import { useState, useEffect } from 'react';
import { getProjects, deleteProject } from '../services/firestoreService';

export default function ProjectList({ user, onAddProject, onViewProject, onRefresh }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadProjects();
  }, [user, onRefresh]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects(user.uid);
      setProjects(data);
    } catch (error) {
      console.error('✗ 案件読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('この案件を削除しますか？')) {
      try {
        await deleteProject(projectId);
        alert('✓ 案件を削除しました');
        loadProjects();
      } catch (error) {
        alert('✗ 削除に失敗しました:' + error.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">読み込み中...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-amber-400">案件一覧</h2>
        <button
          onClick={onAddProject}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2 rounded transition-colors"
        >
          + 新規案件
        </button>
      </div>

      {projects.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(project => (
            <div key={project.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-amber-500 transition-all">
              <h3 className="text-lg font-semibold text-amber-400 mb-2">{project.projectName}</h3>
              <p className="text-slate-400 text-sm mb-1">会社: {project.company}</p>
              <p className="text-slate-400 text-sm mb-1">役職: {project.role || '未記入'}</p>
              <p className="text-slate-400 text-sm mb-1">実績時間: {project.workedHours || 0}時間</p>
              
              {project.skills && project.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3 mb-3">
                  {project.skills.map(skill => (
                    <span key={skill} className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onViewProject(project)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1 rounded transition-colors"
                >
                  詳細
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-3 py-1 rounded transition-colors"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
