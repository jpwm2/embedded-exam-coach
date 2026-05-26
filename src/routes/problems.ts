import type { Env } from "../index";
import { jsonResponse, errorResponse } from "../index";
import type { AuthedUser } from "../db";

export async function handleProblems(req: Request, env: Env, user: AuthedUser, sub: string): Promise<Response> {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const subject = url.searchParams.get("subject");
    const year = url.searchParams.get("year");
    const cardNo = url.searchParams.get("card_no");
    let q = "SELECT * FROM problems WHERE 1=1";
    const args: any[] = [];
    if (subject) { q += " AND subject = ?"; args.push(subject); }
    if (year) { q += " AND year = ?"; args.push(parseInt(year, 10)); }
    if (cardNo) { q += " AND card_no = ?"; args.push(parseInt(cardNo, 10)); }
    q += " ORDER BY subject, year, q LIMIT 2000";
    const rows = await env.DB.prepare(q).bind(...args).all();
    return jsonResponse({ problems: rows.results ?? [] });
  }

  if (req.method === "POST") {
    const body = await req.json().catch(() => null) as any;
    if (!body || !body.subject) return errorResponse("invalid_body", 400);
    const res = await env.DB.prepare(
      "INSERT INTO problems (subject, year, q, card_no, theme, group_label, era, season, meta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(subject, year, q) DO UPDATE SET theme = excluded.theme, group_label = excluded.group_label, era = excluded.era, season = excluded.season, meta = excluded.meta RETURNING id",
    ).bind(
      body.subject,
      body.year ?? 0,
      body.q ?? 0,
      body.card_no ?? null,
      body.theme ?? null,
      body.group_label ?? null,
      body.era ?? null,
      body.season ?? null,
      body.meta ? JSON.stringify(body.meta) : null,
    ).first<{ id: number }>();
    return jsonResponse({ id: res?.id });
  }

  return errorResponse("method_not_allowed", 405);
}
