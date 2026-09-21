/**
 * postbuild.js
 *
 * After react-scripts build, this script makes the single-page app crawlable
 * WITHOUT a JavaScript interpreter:
 *
 * 1. SITEMAP — auto-generated from src/data/services.js + the static pages, so
 *    it can never drift from the live services. Written to public/ and build/.
 *
 * 2. STATIC SEO PAGES — every public route gets its own build/<route>/index.html
 *    with a fully written-out <head>: per-route title, meta description,
 *    canonical, OpenGraph + Twitter tags, robots marker and JSON-LD structured
 *    data (BeautySalon, WebSite, Service, BreadcrumbList, FAQPage,
 *    OfferCatalog, AboutPage, ContactPage, Course). Vercel's filesystem
 *    precedence serves these files to crawlers instead of a generic SPA shell.
 *    This step needs no browser, so it runs identically on Vercel, Render,
 *    Netlify or a local machine.
 *
 * 3. OPTIONAL JS RENDER — if a Chrome/Edge browser is available, we additionally
 *    re-render each route with headless Chrome and overwrite the static page
 *    with the fully rendered DOM (including the visible body content). When the
 *    browser is missing (typical of Vercel builds), the static pages from step
 *    2 are still served, so SEO never depends on the browser.
 *
 * Safety: every failure path degrades gracefully — the deployment always works.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const frontendRoot = path.join(__dirname, '..');
const buildDir = path.join(frontendRoot, 'build');
const publicDir = path.join(frontendRoot, 'public');
const PORT = 45678;
const BASE_URL = `http://localhost:${PORT}`;

const SITE_URL = 'https://www.extremebeautyrw.com';
const SITE_NAME = 'Extreme Beauty Lashes & Brows';
const ADDRESS = '105 KG 9th Ave, Nyarutarama, Kigali, Rwanda';
const PHONE = '+250785069349';
const PHONE_DISPLAY = '+250 785 069 349';
const LAST_MOD = new Date().toISOString().slice(0, 10);
const LOGO_URL = `${SITE_URL}/logo/Logo-White-BG.jpg`;
const HERO_IMAGE = `${SITE_URL}/images/Hero-bg-Image-1.jpg`;

/* ------------------------------------------------------------------ */
/* Data readers                                                       */
/* ------------------------------------------------------------------ */

function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* Parse the full service objects out of src/data/services.js so the sitemap,
   static pages and pre-render all share the app's single source of truth. */
function readServices() {
  const src = path.join(frontendRoot, 'src', 'data', 'services.js');
  let code;
  try {
    code = fs.readFileSync(src, 'utf8');
  } catch (error) {
    console.warn('[postbuild] could not read services data:', error.message);
    return [];
  }
  const services = [];
  const re =
    /\{\s*name:\s*["']([^"']+)["']\s*,\s*slug:\s*slugify\([^)]*\)\s*,\s*price:\s*(\d+)\s*,\s*priceFormatted:\s*["']([^"']*)["']\s*,\s*image:\s*["']([^"']*)["']\s*,\s*category:\s*["']([^"']*)["']\s*,\s*description:\s*"([\s\S]*?)"\s*\}?/g;
  let match;
  while ((match = re.exec(code)) !== null) {
    services.push({
      name: match[1],
      slug: slugify(match[1]),
      price: parseInt(match[2], 10),
      priceFormatted: match[3],
      image: match[4],
      category: match[5],
      description: match[6],
    });
  }
  return services;
}

const SERVICES = readServices();
const SERVICE_SLUGS = SERVICES.map((s) => s.slug);

const PAGE_ROUTES = [
  { path: '', changefreq: 'weekly', priority: 1.0 },
  { path: 'services', changefreq: 'weekly', priority: 0.9 },
  { path: 'about', changefreq: 'monthly', priority: 0.7 },
  { path: 'teaching', changefreq: 'monthly', priority: 0.6 },
  { path: 'booking', changefreq: 'monthly', priority: 0.8 },
  { path: 'contact', changefreq: 'monthly', priority: 0.7 },
  { path: 'tracking', changefreq: 'monthly', priority: 0.5 },
];

const STATIC_ROUTES = PAGE_ROUTES.map((r) => r.path);
const SERVICE_ROUTES = SERVICE_SLUGS.map((slug) => `service/${slug}`);
const ALL_ROUTES = [...STATIC_ROUTES, ...SERVICE_ROUTES];

