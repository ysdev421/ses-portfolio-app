import InterviewLogSection from '../components/InterviewLogSection';

export default function InterviewLogsPage({ user }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold text-amber-400">選考管理</h2>
        <p className="text-slate-400 text-sm mt-1">
          面談日記を記録して、選考ごとの進捗を管理します。
        </p>
      </div>
      <InterviewLogSection user={user} />
    </div>
  );
}
