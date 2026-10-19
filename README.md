# Jerry Onwuka: portfolio site

Static site, no build step. Open it through a local server (not by double-clicking `index.html`, because videos and fonts need http):

    python3 -m http.server 8765 --directory site

Then visit http://localhost:8765

## Editing content
All text, projects, services, experience and contact details live in `js/data.js`.
- Add social links in `SITE.socials`.
- Each project's `images` value points at a folder in `assets/img/`. Image 01 is the cover.
- To add or change images, drop `.webp` files in the folder and update `js/manifest.js` (name, width, height).

## Deploying
Upload the whole `site/` folder to Netlify (drag and drop), Vercel, or GitHub Pages. Routes use `#/` hashes, so no server config is needed.

## Structure
- `index.html`: shell, loader, header, menu
- `css/style.css`: all styles
- `js/app.js`: router, smooth scroll (Lenis), GSAP animations, contour background, cursor, page templates
- `assets/video`: GoDark and Boredroom films (36 MB and 53 MB)
