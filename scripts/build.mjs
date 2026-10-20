/* =========================================================
   Pre-render build for Vercel.
   Writes real HTML for every route into dist/, so search
   engines (and anyone without JavaScript) get full content.
   Also writes sitemap.xml, robots.txt and 404.html.
   Run: node scripts/build.mjs
   ========================================================= */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'dist');

/* 1. load the same data + templates the browser uses */
const ctx = { window: {}, URLSearchParams, Intl, Date, console };
ctx.window.window = ctx.window;
vm.createContext(ctx);
for (const f of ['data', 'manifest', 'content', 'articles', 'pages']) {
  vm.runInContext(readFileSync(join(ROOT, 'js', `${f}.js`), 'utf8'), ctx, { filename: `${f}.js` });
}
const PAGES = ctx.window.PAGES;
const BASE = PAGES.BASE;
const UPDATED = ctx.window.CONTENT.updated;

/* 2. fresh output folder with static files */
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const dir of ['css', 'js', 'assets', 'og']) cpSync(join(ROOT, dir), join(OUT, dir), { recursive: true });

const shell = readFileSync(join(ROOT, 'index.html'), 'utf8');
if (!shell.includes('<!--SEO:START-->') || !shell.includes('<!--APP-->')) throw new Error('index.html is missing build markers');

const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const json = o => JSON.stringify(o).replace(/</g, '\\u003c');

function page(path, r) {
  const ogImage = `${BASE}/og/jerry-onwuka.jpg`;
  const head = [
    `<title>${attr(r.title)}</title>`,
    `<meta name="description" content="${attr(r.description)}">`,
    r.status === 404 ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${r.canonical}">`,
    `<meta property="og:type" content="${r.type === 'article' ? 'article' : 'website'}">`,
    '<meta property="og:site_name" content="Jerry Onwuka">',
    '<meta property="og:locale" content="en">',
    `<meta property="og:title" content="${attr(r.title)}">`,
    `<meta property="og:description" content="${attr(r.description)}">`,
    r.canonical ? `<meta property="og:url" content="${r.canonical}">` : '',
    `<meta property="og:image" content="${ogImage}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${attr(r.title)}">`,
    `<meta name="twitter:description" content="${attr(r.description)}">`,
    `<meta name="twitter:image" content="${ogImage}">`,
    ...(r.ld || []).map(o => `<script type="application/ld+json">${json(o)}</script>`)
  ].filter(Boolean).join('\n  ');
  return shell
    .replace(/<!--SEO:START-->[\s\S]*?<!--SEO:END-->/, head)
    .replace('<!--APP-->', r.html);
}

/* 3. one index.html per route */
const routes = PAGES.routes();
for (const path of routes) {
  const r = PAGES.resolve(path, new URLSearchParams());
  if (r.status !== 200) throw new Error(`Route did not resolve: ${path}`);
  const h1s = (r.html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) throw new Error(`${path} has ${h1s} <h1> elements`);
  const dir = join(OUT, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(path, r));
}

/* 4. 404 */
writeFileSync(join(OUT, '404.html'), page('/404/', PAGES.resolve('/404/')));

/* 5. sitemap + robots */
const urls = routes.map(p => `  <url>\n    <loc>${BASE}${p}</loc>\n    <lastmod>${UPDATED}</lastmod>\n  </url>`).join('\n');
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n# Vercel internals\nDisallow: /_vercel/\n\nSitemap: ${BASE}/sitemap.xml\n`);

if (!existsSync(join(OUT, 'assets', 'Jerry-Onwuka-CV.pdf'))) console.warn('warning: CV PDF missing');
console.log(`Built ${routes.length} pages + 404, sitemap.xml and robots.txt into dist/`);
