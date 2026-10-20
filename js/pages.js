/* =========================================================
   Page templates. Pure string builders shared by the browser
   (app.js) and the build script (scripts/build.mjs).
   ========================================================= */
(() => {
  const S = window.SITE, P = window.PROJECTS, C = window.CATEGORIES, M = window.MANIFEST;
  const img = (g, i = 0) => M[g] && M[g][i] ? `/assets/img/${g}/${M[g][i][0]}` : '';
  const dims = (g, i) => M[g][i];
  const bySlug = s => P.find(p => p.slug === s);
  const thumb = p => p.thumb || img(p.images);
  const catOf = id => C.find(c => c.id === id);
  const inCat = id => P.filter(p => p.cat === id);
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const CT = window.CONTENT, AR = window.ARTICLES;
  const SV = CT.services, BASE = CT.base;
  const svc = s => SV.find(x => x.slug === s);
  const art = s => AR.find(x => x.slug === s);
  /* which service page a project belongs to */
  const LANDING = ['brandpilot-website', 'damov-website', 'motionbox'];
  const serviceOf = p => p.cat === 'branding' ? 'brand-identity-design' : LANDING.includes(p.slug) ? 'landing-page-design' : p.cat === 'motion' ? null : 'web-design-services';
  const kindOf = p => ({ personal: 'Product', systems: 'Software System', websites: LANDING.includes(p.slug) ? 'Landing Page' : 'Website', branding: 'Brand Identity', motion: 'Brand Film' }[p.cat]);
  const crumbs = items => `<nav class="crumbs mono" aria-label="Breadcrumb"><ol>${items.map(([n, u], i) => `<li>${i < items.length - 1 ? `<a href="${u}">${n}</a>` : `<span aria-current="page">${n}</span>`}</li>`).join('')}</ol></nav>`;
  const host = u => u ? u.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';

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
          <a class="btn btn--accent btn--lg" href="/contact/" data-magnetic><span>Start a project</span><i>→</i></a>
          <a class="btn btn--ghost btn--lg" href="tel:${S.phone.replace(/\s/g, '')}" data-magnetic><span>${S.phone}</span></a>
          <a class="btn btn--ghost btn--lg" href="${S.cv}" target="_blank" rel="noopener" data-magnetic><span>Download CV</span><i>↓</i></a>
        </div>
      </div>
      <div class="footer__grid mono">
        <nav aria-label="Services"><span class="h">Services</span>${SV.map(s => `<a href="/services/${s.slug}/">${s.name}</a>`).join('')}<a href="/pricing/">Pricing</a></nav>
        <nav aria-label="Site"><span class="h">Site</span><a href="/">Home</a><a href="/work/">Work</a><a href="/about/">About</a><a href="/process/">Process</a><a href="/insights/">Insights</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a></nav>
        <div><span class="h">Contact</span><a href="mailto:${S.email}">${S.email}</a><a href="tel:${S.phone.replace(/\s/g, '')}">${S.phone}</a></div>
        <div><span class="h">Follow</span>${S.socials.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.label} ${s.handle}</a>`).join('')}</div>
        <div><span class="h">Based in</span><span>${S.location}</span><span>Working worldwide</span><span>©${new Date().getFullYear()} ${S.name}</span></div>
      </div>
      <div class="footer__name" data-footer-name aria-hidden="true">Jerry Onwuka</div>
    </footer>`;

  const projCard = (p, i) => `
    <a class="wcard" href="/work/${p.slug}/" data-cursor="view" data-reveal="card">
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
  const partImgs = p => (p.parts || []).flatMap(([, s]) => { const q = bySlug(s); return M[q.images].filter(d => d[1] > 800 || d[2] < d[1]).slice(0, 3).map(d => `/assets/img/${q.images}/${d[0]}`); });

  /* ---------- new shared sections ---------- */
  const venturesSection = (num = '02') => `
    <section class="section ventures">
      <div class="label-row mono"><span><span class="num">(${num})</span> Personal projects</span><span>Products I co-founded, designed &amp; built</span></div>
      <div class="ventures__head">
        <h2 class="display h2" data-reveal="chars">Personal <span class="serif lime">projects</span></h2>
        <p class="lead dim" data-reveal="words">My own ventures. Same playbook I use for clients: find the money, then build the brand, the website and the system myself.</p>
      </div>
      ${ventures.map((p, i) => {
        const imgs = [thumb(p), ...partImgs(p)];
        return `
      <article class="venture${p.lead ? ' venture--lead' : ''}">
        <a class="venture__media" href="/work/${p.slug}/" data-cursor="view" data-label="MOVE ↔︎" data-scrub-imgs='${JSON.stringify(imgs)}' data-reveal="clip">
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
          <div class="tags">${p.parts.map(([l, s]) => `<a class="tag tag--link" href="/work/${s}/" data-cursor="link">${l} ↗︎</a>`).join('')}</div>
          <div class="venture__cta"><a class="btn btn--accent" href="/work/${p.slug}/" data-magnetic><span>Read the case study</span><i>→</i></a>${p.url ? `<a class="btn btn--ghost" href="${p.url}" target="_blank" rel="noopener" data-magnetic><span>Live</span><i>↗︎</i></a>` : ''}</div>
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
        <p class="display hero__wordmark" aria-label="Business × Innovations">
          <span class="hero__line" data-hero-line>Business</span>
          <span class="hero__line hero__line--2" data-hero-line><span class="hero__x">×</span>Innovations</span>
        </p>
        <div class="hero__promise"><h1 data-hero-promise>I help organizations turn <em>ideas</em> into profitable working <em>systems.</em></h1>
          <p class="hero__lede" data-hero-lede>Jerry Onwuka is a product designer and systems builder in Abuja, Nigeria, who designs and builds brand identities, websites, landing pages, software and motion for businesses that want their ideas to pay.</p></div>
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
      <p class="stage__by mono">— Jerry Onwuka<br>Co-founder &amp; systems builder</p>
    </section>

    <section class="section manifesto" data-manifesto>
      <div class="label-row mono"><span><span class="num">(01)</span> The approach</span><span>Business × Innovations</span></div>
      <p class="manifesto__text display" data-scrub-words>I sit where <span class="serif">business</span> meets innovation. I find where the money is, then design and build the brands, websites and software that make it <span class="serif">real.</span></p>
      <p class="manifesto__by mono">— Jerry Onwuka, product designer &amp; systems builder</p>
      <div class="manifesto__bar"><i data-manifesto-bar></i></div>
    </section>

    <section class="wrap">
      <div class="stats">${S.stats.map(s => `<div class="stat" data-reveal="fade"><b><span data-count="${s.value}">${s.value}</span><sup>${s.suffix}</sup></b><span class="mono">${s.label}</span></div>`).join('')}</div>
    </section>

    <section class="section build">
      <div class="label-row mono"><span><span class="num">(02)</span> What I build</span><span>Services</span></div>
      <div class="build__head">
        <h2 class="display h2" data-reveal="chars">What I <span class="serif lime">build</span></h2>
        <p class="lead dim">I design and build the parts a business needs to turn an idea into revenue, and I build them as one system so they work together from the first day. Most projects combine two or three of these. Start with the one that is most broken today.</p>
      </div>
      <div class="build__grid">
        ${SV.map((s, i) => `<a class="build__card" href="/services/${s.slug}/" data-cursor="view" data-label="OPEN"><span class="mono lime">${pad(i + 1)}</span><h3>${s.name}</h3><p>${s.intro.split('. ')[0]}.</p><span class="build__link">${s.name.toLowerCase()} →</span></a>`).join('')}
        <a class="build__card" href="/work/?c=systems" data-cursor="view" data-label="OPEN"><span class="mono lime">04</span><h3>Software Systems</h3><p>Dashboards, marketplaces, admin control centres and AI assistants that run real operations instead of spreadsheets.</p><span class="build__link">software system work →</span></a>
      </div>
    </section>

    ${venturesSection('03')}

    <section class="hs" data-hs>
      <div class="hs__head">
        <h2 class="display h2" data-reveal="chars">Client <span class="serif lime">work</span></h2>
        <p class="mono dim" data-reveal="fade" style="max-width:34ch">[ ${featured.length} projects ] Systems that run businesses, brands that sell, stories that win. <a class="lime" href="/work/">See all selected work →</a></p>
      </div>
      <div class="hs__pin" data-hs-pin>
        <div class="hs__track" data-hs-track>
          ${featured.map((p, i) => `
          <a class="fcard" href="/work/${p.slug}/" data-cursor="view" data-label="OPEN">
            <div class="fcard__media">${p.award ? `<span class="fcard__badge mono">★ ${p.award}</span>` : ''}<img src="${thumb(p)}" alt="${esc(p.title)}" data-hs-img loading="lazy"></div>
            <div class="fcard__meta"><span class="fcard__num mono">${pad(i + 1)}</span><span class="fcard__title">${p.title}</span><span class="fcard__cat mono">${catOf(p.cat).short} · ${p.year}</span></div>
          </a>`).join('')}
          <div class="fcard fcard--end"><a href="/work/" data-cursor="link"><span><span class="mono">[ ${P.length} projects ]</span><b>All work</b><span class="serif" style="font-size:28px">→</span></span></a></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="label-row mono"><span><span class="num">(04)</span> Motion &amp; storytelling</span><span>Hover to play</span></div>
      <div class="ventures__head">
        <h2 class="display h2" data-reveal="chars">Stories in <span class="serif lime">motion</span></h2>
        <p class="lead dim">3D brand films, launch animations and stories that explain a product in seconds.</p>
      </div>
      <div class="reels">
        ${[['godark', 'big', '3D brand film'], ['boredroom-story', '', 'Illustrated story'], ['boredroom-film', '', '2D launch film']].map(([s, big, kind]) => { const p = bySlug(s); return `
        <a class="reel${big ? ' reel--big' : ''}" href="/work/${s}/" data-reel data-cursor="view" data-label="WATCH" data-reveal="clip">
          <img src="${thumb(p)}" alt="${esc(p.title)} film still" loading="lazy">
          <video src="${p.video}" muted loop playsinline preload="none"></video>
          ${p.award ? `<span class="badge mono">★ ${p.award}</span>` : ''}
          <span class="reel__meta"><b>${p.title}</b><span class="mono">${kind}</span></span>
        </a>`; }).join('')}
      </div>
    </section>

    <section class="section">
      <div class="label-row mono"><span><span class="num">(05)</span> Disciplines</span><span>Hover to preview</span></div>
      <ul class="disc">
        ${C.map((c, i) => { const ps = inCat(c.id); return `<li><a href="/work/?c=${c.id}" data-preview="${thumb(ps[0])}" data-cursor="link"><span class="mono">${pad(i + 1)}</span><b>${c.label}</b><span class="count">(${pad(ps.length)})</span><span class="arr">→</span></a></li>`; }).join('')}
      </ul>
    </section>

    ${marquee(['UI/UX Design', '<span class="serif">Software Systems</span>', 'Web Development', '<span class="serif">Brand Identity</span>', 'Motion Graphics', '<span class="serif">Storytelling</span>'], 'marquee--accent')}

    <section class="section">
      <div class="label-row mono"><span><span class="num">(06)</span> Services</span><span>What I do</span></div>
      <div class="svc" data-svc>
        ${S.services.map((s, i) => `
        <div class="svc__item${i === 0 ? ' open' : ''}">
          <button class="svc__head" aria-expanded="${i === 0}"><span class="mono lime">${pad(i + 1)}</span><b>${s.title}</b><span class="svc__plus"></span></button>
          <div class="svc__body" style="${i === 0 ? 'height:auto' : ''}"><div class="svc__inner"><p>${s.text}</p><div class="tags">${s.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div></div></div>
        </div>`).join('')}
      </div>
    </section>

    ${toolkitSection('07')}

    <section class="section" style="padding-top:0">
      <div class="label-row mono"><span><span class="num">(08)</span> Process</span><a class="lime" href="/process/">How the work runs →</a></div>
      <div class="process">
        ${S.process.map(s => `<article class="pcard"><div class="pcard__n">${s.n}</div><div class="pcard__r"><h3>${s.title}</h3><p>${s.text}</p></div><i class="pcard__shade" aria-hidden="true"></i></article>`).join('')}
      </div>
    </section>

    ${experienceSection('09')}
    ${certsSection('10')}

    <section class="section why">
      <div class="label-row mono"><span>Why one system</span><span>Not four vendors</span></div>
      <div class="why__grid">
        <h2 class="display h2">One system, not <span class="serif lime">four vendors</span></h2>
        <div>
          <p class="lead">Most businesses buy their brand from one person, their website from another, their software from a third and their launch video from a fourth. Each supplier makes reasonable decisions in isolation, and the business pays to reconcile them: a logo that breaks on mobile, a site that cannot show the product, a dashboard that looks like a different company.</p>
          <p class="dim">When one person designs and builds the whole system, every decision is made once, in order, against the same strategy. That is faster, it costs less to change later, and the result feels like one business everywhere a customer meets it. See <a class="lime" href="/process/">how the work runs</a>, or <a class="lime" href="/contact/">start a project</a>.</p>
        </div>
      </div>
    </section>

    <section class="scatter" data-scatter>
      <div class="scatter__title"><p class="mono dim" style="margin-bottom:16px">[ Branding ]</p><h2 class="display">Brands in<br><span class="serif">the wild</span></h2></div>
      ${scatterSet.map(([g, i, x, y, w, sp]) => {
        const slug = P.find(p => p.images === g).slug;
        return `<figure style="left:${x}%;top:${y}%;width:${w}vw;max-width:${w * 16}px;min-width:140px" data-speed="${sp}"><a href="/work/${slug}/" data-cursor="view"><img src="${img(g, i)}" alt="${brandMap[g]} brand application" loading="lazy" style="aspect-ratio:${dims(g, i)[1]}/${dims(g, i)[2]}"></a><figcaption class="mono">${brandMap[g]}</figcaption></figure>`;
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
      ${crumbs([['Home', '/'], ['Work', '/work/']])}
      <p class="mono dim" data-reveal="fade">[ Index of work ]</p>
      <div class="title-count"><h1 class="display" data-reveal="chars">Work</h1><sup aria-hidden="true">(${P.length})</sup></div>
      <div class="page-hero__sub"><p>Selected projects across <a href="/services/brand-identity-design/">brand identity design</a>, <a href="/services/web-design-services/">web design services</a>, <a href="/services/landing-page-design/">landing page design</a>, software systems and brand films. Each case study covers the brief, what made it hard, what shipped and how it turned an idea into something a business could use. Some are my own products; the rest were built for clients.</p></div>
    </section>
    <div class="filters">
      <a class="filter${active === 'all' ? ' on' : ''}" href="/work/${view === 'list' ? '?v=list' : ''}">All<sup>${P.length}</sup></a>
      ${C.map(c => `<a class="filter${active === c.id ? ' on' : ''}" href="/work/?c=${c.id}${view === 'list' ? '&v=list' : ''}">${c.label}<sup>${inCat(c.id).length}</sup></a>`).join('')}
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
          ? `<ul class="wlist">${ps.map(p => `<li><a href="/work/${p.slug}/" data-preview="${thumb(p)}" data-cursor="link"><span class="mono lime">${pad(++n)}</span><b>${p.title}</b><span class="mono dim">${p.industry}</span><span class="mono dim">${p.year}</span><span class="arr">→</span></a></li>`).join('')}</ul>`
          : `<div class="wgrid">${ps.map(p => projCard(p, n++)).join('')}</div>`}
      </section>`;
    }).join('')}
    ${footer()}`;
  };

  const browser = (g, i, url) => {
    const [name, w, h] = dims(g, i), tall = h / w > 0.75;
    return `<div class="browser${tall ? ' browser--tall' : ''}" data-reveal="card" ${tall ? 'data-cursor="view" data-label="SCROLL"' : ''}>
      <div class="browser__bar"><i></i><i></i><i></i><span>${host(url) || 'app'}</span></div>
      <div class="browser__view" style="${tall ? '' : `aspect-ratio:${w}/${h}`}"><img src="/assets/img/${g}/${name}" alt="" loading="lazy" data-w="${w}" data-h="${h}">${tall ? '<span class="browser__hint mono">Hover to scroll ↓</span>' : ''}</div>
    </div>`;
  };
  const phone = (g, i) => `<div class="phone" data-reveal="card"><div class="phone__screen"><img src="/assets/img/${g}/${dims(g, i)[0]}" alt="" loading="lazy"></div></div>`;

  const galleryFor = (p, limit = 999) => {
    const g = p.images, items = M[g].map((d, i) => ({ i, w: d[1], h: d[2], phone: d[1] <= 800 && d[2] > d[1] })).slice(0, limit);
    if (p.cat === 'branding') {
      return `<div class="masonry">${items.slice(1).map((it, k) => `<figure class="${k % 7 === 3 && it.w > it.h ? 'wide' : ''}" data-reveal="clip"><img src="/assets/img/${g}/${M[g][it.i][0]}" alt="${esc(p.title)} brand application ${k + 1}" loading="lazy" width="${it.w}" height="${it.h}" data-parallax-img></figure>`).join('')}</div>`;
    }
    if (p.cat === 'motion') {
      return `<div class="stills">${items.map(it => `<figure data-reveal="clip"><img src="/assets/img/${g}/${M[g][it.i][0]}" alt="${esc(p.title)} film still" loading="lazy"></figure>`).join('')}</div>`;
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
      ${crumbs([['Home', '/'], ['Work', '/work/'], [p.title, `/work/${p.slug}/`]])}
      <div class="case-hero__top mono">
        <a href="/work/?c=${p.cat}" data-cursor="link">← ${c.label}</a>
        <span>${pad(sameCat.indexOf(p) + 1)} / ${pad(sameCat.length)}</span>
        <span>${p.industry}</span>
      </div>
      <h1 class="case-title"><span class="display case-title__main" data-reveal="chars">${p.title}</span><span class="sr-only">: </span><span class="case-hero__sub" data-reveal="words">${titleWords.slice(0, -1).join(' ')} <em>${titleWords.slice(-1)}</em></span></h1>
      <p class="case-hero__line">${/personal/i.test(p.client) ? `${p.title} is one of my own products` : `A ${kindOf(p).toLowerCase()} project for ${p.client}`}, in ${p.industry.toLowerCase().replace(' · ', ' and ').replace(/\bsaas\b/g, 'SaaS').replace(/\bai\b/g, 'AI')}, ${p.year}.${serviceOf(p) ? ` Service: <a href="/services/${serviceOf(p)}/">${svc(serviceOf(p)).name}</a>.` : ''}</p>
      <dl class="meta mono">
        <div data-reveal="fade"><dt>Client</dt><dd>${p.client}</dd></div>
        <div data-reveal="fade"><dt>Role</dt><dd>${p.role}</dd></div>
        <div data-reveal="fade"><dt>Services</dt><dd>${p.services.join(', ')}</dd></div>
        <div data-reveal="fade"><dt>Year</dt><dd>${p.year}${p.award ? ` · <span class="lime">★ ${p.award}</span>` : ''}</dd></div>
        <div data-reveal="fade">${p.url ? `<a class="btn btn--accent" href="${p.url}" target="_blank" rel="noopener" data-magnetic><span>Visit live</span><i>↗︎</i></a>` : ''}</div>
      </dl>
    </section>

    ${p.video ? `
    <div class="cover cover--video" data-video>
      <video src="${p.video}" poster="${p.poster || thumb(p)}" preload="none" playsinline></video>
      <div class="cover__big" aria-hidden="true"><span>Play</span><span>This</span></div>
      <button class="play" data-cursor="play" data-label="PLAY" aria-label="Play ${esc(p.title)} film">PLAY ▶︎</button>
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
    <div class="label-row mono" style="margin:${k ? 'clamp(60px,8vw,120px)' : '0'} var(--gutter) 28px"><span><span class="num">(${pad(4 + k)})</span> ${label}</span><a href="/work/${s}/" class="lime" data-cursor="link">[ Full ${label.toLowerCase()} case study → ]</a></div>
    ${galleryFor(q, q.cat === 'branding' ? 7 : 5)}`; }).join('') : `
    <div class="label-row mono" style="margin:0 var(--gutter) 28px"><span><span class="num">(04)</span> ${p.cat === 'motion' ? 'Film stills' : p.cat === 'branding' ? 'Brand in use' : 'Screens'}</span><span>${M[p.images].length} images</span></div>
    ${galleryFor(p)}`}

    ${(() => { const s = serviceOf(p); const rel = P.filter(x => x !== p && (s ? serviceOf(x) === s : x.cat === p.cat)).slice(0, 2); return `
    <section class="section related">
      <div class="label-row mono"><span>Related work</span><span>Keep exploring</span></div>
      <div class="related__grid">
        ${rel.map(x => `<a class="related__card" href="/work/${x.slug}/" data-cursor="view"><img src="${thumb(x)}" alt="${esc(x.title)} ${esc(kindOf(x).toLowerCase())} preview" loading="lazy"><span><b>${x.title}</b><span class="mono dim">${x.title} case study</span></span></a>`).join('')}
        <div class="related__next">
          <h2 class="h3 display">Want something <span class="serif lime">like this?</span></h2>
          <p class="dim">${s ? `This project is an example of my <a class="lime" href="/services/${s}/">${svc(s).name.toLowerCase()}</a> work.` : 'Brand films and launch animations are part of how I help products land.'} Tell me what you are building and I will show you how I would approach it.</p>
          <a class="btn btn--accent btn--lg" href="/contact/" data-magnetic><span>Start a project like this</span><i>→</i></a>
        </div>
      </div>
    </section>`; })()}

    <a class="next" href="/work/${next.slug}/" data-cursor="view" data-label="NEXT">
      <div class="next__label mono"><span>[ Next project ]</span><span>${catOf(next.cat).label}</span></div>
      <div class="next__img"><img src="${thumb(next)}" alt="" loading="lazy"></div>
      <h2 class="next__title display">${next.title}</h2>
    </a>
    ${footer()}`;
  };

  const About = () => `
    <section class="page-hero about-hero">
      <div>
        ${crumbs([['Home', '/'], ['About', '/about/']])}
        <p class="mono dim" data-reveal="fade">[ About ]</p>
        <h1 class="display" data-reveal="chars"><span class="sr-only">About </span>Jerry <br><span class="serif lime">Onwuka</span></h1>
      </div>
      <figure class="about-hero__photo" data-reveal="clip"><img src="${S.photos.about}" alt="Jerry Onwuka smiling at his desk" data-parallax-img></figure>
    </section>
    <section class="about-intro">
      <div>
        <p data-reveal="words">Hey, I'm Jerry. I turn <em class="serif lime">ideas</em> into things that actually make <em class="serif lime">money.</em></p>
        <p data-reveal="words">I've been an entrepreneur at heart since I was a kid. Always selling something, starting something, or taking things apart to see how they could work better. That never went away. It just got bigger tools.</p>
        <p class="small" data-reveal="fade">These days I sit right where business meets innovation. For 7+ years I've worked with 100+ brands, from first-time founders to established companies, and my process is simple: find where the money is, then design and build everything around it. The brand, the website that sells it, the software that runs it, and the story that launches it.</p>
        <p class="small" data-reveal="fade">Right now I'm the Brand Designer at XSITE Capital Investment and a Google-certified UX designer, based in ${S.location} and working with teams anywhere.</p>
        <div class="footer__actions" style="justify-content:flex-start" data-reveal="fade">
          <a class="btn btn--accent btn--lg" href="${S.cv}" target="_blank" rel="noopener" data-magnetic><span>Download CV</span><i>↓</i></a>
          <a class="btn btn--ghost btn--lg" href="/contact/" data-magnetic><span>Say hi</span><i>↗︎</i></a>
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

    <section class="section about-cols">
      <div class="about-cols__grid">
        <div><h2 class="h3 display">What I do</h2><p class="dim">I design and build the systems that turn ideas into revenue: <a class="lime" href="/services/brand-identity-design/">brand identity design</a>, <a class="lime" href="/services/web-design-services/">web design services</a>, <a class="lime" href="/services/landing-page-design/">landing page design</a>, software systems and motion. You can see it all in <a class="lime" href="/work/">the work</a>.</p></div>
        <div><h2 class="h3 display">How I work</h2><p class="dim">One person, one run, one handover. Every project moves through the same five stages, from brief to handover, so nothing gets designed twice. Here is <a class="lime" href="/process/">the full process</a>.</p></div>
        <div><h2 class="h3 display">What I believe about systems</h2><p class="dim">A business is not a logo, a website and an app. It is one system that customers meet in different places. When those places agree, trust builds itself. When they don't, money leaks.</p></div>
      </div>
    </section>

    <section class="section founder">
      <div class="label-row mono"><span><span class="num">(01)</span> Co-founder mode</span><span>Boredroom</span></div>
      <div class="founder__grid">
        <div>
          <h2 class="display h2">Living the <span class="serif lime">dream</span></h2>
          <p class="lead">I'm the co-founder of Boredroom, remote team software where everyone gets their own AI assistant. Building it is literally the thing I used to daydream about as a kid: an idea, a team, a real product people pay for.</p>
          <p class="dim founder__more">And honestly? This is just the start. There are a whole lot more products and systems I want to build, and I'm building them.</p>
          <a class="btn btn--accent btn--lg" href="/work/boredroom/" data-magnetic><span>See how I built Boredroom</span><i>→</i></a>
        </div>
        <div class="founder__media">
          <a class="founder__link" href="/work/boredroom/" data-cursor="view" data-label="OPEN" data-reveal="clip"><img src="${thumb(bySlug('boredroom'))}" alt="Boredroom website" loading="lazy"></a>
          <svg class="founder__badge" viewBox="0 0 120 120" aria-hidden="true" data-spin>
            <defs><path id="fb-circle" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"/></defs>
            <circle cx="60" cy="60" r="58" class="founder__badge-bg"/>
            <text><textPath href="#fb-circle" textLength="272" lengthAdjust="spacing">CO-FOUNDER • BOREDROOM • </textPath></text>
            <text x="60" y="68" text-anchor="middle" class="founder__badge-star">★</text>
          </svg>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="label-row mono"><span><span class="num">(02)</span> Off the clock</span><span>Hover the cards</span></div>
      <h2 class="display h2 hobbies__title">When I'm not <span class="serif lime">building</span></h2>
      <div class="hobbies">
        <article class="hobby" data-hobby="ball">
          <div class="hobby__art"><svg viewBox="0 0 80 80" class="hobby__ball"><circle cx="40" cy="40" r="30"/><path d="M10 40h60M40 10v60M19 19c10 10 10 32 0 42M61 19c-10 10-10 32 0 42"/></svg><i class="hobby__shadow"></i></div>
          <span class="mono">(01) Basketball</span>
          <h3>Ball is life</h3>
          <p>Best ideas show up between buckets. If I'm not at my desk, check the court.</p>
        </article>
        <article class="hobby" data-hobby="game">
          <div class="hobby__art"><svg viewBox="0 0 96 64" class="hobby__pad"><path d="M24 12h48c12 0 20 10 22 24s-4 22-12 22c-6 0-10-6-14-10H28c-4 4-8 10-14 10C6 58 0 50 2 36S12 12 24 12Z"/><path d="M22 28v14M15 35h14"/><circle class="b1" cx="68" cy="30" r="3.5"/><circle class="b2" cx="77" cy="38" r="3.5"/></svg></div>
          <span class="mono">(02) Gaming</span>
          <h3>Player one</h3>
          <p>I love gaming. So much. It's how my brain cools down after a heavy build, and I come back sharper.</p>
        </article>
        <article class="hobby" data-hobby="classical">
          <div class="hobby__art"><svg viewBox="0 0 80 80" class="hobby__staff"><path d="M6 26h68M6 34h68M6 42h68M6 50h68M6 58h68" class="lines"/><g class="note"><ellipse cx="28" cy="54" rx="6" ry="4.5"/><path d="M34 54V22"/></g><g class="note"><ellipse cx="50" cy="46" rx="6" ry="4.5"/><path d="M56 46V14q6 4 8 10"/></g></svg></div>
          <span class="mono">(03) Classical</span>
          <h3>Bach on, world off</h3>
          <p>Classical music is my deep-focus mode. One symphony in and I'm locked in for hours.</p>
        </article>
        <article class="hobby" data-hobby="jazz">
          <div class="hobby__art hobby__art--player">
            <span class="mono">Now playing</span>
            <b>Late-night lock-in</b>
            <span class="eq">${'<i></i>'.repeat(9)}</span>
            <span class="hobby__track"><i></i></span>
          </div>
          <span class="mono">(04) Jazz</span>
          <h3>Saxophone focus</h3>
          <p>Jazz is how I lock in. Late build, headphones on, sax going. That's the zone.</p>
        </article>
      </div>
    </section>

    ${experienceSection('03')}

    <section class="section" style="padding-top:0">
      <div class="label-row mono"><span><span class="num">(04)</span> Skills</span><span>Self-assessed</span></div>
      <div class="skills">${S.skills.map(([k, v]) => `<div class="skill" data-reveal="fade"><div class="skill__row"><b>${k}</b><span class="mono dim">${v}</span></div><div class="skill__bar"><i data-skill="${v === 'Advanced' ? .92 : .65}"></i></div></div>`).join('')}</div>
    </section>

    ${toolkitSection('05')}

    ${marquee(S.services.map(s => s.title), 'marquee--accent')}

    ${certsSection('06')}
    ${footer()}`;

  const Contact = () => `
    <section class="contact">
      <div>
        ${crumbs([['Home', '/'], ['Contact', '/contact/']])}
        <p class="mono dim" data-reveal="fade">[ Got an idea? ]</p>
        <h1 class="display" data-reveal="chars">Start a <span class="serif lime">project</span></h1>
        <p class="lead" style="margin-top:28px">Tell me what you are building, what is broken today and what a win looks like. Send the form below or email me directly. I read every message myself and reply within two working days with next steps.</p>
      </div>
      <div class="contact__grid">
        <h2 class="sr-only">Other ways to reach me</h2>
        <div data-reveal="fade"><span class="mono">Email</span><a href="mailto:${S.email}?subject=Project%20enquiry" data-cursor="link">${S.email}</a></div>
        <div data-reveal="fade"><span class="mono">Phone / WhatsApp</span><a href="tel:${S.phone.replace(/\s/g, '')}" data-cursor="link">${S.phone}</a></div>
        <div data-reveal="fade"><span class="mono">CV</span><a href="${S.cv}" target="_blank" rel="noopener" data-cursor="link">Download PDF ↓</a></div>
        <div data-reveal="fade"><span class="mono">Pricing</span><a href="/pricing/" data-cursor="link">See packages →</a></div>
        ${S.socials.map(s => `<div data-reveal="fade"><span class="mono">${s.label}</span><a href="${s.url}" target="_blank" rel="noopener" data-cursor="link">${s.handle} ↗︎</a></div>`).join('')}
      </div>
    </section>
    <section class="section contact-info">
      <div class="contact-info__grid">
        <div>
          <h2 class="h3 display">What to include in your message</h2>
          <ul class="prose-list">
            <li>What you are building and who it is for.</li>
            <li>Where things stand today: an idea, an existing brand, a live site that is not working.</li>
            <li>When you need it, and any date that cannot move.</li>
            <li>A rough budget range, so I can suggest the right scope.</li>
          </ul>
        </div>
        <div>
          <h2 class="h3 display">What happens after you send it</h2>
          <ol class="prose-list">
            <li>I reply within two working days, usually with a few questions.</li>
            <li>We have a short call about the business and the goal.</li>
            <li>I send a written scope and quote. You can see <a class="lime" href="/process/">what happens next</a> stage by stage.</li>
          </ol>
        </div>
        <div>
          <h2 class="h3 display">Not sure which service you need?</h2>
          <p class="dim">If the business looks different everywhere, start with <a class="lime" href="/services/brand-identity-design/">brand identity design</a>. If people cannot find or understand you online, look at <a class="lime" href="/services/web-design-services/">web design services</a>. If you need one campaign, launch or waitlist to perform, <a class="lime" href="/services/landing-page-design/">landing page design</a> is the fastest route. Or just describe the problem and I will tell you.</p>
        </div>
      </div>
    </section>
    ${projectForm('01')}
    ${marquee(['Software Systems', '<span class="serif">Websites</span>', 'Branding', '<span class="serif">Motion</span>', 'UI/UX'], 'marquee--accent')}
    <footer class="footer" style="padding-top:40px"><div class="footer__name" data-footer-name aria-hidden="true">Jerry Onwuka</div></footer>`;

  const usd = n => n.toLocaleString('en-US');

  /* project enquiry form: sends to my inbox */
  const projectForm = (num = '03') => `
    <section class="section pform-wrap" id="start">
      <div class="label-row mono"><span><span class="num">(${num})</span> Start a project</span><span>Straight to my inbox</span></div>
      <div class="pform-grid">
        <div>
          <h2 class="display h2">Let's <span class="serif lime">talk</span></h2>
          <p class="lead dim">Tell me about the idea, the business behind it and where you want it to go. I'll get back to you with next steps and a quote.</p>
          <p class="mono dim pform-alt">Prefer email? <a class="lime" href="mailto:${S.email}?subject=Project%20enquiry">${S.email}</a></p>
        </div>
        <form class="pform" data-form novalidate method="POST" action="https://formsubmit.co/${S.email}">
          <input type="hidden" name="_subject" value="New project enquiry from the website">
          <input type="hidden" name="_template" value="table">
          <input type="text" name="_honey" class="pform__hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          <label class="field"><span class="mono">Your name *</span><input name="name" required autocomplete="name" placeholder="Ada Obi"></label>
          <label class="field"><span class="mono">Email *</span><input name="email" type="email" required autocomplete="email" placeholder="ada@company.com"></label>
          <label class="field"><span class="mono">Company or brand</span><input name="company" autocomplete="organization" placeholder="Optional"></label>
          <label class="field"><span class="mono">Project type</span><select name="project_type">
            <option>Brand identity</option><option>Web design</option><option>Landing page</option><option>Software system</option><option>Motion or brand film</option><option selected>Other / not sure</option></select></label>
          <label class="field"><span class="mono">Package</span><select name="package" data-pkg-select>
            ${S.packages.map(k => `<option value="${k.name} (from $${usd(k.price)})">${k.name}, from $${usd(k.price)}</option>`).join('')}
            <option value="Custom">Custom</option><option value="Not sure yet" selected>Not sure yet</option></select></label>
          <label class="field"><span class="mono">Budget</span><select name="budget">
            <option>Under $700</option><option>$700 to $1,500</option><option selected>$1,500 to $2,500</option><option>$2,500 to $5,000</option><option>$5,000+</option></select></label>
          <label class="field"><span class="mono">Timeline</span><select name="timeline">
            <option>As soon as possible</option><option selected>Within a month</option><option>1 to 3 months</option><option>Flexible</option></select></label>
          <label class="field field--full"><span class="mono">Tell me about the project *</span><textarea name="message" rows="5" required placeholder="What are you building, who is it for, and what does success look like?"></textarea></label>
          <div class="pform__foot field--full">
            <button class="btn btn--accent btn--lg" type="submit" data-magnetic><span data-btn-label>Send it</span><i>↗︎</i></button>
            <p class="pform__status mono" data-form-status role="status" aria-live="polite"></p>
          </div>
        </form>
      </div>
    </section>`;

  const Pricing = () => `
    <section class="page-hero">
      ${crumbs([['Home', '/'], ['Pricing', '/pricing/']])}
      <p class="mono dim" data-reveal="fade">[ Rate card ]</p>
      <h1 class="display" data-reveal="chars">Pricing</h1>
      <div class="page-hero__sub"><p>Clear starting points in USD for <a href="/services/brand-identity-design/">brand identity design</a>, <a href="/services/web-design-services/">websites</a>, <a href="/services/landing-page-design/">landing pages</a> and software systems. Every project still gets a proper quote once I understand the business behind it.</p></div>
    </section>

    <section class="section" style="padding-top:clamp(24px,4vw,48px)">
      <div class="label-row mono"><span><span class="num">(01)</span> Packages</span><span>Starting prices</span></div>
      <div class="pkgs">
        ${S.packages.map((k, i) => `
        <article class="pkg${k.featured ? ' pkg--featured' : ''}" data-pkg-card>
          <div class="pkg__top"><span class="mono">${pad(i + 1)} · ${k.tag}</span>${k.featured ? '<span class="pkg__star mono">★ Popular</span>' : ''}</div>
          <h2 class="pkg__name display">${k.name}</h2>
          <div class="pkg__price"><span class="mono">from</span><b>$<span data-count="${usd(k.price)}">${usd(k.price)}</span></b></div>
          <p class="pkg__blurb">${k.blurb}</p>
          <ul class="pkg__list">${k.items.map(t => `<li>${t}</li>`).join('')}</ul>
          <p class="pkg__time mono">Timeline · ${k.time}</p>
          <a class="btn ${k.featured ? 'btn--ink' : 'btn--accent'} btn--lg pkg__cta" href="#start" data-pkg="${k.name} (from $${usd(k.price)})" data-magnetic><span>Start with ${k.name}</span><i>→</i></a>
        </article>`).join('')}
        <article class="pkg pkg--custom" data-pkg-card>
          <div class="pkg__top"><span class="mono">04 · Anything else</span></div>
          <h2 class="pkg__name display">Custom</h2>
          <div class="pkg__price"><b class="serif">Let's talk</b></div>
          <p class="pkg__blurb">Bigger builds, retainers, ongoing design support or something that doesn't fit a box. Send me an email and we'll scope it together.</p>
          <a class="btn btn--ghost btn--lg pkg__cta" href="mailto:${S.email}?subject=Custom%20project%20enquiry" data-magnetic><span>Send an email</span><i>↗︎</i></a>
        </article>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="label-row mono"><span><span class="num">(02)</span> Rate card</span><span>Single services, from</span></div>
      <ul class="rates">
        ${S.rateCard.map(([n, dsc, p, unit], i) => `<li><span class="mono lime">${pad(i + 1)}</span><b>${n}</b><span class="dim">${dsc}</span><span class="rates__price"><span class="mono dim">from</span> $${usd(p)}<span class="mono dim">${unit}</span></span></li>`).join('')}
      </ul>
      <p class="mono dim rates__note">Prices are starting points. Final quotes depend on scope, timeline and how much we build together.</p>
    </section>

    ${projectForm('03')}
    ${footer()}`;

  const NotFound = () => `<section class="contact"><div><p class="mono dim">[ 404 ]</p><h1 class="display">This page does not <span class="serif lime">exist</span></h1><p class="lead">The link may be old or mistyped. Try the <a href="/" class="lime">home page</a>, browse <a href="/work/" class="lime">the work</a> or <a href="/contact/" class="lime">start a project</a>.</p></div></section>`;

  /* =========================================================
     SEO PAGES: services, process, insights, articles, privacy
     ========================================================= */
  const workCard = (slug, anchor) => { const p = bySlug(slug); return `
    <a class="related__card" href="/work/${p.slug}/" data-cursor="view"><img src="${thumb(p)}" alt="${esc(p.title)} ${esc(kindOf(p).toLowerCase())} preview" loading="lazy"><span><b>${p.title} ${anchor}</b><span class="mono dim">${p.sub}</span></span></a>`; };

  const ServicePage = slug => {
    const s = svc(slug); if (!s) return NotFound();
    const a = art(s.article);
    return `
    <section class="page-hero svc-hero">
      ${crumbs([['Home', '/'], [s.name, `/services/${s.slug}/`]])}
      <p class="mono dim" data-reveal="fade">[ Service ]</p>
      <h1 class="display svc-hero__h1" data-reveal="chars">${s.h1}</h1>
      <div class="page-hero__sub"><p class="svc-intro">${s.intro}</p></div>
      <div class="footer__actions" style="justify-content:flex-start;margin-top:28px">
        <a class="btn btn--accent btn--lg" href="/contact/" data-magnetic><span>Start a project</span><i>→</i></a>
        <a class="btn btn--ghost btn--lg" href="/pricing/" data-magnetic><span>See pricing</span><i>→</i></a>
      </div>
    </section>
    <article class="prose-page">
      ${s.sections.map(sec => `<section class="prose-sec"><h2>${sec.h2}</h2>${sec.html}</section>`).join('')}
      <section class="prose-sec">
        <h2>${s.stagesH2}</h2>
        <ol class="stage-list">${s.stages.map(([h, t], i) => `<li><span class="mono lime">${pad(i + 1)}</span><div><h3>${h}</h3><p>${t}</p></div></li>`).join('')}</ol>
        <p>Every project follows <a href="/process/">the full design and build process</a>, from brief to handover.</p>
      </section>
      ${s.standards ? `<section class="prose-sec"><h2>${s.standardsH2}</h2><ul class="prose-list">${s.standards.map(t => `<li>${t}</li>`).join('')}</ul></section>` : ''}
      <section class="prose-sec"><h2>What it costs and how long it takes</h2>${s.cost}</section>
    </article>
    <section class="section related">
      <div class="label-row mono"><span>Selected ${s.name.toLowerCase()} work</span><a class="lime" href="/work/">All work →</a></div>
      <div class="related__grid related__grid--3">${s.work.map(w => workCard(w, s.workAnchor)).join('')}</div>
    </section>
    <section class="prose-page faq">
      <h2>${s.slug === 'brand-identity-design' ? 'Questions before you book' : s.slug === 'web-design-services' ? 'Web design services, questions' : 'Landing page questions'}</h2>
      ${s.faqs.map(([q, ans]) => `<div class="faq__item"><h3>${q}</h3><p>${ans}</p></div>`).join('')}
    </section>
    <section class="section svc-more">
      <div class="svc-more__grid">
        ${a ? `<a class="svc-more__card" href="/insights/${a.slug}/"><span class="mono lime">Insight</span><b>${a.title}</b><span class="dim">${a.excerpt}</span></a>` : ''}
        ${s.siblings.map(x => `<a class="svc-more__card" href="/services/${x}/"><span class="mono lime">Related service</span><b>${svc(x).name}</b><span class="dim">${svc(x).intro.split('. ')[0]}.</span></a>`).join('')}
      </div>
    </section>
    <section class="section svc-cta">
      <h2 class="display h2">${s.ctaH2.replace(/(\w+)$/, '<span class="serif lime">$1</span>')}</h2>
      <p class="lead dim">${s.ctaText}</p>
      <a class="btn btn--accent btn--lg" href="/contact/" data-magnetic><span>${s.ctaAnchor.charAt(0).toUpperCase() + s.ctaAnchor.slice(1)}</span><i>→</i></a>
    </section>
    ${footer()}`;
  };

  const Process = () => { const pr = CT.process; return `
    <section class="page-hero">
      ${crumbs([['Home', '/'], ['Process', '/process/']])}
      <p class="mono dim" data-reveal="fade">[ Process ]</p>
      <h1 class="display" data-reveal="chars">How a project <span class="serif lime">runs</span></h1>
      <div class="page-hero__sub"><p>${pr.intro}</p></div>
    </section>
    <section class="section" style="padding-top:clamp(24px,4vw,48px)">
      <ol class="pstages">
        ${pr.stages.map(([h, t, get], i) => `<li class="pstage"><div class="pstage__n display">${pad(i + 1)}</div><div><h2>Stage ${pad(i + 1)}: ${h}</h2><p>${t}</p><p class="pstage__get"><span class="mono lime">You receive</span> ${get}</p></div></li>`).join('')}
      </ol>
    </section>
    <section class="prose-page">
      <h2>What I need from you</h2>
      <ul class="prose-list">${pr.needs.map(t => `<li>${t}</li>`).join('')}</ul>
      <h2>Start a project</h2>
      <p>The same process runs for <a href="/services/brand-identity-design/">brand identity design</a>, <a href="/services/web-design-services/">web design services</a> and <a href="/services/landing-page-design/">landing page design</a>, as well as software systems and brand films. When you are ready, <a href="/contact/">start a project</a> and tell me where things stand today.</p>
    </section>
    ${footer()}`; };

  const Insights = () => `
    <section class="page-hero">
      ${crumbs([['Home', '/'], ['Insights', '/insights/']])}
      <p class="mono dim" data-reveal="fade">[ Insights ]</p>
      <h1 class="display" data-reveal="chars">Insights</h1>
      <div class="page-hero__sub"><p>Notes on brand identity, web design and landing pages, written to be used: the checklists, comparisons and teardowns the work actually runs on. Each one links to the matching service: <a href="/services/brand-identity-design/">brand identity design</a>, <a href="/services/web-design-services/">web design services</a> and <a href="/services/landing-page-design/">landing page design</a>.</p></div>
    </section>
    <section class="section" style="padding-top:clamp(24px,4vw,48px)">
      <ul class="alist">${AR.map((x, i) => `<li><a href="/insights/${x.slug}/" data-cursor="link"><span class="mono lime">${pad(i + 1)}</span><div><h2>${x.title}</h2><p class="dim">${x.excerpt}</p><span class="mono dim">${x.readTime} min read · ${svc(x.parent).name}</span></div><span class="arr" aria-hidden="true">→</span></a></li>`).join('')}</ul>
    </section>
    ${footer()}`;

  const fmtDate = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const Article = slug => {
    const x = art(slug); if (!x) return NotFound();
    const sibs = (x.related ? x.related.map(art).filter(Boolean) : AR.filter(y => y !== x)).slice(0, 2), parent = svc(x.parent);
    return `
    <article class="article">
      <header class="article__head">
        ${crumbs([['Home', '/'], ['Insights', '/insights/'], [x.title, `/insights/${x.slug}/`]])}
        <p class="mono lime">[ ${parent.name} ]</p>
        <h1 class="display article__h1">${x.h1}</h1>
        <p class="article__by mono">By <a href="/about/" rel="author">Jerry Onwuka</a> · <time datetime="${x.published}">${fmtDate(x.published)}</time> · ${x.readTime} min read</p>
      </header>
      <div class="prose article__body">${x.body}
        <h2>Useful sources</h2>
        <ul class="sources">${x.sources.map(t => `<li>${t}</li>`).join('')}</ul>
      </div>
    </article>
    <section class="section svc-more">
      <div class="svc-more__grid">
        <a class="svc-more__card" href="/services/${parent.slug}/"><span class="mono lime">The service</span><b>${parent.name}</b><span class="dim">${parent.intro.split('. ')[0]}.</span></a>
        ${sibs.map(y => `<a class="svc-more__card" href="/insights/${y.slug}/"><span class="mono lime">Read next</span><b>${y.title}</b><span class="dim">${y.excerpt}</span></a>`).join('')}
      </div>
    </section>
    <section class="section svc-cta">
      <h2 class="display h2">Got a project <span class="serif lime">in mind?</span></h2>
      <p class="lead dim">If you would rather have this designed and built for you, tell me what you are working on and I will reply with how I would approach it.</p>
      <a class="btn btn--accent btn--lg" href="/contact/" data-magnetic><span>Start a project</span><i>→</i></a>
    </section>
    ${footer()}`;
  };

  const Privacy = () => `
    <section class="page-hero">
      ${crumbs([['Home', '/'], ['Privacy', '/privacy/']])}
      <h1 class="display" data-reveal="chars">Privacy</h1>
    </section>
    <section class="prose-page">${CT.privacy.html}</section>
    ${footer()}`;

  /* =========================================================
     ROUTES + SEO META + STRUCTURED DATA
     ========================================================= */
  const url = p => BASE + p;
  const clip = (t, n = 155) => { if (t.length <= n) return t; const c = t.slice(0, n - 1); return c.slice(0, c.lastIndexOf(' ')).replace(/[,;:]$/, '') + '.'; };
  const sameAs = S.socials.map(s => s.url);
  const graph = () => ({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': url('/#person'), name: S.name, url: url('/'), image: url('/og/jerry-onwuka.jpg'), jobTitle: 'Product Designer & Systems Builder', description: 'Designs and builds complete, functioning business systems: software, websites, brand identity and motion storytelling, rather than isolated deliverables.', knowsAbout: ['Web Design', 'Brand Identity Design', 'Landing Page Design', 'Business Systems', 'Motion Design', 'UI/UX Design'], sameAs, worksFor: { '@id': url('/#organization') } },
      { '@type': ['Organization', 'ProfessionalService'], '@id': url('/#organization'), name: S.name, url: url('/'), logo: url('/og/logo.png'), image: url('/og/jerry-onwuka.jpg'), description: 'Design and development practice turning ideas into profitable working systems: software, websites, brand identity and motion storytelling.', founder: { '@id': url('/#person') }, employee: { '@id': url('/#person') }, sameAs, areaServed: { '@type': 'Place', name: 'Worldwide' },
        hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Services', itemListElement: SV.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: url(`/services/${s.slug}/`) } })) } },
      { '@type': 'WebSite', '@id': url('/#website'), url: url('/'), name: S.name, inLanguage: 'en', publisher: { '@id': url('/#organization') } }
    ]
  });
  const breadcrumb = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, p], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: url(p) })) });
  const faqLd = (path, faqs) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', '@id': url(path + '#faq'), mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });

  const STATIC = {
    '/': () => ({ html: Home(), title: 'Jerry Onwuka - Brand, Web and Motion Systems', description: 'Jerry Onwuka turns ideas into profitable working systems: brand identity, web design, landing pages and motion, delivered as one functioning build.', ld: [graph()] }),
    '/work/': q => ({ html: Work(q), title: 'Work | Jerry Onwuka', description: 'Selected brand identity, web design, landing page and software projects, with the brief, the constraint and what shipped.', crumbs: [['Home', '/'], ['Work', '/work/']] }),
    '/about/': () => ({ html: About(), title: 'About Jerry Onwuka | Designer, Developer, Systems Builder', description: 'Jerry Onwuka designs and builds complete business systems: brand identity, websites, landing pages and motion, as one person, one run, one handover.', crumbs: [['Home', '/'], ['About', '/about/']] }),
    '/process/': () => ({ html: Process(), title: CT.process.title, description: CT.process.description, crumbs: [['Home', '/'], ['Process', '/process/']] }),
    '/contact/': () => ({ html: Contact(), title: 'Contact | Jerry Onwuka', description: 'Start a project with Jerry Onwuka. Tell me what you are building, what is broken and what a win looks like. Reply within two working days.', crumbs: [['Home', '/'], ['Contact', '/contact/']],
      extra: [{ '@context': 'https://schema.org', '@type': 'ContactPage', '@id': url('/contact/#contactpage'), url: url('/contact/'), name: 'Contact | Jerry Onwuka', inLanguage: 'en', isPartOf: { '@id': url('/#website') }, about: { '@id': url('/#organization') } }] }),
    '/pricing/': () => ({ html: Pricing(), title: 'Pricing and Rate Card | Jerry Onwuka', description: 'Packages and rates for brand identity, websites, landing pages and software systems, from $700, plus a custom option for larger builds.', crumbs: [['Home', '/'], ['Pricing', '/pricing/']] }),
    '/insights/': () => ({ html: Insights(), title: 'Insights | Jerry Onwuka', description: 'Notes on brand identity, web design and landing pages, written to be used, with the checklists and comparisons the work actually runs on.', crumbs: [['Home', '/'], ['Insights', '/insights/']] }),
    '/privacy/': () => ({ html: Privacy(), title: CT.privacy.title, description: CT.privacy.description, crumbs: [['Home', '/'], ['Privacy', '/privacy/']] })
  };

  const resolve = (path, q = new URLSearchParams()) => {
    let r, m;
    if (STATIC[path]) r = STATIC[path](q);
    else if ((m = path.match(/^\/services\/([a-z0-9-]+)\/$/)) && svc(m[1])) {
      const s = svc(m[1]), cr = [['Home', '/'], [s.name, path]];
      r = { html: ServicePage(s.slug), title: s.title, description: s.description, crumbs: cr,
        extra: [{ '@context': 'https://schema.org', '@type': 'Service', '@id': url(path + '#service'), name: s.name, serviceType: s.name, url: url(path), description: s.schemaDescription, provider: { '@id': url('/#organization') }, areaServed: { '@type': 'Place', name: 'Worldwide' }, audience: { '@type': 'BusinessAudience', name: 'Founders and growing businesses' } }, faqLd(path, s.faqs)] };
    }
    else if ((m = path.match(/^\/work\/([a-z0-9-]+)\/$/)) && bySlug(m[1])) {
      const p = bySlug(m[1]), kind = kindOf(p), s = serviceOf(p);
      let title = `${p.title} ${kind} Case Study | Jerry Onwuka`; if (title.length > 60) title = `${p.title} ${kind} | Jerry Onwuka`; if (title.length > 60) title = `${p.title} | Jerry Onwuka`;
      const description = clip(`${p.title} ${kind.toLowerCase()} case study: ${p.sub.replace(/\.$/, '')}. ${p.outcome}`);
      r = { html: Case(p.slug), title, description, image: thumb(p), crumbs: [['Home', '/'], ['Work', '/work/'], [p.title, path]],
        extra: [{ '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': url(path + '#work'), name: `${p.title}: ${p.sub}`, url: url(path), description, image: url(thumb(p)), datePublished: CT.updated, dateModified: CT.updated, creator: { '@id': url('/#person') }, ...(s ? { about: { '@id': url(`/services/${s}/#service`) } } : {}) }] };
    }
    else if ((m = path.match(/^\/insights\/([a-z0-9-]+)\/$/)) && art(m[1])) {
      const x = art(m[1]);
      r = { html: Article(x.slug), title: x.metaTitle, description: x.description, type: 'article', crumbs: [['Home', '/'], ['Insights', '/insights/'], [x.title, path]],
        extra: [{ '@context': 'https://schema.org', '@type': 'Article', '@id': url(path + '#article'), headline: x.h1.charAt(0).toUpperCase() + x.h1.slice(1), description: x.description, url: url(path), mainEntityOfPage: { '@id': url(path) }, datePublished: x.published, dateModified: x.updated, inLanguage: 'en', image: url('/og/jerry-onwuka.jpg'), author: { '@id': url('/#person') }, publisher: { '@id': url('/#organization') }, about: { '@id': url(`/services/${x.parent}/#service`) }, isPartOf: { '@id': url('/#website') } }] };
    }
    if (!r) return { html: NotFound(), title: 'Not found | Jerry Onwuka', description: 'This page does not exist.', status: 404, canonical: null, ld: [] };
    const ld = [...(r.ld || []), ...(r.crumbs ? [breadcrumb(r.crumbs)] : []), ...(r.extra || [])];
    return { ...r, status: 200, canonical: url(path), ld };
  };

  const routes = () => [
    '/', '/work/', '/about/', '/process/', '/contact/', '/pricing/', '/insights/', '/privacy/',
    ...SV.map(s => `/services/${s.slug}/`),
    ...P.map(p => `/work/${p.slug}/`),
    ...AR.map(x => `/insights/${x.slug}/`)
  ];

  window.PAGES = { resolve, routes, ServicePage, Process, Insights, Article, Privacy, BASE, Home, Work, Case, About, Contact, Pricing, NotFound, featured, ventures, usd, img, thumb, bySlug, catOf, inCat, pad, esc, marquee, footer };
})();
