# 運用ドキュメント

神奈川県釣船業協同組合ホームページ（`kanatsuri.com`）の運用・保守用メモ。
将来の自分と引継ぎ先が迷わないよう、**何がどこにあって、どう繋がっているか**を記録する。

認証情報（ID・パスワード・2FA）はすべて **1Password の「kanaturi」vault** に保管。
このファイルには認証情報は書かない。

---

## 1. アーキテクチャ概要

```
[ユーザーのブラウザ]
        │
        │  https://kanatsuri.com
        ▼
[eBit DNS (rentaldns.jp)]  ← ドメイン登録・DNS管理
        │
        │  A record → 185.199.108-111.153
        ▼
[GitHub Pages]             ← 静的サイトホスティング（無料）
        │
        │  main ブランチから自動ビルド
        ▼
[Jekyll]                   ← HTMLビルド（plugins: jekyll-sitemap, jekyll-seo-tag）
        │
        ▼
[公開]
  ├─ Google Analytics 4    → アクセス解析（全ページにタグ埋込）
  └─ Google Search Console → 検索パフォーマンス監視 / sitemap.xml受付
```

**データの流れ（日常運用）**: ローカルでHTML編集 → `git push` → GitHub Pagesが自動ビルド → 1〜2分で公開反映。

---

## 2. 外部サービス一覧

### ドメインレジストラ: eBit
- **用途**: `kanatsuri.com` の登録管理・DNS管理
- **ダッシュボード**: https://www.e-bit.jp/
- **認証情報**: 1Password「kanaturi / eBit」
- **有効期限**: 年1回更新（自動更新設定を推奨。要確認）
- **DNS設定内容**:
  - `A` レコード（apex）→ GitHub Pages の4つのIP（`185.199.108.153` / `109.153` / `110.153` / `111.153`）
  - ネームサーバー: `ns1.rentaldns.jp` / `ns2.rentaldns.jp`
- **確認コマンド**: `dig kanatsuri.com NS +short` / `dig kanatsuri.com A +short`

### GitHub（リポジトリ / Pages）
- **用途**: ソース管理＋静的サイトホスティング
- **リポジトリ**: https://github.com/kotaokubo/kanaturi
- **Pages設定**: Settings → Pages → Source: `main` branch / 独自ドメイン `kanatsuri.com` / Enforce HTTPS: ON
- **認証情報**: 1Password「kanaturi / GitHub」
- **カスタムドメイン紐付け**: リポジトリ直下の `CNAME` ファイルに `kanatsuri.com` と1行書いてある
- **ビルド状況確認**: https://github.com/kotaokubo/kanaturi/actions

### Google Analytics 4（GA4）
- **用途**: サイト流入・ユーザー行動の計測
- **ダッシュボード**: https://analytics.google.com/
- **測定ID**: `G-BX6S22D5G2`（`_config.yml` の `google_analytics` に設定）
- **認証情報**: 1Password「kanaturi / Google」（Search Consoleと同じアカウント）
- **発火条件**: `_layouts/default.html` にて `jekyll.environment == "production"` の時のみ発火 → **ローカルの `bundle exec jekyll serve` では計測されない**（自分のテストで汚染されない）

### Google Search Console
- **用途**: インデックス状況・検索パフォーマンス監視、sitemap送信
- **ダッシュボード**: https://search.google.com/search-console/
- **プロパティ**: URLプレフィックス型 `https://kanatsuri.com/`
- **所有権確認方法**: Google Analytics経由（GA4を外すと所有権も外れるので注意）
- **登録済みサイトマップ**: `https://kanatsuri.com/sitemap.xml`（jekyll-sitemapが自動生成）
- **認証情報**: 1Password「kanaturi / Google」

### UptimeRobot（死活監視）
- **用途**: サイトのダウン検知・SSL証明書期限の事前通知
- **ダッシュボード**: https://uptimerobot.com/
- **認証情報**: 1Password「kanaturi / UptimeRobot」
- **プラン**: Free（50モニター・5分間隔まで）
- **登録モニター**:
  - `https://kanatsuri.com` — HTTPSモニター（5分間隔、HEAD）
  - SSL監視: 有効（期限30日前に通知）
  - Keyword監視: `神奈川県釣船業協同組合` の文字列チェック（GitHub Pagesが404を返すケースを検知）
- **通知先**: `kutpremium@gmail.com`
- **GA4への影響**: 標準HTTP(S)モニターはJSを実行しないため、計測データには現れない（除外設定不要）。Real Browser Check（有料）を使う場合のみIP除外が必要

