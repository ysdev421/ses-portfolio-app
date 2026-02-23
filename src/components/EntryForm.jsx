import { useState, useEffect } from 'react';
import { createEntry, updateEntry } from '../services/firestoreService';

export default function EntryForm({ userId, projectId, entry, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditMode = !!entry;

  const [formData, setFormData] = useState({
    date: '',
    title: '',
    content: '',
    workedHours: '',
  });

  useEffect(() => {
    if (isEditMode && entry) {
      // 日付をフォーマット（YYYY-MM-DD）
      let dateStr = '';
      if (entry.date) {
        const date = typeof entry.date === 'string' 
          ? new Date(entry.date) 
          : entry.date.toDate?.() || new Date(entry.date);
        dateStr = date.toISOString().split('T')[0];
      }
      
      setFormData({
        date: dateStr,
        title: entry.title || '',
        content: entry.content || '',
        workedHours: entry.workedHours || '',
      });
    } else {
      // 新規作成時は今日の日付を自動設定
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        date: dateStr,
      }));
    }
  }, [entry, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.date || !formData.title) {
      setError('日付とタイトルは必須です');
      setLoading(false);
      return;
    }

    try {
      if (isEditMode) {
        await updateEntry(entry.id, {
          date: new Date(formData.date),
          title: formData.title,
          content: formData.content,
          workedHours: parseInt(formData.workedHours) || 0,
        });
        alert('✓ 日記を更新しました！');
      } else {
        await createEntry(userId, projectId, {
          date: new Date(formData.date),
          title: formData.title,
          content: formData.content,
          workedHours: parseInt(formData.workedHours) || 0,
        });
        alert('✓ 日記を作成しました！');
        // フォームをリセット
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        setFormData({
          date: dateStr,
          title: '',
          content: '',
          workedHours: '',
        });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('✗ フォーム送信エラー:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-700 border border-slate-600 rounded-lg p-4 mb-6">
      <h3 className="text-xl font-semibold text-amber-400 mb-4">
        {isEditMode ? '日記を編集' : '新しい日記を追加'}
      </h3>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="space-y-4">
        {/* 日付 */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1">日付 *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400"
            required
          />
        </div>

        {/* タイトル */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1">タイトル *</label>
          <input
            type="text"
            name="title"
            placeholder="例: API 実装、バグ修正"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400"
            required
          />
        </div>

        {/* 内容 */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1">内容</label>
          <textarea
            name="content"
            placeholder="この日の作業内容を記入してください"
            value={formData.content}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400"
          />
        </div>

        {/* 作業時間 */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1">作業時間（時間）</label>
          <input
            type="number"
            name="workedHours"
            placeholder="例: 8"
            value={formData.workedHours}
            onChange={handleChange}
            min="0"
            step="0.5"
            className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* ボタン */}
      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-white font-bold px-4 py-2 rounded transition-colors"
        >
          {isEditMode ? '更新する' : '作成'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold px-4 py-2 rounded transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
