// ===== Past exams screen: B-1 grid + B-2 themes =====

const PastExams = ({ goto }) => {
  const [tab, setTab] = React.useState("b2"); // "b1" or "b2"

  return (
    <>
      <PageHead
        crumb="演習 / 過去問進捗"
        title="過去問進捗"
        sub="科目B-1 (16年 × 3問、年2問選択で32問) と科目B-2 (23テーマ × 10工数) の対象問題の消化状況。"
        right={
          <div className="seg">
            <button className={tab === "b2" ? "on" : ""} onClick={() => setTab("b2")}>科目B-2</button>
            <button className={tab === "b1" ? "on" : ""} onClick={() => setTab("b1")}>科目B-1</button>
          </div>
        }
      />

      {tab === "b2" ? <B2View/> : <B1View/>}
    </>
  );
};

const B2View = () => {
  const [hovered, setHovered] = React.useState(null);
  const sa = B2_PROGRESS.filter(t => t.group === "SA");
  const es = B2_PROGRESS.filter(t => t.group === "ES");

  const totalKosuu = B2_PROGRESS.length * 10;
  const doneKosuu = B2_PROGRESS.reduce((acc, t) => acc + t.done, 0);

  return (
    <>
      {/* KPI strip */}
      <div className="grid-4" style={{marginBottom: 18}}>
        <div className="card">
          <KPI label="B-2 完了テーマ" value={`${B2_PROGRESS.filter(t => t.done === 10).length}`} unit={` / ${B2_PROGRESS.length}`}/>
          <div className="bar" style={{marginTop: 10}}><div style={{width: `${B2_PROGRESS.filter(t => t.done === 10).length / B2_PROGRESS.length * 100}%`}}/></div>
        </div>
        <div className="card">
          <KPI label="消化工数" value={doneKosuu} unit={` / ${totalKosuu}`}/>
          <div className="bar" style={{marginTop: 10}}><div style={{width: `${doneKosuu/totalKosuu*100}%`, background: "var(--accent)"}}/></div>
        </div>
        <div className="card">
          <KPI label="現在の取組" value="平22秋 問3" delta="状況組み立て5" deltaDir="flat"/>
          <div className="muted" style={{fontSize: 11, marginTop: 6, lineHeight: 1.5}}>機能分担について</div>
        </div>
        <div className="card">
          <KPI label="完答率" value="100" unit="%" delta="目標達成" deltaDir="up"/>
          <div className="muted" style={{fontSize: 11, marginTop: 6}}>過去4週連続</div>
        </div>
      </div>

      {/* Legend */}
      <div className="card" style={{padding: "12px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap"}}>
        <div className="label">テーマ × 10工数</div>
        <span style={{display: "flex", alignItems: "center", gap: 5, fontSize: 11.5}}>
          <div style={{width: 14, height: 14, background: "var(--ink)", borderRadius: 2}}/> 完了
        </span>
        <span style={{display: "flex", alignItems: "center", gap: 5, fontSize: 11.5}}>
          <div style={{width: 14, height: 14, background: "var(--accent)", borderRadius: 2}}/> 進行中
        </span>
        <span style={{display: "flex", alignItems: "center", gap: 5, fontSize: 11.5}}>
          <div style={{width: 14, height: 14, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 2}}/> 未着手
        </span>
        <span style={{marginLeft: "auto", fontSize: 11.5, color: "var(--muted)"}}>
          状況組み立て1 → 7 → 設問1 → 2 → 3 の順
        </span>
      </div>

      {/* SA themes */}
      <div className="card" style={{marginBottom: 18}}>
        <div className="card-head">
          <h3>システムアーキテクト試験 出題 <span className="muted" style={{fontWeight: 400, marginLeft: 6}}>(SA・14テーマ)</span></h3>
          <span className="chip">対象 §4.1</span>
        </div>
        <B2ThemeList themes={sa} hovered={hovered} setHovered={setHovered}/>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>エンベデッドシステムスペシャリスト試験 出題 <span className="muted" style={{fontWeight: 400, marginLeft: 6}}>(ES・9テーマ)</span></h3>
          <span className="chip">対象 §4.2</span>
        </div>
        <B2ThemeList themes={es} hovered={hovered} setHovered={setHovered}/>
      </div>
    </>
  );
};

