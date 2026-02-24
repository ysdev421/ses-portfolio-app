import PublicHeader from '../components/PublicHeader';
import { guideMap } from '../data/guides';
import { useSeo } from '../utils/seo';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

export default function GuideArticlePage({
  slug,
  onNavigatePublic,
  onStartLogin,
  onStartSignup,
}) {
  const article = guideMap[slug];

  useSeo({
    title: article ? `${article.title} | SESキャリア記録` : '記事が見つかりません | SESキャリア記録',
    description: article
      ? article.description
      : '指定された記事は見つかりませんでした。ガイド一覧から別の記事をご確認ください。',
    path: article ? `/guides/${article.slug}` : '/guides',
    jsonLd: article
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          dateModified: article.updatedAt,
          inLanguage: 'ja',
          author: {
            '@type': 'Organization',
            name: 'SESキャリア記録',
          },
        }
      : null,
  });

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <PublicHeader
          onNavigatePublic={onNavigatePublic}
          onStartLogin={onStartLogin}
          onStartSignup={onStartSignup}
        />
        <div className="flex items-center justify-center px-4 pt-20">
          <div className="text-center">
            <p className="text-slate-300">記事が見つかりませんでした。</p>
            <button
              onClick={() => onNavigatePublic('/guides')}
              className="mt-4 text-amber-400 hover:text-amber-300 font-semibold"
            >
              ガイド一覧へ戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <PublicHeader
        onNavigatePublic={onNavigatePublic}
        onStartLogin={onStartLogin}
        onStartSignup={onStartSignup}
      />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <nav className="text-xs text-slate-400">
          <button onClick={() => onNavigatePublic('/')} className="hover:text-slate-200">ホーム</button>
          <span> {'>'} </span>
          <button onClick={() => onNavigatePublic('/guides')} className="hover:text-slate-200">ガイド</button>
          <span> {'>'} </span>
          <span>{article.title}</span>
        </nav>

        <article className="mt-5">
          <p className="text-amber-300 text-sm">{article.keyword}</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-400 mt-2">{article.title}</h1>
          <p className="text-slate-300 mt-4">{article.description}</p>
          <p className="text-xs text-slate-400 mt-2">
            更新日: {formatDate(article.updatedAt)} ・ 読了目安: {article.readingMinutes}分
          </p>

          <div className="mt-8 space-y-6">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold">{section.heading}</h2>
                <p className="text-slate-300 mt-2 leading-7">{section.body}</p>
              </section>
            ))}
          </div>
        </article>

        <section className="mt-10 rounded-lg border border-slate-700 bg-slate-800 p-5">
          <h2 className="text-lg font-bold text-amber-400">関連記事</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {article.relatedSlugs.map((related) => (
              <button
                key={related}
                onClick={() => onNavigatePublic(`/guides/${related}`)}
                className="bg-slate-700 hover:bg-slate-600 text-sm px-3 py-1 rounded"
              >
                {guideMap[related]?.title || related}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-5">
          <h2 className="text-lg font-bold text-amber-300">実績管理を始める</h2>
          <p className="text-sm text-amber-100 mt-2">
            職務経歴書や面談対策は、日々の実績記録があると精度が上がります。無料登録して記録を蓄積してください。
          </p>
          <button
            onClick={onStartSignup}
            className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded text-sm font-semibold"
          >
            無料で新規登録
          </button>
        </section>
      </main>
    </div>
  );
}
