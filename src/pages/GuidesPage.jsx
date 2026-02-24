import PublicHeader from '../components/PublicHeader';
import { guides } from '../data/guides';
import { useSeo } from '../utils/seo';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

export default function GuidesPage({ onNavigatePublic, onStartLogin, onStartSignup }) {
  useSeo({
    title: 'SESガイド一覧 | SESキャリア記録',
    description: 'SESエンジニア向けに、職務経歴書・面談対策・案件選定の実務ガイドを公開。',
    path: '/guides',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'SESガイド一覧',
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

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-400">SESガイド一覧</h1>
        <p className="text-slate-300 text-sm mt-2">
          職務経歴書、スキルシート、面談対策など、現場で使える実務ガイドを公開しています。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {guides.map((guide) => (
            <article key={guide.slug} className="rounded-lg border border-slate-700 bg-slate-800 p-5">
              <p className="text-xs text-amber-300">{guide.keyword}</p>
              <h2 className="text-lg font-bold mt-1">{guide.title}</h2>
              <p className="text-sm text-slate-300 mt-2">{guide.description}</p>
              <div className="text-xs text-slate-400 mt-3">
                更新日: {formatDate(guide.updatedAt)} ・ 読了目安: {guide.readingMinutes}分
              </div>
              <button
                onClick={() => onNavigatePublic(`/guides/${guide.slug}`)}
                className="mt-4 text-amber-400 hover:text-amber-300 text-sm font-semibold"
              >
                記事を読む →
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
