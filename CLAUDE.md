# 神奈川県釣船業協同組合 ホームページ

## 概要
神奈川県釣船業協同組合の公式サイト。Jekyll（GitHub Pages内蔵）で構築。

## リプレイス元（旧サイト）
- **URL**: http://www.kanaturi.jp/
- **構成**: IBM HomePage Builder 2001 で作成された HTML 4.0（Shift_JIS）。WordPress上で運用
- **問題**: 更新頻度が年1回程度でWordPressはオーバースペック。レンタルサーバー費用も高い。スマホ非対応
- **旧ページ構成**:
  - `index.htm` — トップページ
  - `funeyado.htm` — 加盟船宿一覧（川崎地区・八景地区）
  - `jigyo.htm` — 事業内容目次（放流事業・イベント事業）
  - `jigyo1.htm` — 放流活動 年次報告（H9〜H29、写真付き）
  - `jigyo10.htm` — 放流活動 年次報告（H30〜R4）
  - `jigyo11.htm` — 放流活動 年次報告（R5〜R7）
  - `jigyo2.htm` — ファミリーフィッシングイベント報告（2001〜2005）
  - `rijimei.htm` — 役員理事名簿
  - `rinku.htm` — リンク集
- **データ取得方法**: `curl -ksL http://www.kanaturi.jp/xxx.htm | iconv -f SHIFT_JIS -t UTF-8`
- **画像取得**: `curl -ksL -o ファイル名 http://www.kanaturi.jp/画像ファイル名`
- **注意**: SSL証明書が期限切れのため `-k` オプション必須

## 技術スタック
- **Jekyll**（GitHub Pages内蔵、自動ビルド）
- **HTML5 + CSS3 + Vanilla JS** — npm、Astro、Tailwind等は使わない
- **ホスティング**: GitHub Pages（無料）
- **ローカルプレビュー**: `bundle exec jekyll serve --port 8888`（要 homebrew ruby）
- **更新方法**: HTMLを編集して `git push` で反映（GitHub Pagesが自動ビルド）

## ディレクトリ構成
```
├── _config.yml           # Jekyll設定
├── _layouts/
│   └── default.html      # 共通レイアウト（head/header/footer/script）
├── _includes/
│   ├── header.html       # ヘッダー・ナビゲーション
│   └── footer.html       # フッター・back-to-top
├── Gemfile               # Ruby依存（jekyll, webrick）
├── index.html            # トップページ
├── members.html          # 加盟船宿一覧
├── about.html            # 組合概要・役員理事
├── contact.html          # お問い合わせ
├── activities/
│   ├── index.html        # 活動報告一覧
│   ├── YYYY-species.html # 個別記事（例: 2025-madai.html）
│   └── archive.html      # 過去の放流記録（H9〜H29）
├── css/style.css         # 共通スタイル（1ファイル）
├── js/main.js            # ハンバーガー・スクロール等の最小限JS
└── images/               # 画像（GIF + WebPの両方を保持）
```

## コーディングルール

### Jekyll
- 全ページに front matter（`---` ブロック）が必須: `layout`, `title`, `description`, `nav_active`
- header/footer は `_includes/` に共通化。個別ページにはコピーしない
- 内部リンクは `{{ '/path' | relative_url }}` 形式で統一（`../` は使わない）
- ナビのactive状態は `page.nav_active` 変数で自動制御
- OGP/Twitter Cardタグは `_layouts/default.html` で自動適用（個別設定不要）

### HTML
- 外部リンクには `target="_blank" rel="noopener"` を付ける
- 電話番号は `<a href="tel:xxx">` でリンク化
- アクセシビリティ: `aria-label`, `aria-expanded`, `aria-current="page"`, `role` を適切に付与
- 活動詳細ページは `<article>` タグを使用

### CSS
- **1ファイル構成**（`css/style.css`）
- **CSS変数**は `:root` にまとめて定義（`--color-primary`, `--header-height`, `--radius` 等）
- **セクションコメント**で区切る: `/* ===== Section Name ===== */`
- **クラス命名**: フラットなセマンティック名（BEMではない）
- **レスポンシブ**:
  - タブレット: `@media (min-width: 768px) and (max-width: 1024px)`
  - モバイル: `@media (max-width: 767px)`
- **wind-pattern**: 共通ベース（`hero::before, .page-header::before, .wind-pattern::before`）+ 白系/青系の2バリエーション
- **prefers-reduced-motion**: アニメーション無効化対応済み

### 画像
- **WebP優先**: `<picture>` タグで WebP `<source>` + GIF `<img>` フォールバック
- 活動写真: `images/activities/{年度ディレクトリ}/` に格納
  - 令和: `r01/` 〜 `r07/`、平成: `h30/`、古い記録: `archive/`
- hero画像: `images/hero.webp`（CSS背景で使用）

### ページ追加時の手順（活動報告の例）
1. `activities/YYYY-species.html` を既存ページをコピーして作成（front matter含む）
2. `activities/index.html` にカードを追加
3. `index.html` のトップ3件を必要に応じて更新
4. 前後ページの `.article-nav` リンクを更新
5. 画像を `images/activities/{年度}/` に WebP + GIF で配置
