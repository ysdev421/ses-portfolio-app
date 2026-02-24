import { useEffect, useState } from 'react';
import { createProject, updateProject } from '../services/firestoreService';
import { normalizeDateString, toYmd } from '../utils/date';
import CustomDateInput from './CustomDateInput';

const TECH_OPTIONS = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
  'TypeScript', 'Docker', 'AWS', 'GCP', 'Azure', 'Figma', 'UI/UX',
];

const PHASE_OPTIONS = ['要件定義', '基本設計', '詳細設計', '実装', 'テスト', '運用保守'];

const TIER_OPTIONS = [
  { value: 'direct', label: '直請け', intermediaries: 0 },
  { value: '1st', label: '一次請け', intermediaries: 1 },
  { value: '2nd', label: '二次請け', intermediaries: 2 },
  { value: '3rd', label: '三次請け', intermediaries: 3 },
  { value: '4th+', label: '四次請け以上', intermediaries: 4 },
];

const INTERMEDIARY_LABELS = ['一次請け会社', '二次請け会社', '三次請け会社', '四次請け会社'];

const getIntermediaryCount = (tier) =>
  TIER_OPTIONS.find((t) => t.value === tier)?.intermediaries ?? 0;

const toInputDate = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return normalizeDateString(value);
  const date = value?.toDate?.() || new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return toYmd(date);
};

