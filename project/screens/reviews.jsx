// ===== Weekly + Monthly review + Weak map screens =====

const WeeklyReview = ({ goto }) => {
  const [step, setStep] = React.useState(1);
  const [actions, setActions] = React.useState([
    { text: "火・木の科目B-1で『割り込み処理』を含む問題を優先選択する", category: "理解不足" },
    { text: "B-2 設問ウで『評価・拡張』を毎回必ず1段落書く", category: "B-2構成" },
    { text: "", category: "" },
  ]);

  return (
    <>
      <PageHead
        crumb="レビュー / 週次"
        title="週次レビュー · 5/18 — 5/24"
        sub="毎週日曜の終わりに30分。「測る → ふりかえる → うごかす」の3ステップ。"
        right={
          <div className="seg">
            {[1, 2, 3].map(s => (
              <button key={s} className={step === s ? "on" : ""} onClick={() => setStep(s)}>
                {s === 1 ? "① 測る" : s === 2 ? "② ふりかえる" : "③ うごかす"}
              </button>
            ))}
          </div>
        }
      />

      {step === 1 && (
        <>
          <div className="card" style={{marginBottom: 16}}>
            <div className="card-head">
              <h3>定量指標 — 今週の現状把握</h3>
              <span className="muted" style={{fontSize: 11}}>初見正答率と復習正答率は分けて測る</span>
            </div>

            <div className="review-grid">
              <div className="head">指標</div>
              <div className="head">第1週</div>
              <div className="head">第2週</div>
              <div className="head">第3週</div>
              <div className="head">第4週</div>
              <div className="head">傾向</div>

              {[
                { label: "A-2 初見正答率", vals: [0.55, 0.62, 0.70, 0.74], trend: "up", target: "70%+" },
                { label: "A-2 復習正答率", vals: [0.78, 0.82, 0.86, 0.88], trend: "up", target: "90%+" },
                { label: "B-1 設問正答率", vals: [0.50, 0.55, 0.60, 0.66], trend: "up", target: "70%+" },
                { label: "B-1 解答時間", vals: [58, 53, 50, 48], trend: "down-good", target: "≤45分", unit: "分" },
                { label: "B-2 完答率", vals: [1.0, 1.0, 1.0, 1.0], trend: "flat", target: "100%" },
                { label: "学習時間", vals: [12.0, 12.7, 13.7, 14.2], trend: "up", target: "—", unit: "h" },
              ].map((row, i) => (
                <React.Fragment key={i}>
                  <div>
                    <div style={{fontWeight: 500, fontSize: 12.5}}>{row.label}</div>
                    <div className="muted" style={{fontSize: 10.5}}>目標 {row.target}</div>
                  </div>
                  {row.vals.map((v, j) => (
                    <div key={j} className="num" style={{fontSize: 13, textAlign: "right", color: j === 3 ? "var(--ink)" : "var(--muted)", fontWeight: j === 3 ? 600 : 400}}>
                      {row.unit === "分" || row.unit === "h" ? `${v}${row.unit}` : `${Math.round(v * 100)}%`}
                    </div>
                  ))}
                  <div style={{display: "grid", placeItems: "center", fontSize: 16, color: row.trend === "up" || row.trend === "down-good" ? "var(--ok)" : row.trend === "down" ? "var(--danger)" : "var(--muted)"}}>
                    {row.trend === "up" ? "↑" : row.trend === "down" ? "↓" : row.trend === "down-good" ? "↓" : "→"}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="row" style={{gap: 16}}>
            <div className="card" style={{flex: 1}}>
              <div className="card-head">
                <h3>所感メモ</h3>
                <span className="muted" style={{fontSize: 11}}>気づいたこと</span>
              </div>
              <textarea
                defaultValue="A-2 復習正答率が +2pt で目標まであと 2pt。RM スケジューリングの優先度逆転は3週連続で出題された問題で誤答。B-1 は時間が安定して短縮。"
                style={{
                  width: "100%", minHeight: 100,
                  padding: 10, border: "1px solid var(--border)",
                  borderRadius: 6, fontFamily: "inherit", fontSize: 13,
                  background: "var(--surface-2)", resize: "vertical", lineHeight: 1.6,
                }}
              />
            </div>
            <div className="card" style={{flex: 1}}>
              <div className="card-head">
                <h3>エスカレーション判定</h3>
                <span className="muted" style={{fontSize: 11}}>計画見直しの基準</span>
              </div>
              <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, background: "var(--ok-soft)", borderRadius: 6, border: "1px solid oklch(0.86 0.05 150)"}}>
                  <div>
                    <div style={{fontSize: 12.5, fontWeight: 500}}>2週連続で実施率80%未満</div>
                    <div className="muted" style={{fontSize: 11}}>今週 96%・先週 94%</div>
                  </div>
                  <span className="chip ok">OK</span>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, background: "var(--warn-soft)", borderRadius: 6, border: "1px solid oklch(0.86 0.06 80)"}}>
                  <div>
                    <div style={{fontSize: 12.5, fontWeight: 500}}>4週連続で同じ論点を間違えている</div>
                    <div className="muted" style={{fontSize: 11}}>RM スケジューリング → 3週連続</div>
                  </div>
                  <span className="chip warn">注意</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="card" style={{marginBottom: 16}}>
            <div className="card-head">
              <h3>ミスのカテゴリ分類</h3>
              <span className="muted" style={{fontSize: 11}}>今週の誤答を3カテゴリに振り分け</span>
            </div>

            <div className="grid-3">
              {[
                { name: "知識不足型", desc: "そもそも知らなかった", n: 3, color: "oklch(0.65 0.16 25)" },
                { name: "理解不足型", desc: "知っていたが、設問の文脈と結びつかなかった", n: 5, color: "oklch(0.7 0.13 75)" },
                { name: "ケアレス型", desc: "読み落とし、字数オーバー、誤字、転記ミス", n: 2, color: "oklch(0.55 0.11 200)" },
              ].map((c, i) => (
                <div key={i} style={{
                  padding: 16,
                  background: c.color,
                  color: "white",
                  borderRadius: 10,
                  position: "relative",
                }}>
                  <div style={{fontSize: 12, opacity: 0.85, letterSpacing: "0.04em"}}>{c.name}</div>
                  <div className="num" style={{fontSize: 36, fontWeight: 600, lineHeight: 1, marginTop: 6}}>{c.n} <span style={{fontSize: 13, opacity: 0.8}}>件</span></div>
                  <div style={{fontSize: 11.5, opacity: 0.85, marginTop: 8, lineHeight: 1.5}}>{c.desc}</div>
                </div>
              ))}
            </div>

            <div style={{marginTop: 16, padding: 14, background: "var(--warn-soft)", border: "1px solid oklch(0.86 0.06 80)", borderRadius: 8}}>
              <div style={{fontSize: 12.5, fontWeight: 600, color: "oklch(0.4 0.11 70)"}}>
                <Icon name="spark" size={12}/> パターン警告 — 「理解不足型」が2週連続で最多
              </div>
              <div style={{fontSize: 12, color: "oklch(0.4 0.11 70)", marginTop: 6, lineHeight: 1.6}}>
                3週連続で同じカテゴリが上位なら計画的に対策を打ちます。対策候補:<br/>
                • 教材の追加 (組込みリアルタイムOS のテキスト精読)<br/>
                • 解答プロセスの見直し (設問文を読む前にシナリオの3要素を抽出)<br/>
                • セルフチェック手順の導入 (設問→根拠→キーワード の3段確認)
              </div>
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="card" style={{marginBottom: 16}}>
            <div className="card-head">
              <h3>翌週の打ち手 — 最大3つ</h3>
              <span className="muted" style={{fontSize: 11}}>これ以上は実行されない</span>
            </div>

            <div style={{
              background: "var(--surface-2)",
              padding: "10px 14px",
              borderRadius: 6,
              fontSize: 12,
              color: "var(--muted)",
              marginBottom: 14,
              lineHeight: 1.7,
            }}>
              <span style={{color: "var(--danger)"}}>❌</span> 「割り込みの理解を深める」 (具体性なし)<br/>
              <span style={{color: "var(--ok)"}}>⭕</span> 「火・木の科目B-1で『割り込み処理』を含む問題を優先選択する」
            </div>

            {actions.map((a, i) => (
              <div key={i} style={{display: "flex", gap: 10, marginTop: 10, alignItems: "flex-start"}}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: a.text ? "var(--ink)" : "var(--surface-2)",
                  color: a.text ? "var(--bg)" : "var(--muted)",
                  display: "grid", placeItems: "center",
                  fontFamily: "var(--mono)", fontWeight: 600, fontSize: 12,
                  flexShrink: 0, marginTop: 2,
                  border: a.text ? "none" : "1px dashed var(--border-strong)",
                }}>{i + 1}</div>
                <div style={{flex: 1}}>
                  <input
                    value={a.text}
                    onChange={e => {
                      const copy = [...actions];
                      copy[i] = { ...copy[i], text: e.target.value };
                      setActions(copy);
                    }}
                    placeholder="具体的な行動を1行で..."
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      border: "1px solid var(--border)",
                      borderRadius: 5,
                      fontFamily: "inherit",
                      fontSize: 13,
                      background: a.text ? "var(--surface)" : "var(--surface-2)",
                    }}
                  />
                  {a.category && (
                    <div className="muted" style={{fontSize: 10.5, marginTop: 3, paddingLeft: 4}}>
                      対応する弱点: {a.category}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-head">
              <h3>バッファ運用 — 来週の日曜</h3>
              <span className="muted" style={{fontSize: 11}}>優先順位順</span>
            </div>
            <ol style={{margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.9}}>
              <li>
                平日に未消化となった項目の実施
                <span className="muted" style={{fontSize: 11.5, marginLeft: 8}}>予定: <span className="num">0</span> 件</span>
              </li>
              <li>
                復習正答率が80%未満だったカードの追加復習
                <span className="muted" style={{fontSize: 11.5, marginLeft: 8}}>該当: <span className="num">2</span> 枚 (問4, 問7)</span>
              </li>
              <li>
                その週で「分からなかった概念」のキャッチアップ
                <span className="muted" style={{fontSize: 11.5, marginLeft: 8}}>候補: 優先度逆転 / セキュア・ブート</span>
              </li>
            </ol>

            <div className="divider"/>

            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <div>
                <div style={{fontSize: 12.5, fontWeight: 600}}>レビュー所要時間</div>
                <div className="muted num" style={{fontSize: 11}}>26 分 / 目標 30 分</div>
              </div>
              <button className="btn primary"><Icon name="check" size={13}/> 週次レビューを確定して保存</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const MonthlyReview = ({ goto }) => {
  return (
    <>
      <PageHead
        crumb="レビュー / 月次"
        title="月次レビュー · 2026年5月"
        sub="月次は『戦略』。トレンドを見て、来月の重点を「やる/やらない」で宣言する。"
        right={<button className="btn primary">月次レビューを確定</button>}
      />

      {/* §7.1 trends */}
      <div className="card" style={{marginBottom: 16}}>
        <div className="card-head">
          <h3>週次指標の月次集計</h3>
          <span className="muted" style={{fontSize: 11}}>↓が続く指標は原因を特定</span>
        </div>

        <div className="review-grid">
          <div className="head">指標</div>
          <div className="head">第1週</div>
          <div className="head">第2週</div>
          <div className="head">第3週</div>
          <div className="head">第4週</div>
          <div className="head">傾向</div>

          {[
            { label: "A-2 初見正答率", v: [0.55, 0.62, 0.70, 0.74] },
            { label: "A-2 復習正答率", v: [0.78, 0.82, 0.86, 0.88] },
            { label: "B-1 設問正答率", v: [0.50, 0.55, 0.60, 0.66] },
            { label: "B-2 完答率",     v: [1.0, 1.0, 1.0, 1.0] },
            { label: "学習時間 (h)",   v: [12.0, 12.7, 13.7, 14.2], hours: true },
          ].map((row, i) => (
            <React.Fragment key={i}>
              <div style={{fontWeight: 500, fontSize: 12.5}}>{row.label}</div>
              {row.v.map((x, j) => (
                <div key={j} className="num" style={{textAlign: "right", color: j === 3 ? "var(--ink)" : "var(--muted)", fontWeight: j === 3 ? 600 : 400, fontSize: 13}}>
                  {row.hours ? `${x}h` : `${Math.round(x*100)}%`}
                </div>
              ))}
              <div style={{display: "grid", placeItems: "center", fontSize: 16, color: "var(--ok)"}}>↑</div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* §7.2 grading */}
      <div className="row" style={{marginBottom: 16, gap: 16, alignItems: "flex-start"}}>
        <div className="card" style={{flex: 1.4}}>
          <div className="card-head">
            <h3>区分ごとの到達度判定</h3>
            <span className="muted" style={{fontSize: 11}}>A / B / C</span>
          </div>
          {[
            { subj: "科目A-2", grade: "B", desc: "初見正答率 70-80%", upto: "初見 80% 突破まで RM スケジューリングを潰す" },
            { subj: "科目B-1", grade: "B", desc: "設問正答率 60-75%", upto: "解答時間 45分以内に収める" },
            { subj: "科目B-2", grade: "B", desc: "完答 + 構成評価良", upto: "設問ウの『評価・拡張』を毎回必ず書く" },
          ].map((g, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "100px 50px 1fr",
              padding: "12px 0",
              borderTop: i > 0 ? "1px solid var(--border)" : "none",
              alignItems: "center",
              gap: 12,
            }}>
              <div style={{fontWeight: 600, fontSize: 13}}>{g.subj}</div>
              <div style={{
                width: 38, height: 38,
                background: g.grade === "A" ? "var(--ok)" : g.grade === "B" ? "var(--warn)" : "var(--danger)",
                color: "white", borderRadius: 8,
                display: "grid", placeItems: "center",
                fontFamily: "var(--serif)", fontWeight: 700, fontSize: 18,
              }}>{g.grade}</div>
              <div>
                <div style={{fontSize: 12.5, color: "var(--ink-2)"}}>{g.desc}</div>
                <div className="muted" style={{fontSize: 11, marginTop: 3}}>
                  <strong style={{color: "var(--accent-ink)"}}>A に上げる条件:</strong> {g.upto}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* §7.4 残工数チェック */}
        <div className="card" style={{flex: 1}}>
          <div className="card-head">
            <h3>残工数の逆算チェック</h3>
            <span className="muted" style={{fontSize: 11}}>試験まで残り <span className="num">{Math.ceil(DAYS_TO_EXAM/7)}</span> 週</span>
          </div>

          <div className="num" style={{
            background: "var(--surface-2)",
            padding: "10px 14px", borderRadius: 6,
            fontSize: 12.5,
            color: "var(--ink-2)",
            border: "1px solid var(--border)",
          }}>
            残週数 × 週工数 = 残利用可能工数
          </div>

          <div style={{padding: "14px 0", display: "flex", justifyContent: "space-between"}}>
            <div>
              <div className="muted" style={{fontSize: 11}}>残利用可能</div>
              <div className="num" style={{fontSize: 22, fontWeight: 600}}>1,260 <span style={{fontSize: 12, color: "var(--muted)"}}>工数</span></div>
            </div>
            <div>
              <div className="muted" style={{fontSize: 11}}>未消化計画</div>
              <div className="num" style={{fontSize: 22, fontWeight: 600}}>980 <span style={{fontSize: 12, color: "var(--muted)"}}>工数</span></div>
            </div>
            <div>
              <div className="muted" style={{fontSize: 11}}>余裕</div>
              <div className="num" style={{fontSize: 22, fontWeight: 600, color: "var(--ok)"}}>+280</div>
            </div>
          </div>

          <div className="bar"><div style={{width: "78%", background: "var(--ok)"}}/></div>

          <div className="divider"/>

          <div className="label" style={{marginBottom: 6}}>オーバー時の削減順</div>
          <ol style={{margin: 0, paddingLeft: 18, fontSize: 11.5, lineHeight: 1.7, color: "var(--ink-2)"}}>
            <li>「いっぺんに解く」過去2年分は<strong>削らない</strong></li>
            <li>科目B-1の問題数を絞る</li>
            <li>科目A-2 の低頻度論点を統合・スキップ</li>
          </ol>
        </div>
      </div>

      {/* §7.5 やる/やらない */}
      <div className="row" style={{gap: 16}}>
        <div className="card" style={{flex: 1, background: "linear-gradient(180deg, var(--ok-soft), var(--surface))"}}>
          <div className="card-head">
            <h3 style={{color: "oklch(0.38 0.11 150)"}}>来月の重点 (やる)</h3>
            <span className="chip ok">3つまで</span>
          </div>
          {[
            { t: "RM/EDF スケジューリングの完全理解", why: "3週連続で誤答中。A-2 初見正答率 70→80% に直結。" },
            { t: "B-2 設問ウの『評価・拡張』を必ず1段落", why: "完答率は100%だが構成評価B のため。" },
            { t: "B-1 解答時間 45分以内", why: "現在 48分。本番想定では時間切れリスク。" },
          ].map((x, i) => (
            <div key={i} style={{padding: "10px 0", borderTop: i > 0 ? "1px solid var(--border)" : "none"}}>
              <div style={{display: "flex", gap: 10, alignItems: "flex-start"}}>
                <span style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: "var(--ok)", color: "white",
                  display: "grid", placeItems: "center",
                  fontFamily: "var(--mono)", fontWeight: 600, fontSize: 12,
                  flexShrink: 0,
                }}>{i + 1}</span>
                <div>
                  <div style={{fontSize: 13.5, fontWeight: 500}}>{x.t}</div>
                  <div className="muted" style={{fontSize: 11.5, marginTop: 3, lineHeight: 1.6}}>理由: {x.why}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{flex: 1, background: "linear-gradient(180deg, var(--danger-soft), var(--surface))"}}>
          <div className="card-head">
            <h3 style={{color: "oklch(0.42 0.16 25)"}}>来月やらないこと</h3>
            <span className="chip danger">明示する</span>
          </div>
          {[
            { t: "新規教材の導入", why: "現有テキストの消化を優先。" },
            { t: "B-2 H21〜H23 のテーマ再演習", why: "状況組み立て7まで完答済み。優先度低。" },
            { t: "学習時間の上積み", why: "週14h で安定。質を上げるフェーズに移行。" },
          ].map((x, i) => (
            <div key={i} style={{padding: "10px 0", borderTop: i > 0 ? "1px solid var(--border)" : "none"}}>
              <div style={{display: "flex", gap: 10, alignItems: "flex-start"}}>
                <span style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: "var(--danger)", color: "white",
                  display: "grid", placeItems: "center",
                  fontWeight: 600, fontSize: 13,
                  flexShrink: 0,
                }}>×</span>
                <div>
                  <div style={{fontSize: 13.5, fontWeight: 500}}>{x.t}</div>
                  <div className="muted" style={{fontSize: 11.5, marginTop: 3, lineHeight: 1.6}}>理由: {x.why}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const WeakMap = ({ goto }) => {
  const grouped = {
    resolved: WEAK_MAP.filter(w => w.status === "resolved"),
    improving: WEAK_MAP.filter(w => w.status === "improving"),
    active: WEAK_MAP.filter(w => w.status === "active"),
    todo: WEAK_MAP.filter(w => w.status === "todo"),
  };

  const colMeta = {
    resolved: { title: "解消", desc: "3問連続正答 / 自分の言葉で説明できる", color: "var(--ok)" },
    improving: { title: "改善中", desc: "正答率が上向き", color: "var(--accent)" },
    active: { title: "停滞", desc: "対策中だが指標が改善していない", color: "var(--warn)" },
    todo: { title: "未着手", desc: "対策を打てていない", color: "var(--danger)" },
  };

  return (
    <>
      <PageHead
        crumb="演習 / 弱点マップ"
        title="弱点マップ"
        sub="月初の弱点リストを「解消 / 改善中 / 停滞 / 未着手」に振り分け。未着手が3つ以上溜まったら翌月の重点に1つ含める。"
        right={<button className="btn primary"><Icon name="plus" size={13}/> 弱点を追加</button>}
      />

      <div className="grid-4" style={{alignItems: "flex-start"}}>
        {(["resolved", "improving", "active", "todo"]).map(k => (
          <div key={k} className="card" style={{borderTop: `3px solid ${colMeta[k].color}`}}>
            <div style={{paddingBottom: 10, borderBottom: "1px solid var(--border)", marginBottom: 10}}>
              <div style={{display: "flex", alignItems: "baseline", justifyContent: "space-between"}}>
                <div style={{fontWeight: 600, fontSize: 14}}>{colMeta[k].title}</div>
                <div className="num" style={{fontSize: 18, fontWeight: 600, color: colMeta[k].color}}>{grouped[k].length}</div>
              </div>
              <div className="muted" style={{fontSize: 11, marginTop: 3, lineHeight: 1.5}}>{colMeta[k].desc}</div>
            </div>

            {grouped[k].map((w) => (
              <div key={w.id} style={{
                padding: 10, marginBottom: 8,
                background: "var(--surface-2)", borderRadius: 6,
                border: "1px solid var(--border)",
              }}>
                <div style={{fontSize: 12.5, fontWeight: 500, lineHeight: 1.45}}>{w.topic}</div>
                <div style={{display: "flex", alignItems: "center", gap: 6, marginTop: 6}}>
                  <SubjTag subj={w.subject}/>
                  {w.note && <span className="muted" style={{fontSize: 10.5}}>{w.note}</span>}
                </div>
              </div>
            ))}

            {grouped[k].length === 0 && (
              <div className="muted" style={{fontSize: 11.5, textAlign: "center", padding: "20px 0"}}>
                該当なし
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Escalation hint */}
      {grouped.todo.length >= 2 && (
        <div className="card" style={{marginTop: 18, background: "var(--danger-soft)", borderColor: "oklch(0.84 0.07 25)"}}>
          <div style={{display: "flex", gap: 12, alignItems: "flex-start"}}>
            <Icon name="flag" size={18}/>
            <div>
              <div style={{fontWeight: 600, fontSize: 13.5, color: "oklch(0.4 0.14 25)"}}>
                未着手が {grouped.todo.length} つ溜まっています
              </div>
              <div style={{fontSize: 12.5, color: "oklch(0.4 0.14 25)", marginTop: 6, lineHeight: 1.6}}>
                ルールに従い、来月の重点に少なくとも1つ含めてください。<br/>
                候補: <strong>セキュア・ブート / TPM</strong> または <strong>FPGA 設計</strong>
              </div>
              <div style={{display: "flex", gap: 8, marginTop: 10}}>
                <button className="btn sm primary">来月の重点に追加</button>
                <button className="btn sm" onClick={() => goto("monthly")}>月次レビューを開く</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Object.assign(window, { WeeklyReview, MonthlyReview, WeakMap });
