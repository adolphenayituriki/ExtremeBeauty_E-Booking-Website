# SEO & Keyword Strategy

Target keywords for Extreme Beauty Lashes & Brows — both for content writing
and for monitoring in Google Search Console.

## Core SEO setup (already in place)

- `sitemap.xml` — auto-generated on every build with all pages + all services
- `robots.txt` — allows crawling, blocks `/admin`
- Every page and service is pre-rendered to static HTML at build time
- Per-page meta title, description, canonical and Open Graph tags
- JSON-LD structured data per page (BeautySalon, WebSite, FAQPage, Service,
  BreadcrumbList, OfferCatalog, AboutPage, ContactPage, Course)
- Admin area uses `noindex, nofollow`

## Target keywords by page

| Page | Target keywords |
|------|-----------------|
| Home | extreme beauty lashes, lash studio kigali, beauty salon nyarutarama, lash & brow studio rwanda |
| /services | eyelash extensions kigali, microblading kigali, lash lift kigali, lash & brow services rwanda |
| /service/* (Lashes) | eyelash extensions kigali, classic lashes, hybrid lashes, volume lashes, mega volume lashes, wispy lashes, lash removal, lash extension price rwanda |
| /service/* (Brows) | eyebrow microblading kigali, microshading rwanda, ombré brows, hybrid brows, brow lamination kigali, eyebrows retouch |
| /service/lash-lift | lash lift kigali, lash lift vs extensions, lash perm |
| /service/training-session | lash technician training kigali, brow course rwanda, lash artist certification |
| /about | about lash studio kigali, nyarutarama beauty salon |
| /teaching | lash training academy kigali, learn eyelash extensions |
| /contact | book lash appointment kigali, contact beauty salon rwanda |
| Location-based | lashes near me kigali, brow studio nyarutarama, best lash artist in rwanda |

## Primary keyword list

- extreme beauty lashes & brows
- eyelash extensions kigali / rwanda
- volume lashes, mega volume lashes, hybrid lashes, wispy lashes
- eyelash lift kigali
- lash extension price / cost in kigali
- eyebrow microblading kigali
- eyebrow microshading / ombré brows rwanda
- hybrid combination brows
- brow lamination kigali
- eyebrows retouch rwanda
- beauty salon nyarutarama
- lash studio kigali
- lash artist kigali / best lash tech rwanda
- lash and brow training kigali

## Monitoring

Track in Google Search Console → **Performance** and filter by these keywords.
Also check **Pages** to confirm every page and service is indexed.

### Speed up indexing after a deploy

1. Google Search Console → Sitemaps → submit `https://www.extremebeautyrw.com/sitemap.xml`.
2. URL Inspection → "Request indexing" on `/`, `/services`, `/about`,
   `/teaching`, `/contact` and a few service URLs.

Rankings for "… Kigali / Rwanda" keywords typically appear within 2–6 weeks of
an indexed, deployed version.