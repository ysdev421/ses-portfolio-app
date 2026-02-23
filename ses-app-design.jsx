import React, { useState } from 'react';
import { ChevronDown, Plus, Search, Filter, Calendar, Tag, Zap, TrendingUp } from 'lucide-react';

export default function SESPortfolioApp() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);

  // ダミーデータ
  const skillsSummary = [
    { skill: 'React', years: 3.5, months: 4 },
    { skill: 'Java', years: 5, months: 2 },
    { skill: 'PostgreSQL', years: 4, months: 8 },
    { skill: 'AWS', years: 2, months: 6 },
  ];

  const projects = [
    {
      id: 1,
      name: 'ECサイト リプレイス',
      client: '大手流通企業',
      period: '2024/10 - 2024/12',
      skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      role: 'フロントエンドリード',
      entries: [
        {
          date: '2024/12/15',
          title: 'パフォーマンス最適化完了',
          tags: ['パフォーマンス最適化', '技術深掘り'],
          content: 'React コンポーネントの不要なレンダリングを削減。useMemo と useCallback 活用で初期ロード時間を3秒から1.2秒に短縮。',
        },
        {
          date: '2024/12/10',
          title: '顧客との仕様調整',
          tags: ['顧客折衝', 'ビジネススキル'],
          content: 'クライアントとの打ち合わせで決済フロー修正。ユーザビリティと実装期間のバランスを取った提案をした。',
        },
      ],
    },
    {
      id: 2,
      name: 'データ分析基盤構築',
      client: 'SaaS企業',
      period: '2024/07 - 2024/09',
      skills: ['Java', 'PostgreSQL', 'Spark'],
      role: 'バックエンドエンジニア',
      entries: [
        {
          date: '2024/09/05',
          title: '大規模データ処理バグ修正',
          tags: ['バグ修正', 'トラブルシューティング'],
          content: '数百万件のレコード処理時にメモリ不足で落ちる問題を特定。ストリーム処理に変更して解決。',
        },
      ],
    },
  ];

  const tags = {
    'ビジネススキル': '#F59E0B',
    '技術深掘り': '#8B5CF6',
    'バグ修正': '#EF4444',
    '顧客折衝': '#10B981',
    'トラブルシューティング': '#F97316',
    'パフォーマンス最適化': '#06B6D4',
  };

  // ダッシュボード画面
  const Dashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      {/* ヘッダー */}
      <div className="mb-12">
        <h1 className="text-5xl font-serif font-bold mb-2 bg-gradient-to-r from-amber-200 to-amber-50 bg-clip-text text-transparent">
          Career Journey
        </h1>
        <p className="text-slate-400">あなたの技術履歴を可視化する</p>
      </div>

      {/* スキルサマリー */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {skillsSummary.map((skill, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-6 border border-slate-600 hover:border-amber-400 transition-all hover:shadow-lg hover:shadow-amber-400/20"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">{skill.skill}</h3>
              <Zap size={20} className="text-amber-300" />
            </div>
            <p className="text-3xl font-bold text-amber-200">
              {skill.years}
              <span className="text-lg text-slate-400">年</span>
            </p>
            <p className="text-sm text-slate-400 mt-2">{skill.months}ヶ月の実績</p>
          </div>
        ))}
      </div>

      {/* 最近の案件 */}
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold mb-6">最近の案件</h2>
        <div className="space-y-4">
          {projects.slice(0, 2).map((project) => (
            <div
              key={project.id}
              onClick={() => {
                setSelectedProject(project.id);
                setCurrentTab('detail');
              }}
              className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 hover:bg-slate-700 hover:border-amber-400 cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-amber-200 transition-colors">{project.name}</h3>
                  <p className="text-slate-400 text-sm">{project.client}</p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-600 px-3 py-1 rounded-full">{project.period}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {project.skills.map((skill, idx) => (
                  <span key={idx} className="text-xs bg-amber-900/40 text-amber-200 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => setCurrentTab('list')}
        className="bg-gradient-to-r from-amber-400 to-amber-300 text-slate-900 font-semibold px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-amber-400/50 transition-all flex items-center gap-2"
      >
        <Plus size={20} />
        全案件を見る
      </button>
    </div>
  );

  // 案件一覧画面
  const ProjectList = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-amber-200 to-amber-50 bg-clip-text text-transparent">
          案件一覧
        </h1>
      </div>

      {/* フィルタ */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-amber-500 text-slate-900 rounded-full font-semibold whitespace-nowrap hover:bg-amber-400 transition-colors">
          全て
        </button>
        {['React', 'Java', 'PostgreSQL', 'AWS'].map((skill) => (
          <button
            key={skill}
            className="px-4 py-2 bg-slate-700 text-slate-200 rounded-full whitespace-nowrap hover:bg-slate-600 transition-colors border border-slate-600"
          >
            {skill}
          </button>
        ))}
      </div>

      {/* 案件カード */}
      <div className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => {
              setSelectedProject(project.id);
              setCurrentTab('detail');
            }}
            className="group cursor-pointer"
          >
            <div className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 border border-slate-600 rounded-xl p-8 hover:from-slate-700 hover:to-slate-800 hover:border-amber-400 transition-all hover:shadow-xl hover:shadow-amber-400/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold group-hover:text-amber-200 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-slate-400 mt-1">{project.client}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">{project.period}</p>
                  <p className="text-sm text-slate-500 mt-1">{project.role}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gradient-to-r from-amber-900/50 to-amber-800/30 text-amber-200 px-3 py-1.5 rounded-full border border-amber-700/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{project.entries.length} エントリー</span>
                <span className="text-amber-300 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 案件詳細画面
  const ProjectDetail = () => {
    const project = projects.find((p) => p.id === selectedProject);
    if (!project) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
        {/* ヘッダー */}
        <button
          onClick={() => setCurrentTab('list')}
          className="mb-8 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
        >
          ← 戻る
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-amber-200 to-amber-50 bg-clip-text text-transparent">
            {project.name}
          </h1>
          <div className="flex gap-6 text-slate-400 mb-6">
            <span>{project.client}</span>
            <span>{project.period}</span>
            <span>{project.role}</span>
          </div>

          {/* スキルタグ */}
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-900/50 to-amber-800/30 text-amber-200 rounded-full border border-amber-700/50 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 日記タイムライン */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold mb-8">活動記録</h2>

          <div className="space-y-8">
            {project.entries.map((entry, idx) => (
              <div key={idx} className="relative pl-8 border-l-2 border-amber-400/30 hover:border-amber-400 transition-colors">
                {/* タイムラインドット */}
                <div className="absolute left-0 top-2 w-4 h-4 bg-amber-400 rounded-full border-4 border-slate-900 -translate-x-2.5" />

                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 hover:border-amber-400/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{entry.title}</h3>
                    <span className="text-xs text-slate-400">{entry.date}</span>
                  </div>

                  {/* タグ */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.tags.map((tag, tidx) => (
                      <span
                        key={tidx}
                        className="text-xs px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: tags[tag] + '40', borderLeft: `3px solid ${tags[tag]}` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-slate-300 leading-relaxed">{entry.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 日記追加ボタン */}
        <button
          onClick={() => setCurrentTab('mobile')}
          className="bg-gradient-to-r from-amber-400 to-amber-300 text-slate-900 font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-amber-400/50 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          日記を追加
        </button>
      </div>
    );
  };

  // モバイル日記入力画面
  const MobileEntry = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentTab('detail')}
            className="text-slate-400 hover:text-white transition-colors mb-4"
          >
            ← 戻る
          </button>
          <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-200 to-amber-50 bg-clip-text text-transparent">
            今日の活動
          </h1>
          <p className="text-slate-400 text-sm mt-2">やったことを記録しよう</p>
        </div>

        {/* フォーム */}
        <form className="space-y-6">
          {/* 日付 */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-300">日付</label>
            <input
              type="date"
              defaultValue="2024-12-20"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition-colors"
            />
          </div>

          {/* タイトル */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-300">タイトル</label>
            <input
              type="text"
              placeholder="今日やったことをひと言で"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition-colors"
            />
          </div>

          {/* タグ選択 */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-300">タグを選ぶ</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(tags).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="px-3 py-2 rounded-lg text-xs font-medium transition-all border"
                  style={{
                    backgroundColor: tags[tag] + '20',
                    borderColor: tags[tag],
                    color: tags[tag],
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* メモ */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-300">詳細メモ</label>
            <textarea
              placeholder="やったこと、学んだこと、工夫したことなど自由に書く"
              rows="6"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* 保存ボタン */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-400 to-amber-300 text-slate-900 font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-amber-400/50 transition-all"
          >
            記録する
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div>
      {currentTab === 'dashboard' && <Dashboard />}
      {currentTab === 'list' && <ProjectList />}
      {currentTab === 'detail' && <ProjectDetail />}
      {currentTab === 'mobile' && <MobileEntry />}

      {/* ナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 text-white">
        <div className="max-w-4xl mx-auto px-8 py-4 flex justify-around">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`py-2 px-4 rounded transition-colors ${
              currentTab === 'dashboard' ? 'bg-amber-400 text-slate-900 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('list')}
            className={`py-2 px-4 rounded transition-colors ${
              currentTab === 'list' ? 'bg-amber-400 text-slate-900 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            案件
          </button>
          <button
            onClick={() => setCurrentTab('mobile')}
            className={`py-2 px-4 rounded transition-colors ${
              currentTab === 'mobile' ? 'bg-amber-400 text-slate-900 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            追加
          </button>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}
