export default function LandingPage({ onStartSignup, onStartLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <main className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/40 mb-5">
              SESエンジニア向け
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold leading-tight">
              案件実績を、<br />
              面談で語れる武器に。
            </h1>
            <p className="text-slate-300 mt-5 leading-relaxed">
              参画した案件・担当工程・スキルをまとめて記録。あとから迷わず、経歴説明や面談準備に使える状態を作ります。
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <button
                onClick={onStartSignup}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded transition-colors"
              >
                無料で新規登録
              </button>
              <button
                onClick={onStartLogin}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-3 rounded transition-colors"
              >
                ログイン
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-serif font-bold text-amber-400 mb-4">このサービスでできること</h2>
            <div className="space-y-3">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="font-semibold">案件ごとの実績管理</p>
                <p className="text-slate-400 text-sm mt-1">期間・役割・商流・スキルを案件単位で整理。</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="font-semibold">日記で具体的な業務を蓄積</p>
                <p className="text-slate-400 text-sm mt-1">「何をやったか」を日次で残して、面談時に再利用。</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="font-semibold">キャリアシート出力</p>
                <p className="text-slate-400 text-sm mt-1">CSV（Excel）や印刷（PDF保存）で提出用にまとめられる。</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
