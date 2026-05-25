// ===== A-2 Problem screen (実際の問い) =====
// Shows the actual exam problem for a single card.
// Problem content is mocked — replace `MOCK_PROBLEMS[c]` with real text when wired up.

const MOCK_PROBLEMS = {
  7: {
    stem: "リアルタイムOSにおけるレートモノトニック (RM) スケジューリング方式に関する記述として、適切なものはどれか。",
    choices: [
      "周期の短いタスクほど高い優先度を与え、固定優先度方式でスケジューリングする。",
      "デッドラインの近いタスクほど高い優先度を動的に与えて実行する。",
      "全タスクの実行時間が等しい場合に限り適用可能で、ラウンドロビン方式と等価である。",
      "実行時に CPU 使用率の余裕に応じて、優先度を動的に変更する。",
    ],
    answer: 0,
    comment: "RM (Rate Monotonic) は固定優先度方式。周期 T が短いタスクほど優先度が高い。\nB の方式は EDF (Earliest Deadline First) — 動的優先度。\nC, D は誤り。",
    tags: ["スケジューリング", "RTOS", "固定優先度"],
  },
  11: {
    stem: "組込みシステムの割り込み処理に関する記述のうち、適切なものはどれか。",
    choices: [
      "ハードウェア割り込みは常にソフトウェア割り込みより優先される。",
      "割り込み禁止区間が長くなるほど、応答時間 (latency) のジッタが増大する。",
      "ネストした割り込みは禁止することで、再入可能性の問題を完全に解決できる。",
      "DMA 転送中は CPU が他の処理を一切実行できない。",
    ],
    answer: 1,
    comment: "割り込み禁止区間 (critical section) は応答性能の上限を制約する主要因。\nC については「再入可能でない関数」の問題は別途残るため誤り。",
    tags: ["割り込み", "リアルタイム性"],
  },
  13: {
    stem: "組込みシステムにおけるメモリ管理ユニット (MMU) の役割として、適切でないものはどれか。",
    choices: [
      "仮想アドレスと物理アドレスの変換を行う。",
      "ページ単位でアクセス権 (R/W/X) を制御する。",
      "キャッシュコヒーレンシを物理層で保証する。",
      "プロセス間のメモリ空間を分離する。",
    ],
    answer: 2,
    comment: "キャッシュコヒーレンシは MESI 等のキャッシュ制御層の責務で、MMU の機能ではない。",
    tags: ["MMU", "メモリ管理", "仮想記憶"],
  },
};

const FALLBACK_PROBLEM = {
  stem: "（問題本文 — 実データ未投入）\n\nこのカードに対応する原問の本文をここに表示します。本番接続前のスタブとして、選択肢ア〜エが汎用テキストで描画されます。",
  choices: ["選択肢ア", "選択肢イ", "選択肢ウ", "選択肢エ"],
  answer: null,
  comment: "（解説 — 実データ未投入）",
  tags: [],
};

