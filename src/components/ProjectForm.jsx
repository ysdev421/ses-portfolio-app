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
    projectName: '',
    company: '',
    startDate: '',
    endDate: '',
    role: '',
    skills: [],
    description: '',
    workedHours: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createProject(user.uid, {
        ...formData,
        workedHours: parseInt(formData.workedHours) || 0,
      });
      alert('✓ 案件を作成しました！');
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
          <label className="block text-slate-300 mb-2 font-semibold">案件名 *</label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-500"
            placeholder="例：ECサイト構築"
          />
        </div>

        {/* 会社名 */}
        <div>
          <label className="block text-slate-300 mb-2 font-semibold">会社名 *</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-500"
            placeholder="例：株式会社ABC"
          />
        </div>

        {/* 開始日・終了日 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-2 font-semibold">開始日 *</label>
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
            <label className="block text-slate-300 mb-2 font-semibold">終了日</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
            />
          </div>
        </div>

        {/* 役職 */}
        <div>
          <label className="block text-slate-300 mb-2 font-semibold">役職・役割</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-500"
            placeholder="例：フロントエンドエンジニア"
          />
        </div>

        {/* 実績時間 */}
        <div>
          <label className="block text-slate-300 mb-2 font-semibold">実績時間（時間）</label>
          <input
            type="number"
            name="workedHours"
            value={formData.workedHours}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-500"
            placeholder="例：480"
          />
        </div>

        {/* 使用スキル */}
        <div>
          <label className="block text-slate-300 mb-3 font-semibold">使用スキル</label>
          <div className="flex flex-wrap gap-2">
            {TECH_OPTIONS.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                  formData.skills.includes(skill)
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* 説明 */}
        <div>
          <label className="block text-slate-300 mb-2 font-semibold">説明</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-500"
            rows="4"
            placeholder="案件の詳細や特記事項を入力してください"
          />
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
            ✗ {error}
          </div>
        )}

        {/* ボタン */}
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
