export default function ProjectDetail({ project, onBack, onEdit }) {
  if (!project) {
    return (
      <div className="text-center py-12">
        <button 
          onClick={onBack}
          className="text-amber-400 hover:text-amber-300 mb-6"
        >
          ← 戻る
        </button>
      </div>
    );
  }

  const startDate = project.startDate ? new Date(project.startDate) : null;
  const endDate = project.endDate ? new Date(project.endDate) : null;

  const formatDate = (date) => {
    if (!date) return '-';
    if (typeof date === 'string') return date;
    return new Date(date).toLocaleDateString('ja-JP');
  };

  return (
    <div>
      <button 
        onClick={onBack}
        className="text-amber-400 hover:text-amber-300 mb-6 font-semibold"
      >
        ← 案件一覧に戻る
      </button>

      {/* 案件詳細 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-4xl font-serif font-bold text-amber-400 mb-2">
              {project.projectName}
            </h2>
            <p className="text-slate-400 text-lg">会社: {project.company}</p>
          </div>
          <button
            onClick={onEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded transition-colors"
          >
            編集
          </button>
        </div>

        {/* 基本情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-6 border-t border-slate-700">
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-1">開始日</p>
            <p className="text-white text-lg">{formatDate(startDate)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-1">終了日</p>
            <p className="text-white text-lg">{formatDate(endDate) || '進行中'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-1">役職</p>
            <p className="text-white text-lg">{project.role || '未記入'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-1">実績時間</p>
            <p className="text-white text-lg">{project.workedHours || 0}時間</p>
          </div>
        </div>

        {/* スキル */}
        {project.skills && project.skills.length > 0 && (
          <div className="mb-6 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm font-semibold mb-3">使用スキル</p>
            <div className="flex flex-wrap gap-2">
              {project.skills.map(skill => (
                <span 
                  key={skill} 
                  className="bg-amber-500/20 text-amber-300 px-4 py-2 rounded font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 説明 */}
        {project.description && (
          <div className="pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm font-semibold mb-3">説明</p>
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
              {project.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
