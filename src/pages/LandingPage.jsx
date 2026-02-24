import PublicHeader from '../components/PublicHeader';
import { useSeo } from '../utils/seo';

const strengths = [
  {
    no: '01',
    title: '経歴情報が積み上がる',
    desc: '案件・日報・面談ログを時系列で蓄積し、いつでも振り返れます。',
  },
  {
    no: '02',
    title: '技術スタックごとの経験が見える',
    desc: '技術別の経験期間を可視化し、強みと不足を明確にできます。',
  },
  {
    no: '03',
    title: '面談・職務経歴書に再利用できる',
    desc: '記録した情報をそのまま次の行動に転用できるので準備が早くなります。',
  },
];

const CONTACT_EMAIL = process.env.REACT_APP_CONTACT_EMAIL || '';

export default function LandingPage({
  onStartSignup,
  onStartLogin,
  onOpenDemo,
  onNavigatePublic,
}) {
  useSeo({
    title: 'SESキャリア記録 | 案件・面談・キャリアを一元管理',
    description:
      'SESエンジニア向けに、案件実績・面談ログ・キャリア情報を一つにまとめるWebアプリ。',
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SESキャリア記録',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: 'ja',
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <PublicHeader
        onNavigatePublic={onNavigatePublic}
        onStartLogin={onStartLogin}
        onStartSignup={onStartSignup}
      />

      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/40 mb-5">
              SESエンジニア向け
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold leading-tight">
              案件経験を、
              <br />
              武器に変える記録へ。
            </h1>
            <p className="text-slate-300 mt-5 leading-relaxed">
              案件、日報、面談ログをつなげて管理。あとから見返せるデータが、面談・職務経歴書の精度を上げます。
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <button onClick={onStartSignup} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded">
                無料で新規登録
              </button>
              <button onClick={onOpenDemo} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded">
                体験版を見る
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-serif font-bold text-amber-400 mb-4">このサービスの強み</h2>
            <div className="space-y-3">
              {strengths.map((item) => (
                <div key={item.no} className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-start gap-3">
                  <span className="text-amber-300 text-xs font-bold bg-amber-500/20 border border-amber-500/30 rounded px-2 py-1">
                    {item.no}
                  </span>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
            <h3 className="text-xl font-serif font-bold text-amber-300">まずは触って確認</h3>
            <p className="text-amber-100 text-sm mt-3">
              文章だけでは伝わりづらいので、ログイン不要の体験版を用意しています。実際の入力体験で判断してください。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={onOpenDemo} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2 rounded">
                体験版を開く
              </button>
              <button onClick={onStartSignup} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold px-5 py-2 rounded">
                そのまま無料登録
              </button>
            </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
          <div className="flex items-center gap-4">
            <p className="text-slate-400">お問い合わせ</p>
            <button onClick={() => onNavigatePublic('/about')} className="text-slate-300 hover:text-white">
              運営者情報
            </button>
          </div>
          {CONTACT_EMAIL ? (
            <a className="text-amber-300 hover:text-amber-200" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          ) : (
            <p className="text-slate-500">
              連絡先メールは `REACT_APP_CONTACT_EMAIL` を設定してください
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
