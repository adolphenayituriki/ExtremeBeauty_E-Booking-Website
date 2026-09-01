import { useEffect } from 'react';

const SITE_URL = 'https://www.extremebeautyrw.com';
const DEFAULT_TITLE = 'Extreme Beauty Lashes & Brows | Beauty Salon in Kigali, Rwanda';
const DEFAULT_DESC =
  'Professional lash & brow studio in Kigali, Rwanda. Microblading, eyelash extensions, lash lift, brow lamination & brow shaping. Book your appointment today.';

function setMeta(attr, key, content) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

const Seo = ({ title, description, path = '', type = 'website' }) => {
  useEffect(() => {
    document.title = title || DEFAULT_TITLE;
    setMeta('name', 'description', description || DEFAULT_DESC);

    setMeta('property', 'og:title', title || DEFAULT_TITLE);
    setMeta('property', 'og:description', description || DEFAULT_DESC);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', `${SITE_URL}${path}`);
    setMeta('property', 'og:site_name', 'Extreme Beauty Lashes & Brows');
    setMeta('property', 'og:image', `${SITE_URL}/images/Hero-bg-Image-1.jpg`);
  }, [title, description, path, type]);

  return null;
};

export default Seo;
