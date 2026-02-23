import { useEffect, useState } from 'react';
import {
  getAllContactInquiries,
  getContactInquiriesByUser,
  updateContactInquiry,
} from '../services/contactService';

const formatDateTime = (value) => {
  const date = value?.toDate?.() || (value ? new Date(value) : null);
  if (!date || Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('ja-JP');
};

export default function ContactList({ user, mode = 'mine' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = mode === 'all'
          ? await getAllContactInquiries()
          : await getContactInquiriesByUser(user?.uid);
        setItems(data);
      } catch (err) {
        setError(err.message || '読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [mode, user?.uid]);

  const handleAdminUpdate = async (id, patch) => {
    try {
      setSavingId(id);
      setError('');
      await updateContactInquiry(id, patch);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
      );
    } catch (err) {
      setError(err.message || '更新に失敗しました');
    } finally {
      setSavingId('');
    }
  };

  if (loading) return <p className="text-slate-400">読み込み中...</p>;
  if (error) return <p className="text-red-300">{error}</p>;
  if (items.length === 0) return <p className="text-slate-400">問い合わせはまだありません。</p>;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="bg-slate-700/60 border border-slate-600 rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs bg-slate-800 border border-slate-600 rounded px-2 py-0.5">{item.status || 'new'}</span>
            <span className="text-slate-400 text-xs">{formatDateTime(item.createdAt)}</span>
          </div>

          <p className="text-white font-semibold">{item.name || '-'}</p>
          <p className="text-slate-300 text-sm">{item.email || '-'}</p>
          {mode === 'all' && (
            <p className="text-slate-400 text-xs mt-1">問い合わせユーザー: {item.userEmail || item.userId}</p>
          )}
          {item.company && <p className="text-slate-400 text-xs mt-1">会社名: {item.company}</p>}

          <p className="text-slate-200 text-sm mt-3 whitespace-pre-wrap">{item.message || '-'}</p>

          {mode === 'all' && (
            <div className="mt-4 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={item.status || 'new'}
                  onChange={(e) =>
                    handleAdminUpdate(item.id, {
                      status: e.target.value,
                      statusUpdatedBy: user?.email || '',
                      statusUpdatedAtClient: new Date().toISOString(),
                    })
                  }
                  disabled={savingId === item.id}
                  className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                >
                  <option value="new">new</option>
                  <option value="in_progress">in_progress</option>
                  <option value="resolved">resolved</option>
                </select>
                {savingId === item.id && <span className="text-slate-400 text-xs">更新中...</span>}
              </div>

              <textarea
                value={item.adminNote || ''}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((v) =>
                      v.id === item.id ? { ...v, adminNote: e.target.value } : v
                    )
                  )
                }
                rows={2}
                placeholder="管理メモ（社内用）"
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-white"
              />

              <textarea
                value={item.adminReply || ''}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((v) =>
                      v.id === item.id ? { ...v, adminReply: e.target.value } : v
                    )
                  )
                }
                rows={3}
                placeholder="ユーザーへの返信"
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-white"
              />

              <button
                type="button"
                onClick={() =>
                  handleAdminUpdate(item.id, {
                    adminNote: item.adminNote || '',
                    adminReply: item.adminReply || '',
                    noteUpdatedBy: user?.email || '',
                    noteUpdatedAtClient: new Date().toISOString(),
                  })
                }
                disabled={savingId === item.id}
                className="bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 text-white text-sm px-3 py-1 rounded"
              >
                保存
              </button>
            </div>
          )}

          {mode === 'mine' && item.adminReply && (
            <div className="mt-4 bg-slate-800 border border-slate-600 rounded p-3">
              <p className="text-amber-400 text-xs font-semibold mb-1">運営からの返信</p>
              <p className="text-slate-200 text-sm whitespace-pre-wrap">{item.adminReply}</p>
              {(item.noteUpdatedAtClient || item.updatedAt) && (
                <p className="text-slate-500 text-xs mt-2">
                  更新: {formatDateTime(item.noteUpdatedAtClient || item.updatedAt)}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
