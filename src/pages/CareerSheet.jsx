import { useEffect, useMemo, useState } from 'react';
import { getProjects } from '../services/firestoreService';

const formatDate = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const date = value?.toDate?.() || new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const csvEscape = (value) => {
  const text = String(value ?? '');
  const escaped = text.replace(/"/g, '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
};

export default function CareerSheet({ user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjects(user.uid);
        setProjects(data);
      } catch (err) {
        console.error('career sheet load error:', err);
        setError('キャリアシートの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [user?.uid]);

  const activeProjects = useMemo(
    () => projects.filter((p) => !p.endDate || new Date(p.endDate) >= new Date()),
    [projects]
  );

  const topSkills = useMemo(() => {
    const map = {};
    projects.forEach((project) => {
      (project.skills || []).forEach((skill) => {
        map[skill] = (map[skill] || 0) + 1;
      });
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [projects]);

  const handleDownloadCsv = () => {
    const header = [
      '案件名',
      '会社名',
      '開始日',
      '終了日',
      '参画状況',
      '役割',
      '商流',
      '月単価(万円)',
      'スキル',
      '概要',
    ];

    const rows = projects.map((project) => {
      const start = formatDate(project.startDate);
      const end = formatDate(project.endDate);
      const active = !project.endDate || new Date(project.endDate) >= new Date();
      return [
        project.projectName || '',
        project.company || '',
        start,
        end || '現在',
        active ? '参画中' : '終了',
        project.role || '',
        project.contractTier || '',
        project.monthlyRate || '',
        (project.skills || []).join(' / '),
        (project.description || '').replace(/\r?\n/g, ' '),
      ];
    });

    const csv = [header, ...rows]
      .map((row) => row.map(csvEscape).join(','))
      .join('\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `career-sheet-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-serif font-bold text-amber-400">キャリアシート</h2>
          <p className="text-slate-400 text-sm mt-1">面談用に案件実績を一覧表示</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadCsv}
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded transition-colors"
          >
            CSV出力（Excel）
          </button>
          <button
            onClick={() => window.print()}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded transition-colors"
          >
            印刷 / PDF保存
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-700/20 border border-red-600 text-red-200 rounded p-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">総案件数</p>
          <p className="text-3xl font-bold text-amber-400 mt-2">{projects.length}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">参画中案件</p>
          <p className="text-3xl font-bold text-green-400 mt-2">{activeProjects.length}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">主要スキル</p>
          <p className="text-sm text-slate-200 mt-2">
            {topSkills.map(([skill]) => skill).join(' / ') || '未登録'}
          </p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <h3 className="text-xl font-serif font-bold text-amber-400 mb-3">案件一覧</h3>
        {projects.length === 0 ? (
          <p className="text-slate-400">案件データがありません</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-600">
                  <th className="py-2 pr-4 text-slate-300">案件名</th>
                  <th className="py-2 pr-4 text-slate-300">会社名</th>
                  <th className="py-2 pr-4 text-slate-300">期間</th>
                  <th className="py-2 pr-4 text-slate-300">役割</th>
                  <th className="py-2 pr-4 text-slate-300">商流</th>
                  <th className="py-2 pr-4 text-slate-300">スキル</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-slate-700 align-top">
                    <td className="py-3 pr-4 text-white font-semibold">{project.projectName || '-'}</td>
                    <td className="py-3 pr-4 text-slate-300">{project.company || '-'}</td>
                    <td className="py-3 pr-4 text-slate-300">
                      {formatDate(project.startDate) || '-'} 〜 {formatDate(project.endDate) || '現在'}
                    </td>
                    <td className="py-3 pr-4 text-slate-300">{project.role || '-'}</td>
                    <td className="py-3 pr-4 text-slate-300">{project.contractTier || '-'}</td>
                    <td className="py-3 pr-4 text-slate-300">{(project.skills || []).join(', ') || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
