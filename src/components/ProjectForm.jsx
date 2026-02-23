import { useState } from 'react';
import { createProject } from '../services/firestoreService';

const TECH_OPTIONS = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
  'TypeScript', 'Docker', 'AWS', 'GCP', 'Azure', 'Figma', 'UI/UX',
];

export default function ProjectForm({ user, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    startDate: '',
    endDate: '',
    role: '',
    technologies: [],
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleTechnology = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createProject(user.uid, formData);
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
      <h2 className="text-2xl font-serif font-bold text-amber-400 mb-6">新規案件を追加</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 案件名 */}
        <div>
          <label className="block text-slate-300 mb-2">案件名</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
            placeholder="例：ECサイト構築"
          />
        </div>

        {/* クライアント企業 */}
        <div>
          <label className="block text-slate-300 mb-2">クライアント企業</label>
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
            placeholder="例：株式会社ABC"
          />
        </div>

        {/* 開始日・終了日 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-2">開始日</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">終了日（未完了の場合は空白）</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
            />
          </div>
        </div>

        {/* 役職・役割 */}
        <div>
          <label className="block text-slate-300 mb-2">役職・役割</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
            placeholder="例：フロントエンドエンジニア"
          />
        </div>

        {/* 使用技術 */}
        <div>
          <label className="block text-slate-300 mb-3">使用技術</label>
          <div className="flex flex-wrap gap-2">
            {TECH_OPTIONS.map(tech => (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTechnology(tech)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  formData.technologies.includes(tech)
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* 案件説明 */}
        <div>
          <label className="block text-slate-300 mb-2">案件説明</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
            rows="4"
            placeholder="案件の詳細や特記事項を入力してください"
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
            {loading ? '作成中...' : '案件を作成'}
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
