import { useMemo, useState } from 'react';

const sesNews = [
  {
    id: 'ses-1',
    title: 'IT人材需給に関する調査レポート',
    summary: '開発需要と人材不足のトレンドを把握し、案件選定やキャリア方針に活かせる内容。',
    source: '経済産業省 / IPA など',
    date: '2026-02-01',
    url: 'https://www.ipa.go.jp/',
    tags: ['SES', '人材市場', '調査'],
  },
  {
    id: 'ses-2',
    title: 'フリーランス・準委任契約まわりの実務論点',
    summary: '契約形態、責任分界、稼働管理など、現場で押さえるべきポイントを整理。',
    source: '業界メディア',
    date: '2026-01-20',
    url: 'https://www.publickey1.jp/',
    tags: ['SES', '契約', '働き方'],
  },
  {
    id: 'ses-3',
    title: 'セキュリティ教育・開発体制強化の最新動向',
    summary: 'サプライチェーン対策や開発プロセス見直しなど、組織での対応事例を紹介。',
    source: 'NISC / 主要ベンダー発信',
    date: '2026-01-10',
    url: 'https://www.nisc.go.jp/',
    tags: ['SES', 'セキュリティ', '運用'],
  },
];

const techNews = [
  {
    id: 'tech-1',
    title: 'React のアップデート情報',
    summary: 'パフォーマンス改善や開発体験に関わる変更点をキャッチアップ。',
    source: 'React Blog',
    date: '2026-02-05',
    url: 'https://react.dev/blog',
    tags: ['React', 'Frontend'],
  },
  {
    id: 'tech-2',
    title: 'TypeScript リリースノート',
    summary: '型推論やエラーメッセージ改善など、日々の開発効率に直結する内容。',
    source: 'TypeScript',
    date: '2026-01-28',
    url: 'https://devblogs.microsoft.com/typescript/',
    tags: ['TypeScript', 'Frontend'],
  },
  {
    id: 'tech-3',
    title: 'Node.js リリース情報',
    summary: 'LTSやランタイム周りの更新を確認し、運用環境のアップデート判断に活用。',
    source: 'Node.js',
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

export default function NewsPage() {
  const [tab, setTab] = useState('ses');

  const items = useMemo(() => (tab === 'ses' ? sesNews : techNews), [tab]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">ニュース</h2>
        <p className="text-slate-400 text-sm mt-2">
          SES業界と関連技術の情報をまとめて確認できます。
        </p>
      </div>

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
              記事を見る →
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
