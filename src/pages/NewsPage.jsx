import { useMemo, useState } from 'react';
import PublicHeader from '../components/PublicHeader';
import { useSeo } from '../utils/seo';

const sesNews = [
  {
    id: 'ses-1',
    title: 'SES案件の単価交渉で押さえるべき観点（実績・再現性・市場感）',
    summary:
      '単価交渉を通すために必要な準備を整理した実務向け記事。案件ログと面談ログの使い方が分かります。',
    source: 'SESキャリア記録ガイド',
    date: '2026-02-20',
    url: '/guides/ses-rate-negotiation',
    tags: ['SES', '単価交渉', 'ガイド'],
  },
  {
    id: 'ses-2',
    title: 'SES案件比較チェックリスト（技術 / 単価 / 体制）',
    summary:
      '提案案件を比較するときに迷わないためのチェックポイントをまとめた記事。案件一覧の活用例付き。',
    source: 'SESキャリア記録ガイド',
    date: '2026-02-19',
    url: '/guides/ses-project-comparison',
    tags: ['SES', '案件選定', 'ガイド'],
  },
  {
    id: 'ses-3',
    title: 'SESで成長できる案件の特徴',
    summary:
      '技術スタックと工程の観点から、成長に繋がる案件の見分け方を具体化。',
    source: 'SESキャリア記録ガイド',
    date: '2026-02-18',
    url: '/guides/ses-growth-projects',
    tags: ['SES', 'キャリア', 'ガイド'],
  },
  {
    id: 'ses-4',
    title: 'Qiita: SES タグ',
    summary:
      'SESに関する実務記事が継続的に投稿されるタグページ。現場の知見収集に使えます。',
    source: 'Qiita',
    date: '2026-02-10',
    url: 'https://qiita.com/tags/ses',
    tags: ['SES', 'ブログ'],
  },
  {
    id: 'ses-5',
    title: 'Zenn: SES トピック',
    summary:
      'SES・受託・キャリア関連の実践記事がまとまっているトピック。',
    source: 'Zenn',
    date: '2026-02-08',
    url: 'https://zenn.dev/topics/ses',
    tags: ['SES', 'ブログ'],
  },
  {
    id: 'ses-6',
    title: 'レバテックキャリアガイド',
    summary:
      'エンジニアの転職・キャリア情報を継続的にチェックできるメディア。',
    source: 'レバテック',
    date: '2026-02-05',
    url: 'https://career.levtech.jp/guide/',
    tags: ['キャリア', 'ブログ'],
  },
];

const techNews = [
  {
    id: 'tech-1',
    title: 'React Blog',
    summary:
      'React本体の変更点を追う公式ブログ。新機能や移行の注意点を確認できます。',
    source: 'React',
    date: '2026-02-15',
    url: 'https://react.dev/blog',
    tags: ['React', 'Frontend'],
  },
  {
    id: 'tech-2',
    title: 'TypeScript Blog',
    summary:
      'TypeScriptの新機能・破壊的変更・アップグレード方針を確認できる公式ブログ。',
    source: 'Microsoft',
    date: '2026-02-14',
    url: 'https://devblogs.microsoft.com/typescript/',
    tags: ['TypeScript', 'Frontend'],
  },
  {
    id: 'tech-3',
    title: 'Node.js Blog',
    summary:
      'LTS情報やセキュリティアップデートを確認できる公式ブログ。',
    source: 'Node.js',
    date: '2026-02-12',
    url: 'https://nodejs.org/en/blog',
    tags: ['Node.js', 'Backend'],
  },
  {
    id: 'tech-4',
    title: 'Firebase Release Notes',
    summary:
      'Auth / Firestore / Hosting の仕様変更や新機能を追える公式リリースノート。',
    source: 'Firebase',
    date: '2026-02-11',
    url: 'https://firebase.google.com/support/release-notes',
    tags: ['Firebase', 'Backend'],
  },
  {
    id: 'tech-5',
    title: 'Vercel Changelog',
    summary:
      'デプロイ基盤の変更点を確認できる公式変更履歴。',
    source: 'Vercel',
    date: '2026-02-09',
    url: 'https://vercel.com/changelog',
    tags: ['Vercel', 'Infra'],
  },
  {
    id: 'tech-6',
    title: 'Publickey（クラウド / 開発基盤ニュース）',
    summary:
      'インフラ・開発基盤のトレンドを横断的に追える国内技術ニュースサイト。',
    source: 'Publickey',
    date: '2026-02-07',
    url: 'https://www.publickey1.jp/',
    tags: ['Infra', 'ニュース'],
  },
];

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

export default function NewsPage({
  isPublic = false,
  onStartSignup,
  onStartLogin,
  onNavigatePublic,
  enableSeo = true,
}) {
  const [tab, setTab] = useState('ses');
  const items = useMemo(() => (tab === 'ses' ? sesNews : techNews), [tab]);

  useSeo({
    enabled: enableSeo,
    title: 'SESニュース | SESキャリア記録',
    description:
      'SES業界と技術トレンドを短く把握できるニュースまとめ。具体的な記事リンクと公式ブログへの導線を掲載。',
    path: '/news',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'SESニュース',
      inLanguage: 'ja',
    },
  });

  return (
    <div className={isPublic ? 'min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white' : ''}>
      {isPublic && (
        <PublicHeader
          onNavigatePublic={onNavigatePublic}
          onStartLogin={onStartLogin}
          onStartSignup={onStartSignup}
        />
      )}
      <main className={isPublic ? 'max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8' : ''}>
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">ニュース</h2>
          <p className="text-slate-400 text-sm mt-2">
            具体的な記事リンクと、継続的に読むべきブログをまとめています。
          </p>
        </div>

        {isPublic && (
          <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
            <p className="text-amber-200 text-sm">
              体験版で使い勝手を確認したら、無料登録で案件・日報・面談ログを記録できます。
            </p>
            <button
              onClick={onStartSignup}
              className="mt-3 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded transition-colors"
            >
              無料で新規登録
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTab('ses')}
            className={`px-4 py-2 rounded border text-sm font-semibold transition-colors ${
              tab === 'ses'
                ? 'bg-amber-500 text-slate-900 border-amber-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            SES/キャリア
          </button>
          <button
            type="button"
            onClick={() => setTab('tech')}
            className={`px-4 py-2 rounded border text-sm font-semibold transition-colors ${
              tab === 'tech'
                ? 'bg-amber-500 text-slate-900 border-amber-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            技術/プロダクト
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-amber-500 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">{item.title}</h3>
              <p className="text-slate-300 mt-2 text-sm">{item.summary}</p>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                <span>出典: {item.source}</span>
                <span>日付: {formatDate(item.date)}</span>
              </div>

              <a
                href={item.url}
                target={item.url.startsWith('/') ? '_self' : '_blank'}
                rel={item.url.startsWith('/') ? undefined : 'noreferrer'}
                className="inline-block mt-4 text-amber-400 hover:text-amber-300 text-sm font-semibold"
              >
                詳細を見る →
              </a>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
