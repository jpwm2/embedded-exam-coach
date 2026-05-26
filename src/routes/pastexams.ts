import type { Env } from "../index";
import { jsonResponse, errorResponse } from "../index";
import { type AuthedUser, nowSec } from "../db";

export async function handlePastExams(req: Request, env: Env, user: AuthedUser, sub: string): Promise<Response> {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const subject = url.searchParams.get("subject");
    let q = "SELECT * FROM past_exams WHERE user_id = ?";
    const args: any[] = [user.id];
    if (subject) { q += " AND subject = ?"; args.push(subject); }
    q += " ORDER BY year DESC, taken_at DESC LIMIT 500";
    const rows = await env.DB.prepare(q).bind(...args).all();
    return jsonResponse({ exams: rows.results ?? [] });
  }

  if (req.method === "POST") {
    const body = await req.json().catch(() => null) as any;
    if (!body || !body.subject || body.year == null) return errorResponse("invalid_body", 400);
    const res = await env.DB.prepare(
      "INSERT INTO past_exams (user_id, year, season, subject, taken_at, score, raw, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id",
    ).bind(
      user.id, body.year, body.season ?? null, body.subject,
      body.taken_at ?? nowSec(), body.score ?? null,
      body.raw ? JSON.stringify(body.raw) : null,
      body.note ?? null,
    ).first<{ id: number }>();
    return jsonResponse({ id: res?.id });
  }

  const m = sub.match(/^past-exams\/(\d+)$/);
  if (m) {
    const id = parseInt(m[1], 10);
    if (req.method === "DELETE") {
      await env.DB.prepare("DELETE FROM past_exams WHERE id = ? AND user_id = ?").bind(id, user.id).run();
      return jsonResponse({ ok: true });
    }
    if (req.method === "PATCH" || req.method === "PUT") {
      const body = await req.json().catch(() => null) as any;
      if (!body) return errorResponse("invalid_body", 400);
      await env.DB.prepare(
        "UPDATE past_exams SET score = COALESCE(?, score), season = COALESCE(?, season), raw = COALESCE(?, raw), note = COALESCE(?, note) WHERE id = ? AND user_id = ?",
      ).bind(
        body.score ?? null,
        body.season ?? null,
        body.raw ? JSON.stringify(body.raw) : null,
        body.note ?? null,
        id, user.id,
      ).run();
      return jsonResponse({ ok: true });
    }
  }

  return errorResponse("method_not_allowed", 405);
}
