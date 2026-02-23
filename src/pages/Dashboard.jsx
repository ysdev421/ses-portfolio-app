import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function Dashboard({ user, onNavigate }) {
  const [projects, setProjects] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        // 案件を読み込み
        const projectsRef = collection(db, 'users', user.uid, 'projects');
        const projectsSnap = await getDocs(query(projectsRef, orderBy('startDate', 'desc'), limit(5)));
        setProjects(projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('データ読み込みエラー:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return <div className="text-center py-12 text-slate-400">読み込み中...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-amber-400 mb-6">ダッシュボード</h2>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm">総案件数</p>
          <p className="text-4xl font-bold text-amber-400 mt-2">{projects.length}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm">総日記数</p>
          <p className="text-4xl font-bold text-amber-400 mt-2">0</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm">技術種類</p>
          <p className="text-4xl font-bold text-amber-400 mt-2">0</p>
        </div>
      </div>

      {/* 最新案件 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">最新の案件</h3>
        {projects.length === 0 ? (
          <p className="text-slate-400">案件がまだありません</p>
        ) : (
          <div className="space-y-3">
            {projects.map(project => (
              <div key={project.id} className="bg-slate-700 rounded p-4 hover:bg-slate-600 transition-colors">
                <p className="font-bold text-white">{project.name}</p>
                <p className="text-slate-400 text-sm mt-1">{project.client}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map(tech => (
                      <span key={tech} className="bg-amber-900 text-amber-100 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* アクションボタン */}
      <div className="mt-8 flex gap-4">
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
