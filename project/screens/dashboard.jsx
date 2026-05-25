// ===== Dashboard screen =====

const Dashboard = ({ tasks, toggleTask, goto }) => {
  const examDays = DAYS_TO_EXAM;
  const planPct = ((DAY_IDX + 1) / TOTAL_DAYS) * 100;

  // Today's tasks summary
  const todayTotal = tasks.length;
  const todayDone = tasks.filter(t => t.done).length;

  return (
    <>
      <PageHead
        crumb="ホーム"
        title="ダッシュボード"
        sub="エンベデッドシステムスペシャリスト試験 (2027年2月) に向けた今日の作戦盤。"
        right={
          <button className="btn primary" onClick={() => goto("today")}>
            <Icon name="play" size={14}/> 今日のセッションを開始
          </button>
        }
      />

      {/* Top tile row */}
      <div className="grid-4" style={{marginBottom: 16}}>
        <div className="card">
          <KPI label="試験まで" value={examDays} unit="日" delta={`${Math.ceil(examDays/7)}週`} deltaDir="flat"/>
          <div style={{marginTop: 14}}>
            <div className="muted" style={{fontSize: 11, marginBottom: 6}}>2027.02.15 (予)</div>
            <div className="bar"><div style={{width: `${planPct}%`, background: "var(--ink)"}}/></div>
            <div className="muted num" style={{fontSize: 11, marginTop: 6}}>計画 Day {DAY_IDX + 1} / {TOTAL_DAYS}</div>
          </div>
        </div>

        <div className="card">
          <KPI label="連続学習" value={STREAK} unit="日" delta="新記録" deltaDir="up"/>
          <div style={{marginTop: 14, display: "flex", gap: 4}}>
            {Array.from({length: 14}).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 26, borderRadius: 3,
                background: i < 14 ? "var(--ink)" : "var(--surface-2)",
                opacity: i < 14 ? (0.4 + (i / 14) * 0.6) : 1,
              }}/>
            ))}
          </div>
          <div className="muted" style={{fontSize: 11, marginTop: 6}}>過去14日</div>
        </div>

        <div className="card">
          <KPI label="今日のタスク" value={`${todayDone}/${todayTotal}`} unit=""/>
          <div style={{marginTop: 14}}>
            <div className="bar"><div style={{width: `${(todayDone/todayTotal)*100}%`, background: "var(--accent)"}}/></div>
            <div className="muted" style={{fontSize: 11, marginTop: 8, display: "flex", gap: 12}}>
              <span><SubjTag subj="A-2"/> 2</span>
              <span><SubjTag subj="B-1"/> 0</span>
              <span><SubjTag subj="B-2"/> 1</span>
            </div>
          </div>
        </div>

        <div className="card">
          <KPI label="今週の学習時間" value={(WEEKLY_KPI.study_time_min/60).toFixed(1)} unit="時間" delta="+18% 前週比" deltaDir="up"/>
          <div style={{marginTop: 14, display: "flex", gap: 4, alignItems: "flex-end", height: 36}}>
            {[42, 78, 60, 95, 88, 142, 95].map((m, i) => (
              <div key={i} style={{
                flex: 1, height: `${(m/142)*100}%`,
                background: i === 6 ? "var(--accent)" : "var(--ink)",
                opacity: i === 6 ? 1 : 0.35,
                borderRadius: 2,
              }}/>
            ))}
          </div>
          <div className="muted num" style={{fontSize: 10, marginTop: 4, display: "flex", justifyContent: "space-between"}}>
            <span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span>土</span><span>日</span>
          </div>
        </div>
      </div>

      {/* Phase strip */}
      <div className="card" style={{marginBottom: 16}}>
        <div className="card-head">
          <h3>年間フェーズ</h3>
          <div className="sub">2026年5月 → 2027年2月 · 9ヶ月計画</div>
        </div>
        <PhaseStrip/>
      </div>

      {/* Coach */}
      <div style={{marginBottom: 16}}>
        <Coach
          messages={[
            `今日は <em>計画 Day 15 / 228</em> 、第3週の月曜日です。週6枚ペースで進めるなら、今日は <em>A-2 問15 (2010) の導入</em> と <em>復習カード × 2</em>、そして <em>B-2 平成22年度秋期「機能分担」の状況組み立て5</em> が予定です。`,
            `先週の <em>A-2 復習正答率 88%</em> は目標90%にあと少し。<em>RM スケジューリングの優先度逆転</em> がまだ揺れているので、今日の復習で再確認をおすすめします。`,
          ]}
          actions={[
            { label: "今日のセッションを開始", to: "today" },
            { label: "今週の予定を見る", to: "cards" },
            { label: "弱点を確認", to: "weak" },
          ]}
          onAction={(a) => goto(a.to)}
        />
      </div>

      {/* Two column */}
      <div className="row" style={{alignItems: "flex-start"}}>
        <div className="col" style={{flex: 1.4}}>
          {/* Today's tasks */}
          <div className="card">
            <div className="card-head">
              <h3>今日のタスク <span className="muted" style={{fontWeight: 400, marginLeft: 6}}>5/25 (月) · 稼働日</span></h3>
              <button className="btn sm" onClick={() => goto("today")}>セッションを開始 →</button>
            </div>
            {tasks.map((t, i) => (
              <div className={"task" + (t.done ? " done" : "")} key={i}>
                <Check done={t.done} onToggle={() => toggleTask(i)}/>
                <div className="body">
                  <div className="title">{t.title}</div>
                  <div className="meta">
                    <SubjTag subj={t.subj}/>
                    <span>{t.detail}</span>
                    <span><Icon name="clock" size={11}/> {t.est}分</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly KPI */}
          <div className="card">
            <div className="card-head">
              <h3>今週の指標 <span className="muted" style={{fontWeight: 400, marginLeft: 6}}>5/18 — 5/24</span></h3>
              <button className="btn sm ghost" onClick={() => goto("weekly")}>レビューを書く →</button>
            </div>

            <table className="tbl">
              <thead>
                <tr>
                  <th>指標</th>
                  <th style={{width: 100}}>目標</th>
                  <th style={{width: 100}}>今週</th>
                  <th style={{width: 180}}>4週推移</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>科目A-2 実施率</td>
                  <td className="num muted">100%</td>
                  <td className="num"><Pct value={WEEKLY_KPI.a2_jisshi} threshold={[0.85, 0.95]}/></td>
                  <td><Spark series={[0.86, 0.88, 0.94, 0.96]} target={1.0}/></td>
                </tr>
                <tr>
                  <td>科目A-2 初見正答率</td>
                  <td className="num muted">70%+</td>
                  <td className="num"><Pct value={WEEKLY_KPI.a2_shoken} threshold={[0.6, 0.7]}/></td>
                  <td><Spark series={WEEKLY_TREND.map(w => w.a2_new)} target={0.7}/></td>
                </tr>
                <tr>
                  <td>科目A-2 復習正答率</td>
                  <td className="num muted">90%+</td>
                  <td className="num"><Pct value={WEEKLY_KPI.a2_review} threshold={[0.8, 0.9]}/></td>
                  <td><Spark series={WEEKLY_TREND.map(w => w.a2_rev)} target={0.9}/></td>
                </tr>
                <tr>
                  <td>科目B-1 設問正答率</td>
                  <td className="num muted">70%+</td>
                  <td className="num"><Pct value={WEEKLY_KPI.b1_seitou} threshold={[0.55, 0.7]}/></td>
                  <td><Spark series={WEEKLY_TREND.map(w => w.b1)} target={0.7}/></td>
                </tr>
                <tr>
                  <td>科目B-1 解答時間</td>
                  <td className="num muted">≤45分</td>
                  <td className="num">
                    <span className="chip warn"><span className="num">{WEEKLY_KPI.b1_time}分</span></span>
                  </td>
                  <td><Spark series={[58, 53, 50, 48]} target={45} invert/></td>
                </tr>
                <tr>
                  <td>科目B-2 完答率</td>
                  <td className="num muted">100%</td>
                  <td className="num"><Pct value={WEEKLY_KPI.b2_kantou} threshold={[0.9, 1.0]}/></td>
                  <td><Spark series={[1.0, 1.0, 1.0, 1.0]} target={1.0}/></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="col" style={{flex: 1}}>
          {/* Mistakes by type */}
          <div className="card">
            <div className="card-head">
              <h3>ミスのパターン</h3>
              <div className="sub">直近4週</div>
            </div>

            <div style={{display: "flex", flexDirection: "column", gap: 12, marginTop: 6}}>
              {MISTAKE_LOG.map((w, i) => {
                const total = w.knowledge + w.understanding + w.careless;
                return (
                  <div key={i}>
                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11.5}}>
                      <span className="muted">{w.week}</span>
                      <span className="num muted">{total}件</span>
                    </div>
                    <div style={{display: "flex", height: 14, borderRadius: 4, overflow: "hidden", border: "1px solid var(--border)"}}>
                      <div style={{
                        flex: w.knowledge, background: "oklch(0.65 0.16 25)",
                        display: "grid", placeItems: "center", color: "white", fontSize: 10, fontFamily: "var(--mono)",
                      }} title="知識不足">{w.knowledge}</div>
                      <div style={{
                        flex: w.understanding, background: "oklch(0.7 0.13 75)",
                        display: "grid", placeItems: "center", color: "white", fontSize: 10, fontFamily: "var(--mono)",
                      }}>{w.understanding}</div>
                      <div style={{
                        flex: w.careless, background: "oklch(0.55 0.11 200)",
                        display: "grid", placeItems: "center", color: "white", fontSize: 10, fontFamily: "var(--mono)",
                      }}>{w.careless}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{marginTop: 12, display: "flex", gap: 12, fontSize: 11}}>
              <span><span className="dot" style={{background: "oklch(0.65 0.16 25)"}}/> 知識不足</span>
              <span><span className="dot" style={{background: "oklch(0.7 0.13 75)"}}/> 理解不足</span>
              <span><span className="dot" style={{background: "oklch(0.55 0.11 200)"}}/> ケアレス</span>
            </div>

            <div style={{
              marginTop: 12, padding: "10px 12px",
              background: "var(--warn-soft)", borderRadius: 6,
              fontSize: 12, color: "oklch(0.4 0.11 70)",
              border: "1px solid oklch(0.86 0.06 80)",
            }}>
              <Icon name="spark" size={12}/> <strong>理解不足型</strong>が2週連続で最多。教材の追加 / 解答プロセス見直しの検討時期です。
            </div>
          </div>

          {/* Weak point preview */}
          <div className="card">
            <div className="card-head">
              <h3>弱点マップ</h3>
              <button className="btn sm ghost" onClick={() => goto("weak")}>全て見る →</button>
            </div>

            <div style={{display: "flex", gap: 8, marginBottom: 14}}>
              <div style={{flex: 1, textAlign: "center", padding: "10px 0", background: "var(--ok-soft)", borderRadius: 6, border: "1px solid oklch(0.86 0.05 150)"}}>
                <div className="num" style={{fontSize: 22, fontWeight: 600, color: "oklch(0.4 0.1 150)"}}>1</div>
                <div style={{fontSize: 10.5, color: "oklch(0.4 0.1 150)"}}>解消</div>
              </div>
              <div style={{flex: 1, textAlign: "center", padding: "10px 0", background: "var(--accent-soft)", borderRadius: 6, border: "1px solid var(--accent-border)"}}>
                <div className="num" style={{fontSize: 22, fontWeight: 600, color: "var(--accent-ink)"}}>2</div>
                <div style={{fontSize: 10.5, color: "var(--accent-ink)"}}>改善中</div>
              </div>
              <div style={{flex: 1, textAlign: "center", padding: "10px 0", background: "var(--warn-soft)", borderRadius: 6, border: "1px solid oklch(0.86 0.06 80)"}}>
                <div className="num" style={{fontSize: 22, fontWeight: 600, color: "oklch(0.42 0.11 70)"}}>2</div>
                <div style={{fontSize: 10.5, color: "oklch(0.42 0.11 70)"}}>停滞</div>
              </div>
              <div style={{flex: 1, textAlign: "center", padding: "10px 0", background: "var(--danger-soft)", borderRadius: 6, border: "1px solid oklch(0.84 0.07 25)"}}>
                <div className="num" style={{fontSize: 22, fontWeight: 600, color: "oklch(0.4 0.14 25)"}}>2</div>
                <div style={{fontSize: 10.5, color: "oklch(0.4 0.14 25)"}}>未着手</div>
              </div>
            </div>

            <div className="section-title">注目すべき論点</div>
            {WEAK_MAP.filter(w => w.status === "active" || w.status === "todo").slice(0, 3).map(w => (
              <div key={w.id} style={{
                padding: "8px 0", borderTop: "1px solid var(--border)",
                display: "flex", gap: 10, alignItems: "flex-start"
              }}>
                <span className={"dot " + (w.status === "todo" ? "danger" : "warn")}/>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 13, fontWeight: 500}}>{w.topic}</div>
                  <div className="muted" style={{fontSize: 11, marginTop: 1}}>
                    <SubjTag subj={w.subject}/> &nbsp; {w.note || "対策未策定"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Study log */}
          <div className="card">
            <div className="card-head">
              <h3>直近の学習記録</h3>
              <button className="btn sm ghost">全て見る →</button>
            </div>

            {STUDY_LOG.map((l, i) => (
              <div key={i} style={{
                padding: "10px 0",
                borderTop: i > 0 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
                  <div style={{fontSize: 12.5, fontWeight: 600}}>{l.date}</div>
                  <div className="muted num" style={{fontSize: 11}}>
                    <span className="chip">{l.type}</span>
                    &nbsp;<Icon name="clock" size={10}/> {l.time}分
                  </div>
                </div>
                {l.items.map((it, j) => (
                  <div key={j} style={{fontSize: 12, marginTop: 4, color: "var(--ink-2)"}}>
                    <SubjTag subj={it.subj}/> {it.text}
                  </div>
                ))}
                {l.note && (
                  <div style={{
                    marginTop: 6, fontSize: 11.5, color: "var(--muted)",
                    paddingLeft: 8, borderLeft: "2px solid var(--accent-border)",
                  }}>
                    気づき: {l.note}
                  </div>
                )}
                {l.next && (
                  <div style={{fontSize: 11.5, color: "var(--accent-ink)", marginTop: 4, paddingLeft: 8, borderLeft: "2px solid var(--accent)"}}>
                    明日の一手: {l.next}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// Small sparkline component
const Spark = ({ series, target, invert = false }) => {
  const w = 160, h = 28;
  const max = Math.max(...series, target);
  const min = Math.min(...series, target) * 0.95;
  const range = max - min || 1;
  const pts = series.map((v, i) => {
    const x = (i / (series.length - 1)) * (w - 4) + 2;
    const y = h - 2 - ((v - min) / range) * (h - 4);
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const targetY = h - 2 - ((target - min) / range) * (h - 4);
  const last = series[series.length - 1];
  const lastY = pts[pts.length - 1][1];
  const ok = invert ? last <= target : last >= target;

  return (
    <svg width={w} height={h} style={{display: "block"}}>
      <line x1={2} y1={targetY} x2={w-2} y2={targetY} stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="2,2"/>
      <path d={path} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round"/>
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 3 : 1.5} fill={i === pts.length - 1 ? (ok ? "var(--ok)" : "var(--danger)") : "var(--ink)"}/>
      ))}
    </svg>
  );
};

Object.assign(window, { Dashboard, Spark });
