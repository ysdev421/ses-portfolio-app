import { useEffect, useState } from 'react';
import { createInterviewLog, getInterviewLogs, updateInterviewLog } from '../services/firestoreService';
import { normalizeDateString, toYmd, toSlashDate } from '../utils/date';
import CustomDateInput from './CustomDateInput';

const RESULT_OPTIONS = ['pending', 'passed', 'failed', 'other'];
const RESULT_LABELS = {
  pending: '選考中',
  passed: '合格',
  failed: '不合格',
  other: 'その他',
};

const INITIAL_FORM = {
  interviewDate: toYmd(new Date()),
  company: '',
  position: '',
  discussionSummary: '',
  result: 'pending',
  interestLevel: 3,
  questionsAsked: '',
  jobSummary: '',
};

export default function InterviewLogSection({ user }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        setError('');
        const data = await getInterviewLogs(user.uid);
        setLogs(data);
      } catch (err) {
        setError(err.message || '面談日記の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId('');
    setError('');
    setFormData({ ...INITIAL_FORM, interviewDate: toYmd(new Date()) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;

    const normalizedDate = normalizeDateString(formData.interviewDate);
    if (!normalizedDate || !formData.company.trim() || !formData.discussionSummary.trim()) {
      setError('面談日・会社名・面談内容は必須です');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const payload = {
        interviewDate: normalizedDate,
        company: formData.company.trim(),
        position: formData.position.trim(),
        discussionSummary: formData.discussionSummary.trim(),
        result: formData.result,
        interestLevel: Number(formData.interestLevel) || 3,
        questionsAsked: formData.questionsAsked.trim(),
        jobSummary: formData.jobSummary.trim(),
      };

      if (editingId) {
        await updateInterviewLog(editingId, payload);
        setLogs((prev) => prev.map((log) => (log.id === editingId ? { ...log, ...payload } : log)));
      } else {
        const id = await createInterviewLog(user.uid, payload);
        setLogs((prev) => [{ id, ...payload }, ...prev]);
      }

      resetForm();
    } catch (err) {
      setError(err.message || '面談日記の保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (log) => {
    setError('');
    setEditingId(log.id);
    setFormData({
      interviewDate: normalizeDateString(log.interviewDate) || toYmd(new Date()),
      company: log.company || '',
      position: log.position || '',
      discussionSummary: log.discussionSummary || '',
      result: log.result || 'pending',
      interestLevel: Number(log.interestLevel) || 3,
      questionsAsked: log.questionsAsked || '',
      jobSummary: log.jobSummary || '',
    });
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 sm:p-6 space-y-4">
      <div>
        <h3 className="text-xl font-serif font-bold text-amber-400">面談日記</h3>
        <p className="text-slate-400 text-sm mt-1">どこを受けたか、何を話したか、合否や質問内容を記録します。</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 text-sm mb-1">面談日 *</label>
            <CustomDateInput
              value={formData.interviewDate}
              onValueChange={(nextValue) => setFormData((prev) => ({ ...prev, interviewDate: nextValue }))}
              required
              inputClassName="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              buttonClassName="bg-slate-600 hover:bg-slate-500 text-white text-xs px-3 py-2 rounded shrink-0"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm mb-1">受けた会社名 *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="受けた会社名"
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="ポジション / 職種"
            className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
          />
          <select
            name="result"
            value={formData.result}
            onChange={handleChange}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
          >
            {RESULT_OPTIONS.map((result) => (
              <option key={result} value={result}>
                {RESULT_LABELS[result] || result}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-slate-300 text-sm mb-2">希望度（★5）</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, interestLevel: value }))}
                className={`text-2xl leading-none transition-colors ${value <= Number(formData.interestLevel) ? 'text-amber-400' : 'text-slate-500'}`}
                aria-label={`希望度 ${value}`}
              >
                ★
              </button>
            ))}
            <span className="text-slate-400 text-sm">{formData.interestLevel}/5</span>
          </div>
        </div>

        <textarea
          name="discussionSummary"
          value={formData.discussionSummary}
          onChange={handleChange}
          rows={3}
          placeholder="何を話したか（面談内容）"
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
          required
        />

        <textarea
          name="questionsAsked"
          value={formData.questionsAsked}
          onChange={handleChange}
          rows={2}
          placeholder="質問した内容"
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
        />

        <textarea
          name="jobSummary"
          value={formData.jobSummary}
          onChange={handleChange}
          rows={2}
          placeholder="業務内容メモ"
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
        />

        {error && <div className="bg-red-700/20 border border-red-600 text-red-200 rounded px-3 py-2 text-sm">{error}</div>}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-white font-semibold px-4 py-2 rounded"
          >
            {saving ? '保存中...' : editingId ? '面談日記を更新' : '面談日記を追加'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-slate-600 hover:bg-slate-500 text-white font-semibold px-4 py-2 rounded"
            >
              編集をキャンセル
            </button>
          )}
        </div>
      </form>

      <div className="pt-2 border-t border-slate-700">
        <h4 className="text-slate-300 font-semibold mb-2">履歴</h4>
        {loading ? (
          <p className="text-slate-400 text-sm">読み込み中...</p>
        ) : logs.length === 0 ? (
          <p className="text-slate-400 text-sm">面談日記はまだありません。</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="bg-slate-700/60 border border-slate-600 rounded p-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1">
                  <span>{toSlashDate(log.interviewDate)}</span>
                  <span className="bg-slate-800 border border-slate-600 rounded px-2 py-0.5 text-slate-300">
                    {RESULT_LABELS[log.result] || log.result || RESULT_LABELS.pending}
                  </span>
                  <span className="text-amber-400">{'★'.repeat(Math.max(1, Math.min(5, Number(log.interestLevel) || 3)))}</span>
                </div>
                <p className="text-white font-semibold">{log.company}</p>
                {log.position && <p className="text-slate-300 text-sm mt-1">{log.position}</p>}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => startEdit(log)}
                    className="text-sm text-amber-300 hover:text-amber-200 underline"
                  >
                    編集
                  </button>
                </div>
                <p className="text-slate-200 text-sm mt-2 whitespace-pre-wrap">{log.discussionSummary}</p>
                {log.questionsAsked && <p className="text-slate-300 text-sm mt-2 whitespace-pre-wrap">Q: {log.questionsAsked}</p>}
                {log.jobSummary && <p className="text-slate-300 text-sm mt-1 whitespace-pre-wrap">業務: {log.jobSummary}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
