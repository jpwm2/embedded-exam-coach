import type { Env } from "../index";
import { jsonResponse, errorResponse } from "../index";
import { type AuthedUser, nowSec } from "../db";

export async function handleWeakMap(req: Request, env: Env, user: AuthedUser, sub: string): Promise<Response> {
  if (req.method === "GET") {
    const rows = await env.DB.prepare("SELECT * FROM weak_map WHERE user_id = ? ORDER BY updated_at DESC").bind(user.id).all();
    return jsonResponse({ items: rows.results ?? [] });
  }

  if (req.method === "POST") {
    const body = await req.json().catch(() => null) as any;
    if (!body || !body.topic || !body.subject) return errorResponse("invalid_body", 400);
    const ts = nowSec();
    const res = await env.DB.prepare(
      "INSERT INTO weak_map (user_id, topic, subject, status, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id",
    ).bind(user.id, body.topic, body.subject, body.status ?? "todo", body.note ?? null, ts, ts).first<{ id: number }>();
    return jsonResponse({ id: res?.id });
  }

  const m = sub.match(/^weak-map\/(\d+)$/);
  if (m) {
    const id = parseInt(m[1], 10);
    if (req.method === "PATCH" || req.method === "PUT") {
      const body = await req.json().catch(() => null) as any;
      if (!body) return errorResponse("invalid_body", 400);
      await env.DB.prepare(
        "UPDATE weak_map SET topic = COALESCE(?, topic), subject = COALESCE(?, subject), status = COALESCE(?, status), note = COALESCE(?, note), updated_at = ? WHERE id = ? AND user_id = ?",
      ).bind(body.topic ?? null, body.subject ?? null, body.status ?? null, body.note ?? null, nowSec(), id, user.id).run();
      return jsonResponse({ ok: true });
    }
    if (req.method === "DELETE") {
      await env.DB.prepare("DELETE FROM weak_map WHERE id = ? AND user_id = ?").bind(id, user.id).run();
      return jsonResponse({ ok: true });
    }
  }

  return errorResponse("method_not_allowed", 405);
}
