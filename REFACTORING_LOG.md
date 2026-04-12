# リファクタリングログ

---

## Round 1: Jekyll移行（header/footer共通化）

**実施内容:**
- Jekyll導入: `_config.yml`, `Gemfile`, `_layouts/default.html` 作成
- `_includes/header.html` / `_includes/footer.html` に共通部分を切り出し
- 全14 HTMLファイルをfront matter形式に書き換え（header/footer/head/script削除）
- ナビのactive状態を `page.nav_active` 変数で自動制御
- 全ページの内部リンクを `{{ '/path' | relative_url }}` 形式に変換（../パス問題解消）
- `.gitignore` を整理（Astro関連削除、Jekyll関連追加）

**作成ファイル:**
- `_config.yml`, `Gemfile`, `_layouts/default.html`, `_includes/header.html`, `_includes/footer.html`

**検証結果:**
- `jekyll build` 成功（0.079秒）
- 全8ページ 200 OK確認
- 全5セクションのナビactive状態が正しく切り替わることを確認

**新たに見つけた課題:**
- OGP未設定ページでhead内に空行が出る（条件分岐のため）→ 軽微

---

## Round 2: 画像のWebP変換

**実施内容:**
- `brew install webp` で cwebp / gif2webp をインストール
- hero.jpg → hero.webp に変換（1.7MB → 618KB、64%削減）
- GIF画像 140枚を全て gif2webp で WebP に変換（7.6MB → 6.8MB）
- 全HTMLの `<img>` タグを `<picture>` タグに変換（149箇所）
  - WebP `<source>` + GIF `<img>` フォールバック構成
- CSS背景の hero.jpg → hero.webp に変更

**変更ファイル:**
- `css/style.css`（hero背景パス）
- 全活動報告HTML 11ファイル + `index.html`（pictureタグ化）

**検証結果:**
- `jekyll build` 成功
- 全ページ 200 OK

**新たに見つけた課題:**
- `<picture>` 内の `<img class="card-thumb">` でCSSの `.card img` セレクタが効かなくなる可能性 → 要確認
- GIF→WebP の圧縮率が低い（元がGIFなので限界あり）。将来的にJPEG/WebP撮り直しが理想

---

## Round 3: OGP / SNS共有タグ整備

**実施内容:**
- `_layouts/default.html` に OGP + Twitter Card タグをデフォルト値込みで一括追加
- `og:title`, `og:description`, `og:type`, `og:locale`, `og:site_name`, `og:image`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- 各ページの front matter から個別OGP指定を削除（レイアウト側で自動適用）
- OGP画像は hero.webp を暫定使用（ドメイン確定後に absolute_url で正式化）

**検証結果:**
- 全ページに OGP/Twitter Card タグが正しく出力されることを確認

---

## Round 4: CSS整理（wind-pattern統一 + 変数追加）

**実施内容:**
- wind-pattern を3箇所（hero, page-header, wind-pattern）から共通ベースに統一
  - `hero::before, .page-header::before, .wind-pattern::before` の共通プロパティをまとめ
  - 白系（hero, page-header）と青系（wind-pattern）の2バリエーションに整理
  - page-header::before の個別定義を削除（共通定義に統合）
- `:root` に `--radius: 8px`, `--radius-sm: 4px` を追加

**検証結果:**
- `jekyll build` 成功
- 風パターンが hero, page-header, 加盟船宿セクション全てで正常表示

---

## Round 5: アクセシビリティ改善

**実施内容:**
- ハンバーガーボタンに `aria-expanded`, `aria-controls` 属性追加
- `main.js` で `aria-expanded` を開閉時に切り替えるように修正
- ナビに `aria-label="メインナビゲーション"` 追加
- ナビメニューに `id="nav-menu"` 追加（aria-controlsの対象）
- アクティブリンクに `aria-current="page"` を追加
- `.nav-overlay` に `role="presentation" aria-hidden="true"` 追加
- `prefers-reduced-motion` メディアクエリを追加（アニメーション無効化対応）

**検証結果:**
- `jekyll build` 成功
- ARIA属性が正しく出力されることを確認

---

## Round 6: 未使用クラス・HTML整理

**実施内容:**
- `.header-logo-text-short` を HTML（`_includes/header.html`）とCSS から削除（常にdisplay:noneだった）
- ヘッダーロゴのHTML簡素化: `<span class="header-logo-text">` ラッパー削除、テキスト直書きに
- モバイル時のフォントサイズを `.header-logo` に移動

