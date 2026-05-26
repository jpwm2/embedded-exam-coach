import type { Env } from "../index";
import { jsonResponse } from "../index";
import { type AuthedUser, nowSec, daysBetween, todayISO } from "../db";

function weekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export async function handleDashboard(req: Request, env: Env, user: AuthedUser, sub: string): Promise<Response> {
  const today = todayISO();
  const planDay = daysBetween(user.start_date, today) + 1;
  const examDays = daysBetween(today, user.exam_date);

  const fourWeeksAgo = nowSec() - 28 * 86400;

  const recent = await env.DB.prepare(
    `SELECT a.correct, a.rep_index, a.attempted_at, a.mistake_type, a.time_seconds, p.subject
     FROM attempts a JOIN problems p ON p.id = a.problem_id
     WHERE a.user_id = ? AND a.attempted_at >= ?`,
  ).bind(user.id, fourWeeksAgo).all<any>();

  const weeks: Record<string, any> = {};
  for (const a of recent.results ?? []) {
    const d = new Date(a.attempted_at * 1000);
    const wk = weekStart(d);
    if (!weeks[wk]) {
      weeks[wk] = {
        week: wk,
        a2_total: 0, a2_correct: 0,
        a2_new_total: 0, a2_new_correct: 0,
        a2_rev_total: 0, a2_rev_correct: 0,
        b1_total: 0, b1_correct: 0, b1_time: 0, b1_time_n: 0,
        b2_total: 0, b2_correct: 0,
        mistake_knowledge: 0, mistake_understanding: 0, mistake_careless: 0,
        time_minutes: 0,
      };
    }
    const w = weeks[wk];
    if (a.time_seconds) w.time_minutes += Math.round(a.time_seconds / 60);
    if (a.subject === "A2") {
      w.a2_total++;
      if (a.correct) w.a2_correct++;
      if (a.rep_index === 0) { w.a2_new_total++; if (a.correct) w.a2_new_correct++; }
      else { w.a2_rev_total++; if (a.correct) w.a2_rev_correct++; }
    } else if (a.subject === "B1") {
      w.b1_total++;
      if (a.correct) w.b1_correct++;
      if (a.time_seconds) { w.b1_time += a.time_seconds; w.b1_time_n++; }
    } else if (a.subject === "B2") {
      w.b2_total++;
      if (a.correct) w.b2_correct++;
    }
    if (a.mistake_type === "knowledge") w.mistake_knowledge++;
    else if (a.mistake_type === "understanding") w.mistake_understanding++;
    else if (a.mistake_type === "careless") w.mistake_careless++;
  }

  const trend = Object.values(weeks).map((w: any) => ({
    w: w.week,
    a2_new: w.a2_new_total ? w.a2_new_correct / w.a2_new_total : null,
    a2_rev: w.a2_rev_total ? w.a2_rev_correct / w.a2_rev_total : null,
    b1: w.b1_total ? w.b1_correct / w.b1_total : null,
    b1_time_avg: w.b1_time_n ? Math.round(w.b1_time / w.b1_time_n / 60) : null,
    time: w.time_minutes,
    mistakes: {
      knowledge: w.mistake_knowledge,
      understanding: w.mistake_understanding,
      careless: w.mistake_careless,
    },
  })).sort((a, b) => a.w.localeCompare(b.w));

  const thisWeek = trend[trend.length - 1] ?? null;

  // streak: consecutive days with study_log entries (or attempts)
  const logs = await env.DB.prepare(
    "SELECT date FROM study_log WHERE user_id = ? ORDER BY date DESC LIMIT 365",
  ).bind(user.id).all<{ date: string }>();
  const dateSet = new Set((logs.results ?? []).map((r) => r.date));
  let streak = 0;
  const cur = new Date(today + "T00:00:00Z");
  while (true) {
    const ds = `${cur.getUTCFullYear()}-${String(cur.getUTCMonth() + 1).padStart(2, "0")}-${String(cur.getUTCDate()).padStart(2, "0")}`;
    if (dateSet.has(ds)) {
      streak++;
      cur.setUTCDate(cur.getUTCDate() - 1);
    } else break;
  }

  return jsonResponse({
    today,
    plan_day: planDay,
    exam_date: user.exam_date,
    days_to_exam: examDays,
    streak,
    weekly: thisWeek,
    trend,
  });
}
