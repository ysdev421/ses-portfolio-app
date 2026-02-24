# SES Portfolio App

SESエンジニア向けの実績管理アプリです。案件・日報・面談ログを蓄積し、キャリア整理と提案準備を効率化します。

## 主な機能
- 案件管理（一覧 / 詳細 / 追加 / 編集 / 削除）
- 日報管理（案件単位）
- 面談ログ管理
- キャリアシート表示・CSV出力
- LP / 体験版 / お知らせ / ガイド / Aboutページ
- SEO対応（meta、robots、sitemap自動生成）

## 体験版仕様
- 体験版ログインは `REACT_APP_DEMO_EMAIL` / `REACT_APP_DEMO_PASSWORD` を使用
- 体験版ユーザーは閲覧専用（Firestoreルール + UI非活性）
- 案件追加ボタンは表示したまま非活性で理由を表示

## 技術スタック
- React (CRA)
- Firebase Authentication / Firestore
- Tailwind CSS
- Vercel / Firebase Hosting

## セットアップ
1. 依存関係をインストール
```bash
npm install
```

2. `.env.local` を作成
```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=

# optional: 体験版ログイン
REACT_APP_DEMO_EMAIL=
REACT_APP_DEMO_PASSWORD=
```

3. 開発起動
```bash
npm start
```

## ビルド
```bash
npm run build
```
- `prebuild` で `scripts/generate-sitemap.js` が実行され、`public/sitemap.xml` を更新します。

## Firestoreルール反映
`firestore.rules` を変更したら必ずデプロイしてください。
```bash
firebase deploy --only firestore:rules
```

## ディレクトリ（主要）
- `src/pages` 画面コンポーネント
- `src/components` UIコンポーネント
- `src/services` Firebaseアクセス
- `src/utils` 共通処理（SEO/日付など）
- `public` 静的ファイル（robots/sitemap含む）
- `docs` 運用ドキュメント

## 運用メモ
- CIではESLint warningがエラー扱いになる設定です。
- 文字コードはUTF-8（BOMなし）推奨です。