---

## Round 7: nav-menu-label CSS残骸削除

**実施内容:**
- Round前半でHTMLから削除済みの `.nav-menu-label` のCSS定義を削除
  - グローバル定義（display: none）から削除
  - モバイルメディアクエリ内の定義（display: block + スタイル）を削除

---

## Round 8: article要素化

**実施内容:**
- 活動詳細ページ9件の `<div class="article">` → `<article class="article">` に変更
- 対応する閉じタグ `</div>` → `</article>` に変更
- セマンティックHTMLの改善

---

## Round 9: CLAUDE.md更新

**実施内容:**
- Jekyll移行に合わせてCLAUDE.mdを全面改訂
  - 技術スタック: Jekyll追加、ローカルプレビューコマンド記載
  - ディレクトリ構成: `_config.yml`, `_layouts/`, `_includes/`, `Gemfile` 追加
  - コーディングルール: Jekyll固有のルール（front matter、relative_url、nav_active）追記
  - 画像: WebP + picture タグの方針を反映

---

## Round 10: 最終検証 + REFACTORING.md完了マーク

**実施内容:**
- 全14ページの200 OK確認
- aria-expanded, article タグ, picture タグ, hero.webp, reduced-motion, OGPタグの出力を全て検証
- REFACTORING.md の全項目に完了/PENDING ステータスを付与
- 新たに見つかった課題3件を追加:
  - OGP専用画像の作成（現在hero.webp流用）
  - GIF元データの品質問題
  - Gemfile.lock のコミット

**最終検証結果:**
- 全14ページ 200 OK
- Jekyll build 成功（0.094秒）
- OGPタグ全ページ出力OK
- ARIA属性正常
- WebP画像正常読み込み

---

## Phase別レビュー（各3回）

### Phase 1 レビュー（Jekyll移行）

**Round 1:**
- 開発: `_config.yml` の `url` 空欄でOGP画像が相対URL問題 → TODOコメント追加。exclude にGemfile追加
- 開発: 活動詳細ページの `og_type` が website → article に修正（9ファイル）
- デザイン(Playwright): デスクトップ/モバイル/ハンバーガー全て正常。padding・中央寄せ問題なし

**Round 2:**
- 開発: ビルド出力に `../` パス残存なし、description欠落なし、articleタグ整合確認 → 全てクリーン
- デザイン(Playwright): activities一覧、contact、archive、モバイルmembers確認 → 全て正常

**Round 3:**
- 開発: front matter完全性チェック（全14ファイルにlayout/title/nav_active設定済み）、nav_active一貫性確認
- デザイン(Playwright): タブレット(1024px)表示確認 → 全て正常

### Phase 2 レビュー（WebP, CSS整理, article要素化）

**Round 1:**
- 開発: `--radius`/`--radius-sm` が定義のみで未使用 → border-radius 7箇所をCSS変数に置換
- 開発: photo-gridがarticle-bodyの外にある（7ファイル） → `</div>` の位置修正で article-body 内に統合
- デザイン(Playwright): 修正後のレイアウト確認 → 正常

**Round 2:**
- 開発: ハードコードborder-radius 0件、var(--radius) 5件/var(--radius-sm) 2件 → 全て変数化完了
- 開発: 全8ファイルでphoto-gridがarticle-body内にあることを確認
- デザイン(Playwright): デスクトップ2024、モバイル2018 → 全て正常

**Round 3:**
- 開発・デザイン: 2020年ページのデスクトップ表示確認 → 問題なし

### Phase 3 レビュー（アクセシビリティ, SEO）

**Round 1:**
- 開発: ARIA属性11項目チェック → 全項目パス
- 開発: OGP/Twitter Card → 全ページ出力確認、og:type正しく分岐
- 開発: prefers-reduced-motion → 正常動作

**Round 2:**
- デザイン(Playwright): モバイルcontactページ → Google Maps embed が仮URLで表示されない（既知問題、REFACTORING.mdに追記）
- アクセシビリティスナップショット: ランドマーク（banner/main/contentinfo）、ナビラベル正常

**Round 3:**
- 最終総合チェック: 全14ページ200 OK、直接パス0件、ハードコードborder-radius 0件、nav-menu-label残骸0件
- 新規発見課題: Google Maps embed URL本番化（REFACTORING.md #14に追加）

---

