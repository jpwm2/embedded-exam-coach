# 資格学習コーチ画面

_Started 2026-05-24 12:20 UTC_

---

## User

資格学習を支えるGUIを作って。年間計画に書かれているやらなきゃいけないことなどをサポートするコーチのようなシステムのGUI

## Assistant

_[tool: read_file]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: copy_files]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: update_todos]_

申し訳ありません、添付ファイルがシステム制約で読み込めませんでした（ファイル名の特殊文字の問題のようです）。代わりに、エンベデッドシステムスペシャリスト試験（IPA 秋期試験）の一般的な年間計画フェーズをもとに、汎用的だが完成度の高いコーチGUIを設計します。後で実際の年間計画の主要項目を貼っていただければカスタマイズします。

デザイン方針を宣言します:
- **言語**: 日本語UI
- **タイポグラフィ**: Noto Sans JP（本文）+ JetBrains Mono（数値）
- **配色**: 暖かみのあるオフホワイト基調、深いインク、アクセントは静かなティール (oklch)
- **メタファ**: 学習コーチ（チャット風メッセージ＋データダッシュボード）
- **画面**: ダッシュボード / 年間計画 / 今日の学習 / 過去問演習 / 弱点分析 をサイドバーで切替
- **インタラクション**: タスクチェック、ポモドーロタイマー、フェーズ進捗、過去問グリッド

_[tool: copy_starter_component]_

_[tool: write_file]_

## User

ファイルの中身は以下の通りである。

## Assistant

_[tool: write_file]_

詳細な計画内容、ありがとうございます。これは非常に練り込まれた計画なので、計画特有の構造（A-2のカード通し番号と公比2の復習スケジュール、B-1の火木土、B-2の10工数モデル、週次/月次レビューの「測る/ふりかえる/うごかす」）をそのままGUIに翻訳します。

設計をいったん整理:
- **ダッシュボード** — 試験まで残日数、今日の3科目タスク、コーチからのメッセージ、週次KPI
- **今日のセッション** — A-2カードリスト（導入/復習を区別）、B-1/B-2、ポモドーロ
- **A-2カード進行ビュー** — 通し番号 × 公比2スケジュールの可視化
- **過去問進捗** — B-1グリッド（16年×3問、選択2問）＋ B-2の23テーマ×10工数
- **週次レビュー** — 測る/ふりかえる/うごかす の構造化フォーム
- **月次レビュー** — A/B/C判定、弱点マップ、「やる/やらない」宣言
- **弱点マップ** — 解消/改善中/未着手

進めます。

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: write_file]_

_[tool: done]_

_[tool: update_todos]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: multi_screenshot]_

The dashboard looks clean. Let me verify the other screens render correctly.

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

The Today screen layout is cramped at this viewport width. Let me check other screens first, then fix.

_[tool: show_html]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

[Tool use was interrupted]

