/* =========================================================
   Long-form content: service pages, process, privacy.
   Plain data + HTML strings. Edit the words here.
   ========================================================= */
window.CONTENT = {
  base: 'https://www.jerryonwuka.cc',
  updated: '2026-10-20',

  services: [
    {
      slug: 'brand-identity-design',
      name: 'Brand Identity Design',
      title: 'Brand Identity Design | Jerry Onwuka',
      description: 'Brand identity design that turns a business into a working system: strategy, logo, type, colour and voice built to be used, not admired. See the process.',
      h1: 'Brand identity design that works as a system, not a logo',
      schemaDescription: 'Strategy-led brand identity systems: logo, colour, typography, voice and application rules, built to make a business look established and stay recognisable.',
      intro: 'Brand identity design is the work of turning what a business stands for into a system people can recognise everywhere: on a website, a pitch deck, a delivery bag, a product screen. I design identities as working systems, with strategy first, then the marks, type, colour, voice and the rules that keep them consistent long after handover.',
      work: ['chopchop', 'rooted-africa', 'tyrian'],
      workAnchor: 'brand identity',
      article: 'brand-identity-vs-logo',
      siblings: ['web-design-services', 'landing-page-design'],
      sections: [
        { h2: 'What brand identity design actually is', html: `
          <p>A brand is what people conclude about you after every encounter. You can influence it, but you cannot hand it over as a file. A brand identity is the part you can design: the visual and verbal system that carries the brand into the world. A logo is one asset inside that system.</p>
          <p>Most businesses buy from the bottom up. They commission a mark, then wonder why the website, the deck and the packaging feel like three different companies. Brand identity design, and corporate identity design for groups with several entities, fixes that by deciding the rules once, so every new touchpoint starts from an answer instead of a blank page.</p>
          <h3>Brand, identity, logo: the difference</h3>
          <p><strong>Brand</strong> is perception. It is earned slowly, through product, service and communication. It is the only layer nobody can deliver to you on a deadline.</p>
          <p><strong>Identity</strong> is the system. It turns strategy into parts with names: marks, type, colour, image direction, voice and motion. It is what lets a new designer or developer get the same answer without asking you.</p>
          <p><strong>Logo</strong> is a mark. It identifies. It needs clearspace, minimum sizes and colour versions, but it cannot carry a message the rest of the system has not already established.</p>
          <h3>What a brand identity system contains</h3>
          <ul class="prose-list">
            <li>A logo suite: primary mark, lockups, a single-colour version, a dark-background version, favicon and app icon.</li>
            <li>A type scale that says which size and weight to use for which level of information.</li>
            <li>Colour tokens with roles (primary, accent, surface, text, state), with accessible contrast built in from the start.</li>
            <li>Image and illustration direction, so photography and graphics look like they belong to one company.</li>
            <li>A voice with rules and real example sentences, not just three adjectives.</li>
            <li>Usage rules and motion behaviour, written so the system survives new hires and new tools.</li>
          </ul>` },
        { h2: 'What I build for you', html: `
          <p>Unlike a brand identity design agency with several departments, you work with the person who makes the decisions and does the work. Every project covers four layers.</p>
          <h3>Strategy and positioning</h3>
          <p>Who the brand is for, what it promises, what it competes against and what it refuses to be. A short, decisive document that can reject work, so design choices get faster instead of becoming a matter of taste.</p>
          <h3>Visual identity</h3>
          <p>Logo, type, colour, grid and how things move. On projects like Chop Chop and Rooted Africa this meant designing the mark and then proving it on packaging, signage, merch, vehicles and campaigns before calling it finished.</p>
          <h3>Voice and messaging</h3>
          <p>A tagline, a short boilerplate, a messaging hierarchy and examples of how the brand sounds when it is selling, explaining and apologising.</p>
          <h3>Guidelines and handover</h3>
          <p>A usage guide your team will actually open, plus organised source files and exported assets. The <a href="/process/">full design and build process</a> shows exactly what you receive at each stage.</p>` },
        { h2: 'Who this is for', html: `
          <p>Founders launching something new who want to look established from day one. Businesses that have grown past their first logo and now look different on every platform. Companies preparing a rebrand, a new product line or a move into a new market. And teams whose website, social channels and sales materials disagree with each other, because nobody ever wrote the rules down. If people regularly ask "which logo should I use?" or "what is our blue?", an identity system will save you time every week.</p>` }
      ],
      stagesH2: 'How the project runs',
      stages: [
        ['Brief', 'We talk through the business, the audience and what is not working today. I come back with a short summary of the problem in writing.'],
        ['Strategy', 'Positioning, audience and promise, agreed in one short document. This is what every later design decision is checked against.'],
        ['Identity design', 'Two or three directions, built on the strategy and shown on real applications. We choose one and refine it together.'],
        ['System and applications', 'The full identity: logo suite, type, colour, voice and the key touchpoints your business uses most.'],
        ['Handover', 'Guidelines, source files and exported assets, organised so your team and future suppliers can use them without me.']
      ],
      cost: `<p>Brand identity work starts from <strong>$500</strong> for a logo, colours, type and a short guide. The <a href="/pricing/">Launch package</a> (from $700) adds a landing page, and the Grow package (from $1,500) covers a full identity with guidelines plus a multi-page website. Most identity projects take two to five weeks. The biggest variable is not drawing time; it is how quickly decisions get made and approved on your side.</p>`,
      faqs: [
        ['Is a logo the same as a brand identity?', 'No. A logo is one asset inside the identity. The identity also includes type, colour, image direction, voice and the rules for using them together. A new logo alone rarely fixes a business that looks inconsistent, because the inconsistency usually comes from everything around the logo.'],
        ['Do I need brand strategy before the design?', 'If your audience, position or offer is still unclear, yes. Strategy is the step that decides what the identity must say. If the business is already proven and the problem is only that it looks inconsistent, we can keep strategy light and move quickly into the system.'],
        ['How many logo concepts will I see?', 'Usually two or three distinct directions, each shown on real applications such as your website, social posts and packaging. Showing marks on their own makes them hard to judge. Seeing them in use makes the right choice much clearer.'],
        ['What files do I receive at the end?', 'Source files, exported logos in every format you need, colour and type specifications, and a usage guide. Everything is organised so a printer, a developer or a new designer can use it without needing to contact me first.'],
        ['Can you also build the website?', 'Yes. Brand and website are designed as one system, which is the main reason people work with me. The identity decisions carry straight into the web build, so nothing gets lost between two different suppliers.']
      ],
      ctaH2: 'Start a brand identity project',
      ctaText: 'Tell me about the business, who it serves and where it looks inconsistent today. I will reply with how I would approach it, what the first stage looks like and a quote based on your scope.',
      ctaAnchor: 'start a brand identity project'
    },
    {
      slug: 'web-design-services',
      name: 'Web Design Services',
      title: 'Web Design Services | Jerry Onwuka',
      description: 'Web design services that ship a working site, not a mockup: structure, design, build and handover in one run. Fast, indexable, built to convert.',
      h1: 'Web design services that end with a working site',
      schemaDescription: 'Website design and development delivered as one run: structure, interface design, build, performance and handover, for sites that load fast, rank and convert.',
      intro: 'My web design services cover the whole job, from the first sitemap to a live, fast site you own. I design and build in one run, so there is no handover gap between a designer\'s mockup and a developer\'s interpretation of it. The result is a site that looks like your brand, loads quickly, can be found on search and is built to turn visits into enquiries.',
      work: ['aziki', 'fabro', 'boredroom-website'],
      workAnchor: 'website build',
      article: 'design-and-build-one-team',
      siblings: ['brand-identity-design', 'landing-page-design'],
      sections: [
        { h2: 'What web design services include here', html: `
          <p>Design and build are one job here. A web project with me covers structure, interface, development, performance and handover. You are not buying a set of screens that someone else has to rebuild; you are buying a working website, tested on real phones, with the technical basics in place from day one. I have built sites for medical equipment suppliers, fashion labels, creative studios, transport operators and SaaS products, and the pattern is always the same: decide what the site must do for the business, then design every page around that.</p>
          <h3>Structure and content architecture</h3>
          <p>A sitemap, the page types you need and copy direction for each one. This is where we decide what each page is for and how a visitor moves from first visit to enquiry.</p>
          <h3>Design and interface</h3>
          <p>Layout, type, motion and a reusable set of components, all built from your brand identity. Every section is designed for mobile first, because that is where most visitors arrive.</p>
          <h3>Build and performance</h3>
          <p>A fast, modern build with server-rendered HTML, clean URLs, a sitemap and robots file on day one, and attention to Core Web Vitals so pages load quickly on ordinary connections.</p>
          <h3>Handover and training</h3>
          <p>You own the code, the domain and the content. I walk you through updating the site and leave notes so any future developer can pick it up.</p>` },
        { h2: 'The problem with buying design and build separately', html: `
          <p>When one supplier designs and another builds, the website is decided twice. The designer makes choices in a tool that has no real content, no real devices and no real performance limits. The developer then makes a second set of choices to make it work, often without the reasoning behind the first. Animations get dropped, spacing drifts, forms get simplified and nobody owns search visibility. Every gap becomes a round of revisions, and the business pays for the same decision more than once. Designing and building in one run removes that gap: the person who decides how a page should feel is the same person who makes it load fast on a phone.</p>` }
      ],
      stagesH2: 'What a build looks like, stage by stage',
      stages: [
        ['Brief and goals', 'We agree what the site must do for the business and how we will know it worked. I map the pages and the main journeys.'],
        ['Structure and copy', 'A sitemap, page outlines and copy direction. Content decisions come before visual ones so design has something real to work with.'],
        ['Design', 'Key pages designed on desktop and mobile, then a component set that covers the rest of the site.'],
        ['Build', 'Development, content entry, forms, analytics and search setup, tested on real devices and browsers.'],
        ['Launch and handover', 'Go live, check everything in production and hand over the site, logins and a short guide to running it.']
      ],
      standardsH2: 'Technical standards every site ships with',
      standards: [
        'Semantic headings, with exactly one H1 on every page and a logical H2 and H3 structure beneath it.',
        'A self-referencing canonical URL on every indexable page, so search engines never guess which version is the real one.',
        'An XML sitemap and a robots.txt file from the first day the site is live.',
        'Structured data that describes the business, its services and its pages accurately.',
        'Descriptive alt text on every image, visible focus states and body text with at least 4.5:1 contrast.',
        'A target of under two seconds for the largest element on the page to load on a typical mobile connection.'
      ],
      cost: `<p>A single landing page starts from <strong>$600</strong> and a multi-page website with a CMS from <strong>$1,200</strong> on the <a href="/pricing/">rate card</a>. The Grow package (from $1,500) pairs a full brand identity with a website of up to six pages, and Scale (from $2,500) covers product sites alongside a web app or dashboard. Most website builds take three to six weeks.</p>`,
      faqs: [
        ['Do you design and develop the website yourself?', 'Yes. I handle both the design and the build, so the site you approve in design is the site that goes live. There is no second interpretation by a separate developer, and no gap between how a page was meant to work and how it actually works.'],
        ['Will my website be fast and show up on Google?', 'Every site ships with server-rendered pages, clean URLs, a sitemap, a robots file, structured data and image optimisation. That gives search engines everything they need from launch. Rankings also depend on content and competition, which we plan for in the structure stage.'],
        ['Can I update the website myself after launch?', 'Yes. Sites that need regular updates are built with a simple content system, and I show you how to edit pages, add projects or publish posts. You also own the code and the domain, so you are never locked in to me.'],
        ['How many pages do I need?', 'Fewer than most people expect. A typical business site needs a home page, one page per main service, a work or proof page, an about page and a contact page. We decide the list from what your visitors need to see before they get in touch.'],
        ['What if I do not have a brand identity yet?', 'Then we start there. A website built on an unclear identity usually has to be redesigned within a year. My brand identity design work can run first, or alongside the website, so both are decided together.']
      ],
      ctaH2: 'Start a build',
      ctaText: 'Tell me what the website needs to do, what you have today and when you need it live. I will come back with a recommended page list, the build approach and a quote for your scope.',
      ctaAnchor: 'start a build'
    },
    {
      slug: 'landing-page-design',
      name: 'Landing Page Design',
      title: 'Landing Page Design | Jerry Onwuka',
      description: 'Landing page design built around one action: message, layout, proof and form in a single page that loads fast and reads clearly. See the structure.',
      h1: 'Landing page design built around one action',
      schemaDescription: 'Conversion-focused landing page design and build: message, layout, proof, form and analytics in one fast page built around a single action.',
      intro: 'Good landing page design starts with one question: what is the single action this page exists for? A waitlist sign-up, a demo request, a pre-order, a consultation. I design and build landing pages around that action, writing the message first, arranging proof before the ask and keeping the form as short as the decision allows, so the page loads fast and reads clearly on any device.',
      work: ['brandpilot-website', 'damov-website', 'motionbox'],
      workAnchor: 'landing page',
      article: 'landing-page-sections',
      siblings: ['web-design-services', 'brand-identity-design'],
      sections: [
        { h2: 'What a landing page has to do', html: `
          <p>A landing page is one page, for one audience, asking for one action. That is what separates it from a homepage, which has to welcome everyone and point them in several directions. Most landing pages that underperform are trying to be small homepages: full navigation, three equal buttons, every feature listed, proof hidden in the footer. Each extra choice is a small cost to the visitor, and those costs add up before they reach the button. My job is to remove everything that does not move the visitor toward the action, and to make what remains clear enough that the decision feels easy.</p>` },
        { h2: 'The seven sections every landing page needs', html: `
          <h3>Hero: the promise in one line</h3>
          <p>A headline that says what the visitor gets, a single subline that makes it concrete, one primary button and one piece of evidence. If the first screen does not make sense without scrolling, the rest of the page is working against it.</p>
          <h3>Problem: what it costs to ignore</h3>
          <p>A short, specific description of the situation the visitor is in. Written in their words, not yours. This is where people decide whether the page is about them.</p>
          <h3>Mechanism: how it works</h3>
          <p>Three steps, a short demo or the product itself. Show how the promise is delivered, so the offer feels real rather than hopeful.</p>
          <h3>Proof: evidence, not adjectives</h3>
          <p>Named quotes, real screenshots, results with a source and a date. Proof placed before the ask reads as confidence; the same proof in a footer reads as an afterthought.</p>
          <h3>Offer: what you get, exactly</h3>
          <p>What is included, what it costs or what happens next, and how long it takes. Vague offers create questions, and questions delay decisions.</p>
          <h3>Objections: the five real hesitations</h3>
          <p>Price, time, risk, fit and trust. Answer each one plainly, usually as a short FAQ, before the visitor has to leave the page to find out.</p>
          <h3>Close: one action, one button</h3>
          <p>Repeat the promise and the action. One button, with any alternative shown as a plain link so it never competes with the main path.</p>` },
        { h2: 'Landing page layouts that convert, and why', html: `
          <p>The layout should follow how your offer is best understood. A <strong>centre stack</strong> (one narrow column, message then proof) suits offers that can be explained in a sentence and products that are not very visual. A <strong>split hero</strong>, with copy on one side and a working tool or live product card on the other, suits products that can be demonstrated in a single interaction; the BrandPilot site uses this pattern, showing a caption being written and scheduled before any explanation. A <strong>product-as-hero</strong> layout puts the interface on the first screen and keeps the copy short, which works when the product itself is the strongest proof. Choosing the layout is a strategy decision, not a style preference, and it is made before any visual design starts.</p>` },
        { h2: 'Copy first, design second', html: `
          <p>Landing page design that starts in a design tool usually ends with copy squeezed into boxes that were drawn for placeholder text. I work the other way around. The message, the order of the argument and the exact wording of the button are written first, then the layout is designed to carry them. This makes the page shorter, because every section has to earn its place in the argument, and it makes testing easier, because you can change a headline without breaking the design. If you already have strong copy, I will use it. If not, I write it with you.</p>` },
        { h2: 'What you get', html: `
          <ul class="prose-list">
            <li>Copy for every section, written around the one action the page exists for.</li>
            <li>A responsive design for mobile and desktop, built from your brand identity.</li>
            <li>A fast, indexable build with clean HTML and optimised images.</li>
            <li>Your form connected to email or your CRM, with spam protection.</li>
            <li>Analytics events on the main action, so you can see what the page actually does.</li>
            <li>An optional A/B variant of the headline or hero, when you have enough traffic to test it.</li>
          </ul>` }
      ],
      stagesH2: 'How a landing page project runs',
      stages: [
        ['The one action', 'We agree the single action the page exists for, who it is aimed at and how success will be measured.'],
        ['Message and structure', 'I write the argument section by section, from the promise in the hero to the close, before any visual design.'],
        ['Design', 'The page is designed on mobile and desktop around the copy, using your brand identity.'],
        ['Build and wiring', 'A fast, indexable build with the form connected to your inbox or CRM and analytics on the main action.'],
        ['Launch and learn', 'We go live, check the numbers after the first traffic arrives and adjust the headline or proof where it helps.']
      ],
      cost: `<p>A designed and built landing page starts from <strong>$600</strong> on the <a href="/pricing/">rate card</a>. The Launch package (from $700) adds a logo and mini brand kit, which is a good fit for new ideas and waitlists. Most landing pages take one to three weeks, depending on how much copy and proof already exists.</p>`,
      faqs: [
        ['What is the difference between a landing page and a homepage?', 'A homepage welcomes everyone and points them in several directions. A landing page speaks to one audience and asks for one action. That focus is why landing pages are used for launches, ads, waitlists and campaigns where you want a specific result.'],
        ['How many buttons should a landing page have?', 'One primary action. You can offer alternatives, such as a demo or a pricing link, but they should look like links rather than equal buttons. Two buttons of the same weight make the visitor choose before they are ready to commit.'],
        ['Do you write the copy for the landing page?', 'Yes. Copy comes before design in my process, because the order of the argument decides the layout. If you already have copy you trust, I will work with it and only suggest changes where they help the page.'],
        ['How long should the form be?', 'As short as the decision allows. Ask only for what you need to take the next step. Requirements that can be explained, such as who the offer is for, belong on the page above the button rather than inside the form.'],
        ['Can the landing page connect to my email or CRM?', 'Yes. Forms can send to your inbox, a mailing list tool or a CRM, and I add analytics events so you can see how many people reach and complete the main action.']
      ],
      ctaH2: 'Start a landing page',
      ctaText: 'Tell me the one action the page is for, who it is aimed at and when it needs to go live. I will reply with a suggested structure, what I need from you and a quote.',
      ctaAnchor: 'start a landing page'
    }
  ],

  process: {
    title: 'Process | Jerry Onwuka',
    description: 'How a project runs from first call to handover: five stages, what happens in each, what I need from you and what you get back.',
    h1: 'How a project runs',
    intro: 'Every project, whether it is a brand identity, a website, a landing page or a full software system, runs through the same five stages. Each stage ends with something you can see and approve, so decisions are made in order and nothing is designed twice. Here is what happens at each step, what I need from you and what you get back.',
    stages: [
      ['Brief', 'We start with a call about the business, the audience, the goal and the deadline. I listen for what is actually broken, which is not always what the brief says. Within a few days I send a written summary of the problem, the scope and a quote.', 'A written brief, scope and quote you can approve.'],
      ['Strategy', 'Before any visual work, we agree who this is for, what it promises and how we will know it worked. For a brand this is positioning and messaging; for a website or product it is the page list, user journeys and the main action each page drives.', 'A short strategy document or sitemap that every later decision is checked against.'],
      ['Design', 'I design the key screens, marks or layouts on top of the strategy and show them in real context: on phones, on packaging, in a working prototype. We refine together in focused rounds rather than open-ended feedback loops.', 'Approved designs, shown the way people will actually see them.'],
      ['Build', 'I build what we designed: the website, the landing page, the dashboard, the asset library or the motion piece. Development, content, forms, analytics and search setup happen here, tested on real devices.', 'A working build on a preview link you can click through before launch.'],
      ['Handover', 'We launch, check everything in production and I hand over the files, logins and a short guide to running it. You own everything. If you want ongoing support, we agree it at this point.', 'Live work, source files, access and documentation.']
    ],
    needs: [
      'One decision-maker who can approve each stage, so feedback arrives in one voice.',
      'Honest answers about the business: who buys, why, and what has not worked before.',
      'Existing material such as logos, copy, photos, product access and analytics, if you have them.',
      'Feedback within a few working days at each stage, so the timeline holds.'
    ]
  },

  privacy: {
    title: 'Privacy | Jerry Onwuka',
    description: 'What this site collects, why, and how to have it removed.',
    h1: 'Privacy',
    html: `
      <p>This page explains what information this website collects when you visit it or get in touch, why it is collected and how to have it removed. It is written in plain language and covers everything the site does today.</p>
      <h2>What the contact form collects</h2>
      <p>When you send an enquiry, the form collects the details you type in: your name, email address, company, project type, budget, timeline and message. These are sent to my email inbox through FormSubmit, a form delivery service, so I can reply to you. I use them only to answer your enquiry and, if we work together, to run the project. I do not sell or share them with anyone else, and I do not add you to a mailing list.</p>
      <h2>What is stored in your browser</h2>
      <p>If you switch between dark and light mode, your choice is saved in your browser's local storage so the site remembers it next time. It never leaves your device. The site does not set advertising or tracking cookies and does not use analytics.</p>
      <h2>Third-party services</h2>
      <p>The site is hosted on Vercel, which keeps standard server logs such as IP address and browser type to deliver pages and protect against abuse. Fonts are loaded from Google Fonts and animation libraries from public content networks (cdnjs and unpkg), which means those services receive a standard request from your browser when a page loads.</p>
      <h2>How to have your data removed</h2>
      <p>If you have contacted me and want your messages deleted, email <a href="mailto:onwukajerry09@gmail.com">onwukajerry09@gmail.com</a> and I will remove them from my inbox and confirm when it is done.</p>
      <p>Last updated 20 October 2026.</p>`
  }
};
