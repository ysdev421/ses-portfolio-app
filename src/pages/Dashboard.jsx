import { useState, useEffect, useRef, useCallback } from 'react';
import { getProjects, getEntries } from '../services/firestoreService';

export default function Dashboard({ user, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalWorkedHours: 0,
    totalEntries: 0,
    skills: {},
    phaseExperience: {},
    recentEntries: [],
  });

  const loadData = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      setError(null);

      // 案件データ取得
      const projectsData = await getProjects(user.uid);
      if (!isMounted.current) return;

      // 全日記データ取得（各プロジェクトを並列で取得）
      const entryPromises = projectsData.map(p =>
        getEntries(p.id).catch(err => {
          console.error('getEntries error for project', p.id, err);
          return [];
        })
      );
      const entriesArrays = await Promise.all(entryPromises);
      const allEntries = entriesArrays.flat();
      if (!isMounted.current) return;

      // 統計情報を集計
      calculateStats(projectsData, allEntries);
    } catch (error) {
      console.error('✗ ダッシュボードデータ読み込みエラー:', error);
      if (isMounted.current) setError('データ読み込み中にエラーが発生しました');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    isMounted.current = true;
    loadData();
    return () => { isMounted.current = false; };
  }, [loadData]);

  const formatDuration = (months) => {
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (years === 0) return `${rem}ヶ月`;
    if (rem === 0) return `${years}年`;
    return `${years}年${rem}ヶ月`;
  };

  const calculateStats = (projectsData, allEntries) => {
    // 案件からスキルを集計
    const skillsMap = {};
    const techExperience = {};
    const phaseExperience = {};

    projectsData.forEach(project => {
      // スキルをカウント
      if (project.skills && Array.isArray(project.skills)) {
        project.skills.forEach(skill => {
          skillsMap[skill] = (skillsMap[skill] || 0) + 1;
        });
      }

      // 技術別累計経験月数を計算（startDate/endDateから）
      if (project.startDate) {
        const start = new Date(project.startDate);
        const end = project.endDate ? new Date(project.endDate) : new Date();
        const months = Math.max(
          0,
          (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth())
        );
        if (project.skills && Array.isArray(project.skills)) {
          project.skills.forEach(skill => {
            techExperience[skill] = (techExperience[skill] || 0) + months;
          });
        }
        if (project.phases && Array.isArray(project.phases)) {
          project.phases.forEach(phase => {
            phaseExperience[phase] = (phaseExperience[phase] || 0) + months;
          });
        }
      }
    });

    // 日記から最新データを集計
    const recentEntries = [...allEntries].sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    }).slice(0, 5);

    // 最近の案件（最新5件）& 参画中
    const recentProjects = [...projectsData].slice(0, 5);
    const activeProjects = projectsData.filter(p =>
      !p.endDate || new Date(p.endDate) >= new Date()
    );
    const activeCount = activeProjects.length;
    const activeProjName = activeCount === 1 ? activeProjects[0].projectName : null;
    const activePrimaryProject = activeCount > 0 ? activeProjects[0] : null;

    setStats({
      totalProjects: projectsData.length,
      activeCount,
      activeProjName,
      activePrimaryProject,
      totalEntries: allEntries.length,
      skills: skillsMap,
      techExperience,
      phaseExperience,
      recentEntries,
      recentProjects,
    });
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">読み込み中...</div>;
  }

  const handleRefresh = async () => {
    setError(null);
    await loadData();
  };

  const topSkills = Object.entries(stats.skills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topTechExp = Object.entries(stats.techExperience || {})
    .sort((a, b) => b[1] - a[1]);

  const topPhaseExp = Object.entries(stats.phaseExperience || {})
    .sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-serif font-bold text-amber-400">ダッシュボード</h2>
        <div className="flex items-center gap-3">
          <button onClick={handleRefresh} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded">再読み込み</button>
          <div className="text-slate-400 text-sm">ユーザー: {user?.displayName || user?.email}</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-700/20 border border-red-600 text-red-200 rounded p-3 mb-6">
          {error}
        </div>
      )}

      {stats.totalProjects === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/40 rounded-lg p-6 mb-8">
          <p className="text-amber-300 font-semibold text-lg">最初に案件を1件登録しましょう</p>
          <p className="text-slate-300 text-sm mt-2">
            参画期間・役割・スキルを入れると、経験年数やキャリアシートが自動で整理されます。
          </p>
          <button
            onClick={() => onNavigate('add-project')}
            className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2 rounded transition-colors"
          >
            最初の案件を登録する
          </button>
        </div>
      )}

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700 rounded-lg p-6 hover:border-amber-500 transition-all">
          <p className="text-slate-400 text-sm font-semibold">案件数</p>
          <p className="text-4xl font-bold text-amber-400 mt-3">{stats.totalProjects}</p>
          <p className="text-slate-400 text-xs mt-2">登録済み</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-green-800 rounded-lg p-6 hover:border-green-500 transition-all">
          <p className="text-slate-400 text-sm font-semibold">参画中案件</p>
          {(stats.activeCount ?? 0) === 0 ? (
            <>
              <p className="text-2xl font-bold text-slate-400 mt-3">待機中</p>
              <p className="text-slate-500 text-xs mt-2">参画案件なし</p>
            </>
          ) : (stats.activeCount ?? 0) === 1 ? (
            <>
              <p className="text-lg font-bold text-green-400 mt-3 truncate">
                {stats.activeProjName}
              </p>
              <p className="text-green-600 text-xs mt-1">● 1件参画中</p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-green-400 mt-3 truncate">
                {stats.activeCount}件（並行参画）
              </p>
              <p className="text-green-600 text-xs mt-1 truncate">
                {stats.activePrimaryProject?.projectName} ほか
              </p>
            </>
          )}
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

      {/* 技術別累計経験年数 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">技術別 累計経験年数</h3>
        {topTechExp.length === 0 ? (
          <p className="text-slate-400">案件の開始日・終了日を登録すると経験年数が表示されます</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {topTechExp.map(([skill, months]) => (
              <div
                key={skill}
                className="bg-slate-700 border border-slate-600 rounded-lg p-3 hover:border-amber-500 transition-all"
              >
                <p className="text-slate-300 text-sm font-semibold truncate">{skill}</p>
                <p className="text-amber-400 text-xl font-bold mt-1">{formatDuration(months)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 最近の案件 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-serif font-bold text-amber-400">最近の案件</h3>
          <button
            onClick={() => onNavigate('projects')}
            className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
          >
            すべて見る →
          </button>
        </div>
        {(stats.recentProjects || []).length === 0 ? (
          <p className="text-slate-400">案件がまだありません</p>
        ) : (
          <div className="space-y-3">
            {(stats.recentProjects || []).map(project => {
              const startStr = project.startDate || '';
              const endStr = project.endDate || '現在';
              return (
                <div
                  key={project.id}
                  className="border-l-4 border-slate-500 hover:border-amber-500 bg-slate-700 rounded px-4 py-3 cursor-pointer transition-all"
                  onClick={() => onNavigate('project-detail', project)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{project.projectName}</p>
                      <p className="text-slate-400 text-sm">{project.company}</p>
                      <p className="text-slate-500 text-xs mt-1">{startStr} 〜 {endStr}</p>
                    </div>
                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 ml-3 max-w-xs justify-end">
                        {project.skills.slice(0, 3).map(skill => (
                          <span
                            key={skill}
                            className="bg-slate-600 text-slate-300 text-xs px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {project.skills.length > 3 && (
                          <span className="text-slate-500 text-xs">+{project.skills.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 工程別累計経験年数 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">工程別 累計経験年数</h3>
        {topPhaseExp.length === 0 ? (
          <p className="text-slate-400">案件の担当フェーズを登録すると経験年数が表示されます</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {topPhaseExp.map(([phase, months]) => (
              <div
                key={phase}
                className="bg-slate-700 border border-slate-600 rounded-lg p-3 hover:border-amber-500 transition-all"
              >
                <p className="text-slate-300 text-sm font-semibold truncate">{phase}</p>
                <p className="text-amber-400 text-xl font-bold mt-1">{formatDuration(months)}</p>
              </div>
            ))}
          </div>
        )}
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

      {/* よく使うスキル TOP5 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">よく使うスキル TOP5</h3>
        {topSkills.length === 0 ? (
          <p className="text-slate-400">案件にスキルを登録すると表示されます</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topSkills.map(([skill, count], index) => (
              <div key={skill} className="bg-slate-700 border border-slate-600 rounded px-4 py-3">
                <p className="text-slate-300 text-sm">#{index + 1}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-white font-semibold truncate">{skill}</p>
                  <p className="text-amber-300 text-sm">{count}件</p>
                </div>
              </div>
            ))}
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
        <button
          onClick={() => onNavigate('career-sheet')}
          className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-6 py-2 rounded transition-colors"
        >
          キャリアシート
        </button>
      </div>
    </div>
  );
}
