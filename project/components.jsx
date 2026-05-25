// ===== Shared UI components =====

const Icon = ({ name, size = 16 }) => {
  const stroke = "currentColor";
  const sw = 1.6;
  const paths = {
    home: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14V10.5"/></>,
    calendar: <><rect x="3.5" y="4.5" width="17" height="16" rx="2"/><path d="M3.5 9h17"/><path d="M8 3v3M16 3v3"/></>,
    play: <path d="M7 5v14l12-7z"/>,
    cards: <><rect x="3.5" y="4.5" width="13" height="16" rx="1.5"/><rect x="7.5" y="7.5" width="13" height="13" rx="1.5"/></>,
    chart: <><path d="M4 20V8"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M3 20h18"/></>,
    target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/></>,
    book: <><path d="M4 5v15a1 1 0 0 0 1 1h15V6a1 1 0 0 0-1-1H7a3 3 0 0 0-3 3z"/><path d="M4 5a3 3 0 0 1 3-3h13"/></>,
    spark: <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2"/>,
    flame: <path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-3 2-3 4-2-2-3-5-3-8-3 3-5 6-5 11 0 4 3 7 7 7z"/>,
    check: <path d="M4 12l5 5L20 6" strokeWidth="2.5"/>,
    clock: <><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></>,
    flag: <><path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/></>,
    chevron: <path d="M9 6l6 6-6 6"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></>,
    pause: <><rect x="6.5" y="5" width="3.5" height="14" rx="1"/><rect x="14" y="5" width="3.5" height="14" rx="1"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2L10 21h4l.6-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"/></>,
    coach: <><path d="M12 3l3 6 6 1-4.5 4 1 6.5-5.5-3-5.5 3 1-6.5L3 10l6-1z"/></>,
    layers: <><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 18l9 5 9-5"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

const NAV = [
  { section: "学習", items: [
    { id: "dashboard", label: "ダッシュボード", icon: "home" },
    { id: "today", label: "今日のセッション", icon: "play", badge: "進行中" },
    { id: "cards", label: "A-2 カード進行", icon: "cards" },
  ]},
  { section: "演習", items: [
    { id: "pastexams", label: "過去問進捗", icon: "book" },
    { id: "weak", label: "弱点マップ", icon: "target", badge: "7" },
  ]},
  { section: "レビュー", items: [
    { id: "weekly", label: "週次レビュー", icon: "chart" },
    { id: "monthly", label: "月次レビュー", icon: "flag" },
  ]},
];

const Sidebar = ({ current, setCurrent }) => (
  <aside className="sidebar">
    <div className="brand">
      <div className="brand-mark">越</div>
      <div>
        <div className="brand-name">越境コーチ</div>
        <div className="brand-sub">ES-SP / 2027.02</div>
      </div>
    </div>

    {NAV.map((s, i) => (
      <div className="nav-section" key={i}>
        <h6>{s.section}</h6>
        {s.items.map((it) => (
          <button
            key={it.id}
            className={"nav-item" + (current === it.id ? " active" : "")}
            onClick={() => setCurrent(it.id)}
          >
            <span className="nav-glyph"><Icon name={it.icon} size={15}/></span>
            <span>{it.label}</span>
            {it.badge && <span className="nav-tag">{it.badge}</span>}
          </button>
        ))}
      </div>
    ))}

    <div className="sidebar-foot">
      <div className="avatar">あ</div>
      <div>
        <div style={{fontWeight: 600}}>あなた</div>
        <div className="muted" style={{fontSize: 11}}>計画 Day {DAY_IDX + 1} / {TOTAL_DAYS}</div>
      </div>
    </div>
  </aside>
);

const PageHead = ({ crumb, title, sub, right }) => (
  <div className="page-head">
    <div className="page-head-main">
      {crumb && <div className="crumb">{crumb}</div>}
      <h1>{title}</h1>
      {sub && <div className="sub">{sub}</div>}
    </div>
    {right && <div className="page-head-right">{right}</div>}
  </div>
);

const KPI = ({ value, unit, label, delta, deltaDir = "up" }) => (
  <div className="kpi">
    <div className="label">{label}</div>
    <div className="val">{value}{unit && <span className="unit">{unit}</span>}</div>
    {delta && <div className={`delta ${deltaDir}`}>{deltaDir === "down" ? "↓" : deltaDir === "flat" ? "→" : "↑"} {delta}</div>}
  </div>
);

const Bar = ({ value, max = 1, color }) => (
  <div className="bar">
    <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color || "var(--ink)" }}/>
  </div>
);

const SubjTag = ({ subj }) => {
  const cls = subj === "A-2" ? "a2" : subj === "B-1" ? "b1" : subj === "B-2" ? "b2" : "";
  return <span className={"subj-tag " + cls}>{subj}</span>;
};

const Check = ({ done, onToggle }) => (
  <div className={"check" + (done ? " done" : "")} onClick={onToggle}>
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12l5 5L20 6"/>
    </svg>
  </div>
);

// Coach message card
const Coach = ({ messages = [], actions = [], onAction }) => (
  <div className="coach">
    <div className="coach-head">
      <div className="coach-mark">越</div>
      <div>
        <div className="coach-name">越境コーチ</div>
        <div className="coach-meta">{new Date(TODAY).toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "long" })} · おはようございます</div>
      </div>
    </div>
    {messages.map((m, i) => (
      <div className="coach-msg" key={i} style={{marginTop: i === 0 ? 4 : 10}} dangerouslySetInnerHTML={{__html: m}}/>
    ))}
    {actions.length > 0 && (
      <div className="coach-actions">
        {actions.map((a, i) => (
          <button key={i} className={"btn sm " + (i === 0 ? "primary" : "")} onClick={() => onAction && onAction(a)}>
            {a.label}
          </button>
        ))}
      </div>
    )}
  </div>
);

// Phase strip — the 9-month plan
const PhaseStrip = () => (
  <div className="phase-strip">
    {PHASES.map((p, i) => (
      <div key={i} className={"phase-cell " + p.status}>
        <span className="month">{p.m}</span>
        {p.label}
      </div>
    ))}
  </div>
);

// Reused: percent badge
const Pct = ({ value, threshold = [0.6, 0.75] }) => {
  const c = value >= threshold[1] ? "ok" : value >= threshold[0] ? "warn" : "danger";
  return <span className={"chip " + c}><span className="num">{Math.round(value * 100)}%</span></span>;
};

// Export to window for cross-file access
Object.assign(window, {
  Icon, Sidebar, PageHead, KPI, Bar, SubjTag, Check, Coach, PhaseStrip, Pct,
});
