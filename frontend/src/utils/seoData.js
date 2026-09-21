export const SITE_URL = 'https://www.extremebeautyrw.com';
export const SITE_NAME = 'Extreme Beauty Lashes & Brows';
export const SITE_LOGO = `${SITE_URL}/logo/Logo-White-BG.jpg`;

export function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

  return { slug, path, title, description, image, jsonLd, breadcrumbJsonLd };
}