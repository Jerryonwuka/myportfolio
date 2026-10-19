/* =========================================================
   Jerry Onwuka — portfolio engine
   Router · smooth scroll · loader · pixel transitions ·
   contour field · cursor · reveals · page templates
   ========================================================= */
(() => {
  const S = window.SITE, P = window.PROJECTS, C = window.CATEGORIES, M = window.MANIFEST;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const app = $('#app');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile = () => innerWidth < 900;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- helpers ---------- */
  const img = (g, i = 0) => M[g] && M[g][i] ? `assets/img/${g}/${M[g][i][0]}` : '';
  const dims = (g, i) => M[g][i];
  const bySlug = s => P.find(p => p.slug === s);
  const thumb = p => p.thumb || img(p.images);
  const catOf = id => C.find(c => c.id === id);
  const inCat = id => P.filter(p => p.cat === id);
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const host = u => u ? u.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* split into masked words (line-like reveal) */
  function splitWords(el) {
    if (el.dataset.split) return $$('.sw > span', el);
    el.dataset.split = 1;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'sw';
            const i = document.createElement('span'); i.textContent = part; w.appendChild(i); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('sw') && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    return $$('.sw > span', el);
  }
  /* split into chars */
  function splitChars(el) {
    if (el.dataset.splitc) return $$('.sc', el);
    el.dataset.splitc = 1;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(word => {
            if (!word) return;
            if (/^\s+$/.test(word)) { frag.appendChild(document.createTextNode(' ')); return; }
            const wr = document.createElement('span'); wr.className = 'scw';
            [...word].forEach(ch => { const s = document.createElement('span'); s.className = 'sc'; s.textContent = ch; wr.appendChild(s); });
            frag.appendChild(wr);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return $$('.sc', el);
  }
  /* split into plain words for scrub-highlight */
  function splitPlain(el) {
    if (el.dataset.splitp) return $$('.w', el);
    el.dataset.splitp = 1;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w'; w.textContent = part; frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return $$('.w', el);
  }

  /* odometer: rolling digit columns */
  function odometer(el) {
    const v = String(el.dataset.count);
    el.innerHTML = [...v].map(d => `<span class="odo"><span class="odo__col">${'0123456789'.repeat(2).split('').map(n => `<span>${n}</span>`).join('')}</span></span>`).join('');
    return $$('.odo__col', el).map((c, i) => ({ c, d: +v[i] }));
  }
  /* scramble text in, for small numeric labels */
  function scramble(el, dur = .8) {
    const final = el.textContent, chars = '0123456789#%/×+';
    const o = { p: 0 };
    gsap.to(o, { p: 1, duration: dur, ease: 'none', onUpdate: () => {
      el.textContent = [...final].map((ch, i) => (ch === ' ' || i / final.length < o.p) ? ch : chars[Math.floor(Math.random() * chars.length)]).join('');
    }, onComplete: () => { el.textContent = final; } });
  }

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const scrollTop = () => { lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : scrollTo(0, 0); };

  /* scroll velocity (for marquees / skew) */
  let velocity = 0, lastY = scrollY;
  gsap.ticker.add(() => { const y = scrollY; velocity += ((y - lastY) - velocity) * .2; lastY = y; });

  /* header hide on scroll */
  const header = $('#header');
  let hdrY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (document.body.classList.contains('menu-open')) return;
    header.classList.toggle('is-hidden', y > hdrY && y > 200);
    document.body.classList.toggle('hdr-hidden', header.classList.contains('is-hidden'));
    header.classList.toggle('is-scrolled', y > 40);
    hdrY = y;
  }, { passive: true });

  /* ---------- clock ---------- */
  const clock = $('#clock');
  const tick = () => { clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: S.timezone }).format(new Date()); };
  tick(); setInterval(tick, 1000);
  $('#menuEmail').textContent = S.email; $('#menuEmail').href = 'mailto:' + S.email; $('#menuPhone').textContent = S.phone;

  /* =========================================================
     CONTOUR FIELD (living topographic lines, bends to cursor)
     ========================================================= */
  const field = (() => {
    const cv = $('#contours'), ctx = cv.getContext('2d');
    const perm = new Uint8Array(512); const p = [...Array(256).keys()].sort(() => Math.random() - .5);
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
    const fade = t => t * t * t * (t * (t * 6 - 15) + 10), lerp = (a, b, t) => a + (b - a) * t;
    const grad = (h, x, y, z) => { const u = (h & 15) < 8 ? x : y, v = (h & 15) < 4 ? y : ((h & 15) === 12 || (h & 15) === 14 ? x : z); return ((h & 1) ? -u : u) + ((h & 2) ? -v : v); };
    const noise = (x, y, z) => {
      const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
      x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
      const u = fade(x), v = fade(y), w = fade(z);
      const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z, B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
      return lerp(lerp(lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u), lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u), v),
        lerp(lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u), lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u), v), w);
    };
    let W, H, cell, cols, rows, vals, dpr;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, s: 0, ts: 0 };
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
      cell = W < 760 ? 22 : 18; cols = Math.ceil(W / cell) + 1; rows = Math.ceil(H / cell) + 1; vals = new Float32Array(cols * rows);
    };
    resize(); addEventListener('resize', resize);
    addEventListener('pointermove', e => { mouse.tx = e.clientX; mouse.ty = e.clientY; mouse.ts = 1; });
    document.addEventListener('pointerleave', () => { mouse.ts = 0; });
    const levels = [-.45, -.3, -.15, 0, .15, .3, .45, .6];
    let t = Math.random() * 10, frame = 0, visible = true, color = 'rgba(204,255,0,.09)';
    const draw = () => {
      frame++;
      if (!visible || (frame & 1)) return; // ~30fps
      t += reduce ? 0 : .0035;
      mouse.x += (mouse.tx - mouse.x) * .08; mouse.y += (mouse.ty - mouse.y) * .08; mouse.s += (mouse.ts - mouse.s) * .05;
      const sc = .0026, scrollOff = scrollY * .0006, R = 220 * 220;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const x = i * cell, y = j * cell;
        let v = noise(x * sc, y * sc + scrollOff, t) + .5 * noise(x * sc * 2.1, y * sc * 2.1 + scrollOff, t * 1.3);
        const dx = x - mouse.x, dy = y - mouse.y; v += mouse.s * .55 * Math.exp(-(dx * dx + dy * dy) / R);
        vals[j * cols + i] = v;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1; ctx.strokeStyle = color; ctx.beginPath();
      for (const L of levels) {
        for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
          const a = vals[j * cols + i], b = vals[j * cols + i + 1], c = vals[(j + 1) * cols + i + 1], d = vals[(j + 1) * cols + i];
          const idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
          if (idx === 0 || idx === 15) continue;
          const x = i * cell, y = j * cell;
          const top = [x + cell * (L - a) / (b - a), y], right = [x + cell, y + cell * (L - b) / (c - b)],
            bottom = [x + cell * (L - d) / (c - d), y + cell], left = [x, y + cell * (L - a) / (d - a)];
          const seg = (p1, p2) => { ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); };
          switch (idx) {
            case 1: case 14: seg(left, bottom); break;
            case 2: case 13: seg(bottom, right); break;
            case 3: case 12: seg(left, right); break;
            case 4: case 11: seg(top, right); break;
            case 5: seg(left, top); seg(bottom, right); break;
            case 6: case 9: seg(top, bottom); break;
            case 7: case 8: seg(left, top); break;
            case 10: seg(left, bottom); seg(top, right); break;
          }
        }
      }
      ctx.stroke();
    };
    gsap.ticker.add(draw);
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
    return { setColor: c => { color = c; } };
  })();

  /* =========================================================
     CURSOR
     ========================================================= */
  const cursor = $('#cursor'), dot = $('#cursorDot'), cLabel = $('#cursorLabel');
  const preview = $('#preview'), previewImg = $('#previewImg'), previewInner = $('.preview__inner');
  if (fine) {
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringX = gsap.quickTo(cursor, 'x', { duration: .5, ease: 'power3' }), ringY = gsap.quickTo(cursor, 'y', { duration: .5, ease: 'power3' });
    const dotX = gsap.quickTo(dot, 'x', { duration: .08 }), dotY = gsap.quickTo(dot, 'y', { duration: .08 });
    const pvX = gsap.quickTo(preview, 'x', { duration: .7, ease: 'power3' }), pvY = gsap.quickTo(preview, 'y', { duration: .7, ease: 'power3' });
    let lastX = 0, rot = gsap.quickTo(previewInner, 'rotation', { duration: .6, ease: 'power3' });
    addEventListener('pointermove', e => {
      pos.x = e.clientX; pos.y = e.clientY;
      ringX(pos.x); ringY(pos.y); dotX(pos.x); dotY(pos.y); pvX(pos.x); pvY(pos.y);
      rot(gsap.utils.clamp(-12, 12, (pos.x - lastX) * .6)); lastX = pos.x;
    });
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor], a, button');
      cursor.classList.remove('is-link', 'is-view');
      if (!t) { cLabel.textContent = ''; return; }
      const mode = t.dataset.cursor || 'link';
      if (mode === 'view' || mode === 'play') { cursor.classList.add('is-view'); cLabel.textContent = t.dataset.label || (mode === 'play' ? 'PLAY' : 'VIEW'); }
      else cursor.classList.add('is-link');
    });
  }
  /* hide the floating preview once the hovered row scrolls away */
  let pvEl = null, mx = -1, my = -1;
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  const pvCheck = () => {
    const under = mx < 0 ? null : document.elementFromPoint(mx, my);
    const el = under && under.closest('[data-preview]');
    if (el !== pvEl) {
      pvEl = el;
      if (el) { previewImg.src = el.dataset.preview; gsap.to(previewInner, { scale: 1, duration: .6, ease: 'expo.out', overwrite: 'auto' }); }
      else gsap.to(previewInner, { scale: 0, duration: .4, ease: 'expo.out', overwrite: 'auto' });
    }
  };
  addEventListener('scroll', () => { clearTimeout(pvCheck._t); pvCheck._t = setTimeout(pvCheck, 60); }, { passive: true });
  function bindPreview(scope) {
    if (!fine) return;
    $$('[data-preview]', scope).forEach(el => {
      el.addEventListener('mouseenter', pvCheck);
      el.addEventListener('mouseleave', () => setTimeout(pvCheck, 0));
    });
  }
  function bindMagnetic(scope) {
    if (!fine) return;
    $$('[data-magnetic]', scope).forEach(el => {
      if (el._mag) return; el._mag = 1;
      const xTo = gsap.quickTo(el, 'x', { duration: .6, ease: 'elastic.out(1,.4)' }), yTo = gsap.quickTo(el, 'y', { duration: .6, ease: 'elastic.out(1,.4)' });
      el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .35); yTo((e.clientY - r.top - r.height / 2) * .35); });
      el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }
  bindMagnetic(document);

  /* theme: dark (default) / light */
  const root = document.documentElement;
  const setTheme = t => { root.dataset.theme = t; field.setColor(t === 'light' ? 'rgba(10,18,48,.09)' : 'rgba(204,255,0,.09)'); $('meta[name=theme-color]').content = t === 'light' ? '#F3F4EE' : '#060C1E'; try { localStorage.setItem('jo-theme', t); } catch (e) {} };
  let saved = null; try { saved = localStorage.getItem('jo-theme'); } catch (e) {}
  setTheme(saved || 'dark');
  $('#themeBtn').addEventListener('click', e => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    const wipe = document.createElement('div'); wipe.className = 'theme-wipe'; document.body.appendChild(wipe);
    const r = e.currentTarget.getBoundingClientRect(), at = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
    gsap.timeline({ onComplete: () => wipe.remove() })
      .fromTo(wipe, { clipPath: `circle(0% at ${at})` }, { clipPath: `circle(150% at ${at})`, duration: .7, ease: 'expo.inOut' })
      .call(() => setTheme(next))
      .to(wipe, { clipPath: `circle(0% at ${at})`, duration: .7, ease: 'expo.inOut' });
  });

  /* lightbox for certificates */
  const lb = $('#lightbox');
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-lightbox]');
    if (t) { $('img', lb).src = t.dataset.lightbox; $('figcaption', lb).textContent = t.dataset.caption || ''; lb.classList.add('on'); lenis && lenis.stop(); gsap.fromTo($('figure', lb), { scale: .9, opacity: 0 }, { scale: 1, opacity: 1, duration: .6, ease: 'expo.out' }); return; }
    if (e.target.closest('#lightbox')) { lb.classList.remove('on'); lenis && lenis.start(); }
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('on')) { lb.classList.remove('on'); lenis && lenis.start(); } });

  /* =========================================================
     PIXEL TRANSITION
     ========================================================= */
  const px = $('#pixels'); let cells = [];
  const buildPixels = () => {
    const cols = innerWidth < 760 ? 8 : 16, size = innerWidth / cols, rows = Math.ceil(innerHeight / size);
    px.style.gridTemplateColumns = `repeat(${cols}, 1fr)`; px.style.gridTemplateRows = `repeat(${rows}, ${size}px)`;
    px.innerHTML = ''; cells = [];
    for (let i = 0; i < cols * rows; i++) { const c = document.createElement('i'); if (Math.random() < .12) c.className = 'l'; px.appendChild(c); cells.push(c); }
  };
  buildPixels(); addEventListener('resize', () => { clearTimeout(buildPixels._t); buildPixels._t = setTimeout(buildPixels, 200); });
  const cover = () => new Promise(res => { px.classList.add('on'); gsap.to(cells, { opacity: 1, duration: .001, stagger: { amount: .5, from: 'random' }, onComplete: res }); });
  const uncover = () => new Promise(res => { gsap.to(cells, { opacity: 0, duration: .001, stagger: { amount: .55, from: 'random' }, onComplete: () => { px.classList.remove('on'); res(); } }); });

  /* =========================================================
     MENU
     ========================================================= */
  const menu = $('#menu'), menuBtn = $('#menuBtn'); let menuOpen = false;
  const toggleMenu = (open = !menuOpen) => {
    menuOpen = open; document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open); menu.setAttribute('aria-hidden', !open);
    header.classList.remove('is-hidden');
    const r = menuBtn.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (open) {
      lenis && lenis.stop();
      gsap.set(menu, { visibility: 'visible' });
      gsap.fromTo(menu, { clipPath: `circle(0% at ${cx}px ${cy}px)` }, { clipPath: `circle(150% at ${cx}px ${cy}px)`, duration: 1, ease: 'expo.inOut' });
      gsap.fromTo($$('.menu__links b'), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: .06, delay: .35 });
      gsap.fromTo($$('.menu__side > *'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8, stagger: .05, delay: .5 });
    } else {
      lenis && lenis.start();
      gsap.to(menu, { clipPath: `circle(0% at ${cx}px ${cy}px)`, duration: .8, ease: 'expo.inOut', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
    }
  };
  menuBtn.addEventListener('click', () => toggleMenu());
  $$('.menu a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) toggleMenu(false); });

  /* =========================================================
     SHARED PARTIALS
     ========================================================= */
  const marquee = (items, cls = '') => `
    <div class="marquee ${cls}" data-marquee>
      <div class="marquee__track">${[0, 1].map(() => `<div class="marquee__item">${items.map(t => `<span>${t}</span><i>✦</i>`).join('')}</div>`).join('')}</div>
    </div>`;

  const footer = () => `
    <footer class="footer" id="contact">
      <div class="footer__cta">
        <p class="mono dim" data-reveal="fade">[ HAVE AN IDEA? ]</p>
        <h2 class="display" data-reveal="chars">Let's build <span class="serif">it</span></h2>
        <a class="footer__mail" href="mailto:${S.email}" data-cursor="link" data-reveal="fade">${S.email}</a>
        <div class="footer__actions" data-reveal="fade">
          <a class="btn btn--accent btn--lg" href="mailto:${S.email}?subject=Project%20enquiry" data-magnetic><span>Start a project</span><i>↗</i></a>
          <a class="btn btn--ghost btn--lg" href="tel:${S.phone.replace(/\s/g, '')}" data-magnetic><span>${S.phone}</span></a>
          <a class="btn btn--ghost btn--lg" href="${S.cv}" target="_blank" rel="noopener" data-magnetic><span>Download CV</span><i>↓</i></a>
        </div>
      </div>
      <div class="footer__grid mono">
        <div><span class="h">Navigate</span><a href="#/">Home</a><a href="#/work">Work</a><a href="#/about">About</a><a href="#/contact">Contact</a></div>
        <div><span class="h">Work</span>${C.map(c => `<a href="#/work?c=${c.id}">${c.label}</a>`).join('')}</div>
        <div><span class="h">Contact</span><a href="mailto:${S.email}">${S.email}</a><a href="tel:${S.phone.replace(/\s/g, '')}">${S.phone}</a>${S.socials.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join('')}</div>
        <div><span class="h">Based in</span><span>${S.location}</span><span>Working worldwide</span><span>©${new Date().getFullYear()} ${S.name}</span></div>
      </div>
      <div class="footer__name" data-footer-name aria-hidden="true">Jerry Onwuka</div>
    </footer>`;

  const projCard = (p, i) => `
    <a class="wcard" href="#/work/${p.slug}" data-cursor="view" data-reveal="card">
      <div class="wcard__media">
        ${p.award ? `<span class="badge mono">★ ${p.award}</span>` : ''}
        <img src="${thumb(p)}" alt="${esc(p.title)} ${esc(catOf(p.cat).short)}" loading="lazy">
      </div>
      <div class="wcard__meta">
        <div><div class="wcard__title">${p.title}</div><div class="wcard__sub">${p.sub}</div></div>
        <div class="wcard__info mono">${pad(i + 1)}<br>${catOf(p.cat).short}<br>${p.year}</div>
      </div>
    </a>`;

  /* =========================================================
     PAGES
     ========================================================= */
  const featured = ['godark', 'damov-system', 'rooted-africa', 'aziki', 'tyrian', 'fabro', 'orah', 'chopchop'].map(bySlug);
  const ventures = P.filter(p => p.cat === 'personal');
  const partImgs = p => (p.parts || []).flatMap(([, s]) => { const q = bySlug(s); return M[q.images].filter(d => d[1] > 800 || d[2] < d[1]).slice(0, 3).map(d => `assets/img/${q.images}/${d[0]}`); });

  /* ---------- new shared sections ---------- */
  const venturesSection = (num = '02') => `
    <section class="section ventures">
      <div class="label-row mono"><span><span class="num">(${num})</span> Personal projects</span><span>Products I founded, designed &amp; built</span></div>
      <div class="ventures__head">
        <h2 class="display h2" data-reveal="chars">Personal <span class="serif lime">projects</span></h2>
        <p class="lead dim" data-reveal="words">My own ventures. Same playbook I use for clients: find the money, then build the brand, the website and the system myself.</p>
      </div>
      ${ventures.map((p, i) => {
        const imgs = [thumb(p), ...partImgs(p)];
        return `
      <article class="venture${p.lead ? ' venture--lead' : ''}">
        <a class="venture__media" href="#/work/${p.slug}" data-cursor="view" data-label="MOVE ↔" data-scrub-imgs='${JSON.stringify(imgs)}' data-reveal="clip">
          <img src="${imgs[0]}" alt="${esc(p.title)} product screens" loading="lazy">
          ${p.lead ? '<span class="badge mono">★ Lead project</span>' : ''}
          <span class="venture__count mono"><b>01</b> / ${pad(imgs.length)}</span>
          <span class="venture__bar"><i></i></span>
        </a>
        <div class="venture__info">
          <span class="mono lime">(${pad(i + 1)}) ${p.industry}</span>
          <h3 class="display" data-reveal="chars">${p.title}</h3>
          <p class="venture__sub serif">${p.sub}</p>
          <p class="dim">${p.about}</p>
          <div class="tags">${p.parts.map(([l, s]) => `<a class="tag tag--link" href="#/work/${s}" data-cursor="link">${l} ↗</a>`).join('')}</div>
          <div class="venture__cta"><a class="btn btn--accent" href="#/work/${p.slug}" data-magnetic><span>Read the case study</span><i>→</i></a>${p.url ? `<a class="btn btn--ghost" href="${p.url}" target="_blank" rel="noopener" data-magnetic><span>Live</span><i>↗</i></a>` : ''}</div>
        </div>
      </article>`; }).join('')}
    </section>`;

  const toolkitSection = (num = '06') => `
    <section class="section">
      <div class="label-row mono"><span><span class="num">(${num})</span> Toolkit</span><span>What I build with</span></div>
      <div class="toolkit">
        <div>
          <h2 class="display h3" data-reveal="chars">Tech <span class="serif lime">stack</span></h2>
          <p class="dim toolkit__intro" data-reveal="fade">The code behind the systems: from interface to database to payments.</p>
          ${S.techStack.map(g => `<div class="stack"><span class="mono dim">${g.group}</span><div class="stack__items">${g.items.map(t => `<span class="chip" data-chip>${t}</span>`).join('')}</div></div>`).join('')}
        </div>
        <div>
          <h2 class="display h3" data-reveal="chars">Soft<span class="serif lime">ware</span></h2>
          <p class="dim toolkit__intro" data-reveal="fade">The professional tools I design, edit and animate with.</p>
          <div class="tools">${S.software.map(s => `<div class="tool" data-tilt data-chip><b>${s.code}</b><span class="tool__name">${s.name}</span><span class="mono dim">${s.use}</span></div>`).join('')}</div>
        </div>
      </div>
    </section>`;

  const experienceSection = (num = '07') => `
    <section class="section">
      <div class="label-row mono"><span><span class="num">(${num})</span> Work experience</span><span><a href="${S.cv}" target="_blank" rel="noopener" class="lime">[ Download CV ↓ ]</a></span></div>
      <ul class="xp">${S.experience.map((x, i) => `<li data-reveal="fade"><div><span class="mono lime">${pad(i + 1)}</span><h4>${x.org}</h4><span class="mono dim">${x.place}</span></div><div><b class="xp__role">${x.role}</b><span class="mono ${/present/i.test(x.time) ? 'xp__now' : 'dim'}">${x.time}</span></div><p>${x.text}</p></li>`).join('')}</ul>
    </section>`;

  const certsSection = (num = '08', withEdu = false) => `
    <section class="section">
      <div class="label-row mono"><span><span class="num">(${num})</span> Certificates</span><span>Click to view</span></div>
      <div class="certs">
        ${withEdu ? `<div class="cert cert--edu" data-reveal="fade"><span class="mono lime">Education</span><b>${S.education.course}</b><span class="dim">${S.education.school}</span><span class="mono dim">${S.education.time}</span></div>` : ''}
        ${S.certificates.map((c, i) => `<button class="cert" data-lightbox="${c.img}" data-caption="${esc(c.title)} · ${esc(c.issuer)}" data-cursor="view" data-label="VIEW" data-reveal="fade"><span class="cert__img"><img src="${c.img}" alt="${esc(c.title)} certificate" loading="lazy"></span><span class="mono lime">${pad(i + 1)} · ${c.issuer}${c.year ? ' · ' + c.year : ''}</span><b>${c.title}</b></button>`).join('')}
      </div>
    </section>`;

  const Home = () => {
    const scatterSet = [
      ['rooted-africa', 9, 4, 6, 28, 1.3], ['tyrian', 6, 62, 3, 24, .7], ['chopchop', 4, 38, 18, 20, 1.6], ['orah', 3, 8, 34, 22, .9],
      ['brandpilot-brand', 2, 70, 30, 22, 1.4], ['farmerz-brand', 7, 30, 46, 26, .8], ['rooted-africa', 23, 66, 56, 20, 1.2], ['chopchop', 9, 6, 64, 24, 1.5],
      ['tyrian', 12, 40, 72, 22, .9], ['orah', 13, 72, 80, 22, 1.3]
    ];
    const brandMap = { 'rooted-africa': 'Rooted Africa', tyrian: 'Tyrian Group', chopchop: 'Chop Chop', orah: 'Orah Energies', 'brandpilot-brand': 'BrandPilot', 'farmerz-brand': 'Farmerz' };
    return `
    <section class="hero" data-hero>
      <div class="trail" data-trail></div>
      <div class="hero__top mono"><span>(©${String(new Date().getFullYear()).slice(2)}) Portfolio</span><span>Product designer &amp; systems builder</span></div>
      <figure class="hero__photo" data-hero-photo><img src="${S.photos.hero}" alt="Jerry Onwuka"></figure>
      <div class="hero__title">
        <h1 class="display" aria-label="Business × Innovations">
          <span class="hero__line" data-hero-line>Business</span>
          <span class="hero__line hero__line--2" data-hero-line><span class="hero__x">×</span>Innovations</span>
        </h1>
        <div class="hero__promise"><p data-hero-promise>I help organizations turn <em>ideas</em> into profitable working <em>systems.</em></p></div>
      </div>
      <div class="hero__bottom mono">
        <span class="scroll-cue"><i></i>[ Scroll to explore ]</span>
        <span>Systems · Websites · Brands · Motion</span>
        <span>${S.location} — Worldwide</span>
      </div>
    </section>

    <section class="stage" data-stage>
      <div class="stage__grid" aria-hidden="true">${'<i></i>'.repeat(12)}</div>
      <div class="stage__tags mono">${['Diagnose', 'Design', 'Build', 'Launch'].map((t, i) => `<span class="stage__tag" data-stage-tag>(0${i + 1}) ${t}</span>`).join('')}</div>
      <div class="stage__caption mono">[ Ideas → Systems → Profit ]</div>
      <div class="stage__card" data-stage-card>
        <img src="${S.photos.stage}" alt="Jerry Onwuka at his desk">
        <div class="stage__tiles" data-tiles>${'<i></i>'.repeat(80)}</div>
      </div>
      <svg class="stage__sig" viewBox="0 0 900 360" aria-hidden="true" data-sig>
        <path d="M150 74 C 230 62 330 52 392 58"/>
        <path d="M304 62 C 296 160 272 252 212 302 C 162 342 92 322 102 282 C 112 242 192 232 262 252"/>
        <path d="M430 212 C 382 122 472 82 522 132 C 572 192 522 282 462 272 C 402 262 412 182 472 162 C 542 140 602 172 642 152"/>
        <path d="M642 152 C 662 202 672 222 692 172 C 707 132 717 202 737 207 C 757 212 762 152 782 162 C 802 172 792 217 817 212 C 840 207 850 170 862 150"/>
        <path d="M70 334 C 300 294 560 284 870 250"/>
      </svg>
      <p class="stage__line display" data-stage-line>Every system ships <span class="serif">signed.</span></p>
      <p class="stage__by mono">— Jerry Onwuka<br>Founder &amp; systems builder</p>
    </section>

    <section class="section manifesto" data-manifesto>
      <div class="label-row mono"><span><span class="num">(01)</span> The approach</span><span>Business × Innovations</span></div>
      <p class="manifesto__text display" data-scrub-words>I sit where <span class="serif">business</span> meets innovation. I find where the money is, then design and build the brands, websites and software that make it <span class="serif">real.</span></p>
      <p class="manifesto__by mono">— Jerry Onwuka, product designer &amp; systems builder</p>
      <div class="manifesto__bar"><i data-manifesto-bar></i></div>
    </section>

    <section class="wrap">
      <div class="stats">${S.stats.map(s => `<div class="stat" data-reveal="fade"><b><span data-count="${s.value}">0</span><sup>${s.suffix}</sup></b><span class="mono">${s.label}</span></div>`).join('')}</div>
    </section>

    ${venturesSection('02')}

    <section class="hs" data-hs>
      <div class="hs__head">
        <h2 class="display h2" data-reveal="chars">Client <span class="serif lime">work</span></h2>
        <p class="mono dim" data-reveal="fade" style="max-width:34ch">[ ${featured.length} projects ] Systems that run businesses, brands that sell, stories that win.</p>
      </div>
      <div class="hs__pin" data-hs-pin>
        <div class="hs__track" data-hs-track>
          ${featured.map((p, i) => `
          <a class="fcard" href="#/work/${p.slug}" data-cursor="view" data-label="OPEN">
            <div class="fcard__media">${p.award ? `<span class="fcard__badge mono">★ ${p.award}</span>` : ''}<img src="${thumb(p)}" alt="${esc(p.title)}" data-hs-img loading="lazy"></div>
            <div class="fcard__meta"><span class="fcard__num mono">${pad(i + 1)}</span><span class="fcard__title">${p.title}</span><span class="fcard__cat mono">${catOf(p.cat).short} · ${p.year}</span></div>
          </a>`).join('')}
          <div class="fcard fcard--end"><a href="#/work" data-cursor="link"><span><span class="mono">[ ${P.length} projects ]</span><b>All work</b><span class="serif" style="font-size:28px">→</span></span></a></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="label-row mono"><span><span class="num">(03)</span> Motion &amp; storytelling</span><span>Hover to play</span></div>
      <div class="ventures__head">
        <h2 class="display h2" data-reveal="chars">Stories in <span class="serif lime">motion</span></h2>
        <p class="lead dim">3D brand films, launch animations and stories that explain a product in seconds.</p>
      </div>
      <div class="reels">
        ${[['godark', 'big', '3D brand film'], ['boredroom-story', '', 'Illustrated story'], ['boredroom-film', '', '2D launch film']].map(([s, big, kind]) => { const p = bySlug(s); return `
        <a class="reel${big ? ' reel--big' : ''}" href="#/work/${s}" data-reel data-cursor="view" data-label="WATCH" data-reveal="clip">
          <img src="${thumb(p)}" alt="${esc(p.title)} film still" loading="lazy">
          <video src="${p.video}" muted loop playsinline preload="none"></video>
          ${p.award ? `<span class="badge mono">★ ${p.award}</span>` : ''}
          <span class="reel__meta"><b>${p.title}</b><span class="mono">${kind}</span></span>
        </a>`; }).join('')}
      </div>
    </section>

    <section class="section">
      <div class="label-row mono"><span><span class="num">(04)</span> Disciplines</span><span>Hover to preview</span></div>
      <ul class="disc">
        ${C.map((c, i) => { const ps = inCat(c.id); return `<li><a href="#/work?c=${c.id}" data-preview="${thumb(ps[0])}" data-cursor="link"><span class="mono">${pad(i + 1)}</span><b>${c.label}</b><span class="count">(${pad(ps.length)})</span><span class="arr">→</span></a></li>`; }).join('')}
      </ul>
    </section>

    ${marquee(['UI/UX Design', '<span class="serif">Software Systems</span>', 'Web Development', '<span class="serif">Brand Identity</span>', 'Motion Graphics', '<span class="serif">Storytelling</span>'], 'marquee--accent')}

    <section class="section">
      <div class="label-row mono"><span><span class="num">(05)</span> Services</span><span>What I do</span></div>
      <div class="svc" data-svc>
        ${S.services.map((s, i) => `
        <div class="svc__item${i === 0 ? ' open' : ''}">
          <button class="svc__head" aria-expanded="${i === 0}"><span class="mono lime">${pad(i + 1)}</span><b>${s.title}</b><span class="svc__plus"></span></button>
          <div class="svc__body" style="${i === 0 ? 'height:auto' : ''}"><div class="svc__inner"><p>${s.text}</p><div class="tags">${s.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div></div></div>
        </div>`).join('')}
      </div>
    </section>

    ${toolkitSection('06')}

    <section class="section" style="padding-top:0">
      <div class="label-row mono"><span><span class="num">(07)</span> Process</span><span>Idea → profit</span></div>
      <div class="process">
        ${S.process.map(s => `<article class="pcard"><div class="pcard__n">${s.n}</div><div class="pcard__r"><h3>${s.title}</h3><p>${s.text}</p></div><i class="pcard__shade" aria-hidden="true"></i></article>`).join('')}
      </div>
    </section>

    ${experienceSection('08')}
    ${certsSection('09')}

    <section class="scatter" data-scatter>
      <div class="scatter__title"><p class="mono dim" style="margin-bottom:16px">[ Branding ]</p><h2 class="display">Brands in<br><span class="serif">the wild</span></h2></div>
      ${scatterSet.map(([g, i, x, y, w, sp]) => {
        const slug = P.find(p => p.images === g).slug;
        return `<figure style="left:${x}%;top:${y}%;width:${w}vw;max-width:${w * 16}px;min-width:140px" data-speed="${sp}"><a href="#/work/${slug}" data-cursor="view"><img src="${img(g, i)}" alt="${brandMap[g]} brand application" loading="lazy" style="aspect-ratio:${dims(g, i)[1]}/${dims(g, i)[2]}"></a><figcaption class="mono">${brandMap[g]}</figcaption></figure>`;
      }).join('')}
    </section>

    <section class="section section--tight">
      <p class="mono dim" style="text-align:center;margin-bottom:24px">[ Brands &amp; products I've worked with ]</p>
    </section>
    ${marquee(S.brands)}
    ${footer()}`;
  };

  const Work = (q) => {
    const active = q.get('c') || 'all';
    const view = q.get('v') || 'grid';
    const list = active === 'all' ? C : C.filter(c => c.id === active);
    let n = 0;
    return `
    <section class="page-hero">
      <p class="mono dim" data-reveal="fade">[ Index of work ]</p>
      <h1 class="display" data-reveal="chars">Work<sup>(${P.length})</sup></h1>
      <div class="page-hero__sub"><p data-reveal="words">Software systems, websites, brand identities and films for businesses that want more than a pretty screen.</p></div>
    </section>
    <div class="filters">
      <a class="filter${active === 'all' ? ' on' : ''}" href="#/work${view === 'list' ? '?v=list' : ''}">All<sup>${P.length}</sup></a>
      ${C.map(c => `<a class="filter${active === c.id ? ' on' : ''}" href="#/work?c=${c.id}${view === 'list' ? '&v=list' : ''}">${c.label}<sup>${inCat(c.id).length}</sup></a>`).join('')}
      <div class="view-toggle mono">
        <button class="${view === 'grid' ? 'on' : ''}" data-view="grid">Grid</button>
        <button class="${view === 'list' ? 'on' : ''}" data-view="list">List</button>
      </div>
    </div>
    ${list.map(c => {
      const ps = inCat(c.id);
      return `
      <section class="wgroup">
        <div class="wgroup__head"><h2>${c.label}</h2><span class="mono dim">(${pad(ps.length)})</span></div>
        ${view === 'list'
          ? `<ul class="wlist">${ps.map(p => `<li><a href="#/work/${p.slug}" data-preview="${thumb(p)}" data-cursor="link"><span class="mono lime">${pad(++n)}</span><b>${p.title}</b><span class="mono dim">${p.industry}</span><span class="mono dim">${p.year}</span><span class="arr">→</span></a></li>`).join('')}</ul>`
          : `<div class="wgrid">${ps.map(p => projCard(p, n++)).join('')}</div>`}
      </section>`;
    }).join('')}
    ${footer()}`;
  };

  const browser = (g, i, url) => {
    const [name, w, h] = dims(g, i), tall = h / w > 0.75;
    return `<div class="browser${tall ? ' browser--tall' : ''}" data-reveal="card" ${tall ? 'data-cursor="view" data-label="SCROLL"' : ''}>
      <div class="browser__bar"><i></i><i></i><i></i><span>${host(url) || 'app'}</span></div>
      <div class="browser__view" style="${tall ? '' : `aspect-ratio:${w}/${h}`}"><img src="assets/img/${g}/${name}" alt="" loading="lazy" data-w="${w}" data-h="${h}">${tall ? '<span class="browser__hint mono">Hover to scroll ↓</span>' : ''}</div>
    </div>`;
  };
  const phone = (g, i) => `<div class="phone" data-reveal="card"><div class="phone__screen"><img src="assets/img/${g}/${dims(g, i)[0]}" alt="" loading="lazy"></div></div>`;

  const galleryFor = (p, limit = 999) => {
    const g = p.images, items = M[g].map((d, i) => ({ i, w: d[1], h: d[2], phone: d[1] <= 800 && d[2] > d[1] })).slice(0, limit);
    if (p.cat === 'branding') {
      return `<div class="masonry">${items.slice(1).map((it, k) => `<figure class="${k % 7 === 3 && it.w > it.h ? 'wide' : ''}" data-reveal="clip"><img src="assets/img/${g}/${M[g][it.i][0]}" alt="${esc(p.title)} brand application ${k + 1}" loading="lazy" width="${it.w}" height="${it.h}" data-parallax-img></figure>`).join('')}</div>`;
    }
    if (p.cat === 'motion') {
      return `<div class="stills">${items.map(it => `<figure data-reveal="clip"><img src="assets/img/${g}/${M[g][it.i][0]}" alt="${esc(p.title)} film still" loading="lazy"></figure>`).join('')}</div>`;
    }
    const desk = items.filter(it => !it.phone), phones = items.filter(it => it.phone);
    const rows = []; let k = 1; // index 0 is the cover
    const rest = desk.filter(it => it.i !== 0);
    while (k - 1 < rest.length) {
      const pattern = rows.length % 2 === 0 ? 1 : 2;
      rows.push(rest.slice(k - 1, k - 1 + pattern)); k += pattern;
    }
    let html = rows.map(r => `<div class="gallery__row gallery__row--${r.length}">${r.map(it => browser(g, it.i, p.url)).join('')}</div>`);
    if (phones.length) html.splice(Math.min(2, html.length), 0, `<div class="gallery__row gallery__row--phones">${phones.map(it => phone(g, it.i)).join('')}</div>`);
    return `<div class="gallery">${html.join('')}</div>`;
  };

  const Case = slug => {
    const p = bySlug(slug); if (!p) return NotFound();
    const sameCat = inCat(p.cat), idx = P.indexOf(p), next = P[(idx + 1) % P.length];
    const c = catOf(p.cat);
    const titleWords = p.sub.split(' ');
    return `
    <section class="case-hero">
      <div class="case-hero__top mono">
        <a href="#/work?c=${p.cat}" data-cursor="link">← ${c.label}</a>
        <span>${pad(sameCat.indexOf(p) + 1)} / ${pad(sameCat.length)}</span>
        <span>${p.industry}</span>
      </div>
      <h1 class="display" data-reveal="chars">${p.title}</h1>
      <p class="case-hero__sub" data-reveal="words">${titleWords.slice(0, -1).join(' ')} <em>${titleWords.slice(-1)}</em></p>
      <dl class="meta mono">
        <div data-reveal="fade"><dt>Client</dt><dd>${p.client}</dd></div>
        <div data-reveal="fade"><dt>Role</dt><dd>${p.role}</dd></div>
        <div data-reveal="fade"><dt>Services</dt><dd>${p.services.join(', ')}</dd></div>
        <div data-reveal="fade"><dt>Year</dt><dd>${p.year}${p.award ? ` · <span class="lime">★ ${p.award}</span>` : ''}</dd></div>
        <div data-reveal="fade">${p.url ? `<a class="btn btn--accent" href="${p.url}" target="_blank" rel="noopener" data-magnetic><span>Visit live</span><i>↗</i></a>` : ''}</div>
      </dl>
    </section>

    ${p.video ? `
    <div class="cover cover--video" data-video>
      <video src="${p.video}" poster="${p.poster || thumb(p)}" preload="none" playsinline></video>
      <div class="cover__big" aria-hidden="true"><span>Play</span><span>This</span></div>
      <button class="play" data-cursor="play" data-label="PLAY" aria-label="Play ${esc(p.title)} film">PLAY ▶</button>
    </div>` : `
    <div class="cover" data-cover><img src="${thumb(p)}" alt="${esc(p.title)} cover" data-cover-img></div>`}

    <section class="story">
      <div class="story__label mono"><span class="num">(01)</span> The company</div>
      <div class="story__body"><p data-reveal="words">${p.about}</p></div>
    </section>
    <section class="story">
      <div class="story__label mono"><span class="num">(02)</span> The challenge</div>
      <div class="story__body"><p data-reveal="words">${p.challenge}</p></div>
    </section>
    <section class="story">
      <div class="story__label mono"><span class="num">(03)</span> ${p.cat === 'personal' ? 'How I built it' : p.cat === 'systems' ? 'What we built' : p.cat === 'motion' ? 'The story' : p.cat === 'branding' ? 'The identity' : 'What we did'}</div>
      <div class="story__body"><ol class="steps">${p.approach.map(([h, t]) => `<li data-reveal="fade"><div><h4>${h}</h4><p>${t}</p></div></li>`).join('')}</ol></div>
    </section>

    <div class="highlights">${p.highlights.map((h, i) => `<div data-reveal="fade"><span class="mono">${pad(i + 1)}</span>${h}</div>`).join('')}</div>

    <section class="outcome">
      <p class="mono dim">[ ${p.cat === 'motion' && p.award ? 'The result' : 'Outcome'} ]</p>
      <p data-scrub-words>${p.outcome}</p>
    </section>

    ${p.parts ? p.parts.map(([label, s], k) => { const q = bySlug(s); return `
    <div class="label-row mono" style="margin:${k ? 'clamp(60px,8vw,120px)' : '0'} var(--gutter) 28px"><span><span class="num">(${pad(4 + k)})</span> ${label}</span><a href="#/work/${s}" class="lime" data-cursor="link">[ Full ${label.toLowerCase()} case study → ]</a></div>
    ${galleryFor(q, q.cat === 'branding' ? 7 : 5)}`; }).join('') : `
    <div class="label-row mono" style="margin:0 var(--gutter) 28px"><span><span class="num">(04)</span> ${p.cat === 'motion' ? 'Film stills' : p.cat === 'branding' ? 'Brand in use' : 'Screens'}</span><span>${M[p.images].length} images</span></div>
    ${galleryFor(p)}`}

    <a class="next" href="#/work/${next.slug}" data-cursor="view" data-label="NEXT">
      <div class="next__label mono"><span>[ Next project ]</span><span>${catOf(next.cat).label}</span></div>
      <div class="next__img"><img src="${thumb(next)}" alt="" loading="lazy"></div>
      <h2 class="next__title display">${next.title}</h2>
    </a>
    ${footer()}`;
  };

  const About = () => `
    <section class="page-hero about-hero">
      <div>
        <p class="mono dim" data-reveal="fade">[ About ]</p>
        <h1 class="display" data-reveal="chars">Jerry<br><span class="serif lime">Onwuka</span></h1>
      </div>
      <figure class="about-hero__photo" data-reveal="clip"><img src="${S.photos.about}" alt="Jerry Onwuka smiling at his desk" data-parallax-img></figure>
    </section>
    <section class="about-intro">
      <div>
        <p data-reveal="words">I'm a product designer and systems builder working at the point where <em class="serif lime">business</em> meets <em class="serif lime">innovation.</em></p>
        <p data-reveal="words">For over seven years I've collaborated with more than 100 brands, from early-stage founders to established companies, turning ideas into things that work and make money.</p>
        <p class="small" data-reveal="fade">My work starts with the business: who pays, why, and what is in the way. Then I design and build the whole system around it. That means the brand identity, the website that sells it, the dashboards and apps that run it, and the motion and stories that launch it. I've shipped transport operating systems, land-leasing marketplaces, AI-powered SaaS and team-management platforms, built identities for agriculture, energy, food and advisory brands, and won a creative competition with a 3D brand film.</p>
        <p class="small" data-reveal="fade">Today I'm the Brand Designer at XSITE Capital Investment, and I build my own products: Boredroom, Farmerz and BrandPilot. I'm a Google-certified UX designer, studying Business Administration at the National Open University of Nigeria, based in ${S.location} and working with teams everywhere.</p>
        <div class="footer__actions" style="justify-content:flex-start" data-reveal="fade">
          <a class="btn btn--accent btn--lg" href="${S.cv}" target="_blank" rel="noopener" data-magnetic><span>Download CV</span><i>↓</i></a>
          <a class="btn btn--ghost btn--lg" href="#/contact" data-magnetic><span>Get in touch</span><i>↗</i></a>
        </div>
      </div>
      <aside class="about-card" data-reveal="clip">
        <img src="${S.photos.casual}" alt="Jerry Onwuka in a green striped polo">
        <div class="about-card__panel">
          <span class="mono">[ Positioning ]</span>
          <h2 class="display">Business <span class="serif">×</span> Innovations</h2>
          <p class="serif">${S.promise}</p>
        </div>
      </aside>
    </section>

    ${experienceSection('01')}

    <section class="section" style="padding-top:0">
      <div class="label-row mono"><span><span class="num">(02)</span> Skills</span><span>Self-assessed</span></div>
      <div class="skills">${S.skills.map(([k, v]) => `<div class="skill" data-reveal="fade"><div class="skill__row"><b>${k}</b><span class="mono dim">${v}</span></div><div class="skill__bar"><i data-skill="${v === 'Advanced' ? .92 : .65}"></i></div></div>`).join('')}</div>
    </section>

    ${toolkitSection('03')}

    ${marquee(S.services.map(s => s.title), 'marquee--accent')}

    ${certsSection('04', true)}
    ${footer()}`;

  const Contact = () => `
    <section class="contact">
      <div>
        <p class="mono dim" data-reveal="fade">[ Contact ]</p>
        <h1 class="display" data-reveal="chars">Got an <span class="serif lime">idea?</span></h1>
        <p class="lead" data-reveal="words" style="margin-top:28px">Tell me what you want to build. I'll come back with how it makes money and how we ship it.</p>
      </div>
      <div class="contact__grid">
        <div data-reveal="fade"><span class="mono">Email</span><a href="mailto:${S.email}?subject=Project%20enquiry" data-cursor="link">${S.email}</a></div>
        <div data-reveal="fade"><span class="mono">Phone / WhatsApp</span><a href="tel:${S.phone.replace(/\s/g, '')}" data-cursor="link">${S.phone}</a></div>
        <div data-reveal="fade"><span class="mono">CV</span><a href="${S.cv}" target="_blank" rel="noopener" data-cursor="link">Download PDF ↓</a></div>
      </div>
    </section>
    ${marquee(['Software Systems', '<span class="serif">Websites</span>', 'Branding', '<span class="serif">Motion</span>', 'UI/UX'], 'marquee--accent')}
    <footer class="footer" style="padding-top:40px"><div class="footer__name" data-footer-name aria-hidden="true">Jerry Onwuka</div></footer>`;

  const NotFound = () => `<section class="contact"><div><p class="mono dim">[ 404 ]</p><h1 class="display">Lost <span class="serif lime">signal</span></h1><p class="lead">This page doesn't exist. <a href="#/" class="lime">Back home →</a></p></div></section>`;

  /* =========================================================
     PAGE ANIMATIONS
     ========================================================= */
  let ctx = null;
  function animatePage(first) {
    ctx && ctx.revert();
    const cleanups = [];
    ctx = gsap.context(() => {
      const d = first ? .35 : .15;

      /* generic reveals */
      $$('[data-reveal="chars"]', app).forEach(el => {
        const ch = splitChars(el);
        gsap.from(ch, { yPercent: 110, rotate: 6, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .025, delay: d, scrollTrigger: { trigger: el, start: 'top 90%' } });
      });
      $$('[data-reveal="words"]', app).forEach(el => {
        const w = splitWords(el);
        gsap.from(w, { yPercent: 105, duration: 1, ease: 'expo.out', stagger: .018, delay: d, scrollTrigger: { trigger: el, start: 'top 90%' } });
      });
      ScrollTrigger.batch($$('[data-reveal="fade"]', app), { start: 'top 92%', onEnter: b => gsap.fromTo(b, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .07, overwrite: true }) });
      ScrollTrigger.batch($$('[data-reveal="card"]', app), { start: 'top 92%', onEnter: b => gsap.fromTo(b, { opacity: 0, y: 80, clipPath: 'inset(12% 6% 0 6% round 14px)' }, { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0 0% round 14px)', duration: 1.3, ease: 'expo.out', stagger: .1, overwrite: true, clearProps: 'clipPath' }) });
      $$('[data-reveal="clip"]', app).forEach(el => {
        gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 88%' } });
      });
      $$('[data-parallax-img]', app).forEach(im => {
        gsap.fromTo(im, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      /* scrub word highlight */
      $$('[data-scrub-words]', app).forEach(el => {
        const w = splitPlain(el), man = el.closest('[data-manifesto]');
        if (man) {
          const tl = gsap.timeline({ scrollTrigger: { trigger: man, start: 'top top', end: '+=140%', pin: true, scrub: 1, refreshPriority: 9 } });
          tl.fromTo(w, { opacity: .2, y: 24, filter: 'blur(5px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: .1, ease: 'power2.out', duration: .6 }, 0)
            .to($('[data-manifesto-bar]', man), { scaleX: 1, ease: 'none', duration: tl.duration() }, 0);
        } else {
          gsap.fromTo(w, { opacity: .14 }, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
        }
      });

      /* counters */
      $$('[data-count]', app).forEach(el => {
        const cols = odometer(el);
        cols.forEach(({ c, d }, i) => gsap.fromTo(c, { yPercent: 0 }, { yPercent: -(10 + d) * 5, duration: 1.6 + i * .2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } }));
      });
      $$('.label-row .num, .fcard__num, .venture__info > .mono, .cert .mono.lime', app).forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 95%', once: true, onEnter: () => scramble(el) }));

      /* every other piece of text gets a scroll-in */
      const skip = '[data-reveal],[data-scrub-words],[data-hero],[data-stage],.marquee,[data-footer-name],[data-hs-track],.process,.reel,.venture__media,.browser,.phone,.stills,.masonry,.footer__actions,.filters,.tools,.stack__items';
      let auto = $$('p, h2, h3, h4, li, .label-row, .tags, .wcard__meta, .fcard__meta, .stat, .mono', app).filter(el => !el.closest(skip) && !el.querySelector('[data-reveal],[data-scrub-words]'));
      auto = auto.filter(el => !auto.some(o => o !== el && o.contains(el)));
      gsap.set(auto, { opacity: 0, y: 36 });
      ScrollTrigger.batch(auto, { start: 'top 94%', onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .06, overwrite: true }) });

      /* skills bars */
      $$('[data-skill]', app).forEach(el => gsap.to(el, { scaleX: +el.dataset.skill, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 95%' } }));

      /* marquees, velocity-reactive */
      $$('[data-marquee]', app).forEach((m, k) => {
        const tr = $('.marquee__track', m); let x = 0; const dir = k % 2 ? 1 : -1;
        const fn = () => {
          const half = tr.scrollWidth / 2; if (!half) return;
          x += dir * (1 + Math.min(Math.abs(velocity) * .25, 12)) * (velocity < -1 ? -1 : 1);
          if (x <= -half) x += half; if (x > 0) x -= half;
          gsap.set(tr, { x, skewX: gsap.utils.clamp(-8, 8, velocity * -.25) });
        };
        gsap.ticker.add(fn); cleanups.push(() => gsap.ticker.remove(fn));
      });

      /* footer giant name */
      $$('[data-footer-name]', app).forEach(el => {
        const fit = () => { el.style.fontSize = '100px'; el.style.display = 'inline-block'; const w = el.getBoundingClientRect().width; el.style.display = ''; const cs = getComputedStyle(el.parentElement); const avail = el.parentElement.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); el.style.fontSize = (100 * avail / w * .99) + 'px'; };
        fit(); document.fonts && document.fonts.ready.then(fit); ScrollTrigger.addEventListener('refreshInit', fit);
        const ch = splitChars(el);
        gsap.from(ch, { yPercent: 100, duration: 1.2, ease: 'expo.out', stagger: .035, scrollTrigger: { trigger: el, start: 'top 98%' } });
      });

      /* case cover parallax + intro */
      const cv = $('[data-cover]', app);
      if (cv) {
        gsap.fromTo(cv, { clipPath: 'inset(18% 10% 0% 10% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', ease: 'none', scrollTrigger: { trigger: cv, start: 'top 95%', end: 'top 25%', scrub: true } });
        gsap.fromTo($('[data-cover-img]', cv), { yPercent: -8, scale: 1.15 }, { yPercent: 8, scale: 1, ease: 'none', scrollTrigger: { trigger: cv, start: 'top bottom', end: 'bottom top', scrub: true } });
      }

      /* tall screenshots: compute scroll distance */
      $$('.browser--tall', app).forEach(b => {
        const imEl = $('img', b), view = $('.browser__view', b);
        const set = () => { const ratio = imEl.dataset.h / imEl.dataset.w; const ih = view.clientWidth * ratio, vh = view.clientHeight; const shift = Math.max(0, ih - vh); b.style.setProperty('--shift', `-${shift}px`); b.style.setProperty('--dur', `${Math.min(14, 2 + shift / 450)}s`); };
        set(); ScrollTrigger.addEventListener('refreshInit', set);
      });

      /* video */
      $$('[data-video]', app).forEach(wrap => {
        const v = $('video', wrap), b = $('.play', wrap);
        b.addEventListener('click', () => { v.controls = true; v.play(); wrap.classList.add('playing'); });
        v.addEventListener('pause', () => { if (v.ended) wrap.classList.remove('playing'); });
        gsap.fromTo(wrap, { clipPath: 'inset(10% 8% 0% 8% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', ease: 'none', scrollTrigger: { trigger: wrap, start: 'top 95%', end: 'top 30%', scrub: true } });
      });

      /* services accordion */
      $$('[data-svc] .svc__item', app).forEach(item => {
        const head = $('.svc__head', item), body = $('.svc__body', item);
        head.addEventListener('click', () => {
          const open = !item.classList.contains('open');
          $$('[data-svc] .svc__item.open', app).forEach(o => { if (o !== item) { o.classList.remove('open'); $('.svc__head', o).setAttribute('aria-expanded', false); gsap.to($('.svc__body', o), { height: 0, duration: .7, ease: 'expo.inOut' }); } });
          item.classList.toggle('open', open); head.setAttribute('aria-expanded', open);
          gsap.to(body, { height: open ? 'auto' : 0, duration: .8, ease: 'expo.inOut', onComplete: () => ScrollTrigger.refresh() });
        });
      });

      /* process cards shrink as next stacks */
      const proc = $('.process', app);
      if (proc) {
        const pcs = $$('.pcard', proc);
        gsap.set(pcs.slice(1), { yPercent: 115 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: proc, start: () => `top ${$('#header').offsetHeight + 40}px`, end: () => '+=' + innerHeight * pcs.length * .8, pin: true, scrub: 1, invalidateOnRefresh: true, refreshPriority: 1 } });
        pcs.forEach((c, i) => {
          if (!i) return;
          tl.to(c, { yPercent: 0, ease: 'power2.inOut', duration: 1 }, i - 1)
            .to(pcs.slice(0, i), { scale: k => 1 - (i - k) * .05, y: k => -(i - k) * 18, ease: 'power2.inOut', duration: 1 }, i - 1)
            .to(pcs.slice(0, i).map(p => $('.pcard__shade', p)), { opacity: .5, ease: 'power2.inOut', duration: 1 }, i - 1);
        });
        pcs.forEach(c => { const n = $('.pcard__n', c); ScrollTrigger.create({ trigger: proc, start: 'top 80%', once: true, onEnter: () => scramble(n, 1) }); });
      }

      /* ---------- HOME specifics ---------- */
      const hero = $('[data-hero]', app);
      if (hero) {
        const lines = $$('[data-hero-line]', hero);
        lines.forEach(l => splitChars(l));
        const tl = gsap.timeline({ delay: .3 });
        tl.from($$('.sc', lines[0]), { yPercent: 120, rotate: 8, duration: 1.4, ease: 'expo.out', stagger: .04 })
          .from($$('.sc', lines[1]), { yPercent: 120, rotate: 8, duration: 1.4, ease: 'expo.out', stagger: .035 }, '-=1.2')
          .from(splitWords($('[data-hero-promise]', hero)), { yPercent: 110, duration: 1, ease: 'expo.out', stagger: .02 }, '-=1')
          .from($$('.hero__top > *, .hero__bottom > *', hero), { opacity: 0, y: 20, duration: .8, stagger: .06 }, '-=.9');
        /* scroll out */
        gsap.to(lines[0], { xPercent: -18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to(lines[1], { xPercent: 12, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to($('.hero__title', hero), { opacity: .15, ease: 'none', scrollTrigger: { trigger: hero, start: 'center top', end: 'bottom top', scrub: true } });
        /* mouse parallax on lines */
        if (fine) {
          const xs = lines.map(l => gsap.quickTo(l, 'x', { duration: 1.2, ease: 'power3' })), ys = lines.map(l => gsap.quickTo(l, 'y', { duration: 1.2, ease: 'power3' }));
          const mv = e => { const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5; xs.forEach((f, i) => f(nx * (i ? -30 : 30))); ys.forEach((f, i) => f(ny * (i ? -14 : 14))); };
          hero.addEventListener('mousemove', mv);
        }
        /* image trail */
        const trail = $('[data-trail]', hero);
        const pool = featured.concat(P.filter(p => p.cat === 'branding')).map(p => img(p.images, Math.min(1, M[p.images].length - 1)));
        let last = { x: 0, y: 0 }, k = 0, z = 1;
        if (fine) hero.addEventListener('mousemove', e => {
          const r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
          if (Math.hypot(x - last.x, y - last.y) < 110) return;
          last = { x, y };
          const im = document.createElement('img'); im.src = pool[k++ % pool.length]; im.alt = ''; trail.appendChild(im);
          const w = im.offsetWidth || 220;
          gsap.set(im, { x: x - w / 2, y: y - w * .625, zIndex: z++, rotation: gsap.utils.random(-14, 14), scale: .4, opacity: 1 });
          gsap.timeline({ onComplete: () => im.remove() })
            .to(im, { scale: 1, duration: .6, ease: 'expo.out' })
            .to(im, { scale: .2, opacity: 0, yPercent: 30, duration: .9, ease: 'power3.in' }, '+=.25');
        });
      }

      /* signature stage: pixel photo reveal + signed */
      const stage = $('[data-stage]', app);
      if (stage) {
        const card = $('[data-stage-card]', stage), paths = $$('[data-sig] path', stage), tiles = $$('[data-tiles] i', stage), tags = $$('[data-stage-tag]', stage), cells = $$('.stage__grid i', stage);
        const line = splitChars($('[data-stage-line]', stage));
        tiles.forEach(t => { if (Math.random() < .14) t.classList.add('g'); });
        paths.forEach(p => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
        const tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top top', end: '+=220%', pin: true, scrub: 1, refreshPriority: 10 } });
        tl.from(cells, { scaleX: 0, transformOrigin: 'left', stagger: { amount: .15, from: 'random' }, duration: .15, ease: 'none' }, 0)
          .fromTo(card, { scale: .72, rotate: -3 }, { scale: 1, rotate: 2, duration: .45, ease: 'power2.out' }, 0)
          .to(tiles, { opacity: 0, duration: .01, stagger: { amount: .35, from: 'random' } }, .05);
        tags.forEach((t, i) => tl.to(t, { backgroundColor: '#CCFF00', color: '#060C1E', borderColor: '#CCFF00', duration: .04 }, .12 + i * .1));
        tl.to(paths, { strokeDashoffset: 0, ease: 'none', stagger: .1, duration: .3 }, .42)
          .from(line, { yPercent: 115, duration: .2, stagger: .012, ease: 'power3.out' }, .62)
          .from($('.stage__by', stage), { opacity: 0, y: 20, duration: .1 }, .8)
          .to(card, { rotate: 0, scale: 1.03, duration: .2 }, .8);
      }

      /* hero portrait */
      const hp = $('[data-hero-photo]', app);
      if (hp) {
        gsap.fromTo(hp, { clipPath: 'inset(100% 0 0 0 round 10px)' }, { clipPath: 'inset(0% 0 0 0 round 10px)', duration: 1.6, ease: 'expo.inOut', delay: .35 });
        gsap.fromTo($('img', hp), { scale: 1.35 }, { scale: 1, duration: 2, ease: 'expo.out', delay: .4 });
        gsap.to(hp, { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });
        if (fine) { const hx = gsap.quickTo(hp, 'x', { duration: 1.4, ease: 'power3' }); $('[data-hero]', app).addEventListener('mousemove', e => hx((e.clientX / innerWidth - .5) * -24)); }
      }

      /* personal projects: move cursor to scrub through screens */
      $$('[data-scrub-imgs]', app).forEach(m => {
        const list = JSON.parse(m.dataset.scrubImgs), im = $('img', m), cnt = $('.venture__count b', m), bar = $('.venture__bar i', m);
        list.forEach(src => { const p = new Image(); p.src = src; });
        let cur = 0;
        const show = k => { if (k === cur) return; cur = k; im.src = list[k]; cnt.textContent = pad(k + 1); gsap.fromTo(im, { scale: 1.06 }, { scale: 1, duration: .6, ease: 'expo.out' }); gsap.to(bar, { scaleX: (k + 1) / list.length, duration: .4 }); };
        gsap.set(bar, { scaleX: 1 / list.length });
        m.addEventListener('mousemove', e => { const r = m.getBoundingClientRect(); show(Math.min(list.length - 1, Math.floor((e.clientX - r.left) / r.width * list.length))); });
        if (!fine) { const id = setInterval(() => show((cur + 1) % list.length), 2200); cleanups.push(() => clearInterval(id)); }
      });

      /* motion reels */
      $$('[data-reel]', app).forEach(r => {
        const v = $('video', r);
        const play = () => { v.preload = 'auto'; v.play().then(() => r.classList.add('on')).catch(() => {}); };
        const stop = () => { v.pause(); r.classList.remove('on'); };
        if (fine) { r.addEventListener('mouseenter', play); r.addEventListener('mouseleave', stop); }
        else ScrollTrigger.create({ trigger: r, start: 'top 70%', end: 'bottom 30%', onToggle: s => s.isActive ? play() : stop() });
      });

      /* toolkit chips + app tiles */
      $$('.stack__items, .tools', app).forEach(group => {
        gsap.from($$('[data-chip]', group), { opacity: 0, y: 24, scale: .9, duration: .8, ease: 'back.out(1.6)', stagger: .05, scrollTrigger: { trigger: group, start: 'top 90%' } });
      });
      if (fine) $$('[data-tilt]', app).forEach(t => {
        const rx = gsap.quickTo(t, 'rotationX', { duration: .5 }), ry = gsap.quickTo(t, 'rotationY', { duration: .5 });
        t.addEventListener('mousemove', e => { const r = t.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - .5) * 24); rx(-((e.clientY - r.top) / r.height - .5) * 24); });
        t.addEventListener('mouseleave', () => { rx(0); ry(0); });
      });

      /* horizontal featured */
      const hs = $('[data-hs]', app);
      if (hs) {
        const track = $('[data-hs-track]', hs), pin = $('[data-hs-pin]', hs);
        ScrollTrigger.matchMedia({
          '(min-width: 900px)': () => {
            const dist = () => track.scrollWidth - innerWidth;
            const anim = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1, refreshPriority: 8 } });
            $$('[data-hs-img]', track).forEach(im => gsap.fromTo(im, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: im.closest('.fcard'), containerAnimation: anim, start: 'left right', end: 'right left', scrub: true } }));
            $$('.fcard', track).forEach(c => gsap.fromTo(c, { rotate: 3, y: 60 }, { rotate: 0, y: 0, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: anim, start: 'left right', end: 'left 60%', scrub: true } }));
          }
        });
      }

      /* scatter parallax + title */
      const sct = $('.scatter__title', app);
      if (sct) gsap.fromTo($('.display', sct), { scale: .8, letterSpacing: '-0.04em' }, { scale: 1.08, letterSpacing: '0em', ease: 'none', scrollTrigger: { trigger: '[data-scatter]', start: 'top bottom', end: 'bottom top', scrub: true } });
      $$('[data-scatter] figure', app).forEach(f => {
        const sp = +f.dataset.speed;
        gsap.fromTo(f, { y: 260 * sp, rotate: (sp - 1.1) * 14, scale: .85 }, { y: -260 * sp, rotate: (1.1 - sp) * 14, scale: 1.05, ease: 'none', scrollTrigger: { trigger: f.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      ScrollTrigger.sort();
      return () => cleanups.forEach(f => f());
    }, app);
  }

  /* work-page view toggle */
  function bindWork(q) {
    $$('[data-view]', app).forEach(b => b.addEventListener('click', () => {
      const c = q.get('c'); const v = b.dataset.view;
      location.hash = '#/work' + ((c || v === 'list') ? '?' : '') + [c ? 'c=' + c : '', v === 'list' ? 'v=list' : ''].filter(Boolean).join('&');
    }));
  }

  /* =========================================================
     ROUTER
     ========================================================= */
  const parse = () => {
    const h = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = h.split('?');
    return { path, q: new URLSearchParams(qs || '') };
  };
  const titles = { '/': 'Business × Innovations', '/work': 'Work', '/about': 'About', '/contact': 'Contact' };
  let busy = false, first = true, lastPath = null;

  function render() {
    const { path, q } = parse();
    let html, title;
    if (path === '/' || path === '') { html = Home(); title = titles['/']; }
    else if (path === '/work') { html = Work(q); title = 'Work'; }
    else if (path.startsWith('/work/')) { const p = bySlug(path.slice(6)); html = Case(path.slice(6)); title = p ? `${p.title}, ${catOf(p.cat).label}` : 'Not found'; }
    else if (path === '/about') { html = About(); title = 'About'; }
    else if (path === '/contact') { html = Contact(); title = 'Contact'; }
    else { html = NotFound(); title = 'Not found'; }
    document.title = `${title} | Jerry Onwuka`;
    ScrollTrigger.getAll().forEach(t => t.kill());
    ctx && ctx.revert(); ctx = null;
    app.innerHTML = html;
    lastPath = path;
    scrollTop();
    bindPreview(app); bindMagnetic(app);
    if (path === '/work') bindWork(q);
    header.classList.remove('is-hidden'); document.body.classList.remove('hdr-hidden');
    pvEl = null; gsap.to(previewInner, { scale: 0, duration: .2, overwrite: 'auto' });
    requestAnimationFrame(() => { animatePage(first); ScrollTrigger.refresh(); });
    $$('img', app).forEach(im => { if (!im.complete) im.addEventListener('load', () => { clearTimeout(render._r); render._r = setTimeout(() => ScrollTrigger.refresh(), 150); }, { once: true }); });
  }

  async function navigate() {
    if (first) return;
    const { path } = parse();
    /* same work page with different filter: no pixel wipe, quick fade */
    if (path === '/work' && lastPath === '/work') {
      await gsap.to(app, { opacity: 0, duration: .25 });
      render(); gsap.to(app, { opacity: 1, duration: .4 });
      return;
    }
    if (busy) return; busy = true;
    if (reduce) { render(); busy = false; return; }
    await cover(); render(); await wait(80); await uncover(); busy = false;
  }
  addEventListener('hashchange', navigate);

  /* =========================================================
     LOADER → first render
     ========================================================= */
  async function boot() {
    const count = $('#loaderCount'), bar = $('#loaderBar'), loader = $('#loader');
    const preload = [img('godark', 1), ...featured.slice(0, 4).map(p => thumb(p))];
    let loaded = 0;
    const loads = preload.map(src => new Promise(r => { const i = new Image(); i.onload = i.onerror = () => { loaded++; r(); }; i.src = src; }));
    const o = { v: 0 };
    if (reduce) { await Promise.all(loads); }
    else {
      await new Promise(res => {
        gsap.to(o, {
          v: 100, duration: 2.2, ease: 'power2.inOut',
          onUpdate: () => { const v = Math.min(o.v, 30 + (loaded / preload.length) * 70); count.textContent = String(Math.floor(v)).padStart(3, '0'); bar.style.width = `calc(${v}% - 16px)`; },
          onComplete: async () => { await Promise.all(loads); count.textContent = '100'; bar.style.width = 'calc(100% - 16px)'; res(); }
        });
      });
    }
    if (!reduce) await cover();
    loader.remove();
    document.body.classList.remove('is-loading');
    render();
    first = false;
    if (!reduce) await uncover();
    lenis && lenis.start();
    ScrollTrigger.refresh();
  }
  boot();
})();
