import { useState, useEffect } from 'react';
import { getProjects, getEntries } from '../services/firestoreService';

export default function Dashboard({ user, onNavigate }) {
  const [projects, setProjects] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalWorkedHours: 0,
    totalEntries: 0,
    skills: {},
    recentEntries: [],
  });

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 案件データ取得
      const projectsData = await getProjects(user.uid);
      setProjects(projectsData);

      // 全日記データ取得（全プロジェクト分）
      let allEntries = [];
      for (const project of projectsData) {
        const projectEntries = await getEntries(project.id);
        allEntries = [...allEntries, ...projectEntries];
      }
      setEntries(allEntries);

      // 統計情報を集計
      calculateStats(projectsData, allEntries);
    } catch (error) {
      console.error('✗ ダッシュボードデータ読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (projectsData, allEntries) => {
    // 案件から作業時間を集計
    let totalProjectHours = 0;
    const skillsMap = {};

    projectsData.forEach(project => {
      totalProjectHours += project.workedHours || 0;
      
      // スキルをカウント
      if (project.skills && Array.isArray(project.skills)) {
        project.skills.forEach(skill => {
          skillsMap[skill] = (skillsMap[skill] || 0) + 1;
        });
      }
    });

    // 日記から作業時間を集計
    let totalEntryHours = 0;
    const recentEntries = [...allEntries].sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    }).slice(0, 5);

    allEntries.forEach(entry => {
      totalEntryHours += entry.workedHours || 0;
    });

    setStats({
      totalProjects: projectsData.length,
      totalWorkedHours: totalProjectHours + totalEntryHours,
      totalEntries: allEntries.length,
      projectHours: totalProjectHours,
      entryHours: totalEntryHours,
      skills: skillsMap,
      recentEntries,
    });
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">読み込み中...</div>;
  }

  const topSkills = Object.entries(stats.skills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <h2 className="text-3xl font-serif font-bold text-amber-400 mb-8">ダッシュボード</h2>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700 rounded-lg p-6 hover:border-amber-500 transition-all">
          <p className="text-slate-400 text-sm font-semibold">案件数</p>
          <p className="text-4xl font-bold text-amber-400 mt-3">{stats.totalProjects}</p>
          <p className="text-slate-400 text-xs mt-2">登録済み</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700 rounded-lg p-6 hover:border-amber-500 transition-all">
          <p className="text-slate-400 text-sm font-semibold">合計作業時間</p>
          <p className="text-4xl font-bold text-amber-400 mt-3">{stats.totalWorkedHours}</p>
          <p className="text-slate-400 text-xs mt-2">時間</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700 rounded-lg p-6 hover:border-amber-500 transition-all">
          <p className="text-slate-400 text-sm font-semibold">日記数</p>
          <p className="text-4xl font-bold text-amber-400 mt-3">{stats.totalEntries}</p>
          <p className="text-slate-400 text-xs mt-2">記録済み</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700 rounded-lg p-6 hover:border-amber-500 transition-all">
          <p className="text-slate-400 text-sm font-semibold">スキル数</p>
          <p className="text-4xl font-bold text-amber-400 mt-3">{Object.keys(stats.skills).length}</p>
          <p className="text-slate-400 text-xs mt-2">種類</p>
        </div>
      </div>

      {/* 詳細統計 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 時間の内訳 */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">作業時間の内訳</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">プロジェクト関連</span>
              <span className="text-2xl font-bold text-amber-400">{stats.projectHours}h</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full"
                style={{width: `${stats.totalWorkedHours > 0 ? (stats.projectHours / stats.totalWorkedHours) * 100 : 0}%`}}
              ></div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-700">
              <span className="text-slate-300">日記記録分</span>
              <span className="text-2xl font-bold text-blue-400">{stats.entryHours}h</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                style={{width: `${stats.totalWorkedHours > 0 ? (stats.entryHours / stats.totalWorkedHours) * 100 : 0}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* よく使うスキル */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">よく使うスキル TOP 5</h3>
          {topSkills.length === 0 ? (
            <p className="text-slate-400">スキル情報がまだありません</p>
          ) : (
            <div className="space-y-3">
              {topSkills.map(([skill, count], idx) => (
                <div key={skill} className="flex items-center gap-3">
                  <span className="text-amber-400 font-bold w-6">{idx + 1}.</span>
                  <span className="flex-1 text-white">{skill}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-700 rounded h-1.5">
                      <div 
                        className="bg-amber-500 h-1.5 rounded"
                        style={{width: `${(count / topSkills[0][1]) * 100}%`}}
                      ></div>
                    </div>
                    <span className="text-amber-400 font-semibold w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 最近の日記 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">最近の日記</h3>
        {stats.recentEntries.length === 0 ? (
          <p className="text-slate-400">日記がまだありません</p>
        ) : (
          <div className="space-y-3">
            {stats.recentEntries.map(entry => {
              const entryDate = entry.date?.toDate?.() || new Date(entry.date);
              const dateStr = entryDate.toLocaleDateString('ja-JP');
              return (
                <div key={entry.id} className="border-l-4 border-amber-500 bg-slate-700 rounded px-4 py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-400 text-sm">{dateStr}</p>
                      <p className="text-white font-semibold">{entry.title}</p>
                      {entry.workedHours > 0 && (
                        <p className="text-amber-300 text-sm mt-1">作業時間: {entry.workedHours}時間</p>
                      )}
                    </div>
                    {entry.content && (
                      <p className="text-slate-400 text-xs max-w-xs line-clamp-2">
                        {entry.content}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* アクションボタン */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => onNavigate('add-project')}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2 rounded transition-colors"
        >
          + 案件を追加
        </button>
        <button
          onClick={() => onNavigate('projects')}
          className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-2 rounded transition-colors"
        >
          案件一覧
        </button>
      </div>
    </div>
  );
}
