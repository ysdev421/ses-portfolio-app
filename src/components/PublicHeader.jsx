export default function PublicHeader({
  onNavigatePublic,
  onStartLogin,
  onStartSignup,
  onStartDemoLogin,
}) {
  const handleTrial = onStartDemoLogin || (() => onNavigatePublic('/demo'));

  return (
    <header className="border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        <button
          className="text-amber-400 font-serif text-xl font-bold whitespace-nowrap"
          onClick={() => onNavigatePublic('/')}
        >
          SESキャリア記録
        </button>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={handleTrial}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded text-sm font-semibold"
          >
            体験版
          </button>
          <button
            onClick={() => onNavigatePublic('/news')}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3 py-2 rounded text-sm font-semibold"
          >
            ニュース
          </button>
          <button
            onClick={() => onNavigatePublic('/guides')}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3 py-2 rounded text-sm font-semibold"
          >
            ガイド
          </button>
          <button
            onClick={() => onNavigatePublic('/about')}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3 py-2 rounded text-sm font-semibold"
          >
            このサービスについて
          </button>
          <button
            onClick={onStartLogin}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm font-semibold"
          >
            ログイン
          </button>
          <button
            onClick={onStartSignup}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded text-sm font-semibold"
          >
            無料登録
          </button>
        </div>
      </div>
    </header>
  );
}