### （不採用）Cloudflare
- 攻撃リスクが低い（静的サイト・会員登録なし）ため導入見送り。
- 将来、大量アクセスや攻撃が想定される場合は検討。

---

## 3. 日常の更新フロー

### 通常の更新（文言修正・画像差し替え等）
1. ローカルで HTML 編集
2. ローカル確認: `bundle exec jekyll serve --port 8888` → http://localhost:8888
3. `git commit` → `git push origin main`
4. 1〜2分待ってから https://kanatsuri.com で反映確認
5. **追加アクション不要**（sitemap も robots も自動更新）

### 新しい活動報告ページを追加する
手順は `CLAUDE.md` の「ページ追加時の手順」を参照。front matterに `date: YYYY-MM-DD` を入れると sitemap に `<lastmod>` が自動付与されて検索エンジンへの反映が早まる。

### 検索結果に急いで載せたい時
Search Console → 上部「URL検査」バーにURL入力 → 「インデックス登録をリクエスト」。1日あたり10件程度が上限。

---

## 4. トラブルシューティング

### サイト全体が表示されない
UptimeRobotからダウン通知が来た場合もこの手順:
1. **https://www.githubstatus.com/** で GitHub Pages の障害有無を確認
2. `dig kanatsuri.com A +short` → `185.199.108-111.153` が返ってくるか確認
   - 返らない → eBit DNS設定が消えた可能性。eBit管理画面で A レコード再設定
3. リポジトリの **Actions タブ** でビルドエラーが出ていないか確認
4. `CNAME` ファイルが消えていないか確認（消えると独自ドメインが外れる）
5. UptimeRobot側の誤検知の可能性もある（ダッシュボードで他モニターの状況確認）

### 「保護されていない通信」になった（SSL証明書エラー）
- GitHub Pages の SSL は Let's Encrypt で自動更新される（手動作業不要）
- Settings → Pages で「Enforce HTTPS」がONになっているか確認
- OFFの場合、一度OFFにしてから再度ONにすると証明書が再発行される

### アクセス数が急にゼロになった（GA4に何も出ない）
1. 対象ページのHTMLソース表示 → `G-BX6S22D5G2` が含まれているか grep
2. 含まれていない → `_config.yml` の `google_analytics` が空になっていないか確認
3. 含まれている → GA4管理画面「管理 → データストリーム」で計測状態を確認
4. ブラウザの広告ブロッカーで自分だけ計測されていないだけのケースも多い

### 検索結果から消えた / ヒットしなくなった
1. Search Console → 「**ページ**」メニューでインデックス状況を確認
2. 「**URL検査**」で個別ページを調査（エラー理由が表示される）
3. `robots.txt` が誤って `Disallow: /` になっていないか確認（`curl https://kanatsuri.com/robots.txt`）
4. 各ページの `<meta name="robots" content="noindex">` がないか確認

### ドメインが切れた
- eBitの管理画面で更新。期限切れ前の**自動更新設定**を強く推奨。
- 更新忘れて1ヶ月以上経つと第三者に取得される可能性あり（組合の顔なので特に注意）。

---

## 5. 年次メンテナンスチェックリスト

毎年1回（例: 事業年度の切り替わり時）にチェック:

- [ ] **ドメイン有効期限**（eBit管理画面）。自動更新ON＋クレカ有効期限確認
- [ ] **GitHubアカウント**の2FAバックアップコードが1Passwordに入っているか
- [ ] **GoogleアカウントのリカバリーSMS/メール**が現在使えるものになっているか
- [ ] `Gemfile.lock` の依存gem更新: `bundle update` → ローカルでビルド確認 → push
- [ ] `CLAUDE.md` / `INFRA.md` の記載内容が現実と乖離していないか読み返す
- [ ] Search Consoleで大量エラーが溜まっていないか確認
- [ ] GA4のデータ保持期間設定（デフォルト2ヶ月→14ヶ月に変更推奨）
- [ ] UptimeRobotのモニター稼働状況＋通知先メールが生きているか確認

---

## 6. 引継ぎ時の手順（将来、担当者が変わる時）

1. 新担当者の Google アカウントを GA4 と Search Console に「ユーザー追加」
2. GitHub リポジトリに Collaborator として招待
3. eBit のアカウントは譲渡 or 新契約に切替（組合の法人アカウント化を検討）
4. 1Password の「kanaturi」vault を共有 or 全パスワード更新して引き渡し
5. このファイル（`INFRA.md`）を一緒に読みながらひと通り触ってもらう
