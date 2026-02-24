import { useState, useEffect, useRef, useCallback } from 'react';
import { getProjects, getEntries } from '../services/firestoreService';

export default function Dashboard({ user, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalEntries: 0,
    skills: {},
    techExperience: {},
    phaseExperience: {},
    recentEntries: [],
    activeCount: 0,
    activeProjName: null,
    activePrimaryProject: null,
  });

  const formatDuration = (months) => {
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (years === 0) return `${rem}ヶ月`;
    if (rem === 0) return `${years}年`;
    return `${years}年${rem}ヶ月`;
  };

  const calculateStats = (projectsData, allEntries) => {
    const skillsMap = {};
    const techExperience = {};
    const phaseExperience = {};

    projectsData.forEach((project) => {
      if (Array.isArray(project.skills)) {
        project.skills.forEach((skill) => {
          skillsMap[skill] = (skillsMap[skill] || 0) + 1;
        });
      }

      if (project.startDate) {
        const start = new Date(project.startDate);
        const end = project.endDate ? new Date(project.endDate) : new Date();
        const months = Math.max(
          0,
          (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()),
        );

        if (Array.isArray(project.skills)) {
          project.skills.forEach((skill) => {
            techExperience[skill] = (techExperience[skill] || 0) + months;
          });
        }

        if (Array.isArray(project.phases)) {
          project.phases.forEach((phase) => {
            phaseExperience[phase] = (phaseExperience[phase] || 0) + months;
          });
        }
      }
    });

    const recentEntries = [...allEntries]
      .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
      .slice(0, 5);

    const activeProjects = projectsData.filter(
      (project) => !project.endDate || new Date(project.endDate) >= new Date(),
    );
    const activeCount = activeProjects.length;

    setStats({
      totalProjects: projectsData.length,
      totalEntries: allEntries.length,
      skills: skillsMap,
      techExperience,
      phaseExperience,
      recentEntries,
      activeCount,
      activeProjName: activeCount === 1 ? activeProjects[0].projectName : null,
      activePrimaryProject: activeCount > 0 ? activeProjects[0] : null,
    });
  };

  const loadData = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      setError(null);

      const projectsData = await getProjects(user.uid);
      if (!isMounted.current) return;

      const entryPromises = projectsData.map((project) =>
        getEntries(project.id).catch((err) => {
          console.error('getEntries error for project', project.id, err);
          return [];
        }),
      );

      const entriesArrays = await Promise.all(entryPromises);
      const allEntries = entriesArrays.flat();
      if (!isMounted.current) return;

      calculateStats(projectsData, allEntries);
    } catch (err) {
      console.error('ダッシュボード読み込みエラー:', err);
      if (isMounted.current) setError('データ読み込み中にエラーが発生しました');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    isMounted.current = true;
    loadData();
    return () => {
      isMounted.current = false;
    };
  }, [loadData]);

  if (loading) return <div className="text-center py-12 text-slate-400">読み込み中...</div>;

  const topSkills = Object.entries(stats.skills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topTechExp = Object.entries(stats.techExperience).sort((a, b) => b[1] - a[1]);
  const topPhaseExp = Object.entries(stats.phaseExperience).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">ダッシュボード</h2>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-3 py-1 rounded"
          >
            再読み込み
          </button>
          <div className="text-slate-400 text-sm">ユーザー: {user?.displayName || user?.email}</div>
        </div>
      </div>

      {error && <div className="bg-red-700/20 border border-red-600 text-red-200 rounded p-3 mb-6">{error}</div>}

      {stats.activeCount === 0 && (
        <div className="bg-indigo-500/10 border border-indigo-500/40 rounded-lg p-6 mb-8">
          <p className="text-indigo-300 font-semibold text-lg">面談管理を始めましょう</p>
          <p className="text-slate-300 text-sm mt-2">
            参画中案件がない場合でも、面談ログを残しておくと次回提案の改善に役立ちます。
          </p>
          <button
            onClick={() => onNavigate('interview-logs')}
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded transition-colors"
          >
            面談ログを開く
          </button>
        </div>
      )}

      {stats.totalProjects === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/40 rounded-lg p-6 mb-8">
          <p className="text-amber-300 font-semibold text-lg">最初の案件を登録しましょう</p>
          <p className="text-slate-300 text-sm mt-2">
            案件の期間・担当工程・スキルを記録しておくと、職務経歴の整理が楽になります。
          </p>
          <button
            onClick={() => onNavigate('projects')}
            className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2 rounded transition-colors"
          >
            案件を追加する
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm font-semibold">案件数</p>
          <p className="text-3xl sm:text-4xl font-bold text-amber-400 mt-3">{stats.totalProjects}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-green-800 rounded-lg p-6">
          <p className="text-slate-400 text-sm font-semibold">参画中案件</p>
          {stats.activeCount === 0 ? (
            <p className="text-2xl font-bold text-slate-400 mt-3">なし</p>
          ) : stats.activeCount === 1 ? (
            <p className="text-lg font-bold text-green-400 mt-3 truncate">{stats.activeProjName}</p>
          ) : (
            <div>
              <p className="text-lg font-bold text-green-400 mt-3">{stats.activeCount}件</p>
              <p className="text-green-600 text-xs mt-1 truncate">{stats.activePrimaryProject?.projectName} ほか</p>
            </div>
          )}
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm font-semibold">日報数</p>
          <p className="text-3xl sm:text-4xl font-bold text-amber-400 mt-3">{stats.totalEntries}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm font-semibold">スキル数</p>
          <p className="text-3xl sm:text-4xl font-bold text-amber-400 mt-3">{Object.keys(stats.skills).length}</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">技術経験期間</h3>
        {topTechExp.length === 0 ? (
          <p className="text-slate-400">表示できるデータがありません</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {topTechExp.map(([skill, months]) => (
              <div key={skill} className="bg-slate-700 border border-slate-600 rounded-lg p-3">
                <p className="text-slate-300 text-sm font-semibold truncate">{skill}</p>
                <p className="text-amber-400 text-xl font-bold mt-1">{formatDuration(months)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">工程経験期間</h3>
        {topPhaseExp.length === 0 ? (
          <p className="text-slate-400">表示できるデータがありません</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {topPhaseExp.map(([phase, months]) => (
              <div key={phase} className="bg-slate-700 border border-slate-600 rounded-lg p-3">
                <p className="text-slate-300 text-sm font-semibold truncate">{phase}</p>
                <p className="text-amber-400 text-xl font-bold mt-1">{formatDuration(months)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">最近の日報</h3>
        {stats.recentEntries.length === 0 ? (
          <p className="text-slate-400">日報がありません</p>
        ) : (
          <div className="space-y-3">
            {stats.recentEntries.map((entry) => {
              const entryDate = entry.date?.toDate?.() || new Date(entry.date);
              const dateStr = entryDate.toLocaleDateString('ja-JP');
              return (
                <div key={entry.id} className="border-l-4 border-amber-500 bg-slate-700 rounded px-4 py-3">
                  <p className="text-slate-400 text-sm">{dateStr}</p>
                  <p className="text-white font-semibold">{entry.title}</p>
                  {entry.workedHours > 0 && (
                    <p className="text-amber-300 text-sm mt-1">作業時間: {entry.workedHours}時間</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">よく使うスキル TOP5</h3>
        {topSkills.length === 0 ? (
          <p className="text-slate-400">表示できるデータがありません</p>
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
    </div>
  );
}
