import { useEffect, useState } from 'react';
import { getAllContactInquiries, getContactInquiriesByUser } from '../services/contactService';

const formatDateTime = (value) => {
  const date = value?.toDate?.() || (value ? new Date(value) : null);
  if (!date || Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('ja-JP');
};

export default function ContactList({ user, mode = 'mine' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return <p className="text-slate-400">読み込み中...</p>;
  }

  if (error) {
    return <p className="text-red-300">{error}</p>;
  }

  if (items.length === 0) {
    return <p className="text-slate-400">お問い合わせはまだありません。</p>;
  }

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
            <p className="text-slate-400 text-xs mt-1">送信ユーザー: {item.userEmail || item.userId}</p>
          )}
          {item.company && <p className="text-slate-400 text-xs mt-1">会社名: {item.company}</p>}
          <p className="text-slate-200 text-sm mt-3 whitespace-pre-wrap">{item.message || '-'}</p>
        </div>
      ))}
    </div>
  );
}
