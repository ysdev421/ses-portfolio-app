import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getEntries, deleteEntry } from '../services/firestoreService';

export default function ProjectDetail({ user, projectId, project, onBack, onEditProject, onAddEntry }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !projectId) return;

    const loadEntries = async () => {
      try {
        const data = await getEntries(user.uid, projectId);
        setEntries(data);
      } catch (error) {
        console.error('日記読み込みエラー:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [user, projectId]);

  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('この日記を削除しますか？')) {
      try {
        await deleteEntry(user.uid, projectId, entryId);
        setEntries(entries.filter(e => e.id !== entryId));
      } catch (error) {
        console.error('削除エラー:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">読み込み中...</div>;
  }

  const today = new Date();
  const startDate = project?.startDate ? new Date(project.startDate) : null;
  const endDate = project?.endDate ? new Date(project.endDate) : null;
  
  const duration = startDate && endDate 
    ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24) / 30) 
    : '進行中';

  return (
    <div>
      <button onClick={onBack} className="text-amber-400 hover:text-amber-300 mb-6">
        ← 案件一覧に戻る
      </button>

      {/* 案件情報 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-amber-400 mb-2">{project?.name}</h2>
            <p className="text-slate-400">クライアント: {project?.client}</p>
          </div>
          <button
            onClick={onEditProject}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors"
          >
            編集
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-6 border-t border-slate-700">
          <div>
            <p className="text-slate-400 text-sm">開始日</p>
            <p className="text-white font-semibold">
              {startDate ? startDate.toLocaleDateString('ja-JP') : '-'}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">終了日</p>
            <p className="text-white font-semibold">
              {endDate ? endDate.toLocaleDateString('ja-JP') : '進行中'}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">期間</p>
            <p className="text-white font-semibold">{duration}ヶ月</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">役職</p>
            <p className="text-white font-semibold">{project?.role || '-'}</p>
          </div>
        </div>

        {project?.technologies && project.technologies.length > 0 && (
          <div className="mb-4">
            <p className="text-slate-400 text-sm mb-2">使用技術</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(tech => (
                <span key={tech} className="bg-amber-900 text-amber-100 px-3 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {project?.description && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm mb-2">案件説明</p>
            <p className="text-white whitespace-pre-wrap">{project.description}</p>
          </div>
        )}
      </div>

      {/* 日記セクション */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-serif font-bold text-amber-400">日記 ({entries.length}件)</h3>
          <button
            onClick={onAddEntry}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded transition-colors"
          >
            + 日記を追加
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="text-slate-400 text-center py-8">日記がまだありません</p>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => (
              <div key={entry.id} className="border-l-4 border-amber-500 bg-slate-700 rounded px-4 py-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-slate-400 text-sm">
                      {new Date(entry.date).toLocaleDateString('ja-JP')}
                    </p>
                    <h4 className="text-white font-bold text-lg">{entry.title}</h4>
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    削除
                  </button>
                </div>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.tags.map(tag => (
                      <span key={tag} className="bg-amber-800 text-amber-100 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {entry.content && (
                  <p className="text-slate-300 text-sm whitespace-pre-wrap line-clamp-3">
                    {entry.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
