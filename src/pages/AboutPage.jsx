import PublicHeader from '../components/PublicHeader';
import { useSeo } from '../utils/seo';

const CONTACT_EMAIL = process.env.REACT_APP_CONTACT_EMAIL || '';
const TECHCLIPS_AFF_URL =
  process.env.REACT_APP_AFF_TECHCLIPS_URL || 'https://agent.tech-clips.com/lp_aff';

export default function AboutPage({ onNavigatePublic, onStartLogin, onStartSignup }) {
  useSeo({
    title: '運営者情報 | SESキャリア記録',
    description: 'SESキャリア記録の開発背景、提供価値、連絡先を掲載しています。',
    path: '/about',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: '運営者情報',
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

      <main className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-6">
        <section className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h1 className="text-3xl font-serif font-bold text-amber-400">運営者情報</h1>
          <p className="text-slate-300 mt-3 text-sm leading-7">
            SESキャリア記録は、SESエンジニアの案件経験や面談ログを、次の行動に再利用できる形で残すために開発しています。
          </p>
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-bold text-amber-300">このサービスで目指していること</h2>
          <ul className="mt-3 text-sm text-slate-300 space-y-2">
            <li>経歴情報を時系列で蓄積し、面談準備を短縮する</li>
            <li>技術スタックごとの経験期間を可視化する</li>
            <li>職務経歴書に再利用できるデータを整える</li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-bold text-amber-300">技術構成</h2>
          <p className="mt-3 text-sm text-slate-300">
            React / Firebase / Tailwind CSS を中心に構築しています。
          </p>
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-bold text-amber-300">PR（アフィリエイト）</h2>
          <p className="mt-3 text-sm text-slate-300">
            本サイトには、広告を含むリンクがあります。以下は提携中プログラムの紹介です。
          </p>
          <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800 p-4">
            <p className="text-white font-semibold">TechClipsエージェント</p>
            <p className="text-slate-300 text-sm mt-2">
              ITエンジニア向け転職エージェント。求人は事業会社中心で、年収アップを目指す方向け。
            </p>
            <a
              className="inline-block mt-3 text-amber-300 hover:text-amber-200"
              href={TECHCLIPS_AFF_URL}
              target="_blank"
              rel="noopener noreferrer sponsored nofollow"
            >
              公式ページを見る
            </a>
            <p className="text-slate-500 text-xs mt-2">
              ※成果条件・対象は広告主ページの最新情報をご確認ください。
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-6">
          <h2 className="text-xl font-bold text-amber-300">お問い合わせ</h2>
          {CONTACT_EMAIL ? (
            <a className="inline-block mt-3 text-amber-100 hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          ) : (
            <p className="mt-3 text-sm text-amber-100">
              連絡先メールは `REACT_APP_CONTACT_EMAIL` を設定してください。
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
