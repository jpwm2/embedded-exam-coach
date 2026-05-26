import type { Env } from "../index";
import { jsonResponse, errorResponse } from "../index";
import type { AuthedUser } from "../db";

export async function handleStudyLog(req: Request, env: Env, user: AuthedUser, sub: string): Promise<Response> {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "60", 10), 365);
    const rows = await env.DB.prepare("SELECT * FROM study_log WHERE user_id = ? ORDER BY date DESC LIMIT ?").bind(user.id, limit).all<any>();
    const items = (rows.results ?? []).map((r: any) => ({
      ...r,
      items: r.items ? JSON.parse(r.items) : [],
    }));
    return jsonResponse({ entries: items });
  }

  if (req.method === "POST" || req.method === "PUT") {
    const body = await req.json().catch(() => null) as any;
    if (!body || !body.date) return errorResponse("invalid_body", 400);
    await env.DB.prepare(
      "INSERT INTO study_log (user_id, date, day_type, minutes, items, note, next_action) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id, date) DO UPDATE SET day_type = excluded.day_type, minutes = excluded.minutes, items = excluded.items, note = excluded.note, next_action = excluded.next_action",
    ).bind(
      user.id, body.date, body.day_type ?? "稼働", body.minutes ?? 0,
      body.items ? JSON.stringify(body.items) : null,
      body.note ?? null, body.next_action ?? null,
    ).run();
    return jsonResponse({ ok: true });
  }

  const m = sub.match(/^study-log\/(\d{4}-\d{2}-\d{2})$/);
  if (m && req.method === "DELETE") {
    await env.DB.prepare("DELETE FROM study_log WHERE user_id = ? AND date = ?").bind(user.id, m[1]).run();
    return jsonResponse({ ok: true });
  }

  return errorResponse("method_not_allowed", 405);
}
