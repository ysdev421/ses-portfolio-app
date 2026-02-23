import { useState, useEffect } from 'react';
import { createProject, updateProject } from '../services/firestoreService';

const TECH_OPTIONS = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
  'TypeScript', 'Docker', 'AWS', 'GCP', 'Azure', 'Figma', 'UI/UX',
];

const PHASE_OPTIONS = [
  '要件定義', '基本設計', '詳細設計', '実装', 'テスト', '保守運用',
];

const TIER_OPTIONS = [
  { value: 'direct', label: '直接取引', intermediaries: 0 },
  { value: '1st',    label: '一次請け', intermediaries: 1 },
  { value: '2nd',    label: '二次請け', intermediaries: 2 },
  { value: '3rd',    label: '三次請け', intermediaries: 3 },
  { value: '4th+',   label: '四次請け以上', intermediaries: 4 },
];

const INTERMEDIARY_LABELS = ['元請け会社', '二次会社', '三次会社', '四次会社'];

const getIntermediaryCount = (tier) =>
  TIER_OPTIONS.find(t => t.value === tier)?.intermediaries ?? 0;

export default function ProjectForm({ user, project, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const isEditMode = !!project;

  const [formData, setFormData] = useState({
    projectName: '',
    company: '',
    startDate: '',
    endDate: '',
    role: '',
    skills: [],
    phases: [],
    description: '',
    contractTier: 'direct',
    intermediaryCompanies: [],
    monthlyRate: '',
    rateHistory: [],
  });

  useEffect(() => {
    if (isEditMode && project) {
      const tier = project.contractTier || 'direct';
      const count = getIntermediaryCount(tier);
      const saved = project.intermediaryCompanies || [];
      const padded = Array.from({ length: count }, (_, i) => saved[i] || '');
      setFormData({
        projectName: project.projectName || '',
        company: project.company || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        role: project.role || '',
        skills: project.skills || [],
        phases: project.phases || [],
        description: project.description || '',
        contractTier: tier,
        intermediaryCompanies: padded,
        monthlyRate: project.monthlyRate || '',
        rateHistory: project.rateHistory || [],
      });
    }
  }, [project, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTierChange = (e) => {
    const tier = e.target.value;
    const count = getIntermediaryCount(tier);
    setFormData(prev => {
      const current = prev.intermediaryCompanies;
      const next = Array.from({ length: count }, (_, i) => current[i] || '');
      return { ...prev, contractTier: tier, intermediaryCompanies: next };
    });
  };

  const handleIntermediaryChange = (idx, value) => {
    setFormData(prev => {
      const updated = [...prev.intermediaryCompanies];
      updated[idx] = value;
      return { ...prev, intermediaryCompanies: updated };
    });
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const togglePhase = (phase) => {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases.includes(phase)
        ? prev.phases.filter(p => p !== phase)
        : [...prev.phases, phase],
    }));
  };

  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed || formData.skills.includes(trimmed)) return;
    setFormData(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setCustomSkillInput('');
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const addRateEntry = () => {
    setFormData(prev => ({
      ...prev,
      rateHistory: [...prev.rateHistory, { date: '', rate: '', note: '' }],
    }));
  };

  const updateRateEntry = (idx, field, value) => {
    setFormData(prev => ({
      ...prev,
      rateHistory: prev.rateHistory.map((e, i) =>
        i === idx ? { ...e, [field]: value } : e
      ),
    }));
  };

  const removeRateEntry = (idx) => {
    setFormData(prev => ({
      ...prev,
      rateHistory: prev.rateHistory.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...formData,
        monthlyRate: parseFloat(formData.monthlyRate) || 0,
      };
      if (isEditMode) {
        await updateProject(project.id, payload);
        setSuccessMsg('案件を更新しました');
      } else {
        await createProject(user.uid, payload);
        setSuccessMsg('案件を作成しました');
        setFormData({
          projectName: '', company: '', startDate: '', endDate: '',
          role: '', skills: [], phases: [], description: '',
          contractTier: 'direct', intermediaryCompanies: [],
          monthlyRate: '', rateHistory: [],
        });
      }
      setTimeout(() => {
        setSuccessMsg('');
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const customSkills = formData.skills.filter(s => !TECH_OPTIONS.includes(s));
  const intermediaryCount = getIntermediaryCount(formData.contractTier);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 sm:p-6 max-w-2xl">
      <h2 className="text-2xl font-serif font-bold text-amber-400 mb-6">
        {isEditMode ? '案件を編集' : '新規案件を追加'}
      </h2>

      {successMsg && (
        <div className="bg-green-900/50 border border-green-600 text-green-300 px-4 py-3 rounded mb-4 font-semibold">
          ✓ {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* 案件名 */}
        <div>
          <label className="block text-slate-300 mb-2 font-semibold">案件名 *</label>
          <input
            type="text" name="projectName" value={formData.projectName}
            onChange={handleChange} required
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-500"
            placeholder="例：ECサイト構築"
          />
        </div>

        {/* クライアント企業 */}
        <div>
          <label className="block text-slate-300 mb-2 font-semibold">クライアント企業 *</label>
          <input
            type="text" name="company" value={formData.company}
            onChange={handleChange} required
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-500"
            placeholder="例：株式会社ABC（エンド企業）"
          />
        </div>

        {/* 商流 */}
        <div>
          <label className="block text-slate-300 mb-2 font-semibold">商流（取引形態）</label>
          <select
            value={formData.contractTier} onChange={handleTierChange}
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
          >
            {TIER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* 仲介会社 */}
        {intermediaryCount > 0 && (
          <div className="space-y-2 bg-slate-700/50 border border-slate-600 rounded-lg p-4">
            <p className="text-slate-400 text-sm font-semibold mb-3">仲介会社（エンド企業と自社の間）</p>
            {Array.from({ length: intermediaryCount }).map((_, idx) => (
              <div key={idx}>
                <label className="block text-slate-400 text-xs mb-1">
                  {INTERMEDIARY_LABELS[idx] || `${idx + 1}次会社`}
                </label>
                <input
                  type="text"
                  value={formData.intermediaryCompanies[idx] || ''}
                  onChange={e => handleIntermediaryChange(idx, e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 text-sm"
                  placeholder={`${INTERMEDIARY_LABELS[idx] || '会社名'}を入力`}
                />
              </div>
            ))}
          </div>
        )}

        {/* 開始日・終了日 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-2 font-semibold">開始日 *</label>
            <input
              type="date" name="startDate" value={formData.startDate}
              onChange={handleChange} required
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2 font-semibold">終了日</label>
            <input
              type="date" name="endDate" value={formData.endDate}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
            />
          </div>
        </div>

        {/* 役職 */}
        <div>
          <label className="block text-slate-300 mb-2 font-semibold">役職・役割</label>
          <input
            type="text" name="role" value={formData.role}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-500"
            placeholder="例：フロントエンドエンジニア"
          />
        </div>

        {/* 担当フェーズ */}
        <div>
          <label className="block text-slate-300 mb-3 font-semibold">担当フェーズ</label>
          <div className="flex flex-wrap gap-2">
            {PHASE_OPTIONS.map(phase => (
              <button
                key={phase} type="button" onClick={() => togglePhase(phase)}
                className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                  formData.phases.includes(phase)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {phase}
              </button>
            ))}
          </div>
        </div>

        {/* 月単価 */}
        <div>
          <label className="block text-slate-300 mb-2 font-semibold">月単価（万円）</label>
          <div className="flex items-center gap-2">
            <input
              type="number" name="monthlyRate" value={formData.monthlyRate}
              onChange={handleChange} min="0"
              className="flex-1 bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-500"
              placeholder="例：60"
            />
            <span className="text-slate-400">万円</span>
          </div>
        </div>

        {/* 単価変更履歴 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-slate-300 font-semibold">単価変更履歴</label>
            <button
              type="button" onClick={addRateEntry}
              className="text-amber-400 hover:text-amber-300 text-sm"
            >
              + 追加
            </button>
          </div>
          {formData.rateHistory.length > 0 && (
            <div className="space-y-2 bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              {formData.rateHistory.map((entry, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_2fr_auto] gap-2 items-center">
                  <input
                    type="date" value={entry.date}
                    onChange={e => updateRateEntry(idx, 'date', e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-white text-sm"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number" value={entry.rate} min="0"
                      onChange={e => updateRateEntry(idx, 'rate', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-white text-sm"
                      placeholder="65"
                    />
                    <span className="text-slate-400 text-xs whitespace-nowrap">万円</span>
                  </div>
                  <input
                    type="text" value={entry.note}
                    onChange={e => updateRateEntry(idx, 'note', e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-white text-sm"
                    placeholder="メモ（昇給など）"
                  />
                  <button
                    type="button" onClick={() => removeRateEntry(idx)}
                    className="text-red-400 hover:text-red-300 text-sm px-1 justify-self-end"
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 使用スキル */}
        <div>
          <label className="block text-slate-300 mb-3 font-semibold">使用スキル</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {TECH_OPTIONS.map(skill => (
              <button
                key={skill} type="button" onClick={() => toggleSkill(skill)}
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
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text" value={customSkillInput}
              onChange={e => setCustomSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
              className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-white placeholder-slate-500 text-sm"
              placeholder="上記以外のスキルを入力して追加"
            />
            <button
              type="button" onClick={addCustomSkill}
              className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1.5 rounded text-sm"
            >
              追加
            </button>
          </div>
          {customSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {customSkills.map(skill => (
                <span
                  key={skill}
                  className="bg-blue-600/60 text-blue-200 px-3 py-1 rounded text-sm font-semibold flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button" onClick={() => removeSkill(skill)}
                    className="text-blue-300 hover:text-white ml-1"
                  >✕</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 説明 */}
        <div>
          <label className="block text-slate-300 mb-2 font-semibold">説明・メモ</label>
          <textarea
            name="description" value={formData.description}
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

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit" disabled={loading}
            className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-white font-bold py-2 rounded transition-colors"
          >
            {loading ? '処理中...' : isEditMode ? '更新する' : '案件を作成'}
          </button>
          <button
            type="button" onClick={onCancel}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded transition-colors"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
