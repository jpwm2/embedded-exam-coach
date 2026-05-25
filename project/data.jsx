// ===== Mock data based on the user's plan =====
// 試験日: 2027年2月15日 (推定)
// 今日: 2026年5月25日 (月) = 計画開始から想定3週目あたり

const EXAM_DATE = new Date(2027, 1, 15); // Feb 15, 2027
const TODAY = new Date(2026, 4, 25); // May 25, 2026 (Mon)
const START_DATE = new Date(2026, 4, 11); // May 11, 2026 — plan day 1

function daysBetween(a, b) {
  return Math.round((b - a) / 86400000);
}

const DAYS_TO_EXAM = daysBetween(TODAY, EXAM_DATE);
const DAY_IDX = daysBetween(START_DATE, TODAY); // current plan day, 0-indexed
const TOTAL_DAYS = 228;

// ----- 科目A-2 card schedule -----
// 通し番号 → 年度・問
function cardToProblem(c) {
  const year = 2010 + Math.floor((c - 1) / 25);
  const q = ((c - 1) % 25) + 1;
  return { year, q };
}

// Card c introduction day (1-indexed):  D(c) = 7*floor((c-1)/6) + ((c-1)%6) + 1
function introDay(c) {
  return 7 * Math.floor((c - 1) / 6) + ((c - 1) % 6) + 1;
}

// Card c appears on days: D, D+1, D+3, D+7, D+15, D+31, D+63, ...
function appearancesForCard(c) {
  const D = introDay(c);
  const out = [];
  for (let k = 0; k < 8; k++) {
    out.push({ day: D + (Math.pow(2, k) - 1), rep: k });
  }
  return out;
}

// On a given day (1-indexed), what cards appear?
function cardsOnDay(day) {
  // try cards c such that some appearance == day
  const result = [];
  // intro day <= day
  const maxC = Math.min(6 * Math.ceil(day / 7), 25 * 16); // safe upper bound
  for (let c = 1; c <= maxC; c++) {
    const D = introDay(c);
    if (D > day) continue;
    const diff = day - D;
    // diff must be (2^k - 1)
    for (let k = 0; k < 12; k++) {
      const expected = Math.pow(2, k) - 1;
      if (expected === diff) {
        result.push({ c, rep: k, intro: k === 0 });
        break;
      }
      if (expected > diff) break;
    }
  }
  // sort: intro last (rule §5.1③), 古い順 first
  result.sort((a, b) => {
    if (a.intro !== b.intro) return a.intro ? 1 : -1;
    return a.c - b.c;
  });
  return result;
}

// ----- 科目B-1 -----
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

// ----- 科目B-2 -----
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
  { era: "令和5年度春期", year: 2023, q: 3, theme: "組込みシステム開発時の基本要素の選定・設計・評価", group: "ES" },
  { era: "令和6年度春期", year: 2024, q: 1, theme: "組込みシステム製品の企画における生産形態の多様性", group: "ES" },
  { era: "令和6年度春期", year: 2024, q: 2, theme: "組込みシステム製品の設計における実現性の検証・試作などの事前検証", group: "ES" },
  { era: "令和6年度春期", year: 2024, q: 3, theme: "組込みシステム製品における保守業務を支援する機能・構造の開発", group: "ES" },
  { era: "令和7年度春期", year: 2025, q: 1, theme: "新市場に対する組み込みシステムの製品企画におけるマーケティング戦略について", group: "ES" },
  { era: "令和7年度春期", year: 2025, q: 2, theme: "組み込みシステム製品の流用設計について", group: "ES" },
  { era: "令和7年度春期", year: 2025, q: 3, theme: "組み込みシステム製品における入出力インタフェースの開発について", group: "ES" },
];

const B2_KOSUU_LABELS = [
  "状況組み立て1", "状況組み立て2", "状況組み立て3", "状況組み立て4",
  "状況組み立て5", "状況組み立て6", "状況組み立て7",
  "設問1", "設問2", "設問3",
];

// ----- Today (Day 15 = May 25, 2026, Mon) -----
// Day 15 — Week 3, Monday
// A-2 schedule on day 15: card 15 intro, plus reviews
const TODAY_DAY_NUMBER = DAY_IDX + 1; // 1-indexed

// ----- Streak / weekly KPI mock -----
const STREAK = 14;
const WEEKLY_KPI = {
  a2_jisshi: 0.96,        // 実施率
  a2_shoken: 0.74,        // 初見正答率
  a2_review: 0.88,        // 復習正答率
  b1_seitou: 0.66,
  b1_time: 48,            // 分/問
  b2_kantou: 1.0,         // 完答率
  study_time_min: 28 * 7 + 18, // 約 14h 程度
};

const WEEKLY_TREND = [
  { w: "4/27週", a2_new: 0.55, a2_rev: 0.78, b1: 0.50, time: 720 },
  { w: "5/4週",  a2_new: 0.62, a2_rev: 0.82, b1: 0.55, time: 760 },
  { w: "5/11週", a2_new: 0.70, a2_rev: 0.86, b1: 0.60, time: 820 },
  { w: "5/18週", a2_new: 0.74, a2_rev: 0.88, b1: 0.66, time: 854 },
];

