import type { Env } from "../index";
import { jsonResponse, errorResponse } from "../index";
import type { AuthedUser } from "../db";

export async function handleSettings(req: Request, env: Env, user: AuthedUser, sub: string): Promise<Response> {
  if (req.method === "GET") {
    const rows = await env.DB.prepare("SELECT key, value FROM settings WHERE user_id = ?").bind(user.id).all<{ key: string; value: string }>();
    const u = await env.DB.prepare("SELECT exam_date, start_date FROM users WHERE id = ?").bind(user.id).first<{ exam_date: string; start_date: string }>();
    const out: Record<string, any> = {
      exam_date: u?.exam_date,
      start_date: u?.start_date,
    };
    for (const r of rows.results ?? []) {
      try { out[r.key] = JSON.parse(r.value); } catch { out[r.key] = r.value; }
    }
    return jsonResponse(out);
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    const body = await req.json().catch(() => null) as Record<string, any> | null;
    if (!body || typeof body !== "object") return errorResponse("invalid_body", 400);

    if (typeof body.exam_date === "string" || typeof body.start_date === "string") {
      await env.DB.prepare("UPDATE users SET exam_date = COALESCE(?, exam_date), start_date = COALESCE(?, start_date) WHERE id = ?")
        .bind(body.exam_date ?? null, body.start_date ?? null, user.id).run();
    }

    const stmts: D1PreparedStatement[] = [];
    for (const [k, v] of Object.entries(body)) {
      if (k === "exam_date" || k === "start_date") continue;
      stmts.push(env.DB.prepare(
        "INSERT INTO settings (user_id, key, value) VALUES (?, ?, ?) ON CONFLICT(user_id, key) DO UPDATE SET value = excluded.value",
      ).bind(user.id, k, JSON.stringify(v)));
    }
    if (stmts.length) await env.DB.batch(stmts);
    return jsonResponse({ ok: true });
  }

  return errorResponse("method_not_allowed", 405);
}
