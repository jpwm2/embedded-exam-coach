// ===== Main App =====

const INITIAL_TASKS = [
  {
    subj: "A-2",
    title: "問7 (2010) 復習 — 3回目",
    detail: "通し番号 #7 · 復習間隔 +7日",
    est: 8,
    done: true,
    cardC: 7,
    rep: 3,
  },
  {
    subj: "A-2",
    title: "問11 (2010) 復習 — 2回目",
    detail: "通し番号 #11 · 復習間隔 +3日",
    est: 8,
    done: true,
    cardC: 11,
    rep: 2,
  },
  {
    subj: "A-2",
    title: "問13 (2010) 導入 — 新規",
    detail: "通し番号 #13 · 末尾の新規カード",
    est: 14,
    done: false,
    cardC: 13,
    rep: 0,
  },
  {
    subj: "B-2",
    title: "平22秋 問3 「ハードウェアとソフトウェアの機能分担」",
    detail: "状況組み立て5 / 全10工数の5番目",
    est: 25,
    done: false,
    theme: "ハードウェアとソフトウェアの機能分担",
  },
  {
    subj: "復習",
    title: "前週の未消化: 復習正答率80%未満の追加復習",
    detail: "バッファから繰越 · 問4 と 問7 を含む",
    est: 15,
    done: false,
  },
];

const App = () => {
  const [screen, setScreen] = React.useState("dashboard");
  const [tasks, setTasks] = React.useState(INITIAL_TASKS);
  const [problemCtx, setProblemCtx] = React.useState({ cardC: 13, rep: 0 });

  const toggleTask = (i) => {
    setTasks(prev => prev.map((t, j) => j === i ? { ...t, done: !t.done } : t));
  };

  const openProblem = (cardC, rep = 0) => {
    setProblemCtx({ cardC, rep });
    setScreen("problem");
  };

  // Tweaks
  const defaultTweaks = /*EDITMODE-BEGIN*/{
    "accent": "teal",
    "density": "comfortable",
    "showCoach": true
  }/*EDITMODE-END*/;
  const [t, setTweak] = window.useTweaks(defaultTweaks);

  React.useEffect(() => {
    document.body.classList.toggle("compact", t.density === "compact");
    const accentColors = {
      teal:   { c: "oklch(0.55 0.10 200)", ink: "oklch(0.36 0.10 200)", soft: "oklch(0.95 0.022 200)", border: "oklch(0.86 0.045 200)" },
      indigo: { c: "oklch(0.50 0.13 270)", ink: "oklch(0.34 0.13 270)", soft: "oklch(0.95 0.025 270)", border: "oklch(0.85 0.05 270)" },
      ember:  { c: "oklch(0.6 0.15 35)",   ink: "oklch(0.42 0.15 35)",  soft: "oklch(0.96 0.03 35)",   border: "oklch(0.86 0.06 35)" },
      forest: { c: "oklch(0.52 0.11 145)", ink: "oklch(0.35 0.11 145)", soft: "oklch(0.95 0.028 145)", border: "oklch(0.85 0.05 145)" },
      sumi:   { c: "oklch(0.32 0.005 80)", ink: "oklch(0.22 0.005 80)", soft: "oklch(0.95 0.003 80)",  border: "oklch(0.85 0.005 80)" },
    };
    const a = accentColors[t.accent] || accentColors.teal;
    document.documentElement.style.setProperty("--accent", a.c);
    document.documentElement.style.setProperty("--accent-ink", a.ink);
    document.documentElement.style.setProperty("--accent-soft", a.soft);
    document.documentElement.style.setProperty("--accent-border", a.border);
  }, [t.accent, t.density]);

  const screens = {
    dashboard: <Dashboard tasks={tasks} toggleTask={toggleTask} goto={setScreen}/>,
    today: <Today tasks={tasks} toggleTask={toggleTask} goto={setScreen} openProblem={openProblem}/>,
    problem: <Problem cardC={problemCtx.cardC} rep={problemCtx.rep} goto={setScreen}/>,
    cards: <CardSchedule goto={setScreen} openProblem={openProblem}/>,
    pastexams: <PastExams goto={setScreen}/>,
    weak: <WeakMap goto={setScreen}/>,
    weekly: <WeeklyReview goto={setScreen}/>,
    monthly: <MonthlyReview goto={setScreen}/>,
  };

  return (
    <div className="app" data-screen-label={`${screen}`}>
      <Sidebar current={screen} setCurrent={setScreen}/>
      <main className="main">
        {screens[screen]}
      </main>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="表示">
          <window.TweakSelect
            label="アクセント色"
            value={t.accent}
            onChange={(v) => setTweak("accent", v)}
            options={[
              { value: "teal", label: "Teal — 標準" },
              { value: "indigo", label: "Indigo" },
              { value: "ember", label: "Ember" },
              { value: "forest", label: "Forest" },
              { value: "sumi", label: "Sumi (墨)" },
            ]}
          />
          <window.TweakRadio
            label="密度"
            value={t.density}
            onChange={(v) => setTweak("density", v)}
            options={[
              { value: "comfortable", label: "標準" },
              { value: "compact", label: "コンパクト" },
            ]}
          />
        </window.TweakSection>

        <window.TweakSection label="画面ジャンプ">
          {[
            ["dashboard", "ダッシュボード"],
            ["today", "今日のセッション"],
            ["problem", "問題画面 (A-2)"],
            ["cards", "A-2カード進行"],
            ["pastexams", "過去問進捗"],
            ["weak", "弱点マップ"],
            ["weekly", "週次レビュー"],
            ["monthly", "月次レビュー"],
          ].map(([k, l]) => (
            <window.TweakButton key={k} label={l + " を開く"} onClick={() => setScreen(k)} secondary={screen !== k}/>
          ))}
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
