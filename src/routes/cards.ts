import type { Env } from "../index";
import { jsonResponse, errorResponse } from "../index";
import { type AuthedUser, nowSec, daysBetween, todayISO } from "../db";

function introDay(c: number): number {
  return 7 * Math.floor((c - 1) / 6) + ((c - 1) % 6) + 1;
}

function nextAppearance(rep: number): number {
  return Math.pow(2, rep) - 1;
}

function cardToProblem(c: number): { year: number; q: number } {
  const year = 2010 + Math.floor((c - 1) / 25);
  const q = ((c - 1) % 25) + 1;
  return { year, q };
}

export async function handleCards(req: Request, env: Env, user: AuthedUser, sub: string): Promise<Response> {
  const url = new URL(req.url);
  const startDate = user.start_date;
  const today = todayISO();
  const planDay = daysBetween(startDate, today) + 1;

  if (req.method === "GET") {
    if (sub === "cards/today") {
      const rows = await env.DB.prepare(
        "SELECT card_no, intro_day, next_due_day, rep_index, status, last_correct FROM srs_cards WHERE user_id = ? AND next_due_day <= ? AND status != 'done_today' ORDER BY rep_index DESC, card_no ASC",
      ).bind(user.id, planDay).all<any>();
      const cards = (rows.results ?? []).map((r: any) => ({
        ...r,
        ...cardToProblem(r.card_no),
        is_intro: r.rep_index === 0,
      }));
      return jsonResponse({ plan_day: planDay, today, cards });
    }

    if (sub === "cards/schedule") {
      const from = parseInt(url.searchParams.get("from") ?? String(planDay), 10);
      const to = parseInt(url.searchParams.get("to") ?? String(planDay + 14), 10);
      const out: Record<number, any[]> = {};
      for (let day = from; day <= to; day++) out[day] = [];
      const allCards = await env.DB.prepare(
        "SELECT card_no, intro_day, next_due_day, rep_index FROM srs_cards WHERE user_id = ? AND next_due_day BETWEEN ? AND ?",
      ).bind(user.id, from, to).all<any>();
      for (const c of allCards.results ?? []) {
        out[c.next_due_day]?.push({ ...c, ...cardToProblem(c.card_no), is_intro: c.rep_index === 0 });
      }
      return jsonResponse({ from, to, plan_day: planDay, schedule: out });
    }

    const rows = await env.DB.prepare(
      "SELECT * FROM srs_cards WHERE user_id = ? ORDER BY card_no",
    ).bind(user.id).all<any>();
    return jsonResponse({ plan_day: planDay, cards: rows.results ?? [] });
  }

  if (req.method === "POST" && sub === "cards/answer") {
    const body = await req.json().catch(() => null) as any;
    if (!body || !body.card_no) return errorResponse("invalid_body", 400);
    const cardNo = parseInt(body.card_no, 10);
    const correct = body.correct ? 1 : 0;
    const ts = nowSec();

    const card = await env.DB.prepare("SELECT * FROM srs_cards WHERE user_id = ? AND card_no = ?")
      .bind(user.id, cardNo).first<any>();
    if (!card) return errorResponse("card_not_found", 404);

    const newRep = correct ? card.rep_index + 1 : Math.max(0, card.rep_index - 1);
    const nextDue = card.intro_day + nextAppearance(newRep);

    await env.DB.prepare(
      "UPDATE srs_cards SET rep_index = ?, next_due_day = ?, last_correct = ?, status = 'done_today', updated_at = ? WHERE user_id = ? AND card_no = ?",
    ).bind(newRep, nextDue, correct, ts, user.id, cardNo).run();

    const { year, q } = cardToProblem(cardNo);
    let problem = await env.DB.prepare("SELECT id FROM problems WHERE subject = 'A2' AND year = ? AND q = ?")
      .bind(year, q).first<{ id: number }>();
    if (!problem) {
      const ins = await env.DB.prepare("INSERT INTO problems (subject, year, q, card_no) VALUES ('A2', ?, ?, ?) RETURNING id")
        .bind(year, q, cardNo).first<{ id: number }>();
      problem = ins ?? null;
    }
    if (problem) {
      await env.DB.prepare(
        "INSERT INTO attempts (user_id, problem_id, attempted_at, correct, rep_index, time_seconds, mistake_type, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      ).bind(
        user.id, problem.id, ts, correct, card.rep_index,
        body.time_seconds ?? null,
        body.mistake_type ?? null,
        body.note ?? null,
      ).run();
    }
    return jsonResponse({ ok: true, card_no: cardNo, rep_index: newRep, next_due_day: nextDue });
  }

  if (req.method === "POST" && sub === "cards/reset-today") {
    await env.DB.prepare("UPDATE srs_cards SET status = 'pending' WHERE user_id = ? AND status = 'done_today' AND next_due_day < ?")
      .bind(user.id, planDay).run();
    return jsonResponse({ ok: true });
  }

  return errorResponse("method_not_allowed", 405);
}
