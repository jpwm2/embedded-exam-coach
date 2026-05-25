// ===== Today's session screen =====

const Today = ({ tasks, toggleTask, goto, openProblem }) => {
  const [activeIdx, setActiveIdx] = React.useState(() => {
    const i = tasks.findIndex(t => !t.done);
    return i < 0 ? 0 : i;
  });
  const [memoText, setMemoText] = React.useState("RM スケジューリングの優先度逆転 — 共有資源を持つ低優先タスクが中優先タスクに阻まれる現象。優先度継承プロトコル (PIP) で対策。");

  const active = tasks[activeIdx];
  const canOpenProblem = active && active.subj === "A-2" && active.cardC;

  return (
    <>
      <PageHead
        crumb="学習 / 今日のセッション"
        title="今日のセッション"
        sub="5月25日(月) · 計画 Day 15 / 228 · 稼働日"
        right={
          <div style={{display: "flex", gap: 8}}>
            <button className="btn" onClick={() => goto("dashboard")}>← ダッシュボード</button>
            <button className="btn primary">セッションを終了</button>
          </div>
        }
      />

      {/* Top: current task (no timer / no pomodoro grid) */}
      <div className="card" style={{marginBottom: 18, padding: 22}}>
        <div className="label" style={{marginBottom: 8}}>現在の課題</div>
        {active && (
          <>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap"}}>
              <div style={{flex: "1 1 240px", minWidth: 0}}>
                <div style={{fontSize: 20, fontWeight: 600, lineHeight: 1.35}}>
                  {active.title}
                </div>
                <div style={{marginTop: 6, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap"}}>
                  <SubjTag subj={active.subj}/>
                  <span className="muted" style={{fontSize: 12.5}}>{active.detail}</span>
                  <span className="muted" style={{fontSize: 12.5}}><Icon name="clock" size={11}/> 目安 {active.est} 分</span>
                </div>
              </div>

              <div style={{display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap"}}>
                {canOpenProblem && (
                  <button className="btn primary" onClick={() => openProblem(active.cardC, active.rep)}>
                    <Icon name="book" size={13}/> 問題を開く
                  </button>
                )}
                <button className="btn ok" style={{background: "var(--ok)", borderColor: "var(--ok)", color: "white"}} onClick={() => {
                  toggleTask(activeIdx);
                  const next = tasks.findIndex((t, i) => i > activeIdx && !t.done);
                  if (next >= 0) setActiveIdx(next);
                }}>
                  <Icon name="check" size={13}/> 完了
                </button>
                <button className="btn">スキップ</button>
              </div>
            </div>

            {canOpenProblem && (
              <div style={{marginTop: 14, padding: 12, background: "var(--surface-2)", borderRadius: 8}}>
                <div className="label" style={{marginBottom: 6}}>カード情報</div>
                <div className="stat-row">
                  <div className="stat-cell">
                    <div className="muted" style={{fontSize: 11}}>通し番号</div>
                    <div className="num" style={{fontSize: 22, fontWeight: 600}}>#{active.cardC}</div>
                  </div>
                  <div className="stat-cell">
                    <div className="muted" style={{fontSize: 11}}>原問</div>
                    <div style={{fontSize: 14, fontWeight: 500}} className="num">問{cardToProblem(active.cardC).q} ({cardToProblem(active.cardC).year})</div>
                  </div>
                  <div className="stat-cell">
                    <div className="muted" style={{fontSize: 11}}>{active.rep === 0 ? "導入" : `${active.rep}回目の復習`}</div>
                    <div className="num" style={{fontSize: 14, fontWeight: 500}}>
                      {active.rep === 0 ? "新規" : `間隔 ${Math.pow(2, active.rep - 1) === 1 ? 1 : Math.pow(2, active.rep - 1)}日`}
                    </div>
                  </div>
                  <div className="stat-cell">
                    <div className="muted" style={{fontSize: 11}}>次回出現</div>
                    <div className="num" style={{fontSize: 14, fontWeight: 500}}>+{Math.pow(2, active.rep)}日後</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Body: queue + memo */}
      <div className="row" style={{gap: 18, alignItems: "flex-start"}}>
        <div className="col" style={{flex: 1}}>
          <div className="card">
            <div className="card-head">
              <h3>本日のタスクキュー</h3>
              <span className="chip">{tasks.filter(t => !t.done).length} 残</span>
            </div>
            {tasks.map((t, i) => (
              <div
                key={i}
                onClick={() => setActiveIdx(i)}
                className={"task" + (t.done ? " done" : "")}
                style={{
                  cursor: "pointer",
                  background: activeIdx === i ? "var(--accent-soft)" : "transparent",
                  marginLeft: -10, marginRight: -10, paddingLeft: 10, paddingRight: 10,
                  borderRadius: 6,
                  borderTop: i === 0 ? "none" : "1px solid var(--border)",
                }}
              >
                <Check done={t.done} onToggle={(e) => { (e && e.stopPropagation && e.stopPropagation()); toggleTask(i); }}/>
                <div className="body">
                  <div className="title">{t.title}</div>
                  <div className="meta">
                    <SubjTag subj={t.subj}/>
                    <span>{t.detail}</span>
                    <span><Icon name="clock" size={11}/> {t.est}分</span>
                    {activeIdx === i && <span className="chip accent" style={{marginLeft: "auto"}}>進行中</span>}
                  </div>
                </div>
              </div>
            ))}

            <div className="divider"/>
            <div className="label" style={{marginBottom: 6}}>本日休止の科目</div>
            <div className="task" style={{opacity: 0.55}}>
              <div style={{width: 18, height: 18, borderRadius: 5, border: "1.5px dashed var(--border-strong)", flexShrink: 0, marginTop: 2}}/>
              <div className="body">
                <div className="title">科目B-1 は本日休み</div>
                <div className="meta">
                  <SubjTag subj="B-1"/>
                  <span>火・木・土に実施 — 次回 5/26 (火)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col" style={{flex: 1.2}}>
          {/* Memo */}
          <div className="card">
            <div className="card-head">
              <h3>気づきメモ</h3>
              <span className="muted" style={{fontSize: 11}}>このタスクに紐づく</span>
            </div>
            <textarea
              value={memoText}
              onChange={e => setMemoText(e.target.value)}
              style={{
                width: "100%",
                minHeight: 110,
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: 10,
                fontFamily: "var(--sans)",
                fontSize: 13,
                background: "var(--surface-2)",
                resize: "vertical",
                color: "var(--ink)",
                lineHeight: 1.6,
              }}
            />
            <div className="muted" style={{fontSize: 11, marginTop: 6, display: "flex", justifyContent: "space-between"}}>
              <span>記録: {memoText.length} 文字</span>
              <span className="linkish">+ 弱点メモに昇格</span>
            </div>
          </div>

          {/* Self-grade */}
          <div className="card">
            <div className="card-head">
              <h3>セルフ採点</h3>
              <span className="muted" style={{fontSize: 11}}>タスク完了時に記録</span>
            </div>
            <SelfGrade subj={active?.subj}/>
          </div>

          {/* Quick mistake log */}
          <div className="card">
            <div className="card-head">
              <h3>今のミスを記録</h3>
              <span className="muted" style={{fontSize: 11}}>3カテゴリへ振り分け</span>
            </div>
            <div className="grid-3" style={{gap: 8}}>
              <MistakeBtn label="知識不足型" desc="そもそも知らなかった" color="oklch(0.65 0.16 25)"/>
              <MistakeBtn label="理解不足型" desc="知識と文脈が結びつかなかった" color="oklch(0.7 0.13 75)"/>
              <MistakeBtn label="ケアレス型" desc="読み落とし・字数オーバー" color="oklch(0.55 0.11 200)"/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SelfGrade = ({ subj }) => {
  const [grade, setGrade] = React.useState(null);
  if (subj === "B-1") {
    return (
      <div>
        <div className="muted" style={{fontSize: 12, marginBottom: 8}}>各設問の正誤を入力</div>
        <div style={{display: "flex", gap: 8}}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{flex: 1, padding: 10, background: "var(--surface-2)", borderRadius: 6, textAlign: "center"}}>
              <div className="muted" style={{fontSize: 11}}>設問 {i}</div>
              <div style={{display: "flex", gap: 4, marginTop: 6, justifyContent: "center"}}>
                <button className="btn sm" style={{padding: "0 8px"}}>○</button>
                <button className="btn sm" style={{padding: "0 8px"}}>△</button>
                <button className="btn sm" style={{padding: "0 8px"}}>×</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop: 12}}>
          <div className="muted" style={{fontSize: 11, marginBottom: 4}}>所要時間 (目標 ≤45分)</div>
          <div style={{display: "flex", alignItems: "baseline", gap: 6}}>
            <input type="number" defaultValue={42} style={{width: 60, padding: "4px 8px", border: "1px solid var(--border)", borderRadius: 4, fontFamily: "var(--mono)"}}/>
            <span className="muted" style={{fontSize: 12}}>分</span>
          </div>
        </div>
      </div>
    );
  }
  // A-2 (default) — B-2 branch intentionally removed
  return (
    <div>
      <div className="muted" style={{fontSize: 12, marginBottom: 10}}>この問題の自己評価</div>
      <div style={{display: "flex", gap: 6}}>
        {[
          { v: "ok", label: "正答", color: "var(--ok)" },
          { v: "maybe", label: "迷った", color: "var(--warn)" },
          { v: "ng", label: "誤答", color: "var(--danger)" },
        ].map(o => (
          <button
            key={o.v}
            onClick={() => setGrade(o.v)}
            className="btn"
            style={{
              flex: 1, height: 40,
              background: grade === o.v ? o.color : "var(--surface)",
              color: grade === o.v ? "white" : "var(--ink)",
              borderColor: grade === o.v ? o.color : "var(--border-strong)",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      {grade && (
        <div className="muted" style={{fontSize: 11.5, marginTop: 8, padding: 8, background: "var(--surface-2)", borderRadius: 4}}>
          {grade === "ok" && "次回出現は +2 日後 (5/27) です。"}
          {grade === "maybe" && "間隔をリセット、+1 日後 (5/26) に再出現させます。"}
          {grade === "ng" && "弱点メモに自動追加 + 明日 (5/26) と +2 日後に再出現させます。"}
        </div>
      )}
    </div>
  );
};

const MistakeBtn = ({ label, desc, color }) => {
  const [n, setN] = React.useState(0);
  return (
    <div
      style={{
        background: n > 0 ? color : "var(--surface-2)",
        color: n > 0 ? "white" : "var(--ink)",
        borderRadius: 8,
        padding: 10,
        border: "1px solid " + (n > 0 ? color : "var(--border)"),
        cursor: "pointer",
        position: "relative",
        transition: "all 0.15s",
      }}
      onClick={() => setN(n + 1)}
    >
      <div style={{fontWeight: 600, fontSize: 12.5}}>{label}</div>
      <div style={{fontSize: 10.5, opacity: 0.8, marginTop: 2}}>{desc}</div>
      {n > 0 && (
        <div style={{position: "absolute", top: 6, right: 8, fontFamily: "var(--mono)", fontSize: 18, fontWeight: 600}}>+{n}</div>
      )}
    </div>
  );
};

Object.assign(window, { Today });
