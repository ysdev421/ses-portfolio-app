import { useState, useEffect } from 'react';
import { getProjects } from '../services/firestoreService';

export default function ProjectList({ user, onAddProject, onViewProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadProjects = async () => {
      try {
        const data = await getProjects(user.uid);
        setProjects(data);
      } catch (error) {
        console.error('案件読み込みエラー:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [user]);

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
            <div
              key={project.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-amber-500 transition-colors cursor-pointer"
              onClick={() => onViewProject(project)}
            >
              <h3 className="font-bold text-white text-lg mb-2">{project.name}</h3>
              <p className="text-slate-400 text-sm mb-3">クライアント: {project.client}</p>
              
              {project.startDate && (
                <p className="text-slate-400 text-sm mb-3">
                  期間: {new Date(project.startDate).toLocaleDateString('ja-JP')}
                  {project.endDate && ` ~ ${new Date(project.endDate).toLocaleDateString('ja-JP')}`}
                </p>
              )}

              {project.role && (
                <p className="text-slate-400 text-sm mb-3">役职: {project.role}</p>
              )}

              {project.technologies && project.technologies.length > 0 && (
                <div className="mb-3">
                  <p className="text-slate-400 text-sm mb-2">使用技術:</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span key={tech} className="bg-amber-900 text-amber-100 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.description && (
                <p className="text-slate-300 text-sm line-clamp-2">{project.description}</p>
              )}

              <div className="mt-4">
                <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded transition-colors">
                  詳細を表示
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
