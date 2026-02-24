import { useMemo, useState } from 'react';
import { useSeo } from '../utils/seo';

const sesNews = [
  {
    id: 'ses-1',
    title: 'IT人材市場に関する調査レポート',
    summary:
      '需給動向と市場トレンドを確認。案件選びやキャリア方針に活かせる要点を短く整理しています。',
    source: 'IPA',
    date: '2026-02-01',
    url: 'https://www.ipa.go.jp/',
    tags: ['SES', '市場動向', '調査'],
  },
  {
    id: 'ses-2',
    title: 'フリーランス・準委任まわりの実務整理',
    summary:
      '契約形態や単価交渉の論点を整理。現場で混乱しやすいポイントを先回りして押さえます。',
    source: 'Publickey',
    date: '2026-01-20',
    url: 'https://www.publickey1.jp/',
    tags: ['SES', '契約', '実務'],
  },
  {
    id: 'ses-3',
    title: 'セキュリティ情報・注意喚起まとめ',
    summary:
      '脆弱性と運用上の注意点を確認。参画先での対応に使える一次情報リンクを集約しています。',
    source: 'NISC',
    date: '2026-01-10',
    url: 'https://www.nisc.go.jp/',
    tags: ['SES', 'セキュリティ', '運用'],
  },
];

const techNews = [
  {
    id: 'tech-1',
    title: 'React 公式アップデート',
    summary:
      'パフォーマンス改善や開発体験の変更点を要約。現場で影響しやすい項目を優先して確認できます。',
    source: 'React Blog',
    date: '2026-02-05',
    url: 'https://react.dev/blog',
    tags: ['React', 'Frontend'],
  },
  {
    id: 'tech-2',
    title: 'TypeScript リリース情報',
    summary:
      '型推論とエラーメッセージ改善の更新を整理。保守性と開発効率に関わる内容を中心に紹介します。',
    source: 'TypeScript Blog',
    date: '2026-01-28',
    url: 'https://devblogs.microsoft.com/typescript/',
    tags: ['TypeScript', 'Frontend'],
  },
  {
    id: 'tech-3',
    title: 'Node.js LTS 関連情報',
    summary:
      'LTS運用に必要な更新を確認。依存関係と運用リスクを抑えるための判断材料をまとめています。',
    source: 'Node.js Blog',
    date: '2026-01-15',
    url: 'https://nodejs.org/en/blog',
    tags: ['Node.js', 'Backend'],
  },
];

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

export default function NewsPage({ isPublic = false, onStartSignup, enableSeo = true }) {
  const [tab, setTab] = useState('ses');
  const items = useMemo(() => (tab === 'ses' ? sesNews : techNews), [tab]);

  useSeo({
    enabled: enableSeo,
    title: 'SESニュース | SESキャリア記録',
    description:
      'SES業界と技術トレンドの要点を短く把握できるニュースまとめ。案件選びとキャリア判断に使える一次情報リンク付き。',
    path: '/news',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'SESニュース',
      inLanguage: 'ja',
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">ニュース</h2>
        <p className="text-slate-400 text-sm mt-2">
          SES業界と関連技術の情報を、実務で使える観点で整理しています。
        </p>
      </div>

      {isPublic && (
        <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="text-amber-200 text-sm">
            案件実績を一元管理したい方は、無料登録でダッシュボードを利用できます。
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
          SES業界ニュース
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
          技術ニュース
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
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 text-amber-400 hover:text-amber-300 text-sm font-semibold"
            >
              詳細を見る →
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