// ----- Weak point map -----
const WEAK_MAP = [
  { id: 1, topic: "割り込み処理（優先度・ネスト）", subject: "B-1", status: "improving", note: "3週前から正答率上昇" },
  { id: 2, topic: "リアルタイムスケジューリング (RM/EDF)", subject: "A-2", status: "active", note: "初見50%・復習70%" },
  { id: 3, topic: "メモリマップとMMU", subject: "A-2", status: "resolved", note: "3問連続正答" },
  { id: 4, topic: "セキュア・ブート / TPM", subject: "B-2", status: "todo", note: "H29 問3 で頻出" },
  { id: 5, topic: "通信プロトコル (CAN/SPI/I2C)", subject: "B-1", status: "improving", note: "" },
  { id: 6, topic: "FPGA 設計（HDLとタイミング制約）", subject: "A-2", status: "todo", note: "学習着手前" },
  { id: 7, topic: "字数配分（設問ウの拡張論述）", subject: "B-2", status: "active", note: "完答できても評価Bが続く" },
];

// ----- Mistake categories -----
const MISTAKE_LOG = [
  { week: "5/18週", knowledge: 3, understanding: 5, careless: 2 },
  { week: "5/11週", knowledge: 4, understanding: 4, careless: 3 },
  { week: "5/4週",  knowledge: 6, understanding: 3, careless: 4 },
  { week: "4/27週", knowledge: 7, understanding: 4, careless: 3 },
];

// ----- Annual phase strip -----
const PHASES = [
  { m: "MAY", label: "計画始動", start: "5/11", status: "now" },
  { m: "JUN", label: "基礎構築", start: "6/1", status: "future" },
  { m: "JUL", label: "B-2加速", start: "7/1", status: "future" },
  { m: "AUG", label: "中間棚卸", start: "8/1", status: "future" },
  { m: "SEP", label: "応用深化", start: "9/1", status: "future" },
  { m: "OCT", label: "演習集中", start: "10/1", status: "future" },
  { m: "NOV", label: "弱点撲滅", start: "11/1", status: "future" },
  { m: "DEC", label: "通し演習", start: "12/1", status: "future" },
  { m: "JAN", label: "直前総仕上げ", start: "1/1", status: "future" },
];

// ----- B-2 progress (per theme × 10工数) -----
// Generate a plausible progress state. Each theme has 10 phases (0..9).
const B2_PROGRESS = B2_THEMES.map((t, idx) => {
  // We're 15 days in. B-2 daily. So ~15 工数 consumed.
  // First theme nearly complete, second a bit.
  let done = 0;
  if (idx === 0) done = 10;
  else if (idx === 1) done = 5;
  else done = 0;
  return { ...t, done };
});

// ----- B-1 progress -----
// Sessions occur Tue/Thu/Sat. From May 11 (Mon) over ~2 weeks (14 days):
// Tue 5/12 → Y0 Q1; Thu 5/14 → Y0 Q2; Sat 5/16 → Y1 Q1; Tue 5/19 → Y1 Q2; Thu 5/21 → Y2 Q1; Sat 5/23 → Y2 Q2
// Today 5/25 (Mon) = no B-1 yet (Tue is 5/26)
const B1_PROGRESS_SELECTED = [
  { yearIdx: 0, q: 1, status: "done", score: 0.75 },
  { yearIdx: 0, q: 2, status: "done", score: 0.55 },
  { yearIdx: 1, q: 1, status: "done", score: 0.70 },
  { yearIdx: 1, q: 2, status: "done", score: 0.65 },
  { yearIdx: 2, q: 1, status: "done", score: 0.85 },
  { yearIdx: 2, q: 2, status: "done", score: 0.50 },
];

// ----- Study log -----
const STUDY_LOG = [
  {
    date: "5/24 (日)",
    type: "バッファ",
    time: 95,
    items: [
      { subj: "A-2", text: "問4(2010) 復習・問6(2010) 復習" },
      { subj: "復習", text: "復習正答率80%未満カード × 3 追加" },
    ],
    note: "リアルタイムスケジューリング (RM) の優先度逆転を整理した",
    next: "明日からのB-1で割り込み処理を含む問題を優先選択",
  },
  {
    date: "5/23 (土)",
    type: "稼働",
    time: 142,
    items: [
      { subj: "A-2", text: "問13(2010) 復習・問14(2010) 導入" },
      { subj: "B-1", text: "平成24年度春期 問2 — メモリ管理シナリオ" },
      { subj: "B-2", text: "平成22年度秋期 問3 状況組み立て5" },
    ],
    note: "B-1 で40分以内に解答完了。所要時間が目標内に収まった",
    next: "B-2 状況組み立てを明日から週末はまとめて2工数分進める",
  },
];
