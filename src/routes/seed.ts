import type { Env } from "../index";
import { jsonResponse, errorResponse } from "../index";
import { type AuthedUser, nowSec } from "../db";

const B1_YEARS = [
  { era: "平成22", year: 2010, season: "春" },
  { era: "平成23", year: 2011, season: "春" },
  { era: "平成24", year: 2012, season: "春" },
  { era: "平成25", year: 2013, season: "春" },
  { era: "平成26", year: 2014, season: "春" },
  { era: "平成27", year: 2015, season: "春" },
  { era: "平成28", year: 2016, season: "春" },
  { era: "平成29", year: 2017, season: "春" },
  { era: "平成30", year: 2018, season: "春" },
  { era: "平成31", year: 2019, season: "春" },
  { era: "令和2", year: 2020, season: "10月" },
  { era: "令和3", year: 2021, season: "春" },
  { era: "令和4", year: 2022, season: "春" },
  { era: "令和5", year: 2023, season: "春" },
  { era: "令和6", year: 2024, season: "春" },
  { era: "令和7", year: 2025, season: "春" },
];

const B2_THEMES = [
  { era: "平成21年度秋期", year: 2009, q: 3, theme: "組込みシステムにおける適切な外部調達について", group: "SA" },
  { era: "平成22年度秋期", year: 2010, q: 3, theme: "組込みシステム開発におけるハードウェアとソフトウェアとの機能分担について", group: "SA" },
  { era: "平成23年度秋期", year: 2011, q: 3, theme: "組込みシステムの開発におけるプラットフォームの導入について", group: "SA" },
  { era: "平成24年度秋期", year: 2012, q: 3, theme: "組込みシステムの開発プロセスモデルについて", group: "SA" },
  { era: "平成25年度秋期", year: 2013, q: 3, theme: "組込みシステムの開発における信頼性設計について", group: "SA" },
  { era: "平成26年度秋期", year: 2014, q: 3, theme: "組込みシステムの開発における機能分割について", group: "SA" },
  { era: "平成27年度秋期", year: 2015, q: 3, theme: "組込みシステム製品を構築する際のモジュール間インタフェースの仕様決定について", group: "SA" },
  { era: "平成28年度秋期", year: 2016, q: 3, theme: "組込みシステムにおけるオープンソースソフトウェアの導入について", group: "SA" },
  { era: "平成29年度秋期", year: 2017, q: 3, theme: "IoTの進展と組込みシステムのセキュリティ対応について", group: "SA" },
  { era: "平成30年度秋期", year: 2018, q: 3, theme: "組込みシステムのAI利用、IoT化などに伴うデータ量増加への対応について", group: "SA" },
  { era: "令和元年度秋期", year: 2019, q: 3, theme: "組込みシステムのデバッグモニタ機能について", group: "SA" },
  { era: "令和3年度春期", year: 2021, q: 3, theme: "IoTの普及に伴う組込みシステムのネットワーク化について", group: "SA" },
  { era: "令和4年度春期", year: 2022, q: 3, theme: "IoT, AIなどの技術進展に伴う組込みシステムの自動化について", group: "SA" },
  { era: "令和5年度春期", year: 2023, q: 3, theme: "再利用の容易化を考慮した組込みシステムのアーキテクチャについて", group: "SA" },
  { era: "令和5年度春期", year: 2023, q: 1, theme: "組込みシステムの製品企画段階における脅威分析", group: "ES" },
  { era: "令和5年度春期", year: 2023, q: 2, theme: "組込みシステムにおけるマルチコアの利用", group: "ES" },
  { era: "令和6年度春期", year: 2024, q: 1, theme: "組込みシステム製品の企画における生産形態の多様性", group: "ES" },
  { era: "令和6年度春期", year: 2024, q: 2, theme: "組込みシステム製品の設計における実現性の検証・試作などの事前検証", group: "ES" },
  { era: "令和6年度春期", year: 2024, q: 3, theme: "組込みシステム製品における保守業務を支援する機能・構造の開発", group: "ES" },
  { era: "令和7年度春期", year: 2025, q: 1, theme: "新市場に対する組み込みシステムの製品企画におけるマーケティング戦略について", group: "ES" },
  { era: "令和7年度春期", year: 2025, q: 2, theme: "組み込みシステム製品の流用設計について", group: "ES" },
  { era: "令和7年度春期", year: 2025, q: 3, theme: "組み込みシステム製品における入出力インタフェースの開発について", group: "ES" },
];

function introDay(c: number): number {
  return 7 * Math.floor((c - 1) / 6) + ((c - 1) % 6) + 1;
}

export async function handleSeed(req: Request, env: Env, user: AuthedUser, sub: string): Promise<Response> {
  if (req.method !== "POST") return errorResponse("method_not_allowed", 405);

  const existing = await env.DB.prepare("SELECT COUNT(*) as n FROM problems").first<{ n: number }>();
  const force = new URL(req.url).searchParams.get("force") === "1";
  if (existing && existing.n > 0 && !force) {
    return jsonResponse({ ok: false, message: "already_seeded", count: existing.n });
  }

  const ts = nowSec();
  const batch: D1PreparedStatement[] = [];

  for (let year = 2010; year <= 2025; year++) {
    const yearIdx = year - 2010;
    for (let q = 1; q <= 25; q++) {
      const cardNo = yearIdx * 25 + q;
      const era = year <= 2018 ? `平成${year - 1988}` : year === 2019 ? "令和元" : `令和${year - 2018}`;
      batch.push(env.DB.prepare(
        "INSERT INTO problems (subject, year, q, card_no, era) VALUES ('A2', ?, ?, ?, ?) ON CONFLICT(subject, year, q) DO NOTHING",
      ).bind(year, q, cardNo, era));
    }
  }

  for (const y of B1_YEARS) {
    for (const q of [1, 2]) {
      batch.push(env.DB.prepare(
        "INSERT INTO problems (subject, year, q, era, season) VALUES ('B1', ?, ?, ?, ?) ON CONFLICT(subject, year, q) DO NOTHING",
      ).bind(y.year, q, y.era, y.season));
    }
  }

  for (const t of B2_THEMES) {
    batch.push(env.DB.prepare(
      "INSERT INTO problems (subject, year, q, theme, group_label, era) VALUES ('B2', ?, ?, ?, ?, ?) ON CONFLICT(subject, year, q) DO UPDATE SET theme = excluded.theme, group_label = excluded.group_label, era = excluded.era",
    ).bind(t.year, t.q, t.theme, t.group, t.era));
  }

  for (let c = 1; c <= 400; c++) {
    const d = introDay(c);
    batch.push(env.DB.prepare(
      "INSERT INTO srs_cards (user_id, card_no, intro_day, next_due_day, rep_index, status, updated_at) VALUES (?, ?, ?, ?, 0, 'pending', ?) ON CONFLICT(user_id, card_no) DO NOTHING",
    ).bind(user.id, c, d, d, ts));
  }

  // chunked batch to stay within D1 batch size limits
  const chunkSize = 50;
  for (let i = 0; i < batch.length; i += chunkSize) {
    await env.DB.batch(batch.slice(i, i + chunkSize));
  }

  const count = await env.DB.prepare("SELECT COUNT(*) as n FROM problems").first<{ n: number }>();
  return jsonResponse({ ok: true, problems: count?.n ?? 0 });
}
