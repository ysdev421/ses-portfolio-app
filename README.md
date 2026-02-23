# SES エンジニア向けキャリア記録アプリ

SES（客先常駐）エンジニア、フリーランスエンジニアが案件ごとの詳細な仕事内容を記録し、転職時に「実際にやったこと」を思い出す、給与交渉の材料にするためのアプリケーション。

## 特徴

- **ダッシュボード**: 技術別の累計経験年数をカード表示
- **案件管理**: 案件の基本情報、詳細、使用技術を記録
- **日記機能**: スマホから素早くやったことを記録
- **タグシステム**: 市場価値ベースの分類（開発スキル、ビジネススキル、技術深掘り、学習）
- **検索・フィルタ**: 技術、時期、タグで絞り込み
- **レスポンシブデザイン**: モバイル・PC両対応

## 使用技術

- **フロントエンド**: React 19.2.4
- **スタイリング**: Tailwind CSS 4.2.1
- **バックエンド・認証**: Firebase
- **デプロイ**: Vercel（予定）

## セットアップ

### 前提条件

- Node.js 14.0 以上
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd ses-portfolio-app
```

2. 依存パッケージをインストール
```bash
npm install
```

3. Firebase設定
   - Firebase Consoleで新しいプロジェクトを作成
   - `.env.local` ファイルに以下の環境変数を設定（`.env.local`テンプレートを参照）

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 開発サーバーの起動

```bash
npm start
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## ビルド

```bash
npm run build
```

`build` フォルダに本番用ビルドが作成されます。

## テスト

```bash
npm test
```

テストを実行します。

## プロジェクト構造

```
src/
├── App.js              # メインアプリケーション
├── App.css             # Tailwindカスタムスタイル
├── firebaseConfig.js   # Firebase設定
├── index.js            # エントリーポイント
├── index.css           # グローバルスタイル（Tailwind）
└── components/         # Reactコンポーネント（将来作成予定）
```

## デザインガイドライン

### カラーパレット

- **背景色**: 深紺（`#0f172a`）
- **カード背景**: 深紺（`#1e293b`）
- **テキスト**: ライト紺（`#334155`）
- **アクセント**: ゴールド（`#f59e0b`）

### フォント

- **見出し**: セリフフォント（Georgia, Garamond）
- **本文**: サンセリフ（Segoe UI, Roboto）

### レスポンシブブレークポイント

- **モバイル**: < 640px
- **タブレット**: 640px - 1024px
- **PC**: > 1024px

## 主要な今後の実装

- [ ] ユーザー認証（ログイン・サインアップ）
- [ ] 案件管理CRUD
- [ ] 日記機能
- [ ] タグシステム
- [ ] フィルタ・検索機能
- [ ] データベーススキーマ設計
- [ ] API設計

## トラブルシューティング

### Firebase設定エラー
- `.env.local` ファイルが存在することを確認
- 環境変数の値が正しいか確認
- Firebase Consoleでプロジェクト設定を再確認

### Tailwind CSSが反映されない
- `npm install` で依存パッケージが全てインストールされているか確認
- `tailwind.config.js` と `postcss.config.js` が正しく設定されているか確認
- ブラウザキャッシュをクリアし、サーバーを再起動

## ライセンス

MIT

## 参考資料

- [React ドキュメント](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase ドキュメント](https://firebase.google.com/docs)
- [Create React App](https://create-react-app.dev)
