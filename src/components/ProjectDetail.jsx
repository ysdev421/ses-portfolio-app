import { useState, useEffect } from 'react';
import { getEntries, deleteEntry } from '../services/firestoreService';
import EntryForm from './EntryForm';

export default function ProjectDetail({ user, project, onBack, onEdit }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    if (project?.id) {
      loadEntries();
    }
  }, [project?.id]);

  const loadEntries = async () => {
    if (!project?.id) return;
    try {
      setLoading(true);
      const data = await getEntries(project.id);
      setEntries(data);
    } catch (error) {
      console.error('✗ 日記読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('この日記を削除しますか？')) {
      try {
        await deleteEntry(entryId);
        alert('✓ 日記を削除しました');
        loadEntries();
      } catch (error) {
        alert('✗ 削除に失敗しました:' + error.message);
      }
    }
  };

  if (!project) {
    return (
      <div className="text-center py-12">
        <button 
          onClick={onBack}
          className="text-amber-400 hover:text-amber-300 mb-6"
        >
          ← 戻る
        </button>
      </div>
    );
  }

  const startDate = project.startDate ? new Date(project.startDate) : null;
  const endDate = project.endDate ? new Date(project.endDate) : null;

  const formatDate = (date) => {
    if (!date) return '-';
    if (typeof date === 'string') return date;
    return new Date(date).toLocaleDateString('ja-JP');
  };

  return (
    <div>
      <button 
        onClick={onBack}
        className="text-amber-400 hover:text-amber-300 mb-6 font-semibold"
      >
        ← 案件一覧に戻る
      </button>

      {/* 案件詳細 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-4xl font-serif font-bold text-amber-400 mb-2">
              {project.projectName}
            </h2>
            <p className="text-slate-400 text-lg">会社: {project.company}</p>
          </div>
          <button
            onClick={onEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded transition-colors"
          >
            編集
          </button>
        </div>

        {/* 基本情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-6 border-t border-slate-700">
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-1">開始日</p>
            <p className="text-white text-lg">{formatDate(startDate)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-1">終了日</p>
            <p className="text-white text-lg">{formatDate(endDate) || '進行中'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-1">役職</p>
            <p className="text-white text-lg">{project.role || '未記入'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-1">実績時間</p>
            <p className="text-white text-lg">{project.workedHours || 0}時間</p>
          </div>
        </div>

        {/* スキル */}
        {project.skills && project.skills.length > 0 && (
          <div className="mb-6 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm font-semibold mb-3">使用スキル</p>
            <div className="flex flex-wrap gap-2">
              {project.skills.map(skill => (
                <span 
                  key={skill} 
                  className="bg-amber-500/20 text-amber-300 px-4 py-2 rounded font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 説明 */}
        {project.description && (
          <div className="pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm font-semibold mb-3">説明</p>
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
              {project.description}
            </p>
          </div>
        )}
      </div>

      {/* 日記セクション */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-serif font-bold text-amber-400">日記 ({entries.length}件)</h3>
          <button
            onClick={() => {
              setEditingEntry(null);
              setShowEntryForm(!showEntryForm);
            }}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded transition-colors"
          >
            + 日記を追加
          </button>
        </div>

        {/* 日記作成フォーム */}
        {showEntryForm && (
          <EntryForm
            userId={user.uid}
            projectId={project.id}
            entry={editingEntry}
            onSuccess={() => {
              setShowEntryForm(false);
              setEditingEntry(null);
              loadEntries();
            }}
            onCancel={() => {
              setShowEntryForm(false);
              setEditingEntry(null);
            }}
          />
        )}

        {/* 日記一覧 */}
        {entries.length === 0 ? (
          <p className="text-slate-400 text-center py-8">日記がまだありません</p>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => {
              const entryDate = entry.date?.toDate?.() || new Date(entry.date);
              const dateStr = entryDate.toLocaleDateString('ja-JP');
              return (
                <div key={entry.id} className="border-l-4 border-amber-500 bg-slate-700 rounded px-4 py-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-slate-400 text-sm">{dateStr}</p>
                      <h4 className="text-white font-bold text-lg">{entry.title}</h4>
                      {entry.workedHours > 0 && (
                        <p className="text-amber-300 text-sm">作業時間: {entry.workedHours}時間</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingEntry(entry);
                          setShowEntryForm(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        削除
                      </button>
                    </div>
                  </div>

                  {entry.content && (
                    <p className="text-slate-300 text-sm whitespace-pre-wrap line-clamp-3">
                      {entry.content}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
