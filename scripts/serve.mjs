/* Tiny static server for previewing dist/ locally (mirrors Vercel's trailing-slash + 404 behaviour). */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = +process.env.PORT || 8765;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.mp4': 'video/mp4' };
createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x'); let p = decodeURIComponent(u.pathname);
  const file = join(DIST, p);
  try {
    let s = await stat(file);
    if (s.isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(308, { Location: p + '/' + u.search }); return res.end(); }
      const f = join(file, 'index.html'); s = await stat(f);
      res.writeHead(200, { 'Content-Type': TYPES['.html'] }); return res.end(await readFile(f));
    }
    const range = req.headers.range;
    if (range && extname(file) === '.mp4') {
      const [a, b] = range.replace('bytes=', '').split('-'); const start = +a, end = b ? +b : Math.min(start + 4e6, s.size - 1);
      const buf = (await readFile(file)).subarray(start, end + 1);
      res.writeHead(206, { 'Content-Type': 'video/mp4', 'Content-Range': `bytes ${start}-${end}/${s.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': buf.length }); return res.end(buf);
    }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' }); res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] }); res.end(await readFile(join(DIST, '404.html')));
  }
}).listen(PORT, () => console.log(`Serving dist on http://localhost:${PORT}`));
