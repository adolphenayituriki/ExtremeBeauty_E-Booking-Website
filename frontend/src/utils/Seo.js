import { useEffect } from 'react';

const SITE_NAME = 'Extreme Beauty Lashes & Brows';
const DEFAULT_TITLE = 'Extreme Beauty Lashes & Brows';
const DEFAULT_DESC =
  'Professional lash & brow studio in Kigali, Rwanda. Microblading, eyelash extensions, lash lift, brow lamination & brow shaping. Book your appointment today.';
const DEFAULT_IMAGE = 'https://www.extremebeautyrw.com/images/Hero-bg-Image-1.jpg';

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMeta(attr, key) {
  const el = document.querySelector(`meta[${attr}="${key}"]`);
  if (el) el.remove();
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

function removeCanonical() {
  const el = document.querySelector('link[rel="canonical"]');
  if (el) el.remove();
}

const Seo = ({ title, description, path = '', type = 'website', image = DEFAULT_IMAGE }) => {
  useEffect(() => {
    const siteUrl = 'https://www.extremebeautyrw.com';
    const canonicalUrl = `${siteUrl}${path}`;

    document.title = title || DEFAULT_TITLE;
    setMeta('name', 'description', description || DEFAULT_DESC);

    setMeta('property', 'og:title', title || DEFAULT_TITLE);
    setMeta('property', 'og:description', description || DEFAULT_DESC);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:image', image);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title || DEFAULT_TITLE);
    setMeta('name', 'twitter:description', description || DEFAULT_DESC);
    setMeta('name', 'twitter:image', image);

    setCanonical(canonicalUrl);

    return () => {
      removeMeta('property', 'og:url');
      removeMeta('name', 'twitter:title');
      removeMeta('name', 'twitter:description');
      removeMeta('name', 'twitter:image');
    };
  }, [title, description, path, type, image]);

  return null;
};

const JSON_LD_FALLBACK_KEY = 'seo-jsonld';

export const SeoJsonLd = ({ data, key }) => {
  const jsonKey = key || JSON_LD_FALLBACK_KEY;
  useEffect(() => {
    let el = document.getElementById(jsonKey);
    if (el) el.remove();
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = jsonKey;
    el.text = JSON.stringify(data);
    document.head.appendChild(el);
    return () => { const node = document.getElementById(jsonKey); if (node) node.remove(); };
  }, [jsonKey, data]);

  return null;
};

export default Seo;