const B2ThemeList = ({ themes, hovered, setHovered }) => (
  <div style={{display: "flex", flexDirection: "column"}}>
    {themes.map((t, i) => (
      <div
        key={i}
        className="b2-row"
        style={{
          padding: "10px 0",
          borderTop: i === 0 ? "none" : "1px solid var(--border)",
        }}
      >
        <div className="b2-meta">
          <div className="num" style={{fontSize: 12, color: "var(--muted)"}}>{t.era}</div>
          <div className="num" style={{fontWeight: 600, fontSize: 14}}>問{t.q}</div>
        </div>

        <div className="b2-theme">
          <div style={{fontSize: 13, lineHeight: 1.5}}>{t.theme}</div>
          <div style={{marginTop: 4, display: "flex", gap: 8, alignItems: "center", fontSize: 11.5, color: "var(--muted)", flexWrap: "wrap"}}>
            {t.done === 10 ? <span className="chip ok">完了</span> :
             t.done > 0 ? <span className="chip accent">進行中 ({t.done}/10)</span> :
             <span className="chip">未着手</span>}
            {t.done > 0 && t.done < 10 && <span>次: {B2_KOSUU_LABELS[t.done]}</span>}
          </div>
        </div>

        {/* 10 dots for 工数 */}
        <div className="b2-dots">
          {B2_KOSUU_LABELS.map((label, k) => {
            const done = k < t.done;
            const current = k === t.done && t.done < 10;
            const isSetsumon = k >= 7;
            return (
              <div
                key={k}
                onMouseEnter={() => setHovered({theme: t.theme, kosuu: label})}
                onMouseLeave={() => setHovered(null)}
                style={{
                  flex: 1,
                  height: 22,
                  background: done ? "var(--ink)" : current ? "var(--accent)" : "var(--surface-2)",
                  border: "1px solid " + (done ? "var(--ink)" : current ? "var(--accent)" : "var(--border)"),
                  borderRadius: 3,
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                title={`${t.theme} — ${label}`}
              >
                {k === 6 && (
                  <div style={{
                    position: "absolute", right: -2, top: -2, bottom: -2,
                    width: 1, background: "var(--border-strong)",
                  }}/>
                )}
                {isSetsumon && (
                  <div style={{position: "absolute", inset: 0, display: "grid", placeItems: "center"}}>
                    <div className="num" style={{
                      fontSize: 9, color: done ? "var(--bg)" : current ? "white" : "var(--muted)", fontWeight: 600
                    }}>{k - 6}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

const B1View = () => {
  // Build a 16-year × 3-problem grid. Mark selected/done from B1_PROGRESS_SELECTED.
  const selectedMap = {};
  B1_PROGRESS_SELECTED.forEach(s => {
    selectedMap[`${s.yearIdx}-${s.q}`] = s;
  });

  return (
    <>
      {/* KPI strip */}
      <div className="grid-4" style={{marginBottom: 18}}>
        <div className="card">
          <KPI label="実施済み問題" value={B1_PROGRESS_SELECTED.length} unit={` / 32`}/>
          <div className="bar" style={{marginTop: 10}}><div style={{width: `${B1_PROGRESS_SELECTED.length / 32 * 100}%`, background: "var(--accent)"}}/></div>
        </div>
        <div className="card">
          <KPI label="設問正答率" value="66" unit="%" delta="+6pt 先週比" deltaDir="up"/>
          <div className="muted" style={{fontSize: 11, marginTop: 6}}>目標 70% まで -4pt</div>
        </div>
        <div className="card">
          <KPI label="平均所要時間" value="48" unit="分" delta="-10分 先月比" deltaDir="up"/>
          <div className="muted" style={{fontSize: 11, marginTop: 6}}>目標 45 分以内</div>
        </div>
        <div className="card">
          <KPI label="次回セッション" value="5/26" delta="火曜" deltaDir="flat"/>
          <div className="muted" style={{fontSize: 11, marginTop: 6}}>平24年度春期 問3 予定</div>
        </div>
      </div>

      {/* Grid */}
      <div className="card">
        <div className="card-head">
          <h3>16年度 × 3問 (年2問選択)</h3>
          <span className="muted" style={{fontSize: 11}}>火・木・土に実施 · 古い年度から消化</span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "auto repeat(3, 1fr)",
          gap: 6,
          marginTop: 12,
        }}>
          <div></div>
          {[1, 2, 3].map(q => (
            <div key={q} className="label" style={{textAlign: "center", padding: "6px 0"}}>問{q}</div>
          ))}

          {B1_YEARS.map((y, yi) => (
            <React.Fragment key={y.year}>
              <div style={{padding: "0 12px 0 0", textAlign: "right", fontSize: 12, color: "var(--ink-2)"}}>
                <span style={{fontWeight: 500}}>{y.era}</span>
                <span className="muted num" style={{marginLeft: 6, fontSize: 10.5}}>{y.year}{y.season}</span>
              </div>
              {[1, 2, 3].map(q => {
                const k = `${yi}-${q}`;
                const sel = selectedMap[k];
                const future = !sel && B1_PROGRESS_SELECTED.length > 0 && yi > Math.max(...B1_PROGRESS_SELECTED.map(s => s.yearIdx));

                let bg = "var(--surface-2)";
                let color = "var(--muted)";
                let label = "—";
                let border = "1px solid var(--border)";
                if (sel) {
                  bg = sel.score >= 0.7 ? "var(--ink)" : sel.score >= 0.55 ? "oklch(0.55 0.11 200)" : "oklch(0.65 0.16 25)";
                  color = "white";
                  label = `${Math.round(sel.score * 100)}%`;
                  border = "1px solid " + bg;
                }

                return (
                  <div
                    key={q}
                    style={{
                      background: bg,
                      color: color,
                      border: border,
                      borderRadius: 6,
                      padding: "10px 12px",
                      minHeight: 52,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      cursor: sel ? "pointer" : "default",
                      opacity: future ? 0.5 : 1,
                    }}
                  >
                    {sel ? (
                      <>
                        <div className="num" style={{fontSize: 18, fontWeight: 600}}>{label}</div>
                        <div style={{fontSize: 10.5, opacity: 0.8, marginTop: 2}}>3設問中 {Math.round(sel.score * 3)} 正答</div>
                      </>
                    ) : (
                      <div style={{fontSize: 12, color: "var(--muted)"}}>未実施</div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        <div style={{display: "flex", gap: 14, marginTop: 18, fontSize: 11.5, alignItems: "center"}}>
          <span className="muted">凡例</span>
          <span style={{display: "flex", alignItems: "center", gap: 5}}>
            <div style={{width: 14, height: 14, background: "var(--ink)", borderRadius: 2}}/> 70%+
          </span>
          <span style={{display: "flex", alignItems: "center", gap: 5}}>
            <div style={{width: 14, height: 14, background: "oklch(0.55 0.11 200)", borderRadius: 2}}/> 55-69%
          </span>
          <span style={{display: "flex", alignItems: "center", gap: 5}}>
            <div style={{width: 14, height: 14, background: "oklch(0.65 0.16 25)", borderRadius: 2}}/> 55%未満
          </span>
          <span style={{display: "flex", alignItems: "center", gap: 5}}>
            <div style={{width: 14, height: 14, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 2}}/> 未実施
          </span>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { PastExams });
