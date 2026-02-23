import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { createEntry } from '../services/firestoreService';

const TAG_OPTIONS = [
  // 開発スキル系
  '新規開発',
  '機能開発',
  'バグ修正',
  'リファクタリング',
  '設計・アーキテクチャ',
  // ビジネススキル系
  '顧客折衝',
  '要件定義',
  'PM/マネジメント',
  'プレゼン・資料作成',
  // 技術深掘り系
  'インフラ・環境構築',
  'パフォーマンス最適化',
  'セキュリティ対応',
  // 学習・貢献系
  'レビュー・指導',
  '学習・技術検証',
  'トラブルシューティング',
];

export default function EntryForm({ user, projectId, projectName, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    tags: [],
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createEntry(user.uid, projectId, formData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-2xl">
      <h2 className="text-2xl font-serif font-bold text-amber-400 mb-2">日記を追加</h2>
      <p className="text-slate-400 mb-6">案件: {projectName}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 日付 */}
        <div>
          <label className="block text-slate-300 mb-2">日付</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
          />
        </div>

        {/* タイトル */}
        <div>
          <label className="block text-slate-300 mb-2">タイトル（何をしたか）</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
            placeholder="例：ログイン画面のバグを修正した"
          />
        </div>

        {/* タグ選択 */}
        <div>
          <label className="block text-slate-300 mb-3">タグを選択（複数選択可）</label>
          <div className="grid grid-cols-2 gap-2">
            {TAG_OPTIONS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-2 rounded text-sm transition-colors text-left ${
                  formData.tags.includes(tag)
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 詳細メモ */}
        <div>
          <label className="block text-slate-300 mb-2">詳細メモ</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
            rows="6"
            placeholder="詳しく記録してください。何をしたか、どんな技術を使ったか、学んだことなど..."
          />
        </div>

        {error && (
          <div className="bg-red-900 border border-red-500 text-red-100 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* 送信ボタン */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-white font-bold py-2 rounded transition-colors"
          >
            {loading ? '保存中...' : '日記を保存'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded transition-colors"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
