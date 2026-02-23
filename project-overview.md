# SES エンジニア向けキャリア記録アプリ - プロジェクト概要

## ビジネス背景
- **対象ユーザー：** SES（客先常駐）エンジニア、フリーランスエンジニア
- **市場規模：** 日本の SES エンジニア数十万人
- **ニーズ：** 案件ごとの詳細な仕事内容を記録し、転職時に「実際にやったこと」を思い出す、給与交渉の材料にする

## 主要機能

### 1. ダッシュボード
- 技術別の累計経験年数をカード表示
  - 例：「React: 3年2ヶ月」「Java: 5年」
- 最近の案件をピックアップ表示
- ユーザーが一目で自分のキャリアを把握できる

### 2. 案件管理
- **案件基本情報**
  - 案件名
  - クライアント企業
  - 参画期間（開始日～終了日）
  - 役職・役割
  - 使用技術（複数選択可）
  
- **案件詳細**
  - 案件の詳しい説明やメモ
  - プロジェクト規模・体制など

### 3. 日記機能（重要）
- **スマホから素早く記録**
  - 案件が終わるたびに「やったこと」を日記形式で記録
  - テキストメモ + タグ付け
  
- **日記エントリーの構成**
  - 日付
  - タイトル（「〇〇バグを修正した」など）
  - タグ（複数選択）
  - 詳細メモ（自由記述）

### 4. タグシステム（市場価値ベース）

**開発スキル系：**
- 新規開発
- 機能開発
- バグ修正
- リファクタリング
- 設計・アーキテクチャ

**ビジネススキル系（市場価値UP）：**
- 顧客折衝
- 要件定義
- PM/マネジメント
- プレゼン・資料作成

**技術深掘り系：**
- インフラ・環境構築
- パフォーマンス最適化
- セキュリティ対応

**学習・貢献系：**
- レビュー・指導
- 学習・技術検証
- トラブルシューティング

### 5. 検索・フィルタ機能
- **技術で絞る**
  - 「React を使った案件」を全て表示
  - 技術別の累計年数を自動計算
  
- **時期で絞る**
  - 「2024年のやつ」など、日付範囲で検索
  
- **タグで絞る**
  - 「顧客折衝タグ」を持つ日記だけ表示

### 6. PC での参照
- ダッシュボード表示
- 案件一覧（カード型）
- 案件詳細（タイムライン表示）
  - 日記が時系列で展開される
  - タグが視覚的に色分け表示
  
- **転職活動時の使用方法**
  - 「Java を使った案件」で絞る
  - 「顧客折衝」タグで実績を抽出
  - 「この案件でこんなことやりました」と具体例を引き出せる

## 非機能要件

### デザイン
- **テーマ：** モダン・ミニマリスト
- **色彩：** ダークテーマ（深紺）+ ゴールドアクセント
- **Typography：** セリフフォント（見出し）+ サンセリフ（本文）
- **レスポンシブ：** モバイル + PC 両対応
- **UX：** スムーズなアニメーション、ホバーエフェクト

### デバイス対応
- **モバイル（スマホ）：** 日記入力に最適化
- **PC：** 参照・検索に最適化
- ブラウザベース（Responsive Design で対応）

### 価格
- 月額無料（初期段階）
- ドメイン：無し（Vercel のサブドメイン使用）
- サーバー費用：ほぼ 0 円（Firebase 無料枠）

## 技術スタック

- **フロントエンド：** React 18
- **スタイリング：** Tailwind CSS
- **バックエンド + DB：** Firebase (Firestore)
- **認証：** Firebase Authentication
- **デプロイ：** Vercel
- **バージョン管理：** GitHub
- **開発環境：** Node.js 18+, npm, VSCode

## データモデル（Firestore）

### Collections

#### `users`
```
{
  uid: string (Firebase Auth UID)
  email: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `projects` (user ごと)
```
users/{uid}/projects/{projectId}
{
  name: string (案件名)
  client: string (クライアント企業)
  startDate: date
  endDate: date
  role: string (役職)
  technologies: array (使用技術)
  description: string (案件説明)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `entries` (project ごと)
```
users/{uid}/projects/{projectId}/entries/{entryId}
{
  date: date
  title: string
  tags: array (タグ複数)
  content: string (詳細メモ)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## 開発スケジュール（3週間）

### Week 1：認証 + UI 構築 + Firestore スキーマ
- Firebase プロジェクト作成・設定
- Firebase Authentication（メール・パスワード）の実装
- Tailwind CSS セットアップ完了
- UI 4 画面の実装（ダッシュボード、案件一覧、詳細、日記入力）
- Firestore セキュリティルール設定

### Week 2：案件登録・一覧・詳細機能 + 日記機能
- 案件の CRUD（Create, Read, Update, Delete）
- 案件一覧の表示
- 案件詳細ページ実装
- 日記エントリーの追加・編集・削除
- タイムラインの表示

### Week 3：技術別累計計算 + フィルタ機能 + 調整
- 技術別の累計経験年数を自動計算
- 技術でフィルタ
- 時期でフィルタ
- タグでフィルタ
- バグ修正・UX 調整
- モバイル対応の確認

## マーケティング・ユーザー獲得

- **ターゲット：** Twitter、Zenn での SES エンジニア層
- **初期ユーザー目標：** 20～50人
- **期待月収：** 月額 5,000～25,000円（月額無料で広告なしの場合は 0 円）

## 現在の進行状況

### 完了
- ✅ プロジェクト概要設計
- ✅ デザイン案作成（React コンポーネント）
- ✅ 技術スタック確定
- ✅ Node.js インストール
- ✅ React プロジェクト初期化（`npx create-react-app ses-portfolio-app`）

### 次のステップ
- [ ] Tailwind CSS セットアップ
- [ ] Firebase SDK インストール
- [ ] Firebase プロジェクト作成・API キー取得
- [ ] GitHub リポジトリ作成・初期コミット
- [ ] 認証機能実装
- [ ] ダッシュボード UI 実装
- [ ] 案件管理機能実装
- [ ] 日記機能実装
- [ ] フィルタ機能実装
- [ ] Vercel デプロイ設定

## ファイル構成（予定）

```
ses-portfolio-app/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── ProjectList.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── MobileEntry.jsx
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── Layout/
│   │       └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Projects.jsx
│   │   └── Entry.jsx
│   ├── services/
│   │   ├── firebase.js
│   │   ├── auth.js
│   │   └── firestore.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useProjects.js
│   ├── styles/
│   │   └── index.css (Tailwind)
│   ├── App.jsx
│   └── index.js
├── public/
├── .env.local (Firebase keys)
├── tailwind.config.js
├── package.json
└── README.md
```

## その他注意点

- ユーザー認証は Firebase Authentication で実装
- 各ユーザーのデータは Firestore で分離管理
- セキュリティルールで、ユーザーは自分のデータだけアクセス可能にする
- モバイルファーストで UI を設計（スマホでの日記入力が主用途）