const createInitialFormData = () => ({
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

export default function ProjectForm({ user, project, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [formData, setFormData] = useState(createInitialFormData());
  const isEditMode = !!project;

  useEffect(() => {
    if (!isEditMode || !project) return;

    const tier = project.contractTier || 'direct';
    const count = getIntermediaryCount(tier);
    const saved = project.intermediaryCompanies || [];
    const padded = Array.from({ length: count }, (_, i) => saved[i] || '');

    setFormData({
      projectName: project.projectName || '',
      company: project.company || '',
      startDate: toInputDate(project.startDate),
      endDate: toInputDate(project.endDate),
      role: project.role || '',
      skills: project.skills || [],
      phases: project.phases || [],
      description: project.description || '',
      contractTier: tier,
      intermediaryCompanies: padded,
      monthlyRate: project.monthlyRate || '',
      rateHistory: (project.rateHistory || []).map((entry) => ({
        ...entry,
        date: toInputDate(entry?.date),
      })),
    });
  }, [isEditMode, project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTierChange = (e) => {
    const tier = e.target.value;
    const count = getIntermediaryCount(tier);
    setFormData((prev) => ({
      ...prev,
      contractTier: tier,
      intermediaryCompanies: Array.from(
        { length: count },
        (_, i) => prev.intermediaryCompanies[i] || ''
      ),
    }));
  };

  const handleIntermediaryChange = (idx, value) => {
    setFormData((prev) => {
      const updated = [...prev.intermediaryCompanies];
      updated[idx] = value;
      return { ...prev, intermediaryCompanies: updated };
    });
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const togglePhase = (phase) => {
    setFormData((prev) => ({
      ...prev,
      phases: prev.phases.includes(phase)
        ? prev.phases.filter((p) => p !== phase)
        : [...prev.phases, phase],
    }));
  };

  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed || formData.skills.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setCustomSkillInput('');
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addRateEntry = () => {
    setFormData((prev) => ({
      ...prev,
      rateHistory: [...prev.rateHistory, { date: '', rate: '', note: '' }],
    }));
  };

  const updateRateEntry = (idx, field, value) => {
    setFormData((prev) => ({
      ...prev,
      rateHistory: prev.rateHistory.map((r, i) => (i === idx ? { ...r, [field]: value } : r)),
    }));
  };

  const removeRateEntry = (idx) => {
    setFormData((prev) => ({
      ...prev,
      rateHistory: prev.rateHistory.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedStartDate = normalizeDateString(formData.startDate);
      const normalizedEndDate = formData.endDate ? normalizeDateString(formData.endDate) : '';

      if (!normalizedStartDate) throw new Error('開始日は YYYY/MM/DD 形式で入力してください');
      if (formData.endDate && !normalizedEndDate) throw new Error('終了日は YYYY/MM/DD 形式で入力してください');

      const payload = {
        ...formData,
        startDate: normalizedStartDate,
        endDate: normalizedEndDate,
        monthlyRate: parseFloat(formData.monthlyRate) || 0,
        rateHistory: (formData.rateHistory || []).map((r) => ({
          ...r,
          date: r.date ? normalizeDateString(r.date) : '',
        })),
      };

      if (isEditMode) {
        await updateProject(project.id, payload);
        setSuccessMsg('案件を更新しました');
      } else {
        await createProject(user.uid, payload);
        setSuccessMsg('案件を追加しました');
        setFormData(createInitialFormData());
      }

      setTimeout(() => {
        setSuccessMsg('');
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(err.message || '保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const customSkills = formData.skills.filter((s) => !TECH_OPTIONS.includes(s));
  const intermediaryCount = getIntermediaryCount(formData.contractTier);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 sm:p-6 max-w-2xl">
      <h2 className="text-2xl font-serif font-bold text-amber-400 mb-6">
        {isEditMode ? '案件を編集' : '新しい案件を追加'}
      </h2>

      {successMsg && (
        <div className="bg-green-900/50 border border-green-600 text-green-300 px-4 py-3 rounded mb-4 font-semibold">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-slate-300 mb-2 font-semibold">案件名 *</label>
          <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white" />
        </div>

        <div>
          <label className="block text-slate-300 mb-2 font-semibold">クライアント名 *</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white" />
        </div>

        <div>
          <label className="block text-slate-300 mb-2 font-semibold">商流</label>
          <select value={formData.contractTier} onChange={handleTierChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white">
            {TIER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {intermediaryCount > 0 && (
          <div className="space-y-2 bg-slate-700/50 border border-slate-600 rounded-lg p-4">
            {Array.from({ length: intermediaryCount }).map((_, idx) => (
              <div key={idx}>
                <label className="block text-slate-400 text-xs mb-1">{INTERMEDIARY_LABELS[idx] || `${idx + 1}次請け会社`}</label>
                <input type="text" value={formData.intermediaryCompanies[idx] || ''} onChange={(e) => handleIntermediaryChange(idx, e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm" />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="min-w-0">
            <label className="block text-slate-300 mb-2 font-semibold">開始日 *</label>
            <CustomDateInput
              value={formData.startDate}
              onValueChange={(nextValue) => setFormData((prev) => ({ ...prev, startDate: nextValue }))}
              required
              className="w-full min-w-0"
              inputClassName="w-full min-w-0 bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
              buttonClassName="bg-slate-600 hover:bg-slate-500 text-white text-xs px-3 py-2 rounded shrink-0"
            />
          </div>
          <div className="min-w-0">
            <label className="block text-slate-300 mb-2 font-semibold">終了日</label>
            <CustomDateInput
              value={formData.endDate}
              onValueChange={(nextValue) => setFormData((prev) => ({ ...prev, endDate: nextValue }))}
              className="w-full min-w-0"
              inputClassName="w-full min-w-0 bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
              buttonClassName="bg-slate-600 hover:bg-slate-500 text-white text-xs px-3 py-2 rounded shrink-0"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 mb-2 font-semibold">役割</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white" />
        </div>

        <div>
          <label className="block text-slate-300 mb-3 font-semibold">工程</label>
          <div className="flex flex-wrap gap-2">
            {PHASE_OPTIONS.map((phase) => (
              <button key={phase} type="button" onClick={() => togglePhase(phase)} className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${formData.phases.includes(phase) ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                {phase}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-slate-300 mb-2 font-semibold">月額単価（万円）</label>
          <input type="number" name="monthlyRate" value={formData.monthlyRate} onChange={handleChange} min="0" className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-slate-300 font-semibold">単価変更履歴</label>
            <button type="button" onClick={addRateEntry} className="text-amber-400 hover:text-amber-300 text-sm">+ 追加</button>
          </div>
          {formData.rateHistory.length > 0 && (
            <div className="space-y-2 bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              {formData.rateHistory.map((entry, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_2fr_auto] gap-2 items-center">
                  <CustomDateInput
                    value={entry.date || ''}
                    onValueChange={(nextValue) => updateRateEntry(idx, 'date', nextValue)}
                    className="w-full"
                    inputClassName="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-white text-sm"
                    buttonClassName="bg-slate-600 hover:bg-slate-500 text-white text-xs px-2 py-1.5 rounded shrink-0"
                  />
                  <input type="number" value={entry.rate} min="0" onChange={(e) => updateRateEntry(idx, 'rate', e.target.value)} className="bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-white text-sm" placeholder="65" />
                  <input type="text" value={entry.note} onChange={(e) => updateRateEntry(idx, 'note', e.target.value)} className="bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-white text-sm" placeholder="メモ" />
                  <button type="button" onClick={() => removeRateEntry(idx)} className="text-red-400 hover:text-red-300 text-sm px-1 justify-self-end">削除</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-slate-300 mb-3 font-semibold">使用スキル</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {TECH_OPTIONS.map((skill) => (
              <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${formData.skills.includes(skill) ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                {skill}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="text" value={customSkillInput} onChange={(e) => setCustomSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())} className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-white text-sm" placeholder="追加スキル" />
            <button type="button" onClick={addCustomSkill} className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1.5 rounded text-sm">追加</button>
          </div>
          {customSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {customSkills.map((skill) => (
                <span key={skill} className="bg-blue-600/60 text-blue-200 px-3 py-1 rounded text-sm font-semibold flex items-center gap-1">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-blue-300 hover:text-white ml-1">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-slate-300 mb-2 font-semibold">説明</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white" />
        </div>

        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">{error}</div>}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button type="submit" disabled={loading} className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-white font-bold py-2 rounded transition-colors">
            {loading ? '保存中...' : isEditMode ? '更新する' : '案件を追加'}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded transition-colors">キャンセル</button>
        </div>
      </form>
    </div>
  );
}
