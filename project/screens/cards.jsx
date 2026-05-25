// ===== A-2 Card schedule visualizer =====

const CardSchedule = ({ goto, openProblem }) => {
  const [focusCard, setFocusCard] = React.useState(7);
  const [weekOffset, setWeekOffset] = React.useState(0); // 0 = current

  // Show 4 weeks (28 days) starting from a Monday
  // Today is day 15 (week 3 of plan, day 1)
  // Show weeks 2..5 by default
  const weekStartDay = 1 + (Math.floor((DAY_IDX) / 7) + weekOffset - 1) * 7;
  const days = Array.from({length: 28}, (_, i) => weekStartDay + i);
  const focusAppearances = appearancesForCard(focusCard);
  const focusApps = focusAppearances.map(a => a.day);

  return (
    <>
      <PageHead
        crumb="学習 / A-2 カード進行"
        title="科目A-2 カード進行"
        sub="通し番号制 (§5.1) で管理する週6枚ペースの導入と、公比2の復習間隔 (1, 2, 4, 8, 16, 32日)。"
        right={
          <div className="seg">
            <button className="on">グリッド</button>
            <button>テーブル</button>
            <button>カード詳細</button>
          </div>
        }
      />

      {/* Rule explainer */}
      <div className="row" style={{marginBottom: 18, gap: 16}}>
        <div className="card" style={{flex: 1.2}}>
          <div className="card-head">
            <h3>導入ルール</h3>
          </div>
          <div className="num" style={{
            background: "var(--surface-2)",
            padding: "10px 14px", borderRadius: 6,
            fontSize: 13,
            color: "var(--ink-2)",
            border: "1px solid var(--border)",
          }}>
            導入日(c) = 7·⌊(c−1)/6⌋ + ((c−1) mod 6) + 1
          </div>
          <div style={{marginTop: 10, fontSize: 12, lineHeight: 1.7, color: "var(--ink-2)"}}>
            月〜土に1枚ずつ新しいカードを導入（週6枚ペース）。<br/>
            日曜は新規導入なし、復習のみ。
          </div>
        </div>

        <div className="card" style={{flex: 1.2}}>
          <div className="card-head">
            <h3>復習間隔</h3>
          </div>
          <div className="num" style={{
            background: "var(--surface-2)",
            padding: "10px 14px", borderRadius: 6,
            fontSize: 13,
            color: "var(--ink-2)",
            border: "1px solid var(--border)",
          }}>
            出現日 = D + (2^k − 1)
          </div>
          <div style={{display: "flex", gap: 6, marginTop: 10, alignItems: "center", fontFamily: "var(--mono)", fontSize: 11.5}}>
            {[1, 2, 4, 8, 16, 32].map((d, i) => (
              <React.Fragment key={i}>
                <span style={{
                  padding: "3px 8px",
                  background: i === 0 ? "var(--ink)" : "var(--surface-2)",
                  color: i === 0 ? "var(--bg)" : "var(--ink)",
                  border: "1px solid " + (i === 0 ? "var(--ink)" : "var(--border)"),
                  borderRadius: 4,
                }}>{i === 0 ? "導入" : `+${d - 1}`}</span>
                {i < 5 && <span style={{color: "var(--faint)"}}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="card" style={{flex: 1}}>
          <div className="card-head">
            <h3>進捗</h3>
          </div>
          <div style={{display: "flex", gap: 14}}>
            <div>
              <div className="muted" style={{fontSize: 11}}>導入済み</div>
              <div className="num" style={{fontSize: 24, fontWeight: 600}}>13<span className="muted" style={{fontSize: 13}}> / 400</span></div>
            </div>
            <div>
              <div className="muted" style={{fontSize: 11}}>本日まで実施</div>
              <div className="num" style={{fontSize: 24, fontWeight: 600}}>87<span className="muted" style={{fontSize: 13}}> 回</span></div>
            </div>
          </div>
          <div className="bar" style={{marginTop: 12}}><div style={{width: `${13/400*100}%`}}/></div>
        </div>
      </div>

      {/* Schedule grid */}
      <div className="card" style={{marginBottom: 18}}>
        <div className="card-head">
          <h3>4週間スケジュール</h3>
          <div style={{display: "flex", gap: 8, alignItems: "center"}}>
            <button className="btn sm" onClick={() => setWeekOffset(weekOffset - 1)}>← 前4週</button>
            <span className="muted num" style={{fontSize: 12}}>
              計画 Day {weekStartDay} – {weekStartDay + 27}
            </span>
            <button className="btn sm" onClick={() => setWeekOffset(weekOffset + 1)}>後4週 →</button>
          </div>
        </div>

        {/* Card schedule grid — horizontally scrollable on small screens */}
        <div className="cardgrid-scroll">
          {/* DOW header */}
          <div className="cardgrid" style={{marginBottom: 6}}>
            {["月", "火", "水", "木", "金", "土", "日"].map((d, i) => (
              <div key={i} className="label" style={{textAlign: "left", padding: "0 8px"}}>{d}</div>
            ))}
          </div>

          <div className="cardgrid">
          {days.map((day) => {
            const dow = (day - 1) % 7; // 0=mon..6=sun
            const isSunday = dow === 6;
            const isToday = day === TODAY_DAY_NUMBER;
            const isFuture = day > TODAY_DAY_NUMBER;
            const isPast = day < TODAY_DAY_NUMBER;
            const cards = cardsOnDay(day);
            // Calculate corresponding calendar date
            const date = new Date(START_DATE);
            date.setDate(date.getDate() + (day - 1));
            const mDate = `${date.getMonth() + 1}/${date.getDate()}`;

            const hasFocus = focusApps.includes(day);

            return (
              <div
                key={day}
                className={"daycell" + (isToday ? " today" : "") + (isSunday ? " sunday" : "") + (isFuture ? " future" : "")}
                style={hasFocus ? {outline: "2px solid var(--accent)", outlineOffset: -1, zIndex: 1} : null}
              >
                <div className="daycell-date">
                  <span>D{day} · {mDate}</span>
                  <span className="dow">{isSunday ? "バ" : "稼"}</span>
                </div>
                <div style={{display: "flex", flexWrap: "wrap", gap: 3}}>
                  {cards.map((c, i) => {
                    const isFocusCard = c.c === focusCard;
                    const cls = c.intro ? "new" : `rev-${Math.min(3, c.rep)}`;
                    return (
                      <span
                        key={i}
                        className={"minicard " + cls}
                        onClick={(e) => {
                          if (e.shiftKey) { setFocusCard(c.c); return; }
                          setFocusCard(c.c);
                          openProblem && openProblem(c.c, c.rep);
                        }}
                        style={{
                          cursor: "pointer",
                          outline: isFocusCard ? "1.5px solid var(--accent)" : undefined,
                          outlineOffset: 1,
                        }}
                        title={`カード #${c.c} (${cardToProblem(c.c).year} 問${cardToProblem(c.c).q}) — ${c.intro ? "導入" : `${c.rep}回目復習`}\nクリックで問題を開く / Shift+クリックでフォーカスのみ`}
                      >
                        {c.c}{c.intro && <strong> ✦</strong>}
                      </span>
                    );
                  })}
                </div>
                {isPast && (
                  <div style={{position: "absolute", bottom: 4, right: 6, fontSize: 9, color: "var(--ok)", fontFamily: "var(--mono)"}}>✓</div>
                )}
              </div>
            );
          })}
          </div>
        </div>

        {/* Legend */}
        <div style={{display: "flex", gap: 14, marginTop: 14, alignItems: "center", flexWrap: "wrap"}}>
          <span className="muted" style={{fontSize: 11}}>凡例</span>
          <span style={{display: "flex", alignItems: "center", gap: 4, fontSize: 11.5}}>
            <span className="minicard new">15</span> 新規導入
          </span>
          <span style={{display: "flex", alignItems: "center", gap: 4, fontSize: 11.5}}>
            <span className="minicard rev-1">7</span> 復習
          </span>
          <span style={{display: "flex", alignItems: "center", gap: 4, fontSize: 11.5}}>
            <span className="muted">バ</span> = バッファ日 (日曜)
          </span>
          <span style={{fontSize: 11, color: "var(--muted)"}}>
            ミニカードをクリックで問題を開く / Shift+クリックでフォーカスのみ
          </span>
          <span style={{marginLeft: "auto", fontSize: 11.5, color: "var(--accent-ink)"}}>
            カード <span className="num">#{focusCard}</span> をハイライト中
          </span>
        </div>
      </div>

      {/* Focus card detail */}
      <div className="row" style={{gap: 16}}>
        <div className="card" style={{flex: 1.3}}>
          <div className="card-head card-head-wrap">
            <h3>カード詳細 #{focusCard}</h3>
            <div className="card-nav" style={{display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap"}}>
              <button className="btn sm primary" onClick={() => openProblem && openProblem(focusCard, Math.max(0, focusAppearances.filter(a => a.day < TODAY_DAY_NUMBER).length))}>
                <Icon name="book" size={11}/> 問題を開く
              </button>
              <span style={{width: 1, height: 18, background: "var(--border)", margin: "0 4px"}}/>
              <button className="btn sm" onClick={() => setFocusCard(Math.max(1, focusCard - 1))}>←</button>
              <input
                type="number"
                value={focusCard}
                min="1" max="400"
                onChange={e => setFocusCard(Math.max(1, Math.min(400, +e.target.value || 1)))}
                style={{
                  width: 60,
                  padding: "4px 8px",
                  border: "1px solid var(--border-strong)",
                  borderRadius: 4,
                  textAlign: "center",
                  fontFamily: "var(--mono)",
                }}
              />
              <button className="btn sm" onClick={() => setFocusCard(focusCard + 1)}>→</button>
            </div>
          </div>

          <div className="card-stats" style={{display: "flex", flexWrap: "wrap", gap: 20, padding: "14px 0", borderBottom: "1px solid var(--border)", marginBottom: 14}}>
            <div className="stat-cell">
              <div className="muted" style={{fontSize: 11}}>原問</div>
              <div style={{fontSize: 22, fontWeight: 600}} className="num">
                問{cardToProblem(focusCard).q} <span style={{fontSize: 14, color: "var(--muted)", fontWeight: 400}}>({cardToProblem(focusCard).year})</span>
              </div>
            </div>
            <div className="stat-cell stat-cell-divider">
              <div className="muted" style={{fontSize: 11}}>導入日</div>
              <div className="num" style={{fontSize: 22, fontWeight: 600}}>Day {introDay(focusCard)}</div>
            </div>
            <div className="stat-cell stat-cell-divider">
              <div className="muted" style={{fontSize: 11}}>完了回数</div>
              <div className="num" style={{fontSize: 22, fontWeight: 600}}>
                {Math.max(0, focusAppearances.filter(a => a.day < TODAY_DAY_NUMBER).length)} <span style={{fontSize: 13, color: "var(--muted)", fontWeight: 400}}>/ 6</span>
              </div>
            </div>
          </div>

          <div className="label" style={{marginBottom: 10}}>出現スケジュール</div>
          <div className="timeline">
            {focusAppearances.slice(0, 7).map((a, i) => {
              const past = a.day < TODAY_DAY_NUMBER;
              const today = a.day === TODAY_DAY_NUMBER;
              return (
                <div className="tl-item" key={i}>
                  <span className={"tl-dot " + (today ? "now" : past ? "done" : "")}/>
                  <div style={{flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div>
                      <div style={{fontWeight: 500, fontSize: 13}}>
                        {a.rep === 0 ? "導入" : `${a.rep}回目の復習`}
                        {today && <span className="chip accent" style={{marginLeft: 8}}>今日</span>}
                      </div>
                      <div className="muted num" style={{fontSize: 11}}>
                        Day {a.day} · {(() => {
                          const d = new Date(START_DATE);
                          d.setDate(d.getDate() + a.day - 1);
                          return d.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric", weekday: "short" });
                        })()}
                      </div>
                    </div>
                    {past && (
                      <span className={"chip " + (i === 0 ? "ok" : i === 4 ? "warn" : "ok")}>
                        {i === 0 ? "導入正答" : i === 4 ? "迷い" : "復習正答"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Year matrix */}
        <div className="card" style={{flex: 1}}>
          <div className="card-head">
            <h3>16年×25問マトリクス</h3>
            <span className="muted" style={{fontSize: 11}}>カード番号の年度内分布</span>
          </div>
          <YearMatrix focusCard={focusCard} onPick={setFocusCard}/>

          <div style={{marginTop: 14, padding: 10, background: "var(--surface-2)", borderRadius: 6, fontSize: 11.5, lineHeight: 1.6}}>
            <strong>逆引き式</strong> <span className="num muted">(§5.1 ルール⓪)</span><br/>
            <span className="num">年度</span> = 2010 + ⌊(c−1) / 25⌋<br/>
            <span className="num">問番号</span> = ((c−1) mod 25) + 1
          </div>
        </div>
      </div>
    </>
  );
};

const YearMatrix = ({ focusCard, onPick }) => {
  const years = Array.from({length: 16}, (_, i) => 2010 + i);
  // 16 years × 25 problems. Render compact grid.
  return (
    <div className="ymatrix-scroll">
    <div className="ymatrix-inner">
      {/* Column header (problem numbers 1..25) — just abbreviate */}
      <div style={{display: "grid", gridTemplateColumns: "32px repeat(25, 1fr)", gap: 1, alignItems: "center"}}>
        <div></div>
        {Array.from({length: 25}, (_, i) => (
          <div key={i} className="num" style={{fontSize: 8.5, color: "var(--faint)", textAlign: "center"}}>{(i + 1) % 5 === 1 || i === 24 ? i + 1 : "·"}</div>
        ))}
      </div>
      {years.map((y, yi) => (
        <div key={y} style={{display: "grid", gridTemplateColumns: "32px repeat(25, 1fr)", gap: 1, alignItems: "center", marginTop: 1}}>
          <div className="num muted" style={{fontSize: 9.5, textAlign: "right", paddingRight: 4}}>{y}</div>
          {Array.from({length: 25}, (_, qi) => {
            const c = yi * 25 + qi + 1;
            const introd = introDay(c) <= TODAY_DAY_NUMBER;
            const reviewing = introDay(c) <= TODAY_DAY_NUMBER && introDay(c) > TODAY_DAY_NUMBER - 32;
            const isFocus = c === focusCard;
            let bg = "var(--surface-2)";
            if (introd) {
              bg = "oklch(0.78 0.08 200)";
              if (introDay(c) > TODAY_DAY_NUMBER - 7) bg = "oklch(0.55 0.11 200)";
            }
            return (
              <button
                key={qi}
                onClick={() => onPick(c)}
                title={`#${c} = 問${qi + 1}(${y})`}
                style={{
                  height: 10, padding: 0, border: "none",
                  background: bg,
                  borderRadius: 1.5,
                  cursor: "pointer",
                  outline: isFocus ? "1.5px solid var(--ink)" : "none",
                  outlineOffset: 1,
                  position: "relative",
                  zIndex: isFocus ? 2 : 1,
                }}
              />
            );
          })}
        </div>
      ))}

      <div style={{display: "flex", gap: 10, marginTop: 14, fontSize: 10.5, alignItems: "center"}}>
        <span className="muted">凡例</span>
        <span style={{display: "flex", alignItems: "center", gap: 4}}>
          <div style={{width: 12, height: 10, background: "var(--surface-2)", borderRadius: 2}}/> 未導入
        </span>
        <span style={{display: "flex", alignItems: "center", gap: 4}}>
          <div style={{width: 12, height: 10, background: "oklch(0.78 0.08 200)", borderRadius: 2}}/> 導入済
        </span>
        <span style={{display: "flex", alignItems: "center", gap: 4}}>
          <div style={{width: 12, height: 10, background: "oklch(0.55 0.11 200)", borderRadius: 2}}/> 直近7日
        </span>
      </div>
    </div>
    </div>
  );
};

Object.assign(window, { CardSchedule });
