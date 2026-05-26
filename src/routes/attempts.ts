import type { Env } from "../index";
import { jsonResponse, errorResponse } from "../index";
import { type AuthedUser, nowSec } from "../db";

export async function handleAttempts(req: Request, env: Env, user: AuthedUser, sub: string): Promise<Response> {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const subject = url.searchParams.get("subject");
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "200", 10), 1000);
    const sinceTs = url.searchParams.get("since");
    let q = `SELECT a.*, p.subject, p.year, p.q, p.card_no, p.theme
             FROM attempts a JOIN problems p ON p.id = a.problem_id
             WHERE a.user_id = ?`;
    const args: any[] = [user.id];
    if (subject) { q += " AND p.subject = ?"; args.push(subject); }
    if (sinceTs) { q += " AND a.attempted_at >= ?"; args.push(parseInt(sinceTs, 10)); }
    q += " ORDER BY a.attempted_at DESC LIMIT ?";
    args.push(limit);
    const rows = await env.DB.prepare(q).bind(...args).all();
    return jsonResponse({ attempts: rows.results ?? [] });
  }

  if (req.method === "POST") {
    const body = await req.json().catch(() => null) as any;
    if (!body) return errorResponse("invalid_body", 400);

    let problemId: number | null = body.problem_id ?? null;
    if (!problemId && body.subject && body.year != null && body.q != null) {
      const p = await env.DB.prepare("SELECT id FROM problems WHERE subject = ? AND year = ? AND q = ?")
        .bind(body.subject, body.year, body.q).first<{ id: number }>();
      if (p) problemId = p.id;
    }
    if (!problemId) return errorResponse("problem_required", 400);

    const ts = body.attempted_at ?? nowSec();
    const res = await env.DB.prepare(
      "INSERT INTO attempts (user_id, problem_id, attempted_at, correct, time_seconds, rep_index, choice, mistake_type, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id",
    ).bind(
      user.id,
      problemId,
      ts,
      body.correct ? 1 : 0,
      body.time_seconds ?? null,
      body.rep_index ?? null,
      body.choice ?? null,
      body.mistake_type ?? null,
      body.note ?? null,
    ).first<{ id: number }>();

    return jsonResponse({ id: res?.id, ts });
  }

  return errorResponse("method_not_allowed", 405);
}
