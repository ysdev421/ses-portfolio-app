import { useState, useEffect, useCallback } from 'react';
import { getEntries, deleteEntry } from '../services/firestoreService';
import EntryForm from './EntryForm';

const TIER_LABELS = {
  direct: '直接取引',
  '1st': '一次請け',
  '2nd': '二次請け',
  '3rd': '三次請け',
  '4th+': '四次請け以上',
};

const INTERMEDIARY_LABELS = ['元請け会社', '二次会社', '三次会社', '四次会社'];

export default function ProjectDetail({ user, project, onBack, onEdit }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [toast, setToast] = useState({ msg: '', type: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const loadEntries = useCallback(async () => {
    if (!project?.id) return;
    try {
      setLoading(true);
      const data = await getEntries(project.id);
      setEntries(data);
    } catch (error) {
      console.error('日記読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  }, [project?.id]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm('この日記を削除しますか？')) return;
    try {
      await deleteEntry(entryId);
      showToast('日記を削除しました');
      loadEntries();
    } catch (error) {
      showToast('削除に失敗しました: ' + error.message, 'error');
    }
  };

  if (!project) {
    return (
      <div className="text-center py-12">
        <button onClick={onBack} className="text-amber-400 hover:text-amber-300">← 戻る</button>
      </div>
    );
  }

  const isActive = !project.endDate || new Date(project.endDate) >= new Date();

  const formatDate = (d) => {
    if (!d) return '-';
    if (typeof d === 'string') return d;
    return new Date(d).toLocaleDateString('ja-JP');
  };

  return (
    <div>
      {/* トースト */}
      {toast.msg && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl font-semibold ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      <button
        onClick={onBack}
        className="text-amber-400 hover:text-amber-300 mb-6 font-semibold block"
      >
        ← 案件一覧に戻る
      </button>

      {/* 案件詳細 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                {project.projectName}
              </h2>
              {isActive ? (
                <span className="bg-green-900/60 text-green-400 text-xs font-bold px-2 py-1 rounded-full border border-green-700">
                  参画中
                </span>
              ) : (
                <span className="bg-slate-700 text-slate-400 text-xs px-2 py-1 rounded-full">終了</span>
              )}
            </div>
            <p className="text-slate-400 text-lg">{project.company}</p>
          </div>
          <button
            onClick={onEdit}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-5 py-2 rounded transition-colors"
          >
            編集
          </button>
        </div>

        {/* 基本情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-slate-700 mb-6">
          <div>
            <p className="text-slate-400 text-xs font-semibold mb-1">開始日</p>
            <p className="text-white">{formatDate(project.startDate)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold mb-1">終了日</p>
            <p className="text-white">{project.endDate ? formatDate(project.endDate) : '進行中'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold mb-1">役職</p>
            <p className="text-white">{project.role || '未記入'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold mb-1">商流</p>
            <p className="text-white">{TIER_LABELS[project.contractTier] || '未記入'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold mb-1">月単価</p>
            <p className="text-white">
              {project.monthlyRate ? `${project.monthlyRate} 万円` : '未記入'}
            </p>
          </div>
        </div>

        {/* 仲介会社 */}
        {project.intermediaryCompanies && project.intermediaryCompanies.some(c => c) && (
          <div className="mb-6 pt-5 border-t border-slate-700">
            <p className="text-slate-400 text-xs font-semibold mb-2">仲介会社</p>
            <div className="space-y-1">
              {project.intermediaryCompanies.map((company, idx) =>
                company ? (
                  <p key={idx} className="text-white text-sm">
                    <span className="text-slate-400 mr-2">{INTERMEDIARY_LABELS[idx] || `${idx + 1}次会社`}:</span>
                    {company}
                  </p>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* 単価変更履歴 */}
        {project.rateHistory && project.rateHistory.length > 0 && (
          <div className="mb-6 pt-5 border-t border-slate-700">
            <p className="text-slate-400 text-xs font-semibold mb-2">単価変更履歴</p>
            <div className="space-y-1">
              {project.rateHistory.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-4 text-sm">
                  <span className="text-slate-400">{entry.date || '-'}</span>
                  <span className="text-amber-400 font-semibold">{entry.rate} 万円</span>
                  {entry.note && <span className="text-slate-300">{entry.note}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 担当フェーズ */}
        {project.phases && project.phases.length > 0 && (
          <div className="mb-6 pt-5 border-t border-slate-700">
            <p className="text-slate-400 text-xs font-semibold mb-2">担当フェーズ</p>
            <div className="flex flex-wrap gap-2">
              {project.phases.map(phase => (
                <span
                  key={phase}
                  className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded text-sm font-semibold border border-blue-700/50"
                >
                  {phase}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* スキル */}
        {project.skills && project.skills.length > 0 && (
          <div className="mb-6 pt-5 border-t border-slate-700">
            <p className="text-slate-400 text-xs font-semibold mb-2">使用スキル</p>
            <div className="flex flex-wrap gap-2">
              {project.skills.map(skill => (
                <span key={skill} className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded font-semibold text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 説明 */}
        {project.description && (
          <div className="pt-5 border-t border-slate-700">
            <p className="text-slate-400 text-xs font-semibold mb-2">説明</p>
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
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

        {loading ? (
          <p className="text-slate-400 text-center py-8">読み込み中...</p>
        ) : entries.length === 0 ? (
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
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => { setEditingEntry(entry); setShowEntryForm(true); }}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >編集</button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >削除</button>
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
