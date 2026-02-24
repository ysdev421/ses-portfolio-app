import { useState } from 'react';
import PublicHeader from '../components/PublicHeader';
import { useSeo } from '../utils/seo';

const tabs = [
  { id: 'projects', label: '案件一覧' },
  { id: 'interviews', label: '面談ログ' },
  { id: 'career', label: 'キャリア整理' },
];

export default function DemoPage({ onNavigatePublic, onStartLogin, onStartSignup }) {
  const [tab, setTab] = useState('projects');

  useSeo({
    title: 'デモモード | SESキャリア記録',
    description: 'ログイン不要で、SESキャリア記録の主要機能を体験できます。',
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
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-400">デモモード</h1>
          <p className="text-slate-300 text-sm mt-2">
            ログイン不要で機能を確認できます。実データには保存されません。
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded border text-sm font-semibold ${
                tab === t.id
                  ? 'bg-amber-500 text-slate-900 border-amber-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

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

        {tab === 'interviews' && (
          <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="text-xl font-bold text-amber-300">面談ログ（サンプル）</h2>
            <div className="mt-4 space-y-3">
              {[
                ['2026/02/20', '質問: 得意領域は？', '回答: Reactの画面設計と改善施策の提案経験あり'],
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

        {tab === 'career' && (
          <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="text-xl font-bold text-amber-300">キャリア整理（サンプル）</h2>
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

        <div className="mt-8 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5">
          <p className="text-amber-100 text-sm">このまま実データで使い始める場合は無料登録へ進んでください。</p>
          <button onClick={onStartSignup} className="mt-3 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2 rounded">
            無料で新規登録
          </button>
        </div>
      </main>
    </div>
  );
}