const Problem = ({ cardC, rep = 0, goto, onAnswered }) => {
  const c = cardC || 7;
  const meta = cardToProblem(c);
  const problem = MOCK_PROBLEMS[c] || FALLBACK_PROBLEM;
  const choiceLabels = ["ア", "イ", "ウ", "エ"];

  const [selected, setSelected] = React.useState(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [elapsedSec, setElapsedSec] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setElapsedSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
  const ss = String(elapsedSec % 60).padStart(2, "0");
  const isCorrect = submitted && problem.answer !== null && selected === problem.answer;
  const isWrong = submitted && problem.answer !== null && selected !== problem.answer;

  return (
    <>
      <PageHead
        crumb={`学習 / 今日のセッション / 問題 #${c}`}
        title={<>問{meta.q} <span className="muted num" style={{fontSize: 18, fontWeight: 400}}>（{meta.year}年度）</span></>}
        sub={
          <span>
            <SubjTag subj="A-2"/>
            <span style={{marginLeft: 8}}>通し番号 #{c}</span>
            <span style={{marginLeft: 12}} className="muted">·</span>
            <span style={{marginLeft: 12}}>{rep === 0 ? "導入 (新規)" : `${rep}回目の復習`}</span>
            <span style={{marginLeft: 12}} className="muted">·</span>
            <span style={{marginLeft: 12}} className="num muted">経過 {mm}:{ss}</span>
          </span>
        }
        right={
          <div style={{display: "flex", gap: 8}}>
            <button className="btn" onClick={() => goto("today")}>← セッションに戻る</button>
          </div>
        }
      />

      <div className="row" style={{gap: 18, alignItems: "flex-start"}}>
        {/* Problem body — main column */}
        <div className="col problem-main-col" style={{flex: 1.8, minWidth: 0}}>
          <div className="card problem-card" style={{padding: 26}}>
            <div style={{display: "flex", alignItems: "baseline", gap: 12, paddingBottom: 14, borderBottom: "1px solid var(--border)", marginBottom: 18}}>
              <span style={{
                fontFamily: "var(--mono)",
                fontSize: 13,
                background: "var(--ink)",
                color: "var(--bg)",
                padding: "3px 10px",
                borderRadius: 4,
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}>問 {meta.q}</span>
              <span className="muted num" style={{fontSize: 12}}>{meta.year}年度 春期 / 応用情報技術者試験 (午前II 想定)</span>
            </div>

            {/* Problem stem */}
            <div style={{
              fontSize: 16,
              lineHeight: 1.95,
              fontFamily: "var(--serif)",
              fontWeight: 500,
              color: "var(--ink)",
              whiteSpace: "pre-wrap",
              marginBottom: 22,
            }}>
              {problem.stem}
            </div>

            {/* Choices */}
            <div style={{display: "flex", flexDirection: "column", gap: 10}}>
              {problem.choices.map((text, i) => {
                const picked = selected === i;
                const isAnswer = submitted && problem.answer === i;
                const isPickedWrong = submitted && picked && problem.answer !== null && problem.answer !== i;
                let bg = "var(--surface)";
                let border = "var(--border-strong)";
                let labelBg = "var(--surface-2)";
                let labelColor = "var(--ink)";
                if (picked && !submitted) {
                  bg = "var(--accent-soft)";
                  border = "var(--accent)";
                  labelBg = "var(--accent)";
                  labelColor = "white";
                }
                if (isAnswer) {
                  bg = "var(--ok-soft)";
                  border = "var(--ok)";
                  labelBg = "var(--ok)";
                  labelColor = "white";
                }
                if (isPickedWrong) {
                  bg = "var(--danger-soft)";
                  border = "var(--danger)";
                  labelBg = "var(--danger)";
                  labelColor = "white";
                }
                return (
                  <button
                    key={i}
                    onClick={() => !submitted && setSelected(i)}
                    disabled={submitted}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      padding: "14px 16px",
                      background: bg,
                      border: "1.5px solid " + border,
                      borderRadius: 8,
                      cursor: submitted ? "default" : "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                      transition: "all 0.12s",
                      width: "100%",
                    }}
                  >
                    <span style={{
                      flexShrink: 0,
                      width: 30, height: 30,
                      display: "grid", placeItems: "center",
                      borderRadius: 6,
                      background: labelBg,
                      color: labelColor,
                      fontFamily: "var(--serif)",
                      fontWeight: 600,
                      fontSize: 15,
                    }}>{choiceLabels[i]}</span>
                    <span style={{
                      flex: 1, fontSize: 14.5,
                      lineHeight: 1.7,
                      paddingTop: 4,
                      color: "var(--ink)",
                    }}>{text}</span>
                    {isAnswer && <span className="chip ok" style={{flexShrink: 0, marginTop: 4}}>正解</span>}
                  </button>
                );
              })}
            </div>

            {/* Action bar */}
            <div className="action-bar" style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}>
              {!submitted ? (
                <>
                  <button
                    className="btn primary"
                    disabled={selected === null}
                    onClick={() => setSubmitted(true)}
                    style={{opacity: selected === null ? 0.4 : 1, cursor: selected === null ? "not-allowed" : "pointer"}}
                  >
                    解答する
                  </button>
                  <button className="btn" onClick={() => setSelected(null)} disabled={selected === null}>選択解除</button>
                  <span className="muted" style={{fontSize: 12, marginLeft: "auto"}}>
                    {selected === null ? "選択肢を選んでください" : `${choiceLabels[selected]} を選択中`}
                  </span>
                </>
              ) : (
                <>
                  {isCorrect && <span className="chip ok"><Icon name="check" size={12}/> 正答</span>}
                  {isWrong && <span className="chip danger">誤答</span>}
                  {problem.answer === null && <span className="chip">提出済み (採点データ未投入)</span>}
                  <span className="muted num" style={{fontSize: 12, marginLeft: "auto"}}>所要 {mm}:{ss}</span>
                  <button className="btn" onClick={() => { setSubmitted(false); setSelected(null); }}>もう一度解く</button>
                  <button className="btn primary" onClick={() => goto("today")}>セッションに戻る</button>
                </>
              )}
            </div>
          </div>

          {/* Explanation — shown after submission */}
          {submitted && (
            <div className="card" style={{marginTop: 16}}>
              <div className="card-head">
                <h3>解説</h3>
                <span className="muted" style={{fontSize: 11}}>正解: {problem.answer !== null ? choiceLabels[problem.answer] : "—"}</span>
              </div>
              <div style={{
                fontSize: 13.5,
                lineHeight: 1.85,
                whiteSpace: "pre-wrap",
                color: "var(--ink-2)",
                padding: 12,
                background: "var(--surface-2)",
                borderRadius: 6,
                border: "1px solid var(--border)",
              }}>{problem.comment}</div>

              {problem.tags && problem.tags.length > 0 && (
                <div style={{marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center"}}>
                  <span className="label" style={{marginRight: 4}}>関連トピック</span>
                  {problem.tags.map((t, i) => (
                    <span key={i} className="chip">{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Side: card meta */}
        <div className="col" style={{flex: 1, minWidth: 240}}>
          <div className="card">
            <div className="card-head">
              <h3>このカード</h3>
              <span className="num muted" style={{fontSize: 11}}>#{c}</span>
            </div>
            <div style={{display: "grid", gap: 10, fontSize: 13}}>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span className="muted">通し番号</span>
                <span className="num" style={{fontWeight: 600}}>#{c}</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span className="muted">原問</span>
                <span className="num">問{meta.q} ({meta.year})</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span className="muted">導入日</span>
                <span className="num">Day {introDay(c)}</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span className="muted">今回</span>
                <span>{rep === 0 ? "導入 (新規)" : `${rep}回目の復習`}</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span className="muted">次回出現</span>
                <span className="num">+{Math.pow(2, rep)}日後</span>
              </div>
            </div>
            <div className="divider"/>
            <button className="btn sm" style={{width: "100%"}} onClick={() => goto("cards")}>
              カード進行表で見る →
            </button>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>ミス分類</h3>
              <span className="muted" style={{fontSize: 11}}>誤答時のみ</span>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: 6}}>
              {[
                ["知識不足型", "そもそも知らなかった", "oklch(0.65 0.16 25)"],
                ["理解不足型", "知識と文脈が結びつかなかった", "oklch(0.7 0.13 75)"],
                ["ケアレス型", "読み落とし・字数オーバー", "oklch(0.55 0.11 200)"],
              ].map(([label, desc, color], i) => (
                <button key={i} className="btn" style={{
                  textAlign: "left",
                  display: "block",
                  padding: "8px 10px",
                  borderColor: "var(--border)",
                  opacity: isWrong ? 1 : 0.5,
                  cursor: isWrong ? "pointer" : "not-allowed",
                }} disabled={!isWrong}>
                  <div style={{display: "flex", alignItems: "center", gap: 8}}>
                    <span style={{width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0}}/>
                    <span style={{fontWeight: 600, fontSize: 12.5}}>{label}</span>
                  </div>
                  <div className="muted" style={{fontSize: 10.5, marginTop: 2, marginLeft: 16}}>{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>気づきメモ</h3>
            </div>
            <textarea
              placeholder="この問題で得た気づきを記録..."
              style={{
                width: "100%",
                minHeight: 90,
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
            <div className="muted" style={{fontSize: 11, marginTop: 6}}>
              <span className="linkish">+ 弱点メモに昇格</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { Problem });
