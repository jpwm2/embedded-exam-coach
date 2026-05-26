import type { Env } from "./index";
import { jsonResponse, errorResponse } from "./index";
import { type AuthedUser, type UserRow, getOnlyUser, getUserById, nowSec } from "./db";

const SESSION_DAYS = 90;
const SESSION_COOKIE = "eec_session";
const PBKDF2_ITERATIONS_DEFAULT = 600000;

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function hexToBuf(hex: string): ArrayBuffer {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out.buffer;
}

async function pbkdf2(password: string, saltHex: string, iterations: number): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: hexToBuf(saltHex), iterations, hash: "SHA-256" },
    key,
    256,
  );
  return bufToHex(bits);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function parseCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const k = part.slice(0, idx).trim();
    if (k === name) return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return null;
}

function buildSessionCookie(token: string, expiresSec: number): string {
  const expires = new Date(expiresSec * 1000).toUTCString();
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    `Path=/`,
    `HttpOnly`,
    `Secure`,
    `SameSite=Lax`,
    `Expires=${expires}`,
  ].join("; ");
}

function buildClearCookie(): string {
  return [
    `${SESSION_COOKIE}=`,
    `Path=/`,
    `HttpOnly`,
    `Secure`,
    `SameSite=Lax`,
    `Max-Age=0`,
  ].join("; ");
}

export async function requireAuth(req: Request, env: Env): Promise<AuthedUser | null> {
  const token = parseCookie(req.headers.get("cookie"), SESSION_COOKIE);
  if (!token) return null;
  const now = nowSec();
  const session = await env.DB.prepare(
    "SELECT s.user_id, u.exam_date, u.start_date FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > ?",
  ).bind(token, now).first<{ user_id: number; exam_date: string; start_date: string }>();
  if (!session) return null;
  return { id: session.user_id, exam_date: session.exam_date, start_date: session.start_date };
}

async function readJson(req: Request): Promise<any> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export async function handleAuth(req: Request, env: Env, sub: string): Promise<Response> {
  if (sub === "status") {
    const user = await requireAuth(req, env);
    const existingUser = await getOnlyUser(env);
    return jsonResponse({
      authenticated: !!user,
      setup_required: !existingUser,
      exam_date: user?.exam_date ?? null,
      start_date: user?.start_date ?? null,
    });
  }

  if (sub === "setup") {
    if (req.method !== "POST") return errorResponse("method_not_allowed", 405);
    const existing = await getOnlyUser(env);
    if (existing) return errorResponse("already_setup", 409, "already_setup");
    const body = await readJson(req);
    const password = String(body?.password ?? "");
    if (password.length < 8) return errorResponse("password_too_short", 400, "weak_password");

    const examDate = String(body?.exam_date ?? "2027-02-15");
    const startDate = String(body?.start_date ?? "2026-05-11");

    const salt = randomHex(16);
    const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS_DEFAULT);
    const now = nowSec();

    await env.DB.prepare(
      "INSERT INTO users (password_hash, password_salt, iterations, created_at, exam_date, start_date) VALUES (?, ?, ?, ?, ?, ?)",
    ).bind(hash, salt, PBKDF2_ITERATIONS_DEFAULT, now, examDate, startDate).run();

    const user = await getOnlyUser(env);
    if (!user) return errorResponse("setup_failed", 500);

    const token = randomHex(32);
    const expires = now + SESSION_DAYS * 86400;
    await env.DB.prepare("INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
      .bind(token, user.id, now, expires).run();

    return jsonResponse({ ok: true, user_id: user.id }, 200, { "set-cookie": buildSessionCookie(token, expires) });
  }

  if (sub === "login") {
    if (req.method !== "POST") return errorResponse("method_not_allowed", 405);
    const user = await getOnlyUser(env);
    if (!user) return errorResponse("setup_required", 409, "setup_required");
    const body = await readJson(req);
    const password = String(body?.password ?? "");
    if (!password) return errorResponse("password_required", 400);

    const computed = await pbkdf2(password, user.password_salt, user.iterations);
    if (!constantTimeEqual(computed, user.password_hash)) {
      return errorResponse("invalid_password", 401, "invalid_credentials");
    }

    const now = nowSec();
    const token = randomHex(32);
    const expires = now + SESSION_DAYS * 86400;
    await env.DB.prepare("INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
      .bind(token, user.id, now, expires).run();

    await env.DB.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(now).run();

    return jsonResponse({ ok: true }, 200, { "set-cookie": buildSessionCookie(token, expires) });
  }

  if (sub === "logout") {
    if (req.method !== "POST") return errorResponse("method_not_allowed", 405);
    const token = parseCookie(req.headers.get("cookie"), SESSION_COOKIE);
    if (token) {
      await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
    }
    return jsonResponse({ ok: true }, 200, { "set-cookie": buildClearCookie() });
  }

  if (sub === "change-password") {
    if (req.method !== "POST") return errorResponse("method_not_allowed", 405);
    const authed = await requireAuth(req, env);
    if (!authed) return errorResponse("unauthorized", 401, "unauthorized");
    const body = await readJson(req);
    const current = String(body?.current ?? "");
    const next = String(body?.next ?? "");
    if (next.length < 8) return errorResponse("password_too_short", 400, "weak_password");
    const user = await getUserById(env, authed.id);
    if (!user) return errorResponse("not_found", 404);
    const computed = await pbkdf2(current, user.password_salt, user.iterations);
    if (!constantTimeEqual(computed, user.password_hash)) {
      return errorResponse("invalid_password", 401, "invalid_credentials");
    }
    const salt = randomHex(16);
    const hash = await pbkdf2(next, salt, PBKDF2_ITERATIONS_DEFAULT);
    await env.DB.prepare("UPDATE users SET password_hash = ?, password_salt = ?, iterations = ? WHERE id = ?")
      .bind(hash, salt, PBKDF2_ITERATIONS_DEFAULT, user.id).run();
    return jsonResponse({ ok: true });
  }

  return errorResponse("not_found", 404);
}
