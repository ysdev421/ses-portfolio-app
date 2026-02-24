import { useSeo } from '../utils/seo';

export default function LandingPage({ onStartSignup, onStartLogin, onOpenNews, onOpenGuides }) {
  useSeo({
    title: 'SESキャリア記録 | SESエンジニア向け案件・選考管理',
    description:
      'SESエンジニア向けに、案件の実績・面談ログ・スキル棚卸しをまとめて管理できるWebアプリです。',
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SESキャリア記録',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: 'ja',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'JPY',
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <main className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/40 mb-5">
              SESエンジニア向け
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold leading-tight">
              案件経験を、
              <br />
              武器に変える記録に。
            </h1>
            <p className="text-slate-300 mt-5 leading-relaxed">
              参画案件・日報・スキルをまとめて管理。あとから振り返って、面談や職務経歴書に使える実績を残せます。
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
              <button
                onClick={onOpenNews}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold px-6 py-3 rounded transition-colors"
              >
                ニュースを見る
              </button>
              <button
                onClick={onOpenGuides}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold px-6 py-3 rounded transition-colors"
              >
                ガイドを見る
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-serif font-bold text-amber-400 mb-4">このサービスでできること</h2>
            <div className="space-y-3">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="font-semibold">案件ごとの進捗管理</p>
                <p className="text-slate-400 text-sm mt-1">参画期間・担当工程・使用スキルを案件単位で整理。</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="font-semibold">日報で使える実績を可視化</p>
                <p className="text-slate-400 text-sm mt-1">「何をやったか」を日次で残し、面談時にすぐ提示できます。</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="font-semibold">キャリアシート出力</p>
                <p className="text-slate-400 text-sm mt-1">実績をもとに、職務経歴に転用しやすい情報を蓄積。</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
