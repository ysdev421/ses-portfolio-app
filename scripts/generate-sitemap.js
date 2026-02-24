const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const guidesFile = path.join(projectRoot, 'src', 'data', 'guides.js');
const outputFile = path.join(projectRoot, 'public', 'sitemap.xml');
const siteUrl = process.env.SITE_URL || 'https://ses-portfolio-app.web.app';

const fileText = fs.readFileSync(guidesFile, 'utf8');
const slugMatches = [...fileText.matchAll(/slug:\s*'([^']+)'/g)];
const slugs = slugMatches.map((match) => match[1]);

const staticPaths = ['/', '/demo', '/news', '/guides'];
const guidePaths = slugs.map((slug) => `/guides/${slug}`);
const allPaths = [...staticPaths, ...guidePaths];

const renderUrl = (loc, changefreq, priority) => `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...allPaths.map((pathName) => {
    const fullUrl = `${siteUrl}${pathName}`;
    if (pathName === '/') return renderUrl(fullUrl, 'weekly', '1.0');
    if (pathName === '/demo' || pathName === '/news' || pathName === '/guides') {
      return renderUrl(fullUrl, 'weekly', '0.9');
    }
    return renderUrl(fullUrl, 'monthly', '0.8');
  }),
  '</urlset>',
  '',
];

fs.writeFileSync(outputFile, lines.join('\n'), 'utf8');
console.log(`sitemap generated: ${outputFile}`);
