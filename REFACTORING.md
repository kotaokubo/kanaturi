# リファクタリング計画

## Phase 1: 高優先

### 1. header/footer の共通化 — DONE (Round 1)
- Jekyll移行で `_includes/header.html`, `_includes/footer.html` に共通化
- ナビのactive状態も `page.nav_active` で自動制御

### 2. OGP / SNS共有タグの追加 — DONE (Round 3)
- `_layouts/default.html` で全ページに自動適用
- og:title, og:description, og:type, og:image, twitter:card 等

### 3. hero.jpg の最適化 — DONE (Round 2)
- hero.webp に変換（1.7MB → 618KB）

---

## Phase 2: 中優先

### 4. GIF画像のWebP変換 — DONE (Round 2)
- 140枚を gif2webp で変換、`<picture>` タグでフォールバック対応

### 5. page-header の構造統一 + article要素化 — DONE (Round 8)
- 活動詳細ページの `<div class="article">` → `<article class="article">` に変更

### 6. CSS整理 — DONE (Round 4, 6, 7)
- wind-pattern を3箇所から共通ベースに統一
- `--radius`, `--radius-sm` 変数追加
- nav-menu-label 関連の残骸CSS削除
- header-logo-text-short の未使用HTML/CSS削除

### 7. .gitignore の整理 — DONE (Round 1)
- Astro関連削除、Jekyll関連追加

---

## Phase 3: 低優先

### 8. アクセシビリティ改善 — DONE (Round 5)
- `aria-expanded`, `aria-controls`, `aria-current="page"` 追加
- `prefers-reduced-motion` メディアクエリ追加
- `.nav-overlay` に `role="presentation" aria-hidden="true"` 追加

### 9. canonical リンクの追加 — PENDING
- ドメイン確定後に `_layouts/default.html` に追加予定

### 10. レスポンシブ画像対応 — PENDING
- hero画像の srcset 複数サイズ提供
- 活動写真のサムネイル用小サイズ画像

---

## 追加で見つかった課題

### 11. OGP画像の専用化 — PENDING
- 現在 hero.webp を流用。1200x630 の専用OGP画像を作成すべき
- ドメイン確定後に `absolute_url` で正式なURLに

### 12. GIF画像の元データ品質 — PENDING
- 旧サイトのGIFは低画質。将来的に高画質JPEG/WebPで撮り直しが理想

### 13. Gemfile.lock のコミット — PENDING
- `bundle install` で生成された `Gemfile.lock` をコミットに含めるべき

### 14. Google Maps embed URLの本番化 — PENDING
- contact.html のiframeが仮URLのため地図が表示されない
- 本番用の正しい embed URL を Google Maps で取得して設置する必要あり

---

## 対応不要（現状維持でOK）

- **meta description**: 全ページに設定済み
- **外部リンク**: `target="_blank" rel="noopener"` が全て付与済み
- **tel リンク**: 正しくマークアップ済み
- **aria-label**: ハンバーガーボタン、back-to-topに設定済み
- **Google Maps iframe**: `loading="lazy"` 設定済み
- **内部リンク整合性**: Jekyll relative_url で統一済み