/* ------------------------------------------------------------------ */
/* Sitemap                                                            */
/* ------------------------------------------------------------------ */

function writeSitemap() {
  const urls = [];
  for (const page of PAGE_ROUTES) {
    const loc = page.path ? `${SITE_URL}/${page.path}` : `${SITE_URL}/`;
    urls.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`);
  }
  for (const route of SERVICE_ROUTES) {
    urls.push(`  <url>
    <loc>${SITE_URL}/${route}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  const targets = [];
  if (fs.existsSync(buildDir)) targets.push(path.join(buildDir, 'sitemap.xml'));
  if (fs.existsSync(publicDir)) targets.push(path.join(publicDir, 'sitemap.xml'));

  for (const target of targets) {
    try {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, xml, 'utf8');
      console.log(`[postbuild] Wrote ${path.relative(frontendRoot, target)} (${PAGE_ROUTES.length + SERVICE_ROUTES.length} URLs).`);
    } catch (error) {
      console.warn('[postbuild] could not write sitemap:', error.message);
    }
  }
}

/* ------------------------------------------------------------------ */
/* JSON-LD blocks (mirrors src/utils/seoData.js + the page components) */
/* ------------------------------------------------------------------ */

function beautySalonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: SITE_NAME,
    description:
      'Professional lash & brow studio in Nyarutarama, Kigali, Rwanda. Eyelash extensions (classic, hybrid, volume, mega volume, wispy), lash lift, eyebrow microblading, microshading, hybrid brows and brow lamination.',
    image: HERO_IMAGE,
    url: `${SITE_URL}/`,
    telephone: '+250787035643',
    email: 'info@extremebeauty.rw',
    priceRange: 'RWF 30,000 - RWF 100,000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '105 KG 9th Ave, Nyarutarama',
      addressLocality: 'Kigali',
      addressRegion: 'Kigali City',
      addressCountry: 'RW',
    },
    geo: { '@type': 'GeoCoordinates', latitude: -1.9536, longitude: 30.1037 },
    hasMap: 'https://maps.app.goo.gl/sCWWKFUmaUV8fXHY7?g_st=iwb',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: PHONE,
      contactType: 'customer service',
      availableLanguage: ['English', 'French', 'Kinyarwanda'],
    },
    sameAs: ['https://www.instagram.com/extreme_beauty.rw', 'https://wa.me/250787035643'],
    makesOffer: SERVICES.filter((s) => s.price > 0).map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name },
      price: String(s.price),
      priceCurrency: 'RWF',
    })),
  };
}

function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description:
      'Lash and brow studio in Nyarutarama, Kigali, Rwanda. Eyelash extensions, lash lift, microblading, microshading, hybrid brows and brow lamination.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/services?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

function homeFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where is Extreme Beauty Lashes & Brows located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `We are located at ${ADDRESS}. You can book an appointment online or contact us on ${PHONE_DISPLAY} / +250 787 035 643.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How long do eyelash extensions last?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A full set of eyelash extensions typically lasts 3-4 weeks with proper aftercare, after which a refill is recommended to keep your lashes looking full and fresh.',
        },
      },
      {
        '@type': 'Question',
        name: 'What lash styles do you offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer classic, hybrid, volume, mega volume and wispy lash sets. A classic set adds one extension per natural lash for a natural look, while volume and mega volume sets use ultra-fine fans for a fuller, more dramatic appearance.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer eyebrow services?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We specialise in eyebrow microblading, microshading, hybrid (combination) brows and brow lamination, all tailored to give you natural, well-defined eyebrows that suit your face.',
        },
      },
    ],
  };
}

const servicesFaqs = [
  {
    q: 'How long do eyelash extensions last in Kigali?',
    a: 'A full set of eyelash extensions typically lasts 3-4 weeks before a refill is needed, depending on your natural lash growth cycle. We offer refills to keep your lashes looking fresh.',
  },
  {
    q: 'What is the difference between classic, volume and mega volume lashes?',
    a: 'Classic lashes use one extension per natural lash for a natural look. Volume lashes use ultra-fine fans for a fuller, fluffier finish, and mega volume lashes add even more density for a bold, dramatic lash line. We will recommend the right set for your natural lashes and desired look.',
  },
  {
    q: 'Is microblading painful and how long does it last?',
    a: 'Microblading is performed with a numbing cream, so most clients feel little to no discomfort. Results typically last 1-2 years, with a retouch recommended to maintain the shape and colour of your eyebrows.',
  },
  {
    q: 'How do I book an appointment?',
    a: 'You can book directly online through our Booking page in just a few minutes, or contact us for a free consultation and we will help you choose the perfect service.',
  },
];

function offerCatalogJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Lash and Brow Services in Kigali',
    url: `${SITE_URL}/services`,
    description:
      'Eyelash extensions, volume lashes, lash lift, microblading, microshading, hybrid brows, brow lamination and training at Extreme Beauty Lashes & Brows, Nyarutarama, Kigali.',
    provider: { '@type': 'BeautySalon', name: SITE_NAME, url: `${SITE_URL}/` },
    itemListElement: SERVICES.map((s) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: s.name,
        url: `${SITE_URL}/service/${s.slug}`,
        image: `${SITE_URL}${s.image}`,
        description: s.description,
        ...(s.price > 0 ? { offers: { '@type': 'Offer', price: s.price, priceCurrency: 'RWF' } } : {}),
      },
    })),
  };
}

function servicesFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: servicesFaqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function aboutPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Extreme Beauty Lashes & Brows',
    url: `${SITE_URL}/about`,
    description:
      'Extreme Beauty Lashes & Brows is a professional lash and brow studio in Nyarutarama, Kigali, Rwanda specialising in eyelash extensions, lash lift, microblading, microshading, hybrid brows and brow lamination.',
    about: {
      '@type': 'BeautySalon',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      telephone: PHONE,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '105 KG 9th Ave, Nyarutarama',
        addressLocality: 'Kigali',
        addressCountry: 'RW',
      },
    },
  };
}

function contactPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Extreme Beauty Lashes & Brows',
    url: `${SITE_URL}/contact`,
    description:
      'Contact Extreme Beauty Lashes & Brows in Nyarutarama, Kigali, Rwanda to book eyelash extensions, lash lift, microblading, microshading or brow lamination appointments.',
    mainEntity: {
      '@type': 'BeautySalon',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      telephone: PHONE,
      email: 'info@extremebeauty.rw',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '105 KG 9th Ave, Nyarutarama',
        addressLocality: 'Kigali',
        addressCountry: 'RW',
      },
    },
  };
}

function courseJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Lash & Brow Training in Kigali',
    description:
      'Certified training in eyelash extensions and eyebrow treatments in Kigali, Rwanda, with hands-on practice on live models and essential safety guidance.',
    url: `${SITE_URL}/teaching`,
    provider: { '@type': 'BeautySalon', name: SITE_NAME, url: `${SITE_URL}/` },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      location: {
        '@type': 'Place',
        name: SITE_NAME,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '105 KG 9th Ave, Nyarutarama',
          addressLocality: 'Kigali',
          addressCountry: 'RW',
        },
      },
    },
  };
}

function serviceFaqsFor(service) {
  const name = service.name;
  const lower = name.toLowerCase();
  const price = service.priceFormatted || 'on request';
  return [
    {
      q: `What is ${name} and how does it work?`,
      a: `${name} is one of the most requested treatments at Extreme Beauty Lashes & Brows in Nyarutarama, Kigali. ${service.description} Our specialists assess your features and recommend the best approach for natural, lasting results.`,
    },
    {
      q: `Where can I get ${lower} in Kigali?`,
      a: `We perform ${lower} at Extreme Beauty Lashes & Brows, located at ${ADDRESS}. You can book online in just a few minutes or call us on ${PHONE_DISPLAY} to schedule your appointment.`,
    },
    {
      q: `How much does ${lower} cost at Extreme Beauty?`,
      a: `A ${lower} appointment at Extreme Beauty Lashes & Brows in Kigali costs ${price}. Your specialist will confirm the exact price during your consultation, with no hidden fees.`,
    },
    {
      q: `How long does ${lower} take to complete?`,
      a: `A ${lower} appointment at our Nyarutarama studio typically takes 45–120 minutes depending on the treatment. We use premium products, sterilised tools and strict hygiene standards so you get a beautiful, safe result.`,
    },
    {
      q: `How long does the result of ${lower} last?`,
      a: `The longevity of ${lower} depends on your natural lash and brow cycle and aftercare. Our team will give you clear aftercare guidance and recommend the right follow-up so your look stays fresh and beautiful.`,
    },
  ];
}

function serviceJsonLd(service) {
  const spath = `/service/${service.slug}`;
  const url = `${SITE_URL}${spath}`;
  const image = service.image ? `${SITE_URL}${service.image}` : HERO_IMAGE;
  const block = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    image,
    url,
    provider: {
      '@type': 'BeautySalon',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      telephone: PHONE,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '105 KG 9th Ave, Nyarutarama',
        addressLocality: 'Kigali',
        addressCountry: 'RW',
      },
    },
  };
  if (service.price > 0) {
    block.offers = {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: 'RWF',
      availability: 'https://schema.org/InStock',
      url,
    };
  }
  return block;
}

function serviceBreadcrumbJsonLd(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
      { '@type': 'ListItem', position: 3, name: service.name, item: `${SITE_URL}/service/${service.slug}` },
    ],
  };
}

function serviceFaqJsonLd(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: serviceFaqsFor(service).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Static SEO head                                                    */
/* ------------------------------------------------------------------ */

const GLOBAL_BLOCKS = [beautySalonJsonLd(), webSiteJsonLd()];

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* Replace only the SEO-relevant tags inside the REAL built <head>. This keeps
   everything react-scripts injected (the <link> stylesheets, the <script src>
   bundles, prefetch/manifest and font tags) intact — only title, meta,
   canonical and JSON-LD are swapped per route. */
function injectSeo(headInner, { title, description, canonical, image = LOGO_URL, ogType = 'website', blocks = [] }) {
  const cleaned = headInner
    .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<link rel="canonical"[^>]*>/gi, '')
    .replace(/<meta name="robots"[^>]*>/gi, '')
    .replace(/<meta name="description"[^>]*>/gi, '')
    .replace(/<meta property="og:[^"]*"[^>]*>/gi, '')
    .replace(/<meta name="twitter:[^"]*"[^>]*>/gi, '')
    .replace(/<script type="application\/ld\+json"[\s\S]*?<\/script>/gi, '')
    .trim();

  const blockHtml = blocks.map((b) => `<script type="application/ld+json">
