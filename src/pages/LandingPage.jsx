import PublicHeader from '../components/PublicHeader';
import { useSeo } from '../utils/seo';

const strengths = [
  {
    no: '01',
    title: '邨梧ｭｴ諠・ｱ縺檎ｩ阪∩荳翫′繧・,
    desc: '譯井ｻｶ繝ｻ譌･蝣ｱ繝ｻ髱｢隲・Ο繧ｰ繧呈凾邉ｻ蛻励〒闢・ｩ阪＠縲√＞縺､縺ｧ繧よ険繧願ｿ斐ｌ縺ｾ縺吶・,
  },
  {
    no: '02',
    title: '謚陦薙せ繧ｿ繝・け縺斐→縺ｮ邨碁ｨ薙′隕九∴繧・,
    desc: '謚陦灘挨縺ｮ邨碁ｨ捺悄髢薙ｒ蜿ｯ隕門喧縺励∝ｼｷ縺ｿ縺ｨ荳崎ｶｳ繧呈・遒ｺ縺ｫ縺ｧ縺阪∪縺吶・,
  },
  {
    no: '03',
    title: '髱｢隲・・閨ｷ蜍咏ｵ梧ｭｴ譖ｸ縺ｫ蜀榊茜逕ｨ縺ｧ縺阪ｋ',
    desc: '險倬鹸縺励◆諠・ｱ繧偵◎縺ｮ縺ｾ縺ｾ谺｡縺ｮ陦悟虚縺ｫ霆｢逕ｨ縺ｧ縺阪ｋ縺ｮ縺ｧ貅門ｙ縺梧掠縺上↑繧翫∪縺吶・,
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
    title: 'SES繧ｭ繝｣繝ｪ繧｢險倬鹸 | 譯井ｻｶ繝ｻ髱｢隲・・繧ｭ繝｣繝ｪ繧｢繧剃ｸ蜈・ｮ｡逅・,
    description:
      'SES繧ｨ繝ｳ繧ｸ繝九い蜷代￠縺ｫ縲∵｡井ｻｶ螳溽ｸｾ繝ｻ髱｢隲・Ο繧ｰ繝ｻ繧ｭ繝｣繝ｪ繧｢諠・ｱ繧剃ｸ縺､縺ｫ縺ｾ縺ｨ繧√ｋWeb繧｢繝励Μ縲・,
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SES繧ｭ繝｣繝ｪ繧｢險倬鹸',
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
        onStartDemoLogin={onOpenDemo}
      />

      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/40 mb-5">
              SES繧ｨ繝ｳ繧ｸ繝九い蜷代￠
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold leading-tight">
              譯井ｻｶ邨碁ｨ薙ｒ縲・              <br />
              豁ｦ蝎ｨ縺ｫ螟峨∴繧玖ｨ倬鹸縺ｸ縲・            </h1>
            <p className="text-slate-300 mt-5 leading-relaxed">
              譯井ｻｶ縲∵律蝣ｱ縲・擇隲・Ο繧ｰ繧偵▽縺ｪ縺偵※邂｡逅・ゅ≠縺ｨ縺九ｉ隕玖ｿ斐○繧九ョ繝ｼ繧ｿ縺後・擇隲・・閨ｷ蜍咏ｵ梧ｭｴ譖ｸ縺ｮ邊ｾ蠎ｦ繧剃ｸ翫￡縺ｾ縺吶・            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <button onClick={onStartSignup} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded">
                辟｡譁吶〒譁ｰ隕冗匳骭ｲ
              </button>
              <button onClick={onOpenDemo} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded">
                菴馴ｨ鍋沿繧定ｦ九ｋ
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-serif font-bold text-amber-400 mb-4">縺薙・繧ｵ繝ｼ繝薙せ縺ｮ蠑ｷ縺ｿ</h2>
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
            <h3 className="text-xl font-serif font-bold text-amber-300">縺ｾ縺壹・隗ｦ縺｣縺ｦ遒ｺ隱・/h3>
            <p className="text-amber-100 text-sm mt-3">
              繝ｭ繧ｰ繧､繝ｳ荳崎ｦ√・菴馴ｨ鍋沿繧堤畑諢上＠縺ｦ縺・∪縺吶ょｮ滄圀縺ｮ蜈･蜉帑ｽ馴ｨ薙〒蛻､譁ｭ縺励※縺上□縺輔＞縲・            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={onOpenDemo} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2 rounded">
                菴馴ｨ鍋沿繧帝幕縺・              </button>
              <button onClick={onStartSignup} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold px-5 py-2 rounded">
                縺昴・縺ｾ縺ｾ辟｡譁咏匳骭ｲ
              </button>
            </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
          <div className="flex items-center gap-4">
            <p className="text-slate-400">縺雁撫縺・粋繧上○</p>
            <button onClick={() => onNavigatePublic('/about')} className="text-slate-300 hover:text-white">
              驕句霧閠・ュ蝣ｱ
            </button>
          </div>
          {CONTACT_EMAIL ? (
            <a className="text-amber-300 hover:text-amber-200" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          ) : (
            <p className="text-slate-500">
              騾｣邨｡縺ｯ縺雁撫縺・粋繧上○繝壹・繧ｸ縺九ｉ縺企｡倥＞縺励∪縺・            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

