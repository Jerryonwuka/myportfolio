# Jerry Onwuka: portfolio site

Static site with a pre-render build, so every page ships as real HTML for search engines.

## Run locally

    node scripts/build.mjs     # writes dist/ (42 pages, 404, sitemap.xml, robots.txt)
    node scripts/serve.mjs     # serves dist/ on http://localhost:8765

## Deploy

Push to `main`. Vercel reads `vercel.json`: it runs `node scripts/build.mjs` and serves `dist/`
with trailing-slash URLs and the redirect map. No npm install needed.

## Editing content

- `js/data.js`: projects, experience, services, pricing, socials
- `js/content.js`: service pages, process page, privacy page
- `js/articles.js`: Insights articles
- `js/pages.js`: page templates, page titles/descriptions, structured data, route list
- `js/app.js`: animations, router, interactions (browser only)

After deploying, submit https://www.jerryonwuka.cc/sitemap.xml in Google Search Console.