${JSON.stringify(b, null, 2)}
</script>`).join('\n  ');

  const seo = `<title>${esc(title)}</title>
    <meta name="robots" content="index, follow" />
    <meta name="description" content="${esc(description)}" />
    <meta property="og:locale" content="en_RW" />
    <meta property="og:site_name" content="${esc(SITE_NAME)}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="canonical" href="${canonical}" />
  ${blockHtml}`;

  return `<head>
    ${cleaned}
    ${seo}
  </head>`;
}

function routeSeo(route) {
  if (route === '') {
    return {
      title: SITE_NAME,
      description:
        'Professional lash & brow studio in Kigali, Rwanda. Microblading, eyelash extensions, lash lift and brow lamination. Book online.',
      canonical: `${SITE_URL}/`,
      image: LOGO_URL,
      blocks: [...GLOBAL_BLOCKS, homeFaqJsonLd()],
    };
  }

  if (route === 'services') {
    return {
      title: 'Lash & Brow Services in Kigali | Extreme Beauty Lashes & Brows',
      description:
        'Eyelash extensions, volume lashes, mega volume lashes, microblading & brow lamination in Kigali. Book lash extensions or microblading at Extreme Beauty Lashes & Brows, Nyarutarama, Rwanda.',
      canonical: `${SITE_URL}/services`,
      blocks: [...GLOBAL_BLOCKS, offerCatalogJsonLd(), servicesFaqJsonLd()],
    };
  }

  if (route === 'about') {
    return {
      title: 'About Us | Extreme Beauty Lashes & Brows',
      description:
        "Learn about Extreme Beauty Lashes & Brows, Kigali's trusted lash and brow studio — expert technicians, premium products and personalized care.",
      canonical: `${SITE_URL}/about`,
      blocks: [...GLOBAL_BLOCKS, aboutPageJsonLd()],
    };
  }

  if (route === 'teaching') {
    return {
      title: 'Lash Training & Academy | Extreme Beauty Lashes & Brows',
      description:
        "Learn professional lash and brow techniques at Extreme Beauty's training academy in Kigali. Step-by-step process, hands-on guidance and aftercare support.",
      canonical: `${SITE_URL}/teaching`,
      blocks: [...GLOBAL_BLOCKS, courseJsonLd()],
    };
  }

  if (route === 'booking') {
    return {
      title: 'Book Appointment | Extreme Beauty Lashes & Brows',
      description:
        'Book your lash or brow treatment at Extreme Beauty Lashes & Brows, Kigali. Choose a service, pick a time and confirm your appointment online.',
      canonical: `${SITE_URL}/booking`,
      blocks: GLOBAL_BLOCKS,
    };
  }

  if (route === 'contact') {
    return {
      title: 'Contact Us | Extreme Beauty Lashes & Brows',
      description:
        'Get in touch with Extreme Beauty Lashes & Brows in Kigali, Rwanda. Call, WhatsApp or send us a message to book your lash and brow appointment.',
      canonical: `${SITE_URL}/contact`,
      blocks: [...GLOBAL_BLOCKS, contactPageJsonLd()],
    };
  }

  if (route === 'tracking') {
    return {
      title: 'Track Your Booking | Extreme Beauty Lashes & Brows',
      description:
        'Check the status of your appointment with Extreme Beauty Lashes & Brows, Kigali. Enter your booking reference to track it online.',
      canonical: `${SITE_URL}/tracking`,
      blocks: GLOBAL_BLOCKS,
    };
  }

  const slug = route.replace(/^service\//, '');
  const service = SERVICES.find((s) => s.slug === slug);
  if (service) {
    return {
      title: `${service.name} in Kigali | ${SITE_NAME}`,
      description:
        `${service.description} Book ${service.name} (${
          service.priceFormatted || 'on request'
        }) at Extreme Beauty Lashes & Brows, Nyarutarama, Kigali, Rwanda. ` +
        'Professional lash and brow studio. Book online today.',
      canonical: `${SITE_URL}/service/${service.slug}`,
      image: service.image ? `${SITE_URL}${service.image}` : HERO_IMAGE,
      blocks: [...GLOBAL_BLOCKS, serviceJsonLd(service), serviceBreadcrumbJsonLd(service), serviceFaqJsonLd(service)],
    };
  }

  return { title: SITE_NAME, description: '', canonical: `${SITE_URL}/`, blocks: GLOBAL_BLOCKS };
}

/* Write build/<route>/index.html for every route, preserving everything in the
   built SPA shell but rewriting the SEO head. No browser required. This is the
   safety net that runs on Vercel where no Chrome is available. */
function generateStaticPages() {
  const shellPath = path.join(buildDir, 'index.html');
  if (!fs.existsSync(shellPath)) {
    console.warn('[postbuild] build/index.html not found; skipping static page generation.');
    return 0;
  }
  const shell = fs.readFileSync(shellPath, 'utf8');
  const headMatch = shell.match(/<head>([\s\S]*?)<\/head>/i);
  const headInner = headMatch ? headMatch[1] : '';
  const bodyStart = shell.indexOf('<body>');
  const bodyEnd = shell.indexOf('</html>');
  const body = shell.slice(bodyStart, bodyEnd === -1 ? shell.length : bodyEnd);

  let written = 0;
  for (const route of ALL_ROUTES) {
    const seo = routeSeo(route);
    const pageHtml = `<!DOCTYPE html>
