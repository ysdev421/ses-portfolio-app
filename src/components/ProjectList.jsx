import { useState, useEffect, useCallback, useMemo } from 'react';
import { getProjects, deleteProject } from '../services/firestoreService';

const isActive = (project) => {
  if (!project.endDate) return true;
  return new Date(project.endDate) >= new Date();
};

export default function ProjectList({ user, onAddProject, onViewProject, onRefresh }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [keyword, setKeyword] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const loadProjects = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getProjects(user.uid);
      setProjects(data);
    } catch (error) {
      console.error('案件読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects, onRefresh]);

  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    if (!window.confirm('この案件を削除しますか？')) return;
    try {
      await deleteProject(projectId);
      showToast('案件を削除しました');
      loadProjects();
    } catch (error) {
      showToast('削除に失敗しました: ' + error.message, 'error');
    }
  };

  const techOptions = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => (p.skills || []).forEach((s) => set.add(s)));
    return [...set].sort();
  }, [projects]);

  const phaseOptions = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => (p.phases || []).forEach((s) => set.add(s)));
    return [...set].sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const keywordNorm = keyword.trim().toLowerCase();
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return projects.filter((project) => {
      if (keywordNorm) {
        const haystack = [
          project.projectName,
          project.company,
          project.role,
          project.description,
          ...(project.skills || []),
          ...(project.phases || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(keywordNorm)) return false;
      }

      if (techFilter && !(project.skills || []).includes(techFilter)) {
        return false;
      }

      if (phaseFilter && !(project.phases || []).includes(phaseFilter)) {
        return false;
      }

      if (from || to) {
        const start = project.startDate ? new Date(project.startDate) : null;
        const end = project.endDate ? new Date(project.endDate) : new Date('2999-12-31');
        if (!start || Number.isNaN(start.getTime())) return false;
        if (from && end < from) return false;
        if (to && start > to) return false;
      }

      return true;
    });
  }, [projects, keyword, techFilter, phaseFilter, fromDate, toDate]);

  const activeProjects = filteredProjects.filter(isActive);
  const pastProjects = filteredProjects.filter((p) => !isActive(p));

  const ProjectCard = ({ project, active }) => (
    <div
      onClick={() => onViewProject(project)}
      className={`rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg group ${
        active
          ? 'bg-slate-800 border border-green-700 hover:border-green-500'
          : 'bg-slate-800 border border-slate-700 hover:border-slate-500 opacity-80'
      }`}
    >
      {/* ヘッダー */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-amber-400 group-hover:text-amber-300 leading-tight pr-2">
          {project.projectName}
        </h3>
        {active ? (
          <span className="shrink-0 bg-green-900/60 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full border border-green-700">
            参画中
          </span>
        ) : (
          <span className="shrink-0 bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded-full">
            終了
          </span>
        )}
      </div>

      <p className="text-slate-400 text-sm mb-1">{project.company}</p>

      {/* 期間 */}
      <p className="text-slate-500 text-xs mb-2">
        {project.startDate || '-'} 〜 {project.endDate || '現在'}
      </p>

      {/* 商流バッジ */}
      {project.contractTier && project.contractTier !== 'direct' && (
        <p className="text-slate-500 text-xs mb-2">
          {{
            '1st': '一次請け',
            '2nd': '二次請け',
            '3rd': '三次請け',
            '4th+': '四次請け以上',
          }[project.contractTier]}
        </p>
      )}

      {/* スキル */}
      {project.skills && project.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 mb-3">
          {project.skills.slice(0, 5).map(skill => (
            <span key={skill} className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
              {skill}
            </span>
          ))}
          {project.skills.length > 5 && (
            <span className="text-xs text-slate-500">+{project.skills.length - 5}</span>
          )}
        </div>
      )}

      {/* ボタン */}
      <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onViewProject(project)}
          className={`flex-1 text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors ${
            active
              ? 'bg-green-700 hover:bg-green-600'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {active ? '日記を書く / 詳細' : '詳細'}
        </button>
        <button
          onClick={(e) => handleDelete(project.id, e)}
          className="bg-slate-700 hover:bg-red-700 text-slate-400 hover:text-white text-sm px-3 py-1.5 rounded transition-colors"
        >
          削除
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* トースト */}
      {toast.msg && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl font-semibold transition-all ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-amber-400">案件一覧</h2>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-400 mb-4">案件がまだありません</p>
          <button
            onClick={onAddProject}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2 rounded transition-colors"
          >
            最初の案件を追加
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <section className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-300 text-sm font-semibold mb-3">検索・フィルタ</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="キーワード（案件名・会社名など）"
                className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500"
              />
              <select
                value={techFilter}
                onChange={(e) => setTechFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              >
                <option value="">技術（すべて）</option>
                {techOptions.map((tech) => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
              <select
                value={phaseFilter}
                onChange={(e) => setPhaseFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              >
                <option value="">工程（すべて）</option>
                {phaseOptions.map((phase) => (
                  <option key={phase} value={phase}>{phase}</option>
                ))}
              </select>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    setKeyword('');
                    setTechFilter('');
                    setPhaseFilter('');
                    setFromDate('');
                    setToDate('');
                  }}
                  className="shrink-0 bg-slate-600 hover:bg-slate-500 text-white text-sm px-3 py-2 rounded"
                >
                  クリア
                </button>
              </div>
            </div>
            <p className="text-slate-400 text-xs mt-3">検索結果: {filteredProjects.length}件</p>
          </section>

          {filteredProjects.length === 0 && (
            <section className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
              <p className="text-slate-400">条件に一致する案件がありません</p>
            </section>
          )}

          {/* 現在の案件 */}
          {activeProjects.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-bold text-green-400">現在参画中</h3>
                <span className="bg-green-900/40 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-800">
                  {activeProjects.length}件
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeProjects.map(p => <ProjectCard key={p.id} project={p} active />)}
              </div>
            </section>
          )}

          {/* 過去の案件 */}
          {pastProjects.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-bold text-slate-400">過去の案件</h3>
                <span className="bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                  {pastProjects.length}件
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastProjects.map(p => <ProjectCard key={p.id} project={p} active={false} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
