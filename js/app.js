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
  const { Home, Work, Case, About, Contact, Pricing, NotFound, featured, usd } = window.PAGES;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile = () => innerWidth < 900;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------- helpers ---------- */
  const img = (g, i = 0) => M[g] && M[g][i] ? `/assets/img/${g}/${M[g][i][0]}` : '';
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
    el.innerHTML = [...v].map(d => /\d/.test(d) ? `<span class="odo"><span class="odo__col">${'0123456789'.repeat(2).split('').map(n => `<span>${n}</span>`).join('')}</span></span>` : `<span class="odo__sep">${d}</span>`).join('');
    const digits = [...v].filter(d => /\d/.test(d));
    return $$('.odo__col', el).map((c, i) => ({ c, d: +digits[i] }));
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
  $('#menuSocials').innerHTML = S.socials.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.label} ↗︎</a>`).join(' &nbsp; ');
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
      const skip = '[data-reveal],[data-scrub-words],[data-hero],[data-stage],.marquee,[data-footer-name],[data-hs-track],.process,.reel,.venture__media,.browser,.phone,.stills,.masonry,.footer__actions,.filters,.tools,.stack__items,.pkgs,.pform';
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
      if (proc && innerWidth < 900) {
        proc.classList.add('process--static');
      } else if (proc) {
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
          .from($('[data-hero-lede]', hero), { opacity: 0, y: 16, duration: .9, ease: 'expo.out' }, '-=.7')
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

      /* about: founder badge + hobby cards */
      $$('[data-spin]', app).forEach(b => gsap.to(b, { rotation: 360, duration: 14, repeat: -1, ease: 'none', transformOrigin: '50% 50%' }));
      $$('[data-hobby]', app).forEach(card => {
        const kind = card.dataset.hobby; let tl;
        if (kind === 'ball') {
          const ball = $('.hobby__ball', card), sh = $('.hobby__shadow', card);
          tl = gsap.timeline({ repeat: -1 })
            .to(ball, { y: -46, rotation: 180, duration: .45, ease: 'power2.out' })
            .to(sh, { scale: .5, opacity: .25, duration: .45, ease: 'power2.out' }, 0)
            .to(ball, { y: 0, rotation: 360, duration: .45, ease: 'power2.in' })
            .to(sh, { scale: 1, opacity: .6, duration: .45, ease: 'power2.in' }, '<')
            .to(ball, { scaleY: .86, scaleX: 1.1, duration: .08, yoyo: true, repeat: 1, transformOrigin: '50% 100%' });
        } else if (kind === 'game') {
          const pad = $('.hobby__pad', card);
          tl = gsap.timeline({ repeat: -1, repeatDelay: .4 })
            .to(pad, { rotation: -8, duration: .12 }).to(pad, { rotation: 8, duration: .12 }).to(pad, { rotation: -5, duration: .1 }).to(pad, { rotation: 0, duration: .1 })
            .to($('.b1', card), { fill: 'currentColor', duration: .1, yoyo: true, repeat: 3 }, 0)
            .to($('.b2', card), { fill: 'currentColor', duration: .1, yoyo: true, repeat: 3 }, .2);
        } else if (kind === 'classical') {
          tl = gsap.timeline({ repeat: -1 }).to($$('.note', card), { y: -8, rotation: -6, duration: .6, ease: 'sine.inOut', stagger: .3, yoyo: true, repeat: 1 });
        } else if (kind === 'jazz') {
          const bars = $$('.eq i', card);
          tl = gsap.timeline({ repeat: -1 });
          bars.forEach((b, i) => tl.to(b, { scaleY: () => gsap.utils.random(.2, 1), duration: .25, repeat: 3, yoyo: true, repeatRefresh: true, ease: 'sine.inOut' }, i * .05));
          gsap.fromTo($('.hobby__track i', card), { scaleX: 0 }, { scaleX: 1, duration: 30, ease: 'none', repeat: -1 });
        }
        if (!tl) return;
        tl.timeScale(.6);
        card.addEventListener('mouseenter', () => gsap.to(tl, { timeScale: 1.6, duration: .4 }));
        card.addEventListener('mouseleave', () => gsap.to(tl, { timeScale: .6, duration: .6 }));
        gsap.from(card, { y: 80, rotation: gsap.utils.random(-6, 6), opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 92%' } });
      });

      /* pricing cards */
      const pk = $$('[data-pkg-card]', app);
      if (pk.length) gsap.from(pk, { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .1, clearProps: 'transform', scrollTrigger: { trigger: '.pkgs', start: 'top 85%' } });

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

  /* project form: package buttons + submit to inbox */
  function bindForms(q) {
    const form = $('[data-form]', app); if (!form) return;
    const sel = $('[data-pkg-select]', form), status = $('[data-form-status]', form), label = $('[data-btn-label]', form);
    const goToForm = () => { const t = $('#start', app); lenis ? lenis.scrollTo(t, { offset: -40 }) : t.scrollIntoView({ behavior: 'smooth' }); };
    $$('[data-pkg]', app).forEach(b => b.addEventListener('click', e => {
      e.preventDefault(); sel.value = b.dataset.pkg; goToForm();
      gsap.fromTo(sel.closest('.field'), { backgroundColor: 'rgba(204,255,0,.35)' }, { backgroundColor: 'rgba(204,255,0,0)', duration: 1.6, delay: .8 });
    }));
    if (q.get('package')) { const m = S.packages.find(k => k.id === q.get('package')); if (m) sel.value = `${m.name} (from $${usd(m.price)})`; }
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (form._honey.value) return;
      const bad = $$('[required]', form).filter(f => !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value)));
      $$('.field', form).forEach(f => f.classList.remove('is-bad'));
      if (bad.length) { bad.forEach(f => f.closest('.field').classList.add('is-bad')); status.textContent = 'Please fill in the highlighted fields.'; gsap.fromTo(form, { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(1,.3)' }); return; }
      const data = Object.fromEntries(new FormData(form));
      delete data._honey;
      label.textContent = 'Sending…'; status.textContent = '';
      try {
        const res = await fetch(`https://formsubmit.co/ajax/${S.email}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...data, _subject: `New project enquiry from ${data.name}`, _replyto: data.email, _template: 'table' })
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || out.success === 'false' || out.success === false) throw new Error(out.message || 'send failed');
        label.textContent = 'Sent ✓'; status.textContent = `Thanks ${data.name.split(' ')[0]}, it's in my inbox. I'll be in touch soon.`;
        form.reset(); gsap.fromTo(form, { scale: .98 }, { scale: 1, duration: .8, ease: 'elastic.out(1,.4)' });
      } catch (err) {
        label.textContent = 'Send it';
        const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
        status.innerHTML = `Couldn't send from the page. <a class="lime" href="mailto:${S.email}?subject=${encodeURIComponent('Project enquiry from ' + data.name)}&body=${encodeURIComponent(body)}">Send it by email instead →</a>`;
      }
    });
  }

  /* work-page view toggle */
  function bindWork(q) {
    $$('[data-view]', app).forEach(b => b.addEventListener('click', () => {
      const c = q.get('c'); const v = b.dataset.view;
      go('/work/' + ((c || v === 'list') ? '?' : '') + [c ? 'c=' + c : '', v === 'list' ? 'v=list' : ''].filter(Boolean).join('&'));
    }));
  }

  /* =========================================================
     ROUTER (clean /path/ URLs, History API)
     ========================================================= */
  /* old #/ links keep working */
  if (location.hash.startsWith('#/')) {
    const [p, qs] = location.hash.slice(1).split('?');
    history.replaceState(null, '', (p.endsWith('/') ? p : p + '/') + (qs ? '?' + qs : ''));
  }
  const parse = () => {
    let path = location.pathname.replace(/index\.html$/, '');
    if (!path.endsWith('/')) path += '/';
    return { path, q: new URLSearchParams(location.search) };
  };
  let busy = false, first = true, lastPath = null;

  function render() {
    const { path, q } = parse();
    const page = window.PAGES.resolve(path, q);
    document.title = page.title;
    const md = $('meta[name=description]'); if (md) md.content = page.description;
    const cl = $('link[rel=canonical]'); if (cl && page.canonical) cl.href = page.canonical;
    ScrollTrigger.getAll().forEach(t => t.kill());
    ctx && ctx.revert(); ctx = null;
    app.innerHTML = page.html;
    lastPath = path;
    if (!location.hash) scrollTop();
    bindPreview(app); bindMagnetic(app);
    if (path === '/work/') bindWork(q);
    bindForms(q);
    header.classList.remove('is-hidden'); document.body.classList.remove('hdr-hidden');
    pvEl = null; gsap.to(previewInner, { scale: 0, duration: .2, overwrite: 'auto' });
    requestAnimationFrame(() => {
      animatePage(first); ScrollTrigger.refresh();
      if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) lenis ? lenis.scrollTo(t, { immediate: true, offset: -90 }) : t.scrollIntoView(); }
    });
    $$('img', app).forEach(im => { if (!im.complete) im.addEventListener('load', () => { clearTimeout(render._r); render._r = setTimeout(() => ScrollTrigger.refresh(), 150); }, { once: true }); });
  }

  async function navigate() {
    if (first) return;
    const { path } = parse();
    /* same work page with different filter: no pixel wipe, quick fade */
    if (path === '/work/' && lastPath === '/work/') {
      await gsap.to(app, { opacity: 0, duration: .25 });
      render(); gsap.to(app, { opacity: 1, duration: .4 });
      return;
    }
    if (busy) return; busy = true;
    if (reduce) { render(); busy = false; return; }
    await cover(); render(); await wait(80); await uncover(); busy = false;
  }
  function go(url) { history.pushState(null, '', url); navigate(); }
  addEventListener('popstate', navigate);
  /* intercept internal links */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const href = a.getAttribute('href');
    if (!href.startsWith('/') || href.startsWith('//') || a.target === '_blank' || a.hasAttribute('download') || /\.(pdf|xml|txt|jpg|png|webp|mp4)$/i.test(href.split(/[?#]/)[0])) return;
    e.preventDefault();
    if (menuOpen) toggleMenu(false);
    const url = new URL(href, location.origin);
    if (url.pathname === location.pathname && url.search === location.search && url.hash) { const t = document.getElementById(url.hash.slice(1)); if (t) { lenis ? lenis.scrollTo(t, { offset: -90 }) : t.scrollIntoView({ behavior: 'smooth' }); } return; }
    if (url.pathname + url.search === location.pathname + location.search && !url.hash) return;
    go(url.pathname + url.search + url.hash);
  });

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