<html lang="en">
  ${injectSeo(headInner, seo)}
  ${body}
</html>
`;
    const outPath = path.join(buildDir, route === '' ? 'index.html' : `${route}/index.html`);
    try {
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, pageHtml, 'utf8');
      written += 1;
    } catch (error) {
      console.warn(`[postbuild] could not write static page "/${route}":`, error.message);
    }
  }
  console.log(`[postbuild] Wrote static SEO HTML for ${written}/${ALL_ROUTES.length} routes (no browser needed).`);
  return written;
}

/* ------------------------------------------------------------------ */
/* Optional full JS render (enhances static pages with body content)   */
/* ------------------------------------------------------------------ */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function startServer() {
  const server = http.createServer((req, res) => {
    let urlPath;
    try {
      urlPath = decodeURIComponent(new URL(req.url, BASE_URL).pathname);
    } catch {
      urlPath = '/';
    }
    let filePath = path.normalize(path.join(buildDir, urlPath === '/' ? 'index.html' : urlPath));
    if (!filePath.startsWith(buildDir)) filePath = path.join(buildDir, 'index.html');
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(buildDir, 'index.html');
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

async function findBrowser() {
  const candidates = [process.env.CHROME_PATH];
  if (process.platform === 'win32') {
    candidates.push(
      process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env.PROGRAMFILES + '\\Microsoft\\Edge\\Application\\msedge.exe',
      process.env['PROGRAMFILES(X86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
      process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\Application\\msedge.exe'
    );
  } else if (process.platform === 'darwin') {
    candidates.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium'
    );
  } else {
    candidates.push(
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/opt/google/chrome/chrome'
    );
  }
  const system = candidates.filter(Boolean).find((p) => typeof p === 'string' && p.length > 0 && fs.existsSync(p));
  if (system) return system;
  try {
    const chromium = require('@sparticuz/chromium');
    const sparticuzPath = await chromium.executablePath();
    if (sparticuzPath && fs.existsSync(sparticuzPath)) {
      console.log('[postbuild] Using Chromium from @sparticuz/chromium.');
      return sparticuzPath;
    }
  } catch (error) {
    console.warn('[postbuild] @sparticuz/chromium unavailable:', error.message);
  }
  return null;
}

async function gotoRoute(page, route) {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      await page.goto(`${BASE_URL}/${route}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 2500));
      return true;
    } catch (error) {
      console.warn(`[postbuild] attempt ${attempt} failed for "/${route}":`, error.message);
      await page.goto('about:blank', { waitUntil: 'domcontentloaded' }).catch(() => {});
    }
  }
  return false;
}

