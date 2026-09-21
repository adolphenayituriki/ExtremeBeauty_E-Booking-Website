export const SITE_URL = 'https://www.extremebeautyrw.com';
export const SITE_NAME = 'Extreme Beauty Lashes & Brows';
export const SITE_LOGO = `${SITE_URL}/logo/Logo-White-BG.jpg`;

const FP = '+250 785 069 349';
const ADDRESS = '105 KG 9th Ave, Nyarutarama, Kigali, Rwanda';

export function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* Keyword-rich, service-specific FAQ Q&As. These power both the on-page FAQ
   accordion and the FAQPage structured data, which Google can show as rich
   results when people search for these services. */
export function getServiceFaqs(service) {
  const name = service?.name || '';
  const lower = name.toLowerCase();

  return [
    {
      q: `What is ${name} and how does it work?`,
      a: `${name} is one of the most requested treatments at Extreme Beauty Lashes & Brows in Nyarutarama, Kigali. ${service?.description || ''} Our specialists assess your features and recommend the best approach for natural, lasting results.`,
    },
    {
      q: `Where can I get ${lower} in Kigali?`,
      a: `We perform ${lower} at Extreme Beauty Lashes & Brows, located at ${ADDRESS}. You can book online in just a few minutes or call us on ${FP} to schedule your appointment.`,
    },
    {
      q: `How much does ${lower} cost at Extreme Beauty?`,
      a: `A ${lower} appointment at Extreme Beauty Lashes & Brows in Kigali costs ${service?.priceFormatted || 'on request'}. Your specialist will confirm the exact price during your consultation, with no hidden fees.`,
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

export function buildFaqJsonLd(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: getServiceFaqs(service).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function buildServiceMeta(service) {
  const slug = slugify(service.name);
  const path = `/service/${slug}`;
  const title = `${service.name} in Kigali | ${SITE_NAME}`;
  const description =
    `${service.description} Book ${service.name} (${
      service.priceFormatted || 'on request'
    }) at Extreme Beauty Lashes & Brows, Nyarutarama, Kigali, Rwanda. ` +
    'Professional lash and brow studio. Book online today.';
  const image = service.image ? `${SITE_URL}${service.image}` : `${SITE_URL}/images/Hero-bg-Image-1.jpg`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    image,
    url: `${SITE_URL}${path}`,
    provider: {
      '@type': 'BeautySalon',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      telephone: '+250785069349',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '105 KG 9th Ave, Nyarutarama',
        addressLocality: 'Kigali',
        addressCountry: 'RW',
      },
    },
  };

  if (service.price) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: Number(service.price),
      priceCurrency: 'RWF',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}${path}`,
    };
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
      { '@type': 'ListItem', position: 3, name: service.name, item: `${SITE_URL}${path}` },
    ],
  };

  const faqJsonLd = buildFaqJsonLd(service);

  return { slug, path, title, description, image, jsonLd, breadcrumbJsonLd, faqJsonLd, faqs: getServiceFaqs(service) };
}