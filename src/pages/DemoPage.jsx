import { useState } from 'react';
import PublicHeader from '../components/PublicHeader';
import { useSeo } from '../utils/seo';

const demoNav = [
  { id: 'dashboard', label: 'ダッシュボード' },
  { id: 'projects', label: '案件一覧' },
  { id: 'career', label: 'キャリアシート' },
  { id: 'interviews', label: '選考管理' },
  { id: 'news', label: 'ニュース' },
  { id: 'settings', label: '設定' },
];

export default function DemoPage({ onNavigatePublic, onStartLogin, onStartSignup }) {
  const [tab, setTab] = useState('dashboard');

  useSeo({
    title: '体験版 | SESキャリア記録',
    description: 'ログイン不要で、SESキャリア記録の主要機能を本番に近い構成で体験できます。',
    path: '/demo',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <PublicHeader
        onNavigatePublic={onNavigatePublic}
        onStartLogin={onStartLogin}
        onStartSignup={onStartSignup}
      />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">SESキャリア記録（体験版）</h1>
              <p className="text-slate-400 text-sm mt-1">本番に近い画面構成で操作感を確認できます</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-300">
              demo-user@example.com
            </div>
          </div>

          <nav className="mt-4 flex flex-wrap gap-2">
            {demoNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
                  tab === item.id
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {tab === 'dashboard' && (
          <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="text-xl font-bold text-amber-300">ダッシュボード</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                ['案件数', '12'],
                ['参画中案件', '2'],
                ['日報数', '84'],
                ['スキル数', '15'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                  <p className="text-slate-400 text-xs">{k}</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1">{v}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'projects' && (
          <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="text-xl font-bold text-amber-300">案件一覧（サンプル）</h2>
            <div className="mt-4 space-y-3">
              {[
                ['ECサイト保守開発', 'React / TypeScript / Node.js', '2025/07 - 参画中'],
                ['受発注システム改修', 'Java / Spring / PostgreSQL', '2024/11 - 2025/06'],
              ].map((p) => (
                <div key={p[0]} className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                  <p className="font-semibold">{p[0]}</p>
                  <p className="text-slate-300 text-sm mt-1">{p[1]}</p>
                  <p className="text-slate-400 text-xs mt-1">{p[2]}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'career' && (
          <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="text-xl font-bold text-amber-300">キャリアシート（サンプル）</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                <p className="text-slate-400 text-xs">経験技術</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">12</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                <p className="text-slate-400 text-xs">面談通過率</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">57%</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                <p className="text-slate-400 text-xs">直近3ヶ月の改善数</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">8</p>
              </div>
            </div>
          </section>
        )}

        {tab === 'interviews' && (
          <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="text-xl font-bold text-amber-300">選考管理（サンプル）</h2>
            <div className="mt-4 space-y-3">
              {[
                ['2026/02/20', '質問: 得意領域は？', '回答: Reactの画面設計と改善提案の経験あり'],
                ['2026/02/10', '質問: 参画までの立ち上がりは？', '回答: 初週で仕様把握、2週目で改善提案まで実施'],
              ].map((row) => (
                <div key={row[0]} className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                  <p className="text-slate-400 text-xs">{row[0]}</p>
                  <p className="font-semibold mt-1">{row[1]}</p>
                  <p className="text-slate-300 text-sm mt-1">{row[2]}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(tab === 'news' || tab === 'settings') && (
          <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="text-xl font-bold text-amber-300">{tab === 'news' ? 'ニュース' : '設定'}（体験版）</h2>
            <p className="text-slate-300 text-sm mt-3">このカテゴリは体験版では表示のみです。無料登録後に全機能を利用できます。</p>
          </section>
        )}

        <div className="mt-8 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5">
          <p className="text-amber-100 text-sm">
            このまま実データで使い始める場合は、無料登録へ進んでください。
          </p>
          <button onClick={onStartSignup} className="mt-3 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2 rounded">
            無料で新規登録
          </button>
        </div>
      </main>
    </div>
  );
}