async function browserRender() {
  if (process.env.PRERENDER_DISABLE === '1') {
    console.log('[postbuild] Browser render disabled via PRERENDER_DISABLE=1. Skipping.');
    return;
  }

  const browserPath = await findBrowser();
  if (!browserPath) {
    console.warn('[postbuild] No Chrome/Edge found; keeping static SEO pages (browser render skipped).');
    return;
  }

  let puppeteer;
  try {
    puppeteer = require('puppeteer-core');
  } catch {
    console.warn('[postbuild] puppeteer-core unavailable; browser render skipped.');
    return;
  }

  console.log(`[postbuild] Rendering ${ALL_ROUTES.length} routes with ${browserPath}...`);

  const server = await startServer();
  let browser = null;

  try {
    browser = await puppeteer.launch({
      executablePath: browserPath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });
  } catch (error) {
    console.warn('[postbuild] Could not launch browser:', error.message, '-> keeping static SEO pages.');
    server.close();
    return;
  }

  let rendered = 0;
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('/api/') || req.resourceType() === 'media') {
        req.abort();
      } else {
        req.continue();
      }
    });

    for (const route of ALL_ROUTES) {
      const relFile = route === '' ? 'index.html' : `${route}/index.html`;
      const outPath = path.join(buildDir, relFile);

      await page.goto('about:blank', { waitUntil: 'domcontentloaded' }).catch(() => {});
      const loaded = await gotoRoute(page, route);

      if (loaded) {
        try {
          const html = await page.content();
          fs.mkdirSync(path.dirname(outPath), { recursive: true });
          fs.writeFileSync(outPath, html, 'utf8');
          rendered += 1;
        } catch (error) {
          console.warn(`[postbuild] capture failed for "/${route}":`, error.message);
        }
      } else {
        console.warn(`[postbuild] skipping "/${route}" after repeated timeouts.`);
      }
      await new Promise((r) => setTimeout(r, 500));
    }

    await browser.close();
    server.close();
    console.log(`[postbuild] Browser-rendered ${rendered}/${ALL_ROUTES.length} routes (full DOM snapshots).`);
  } catch (error) {
    console.error('[postbuild] ERROR during browser render:', error.message);
    if (browser) await browser.close().catch(() => {});
    server.close();
  }
}

/* ------------------------------------------------------------------ */
/* Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  writeSitemap();
  generateStaticPages();
  await browserRender();
  console.log('[postbuild] Done.');
}

main().catch((error) => {
  console.error('[postbuild] Unexpected failure:', error);
});