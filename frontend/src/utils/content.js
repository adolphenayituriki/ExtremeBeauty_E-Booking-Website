import { useEffect, useState } from 'react';
import API_URL from './apiConfig';

export const DEFAULT_SITE = {
  name: 'Extreme Beauty Lashes & Brows',
  phone1: '+250 787 035 643',
  phone2: '+250 785 069 349',
  email: 'info@extremebeauty.rw',
  address: '105 KG 9th Ave, Nyarutarama, Kigali',
  mapsUrl: 'https://maps.app.goo.gl/sCWWKFUmaUV8fXHY7?g_st=iwb',
  instagram: '@extreme_beauty.rw',
  workingHours: 'Mon – Sat, 9AM – 6PM',
};

export const DEFAULT_CONTENT = {
  heroSlides: [
    { type: 'image', src: '/images/Hero-bg-Image-1.jpg', title: 'Where Beauty Meets Artistry', subtitle: 'Extreme Beauty Lashes & Brows' },
    { type: 'video', src: '/videos/VID-20260826-WA0028.mp4', title: 'Precision & Perfection', subtitle: 'Extreme Beauty Lashes & Brows' },
    { type: 'image', src: '/images/Hero-bg-Image-2.jpg', title: 'Your Transformation Starts Here', subtitle: 'Extreme Beauty Lashes & Brows' },
    { type: 'video', src: '/videos/VID-20260826-WA0034.mp4', title: 'Define Your Elegance', subtitle: 'Extreme Beauty Lashes & Brows' },
    { type: 'image', src: '/images/Hero-bg-Image-3.jpg', title: 'Experience the Art of Beauty', subtitle: 'Extreme Beauty Lashes & Brows' },
  ],
  heroStats: [
    { value: '2000+', label: 'Happy Clients' },
    { value: '12+', label: 'Services' },
    { value: '5★', label: 'Rating' },
  ],
  categories: [
    { name: 'Brows', description: '4 Services', image: '/images/Microblading.jpg', category: 'Brows' },
    { name: 'Lash Lift', description: 'Premium Service', image: '/images/Lash%20lift.jpg', category: 'Lash Lift' },
    { name: 'Eyelash Extensions', description: '6 Styles Available', image: '/images/Volume%20lashes%20set.jpg', category: 'Lashes' },
    { name: 'Eyebrows Retouch', description: 'Touch-Up Service', image: '/images/Eyebrows.jpg', category: 'Retouch' },
  ],
  featuredServices: [
    { category: 'BROWS', title: 'Microblading Eyebrows', description: 'Semi-permanent tattooing technique that creates natural-looking, fuller eyebrows with hair-like strokes.', image: '/images/Microblading.jpg' },
    { category: 'LASHES', title: 'Volume Set', description: 'Multiple lightweight extensions per natural lash creating a full, dramatic look perfect for special occasions.', image: '/images/Volume%20set%20final.jpg' },
    { category: 'LASHES', title: 'Wispy Sets', description: 'Trendy, textured lash style with varying lengths for a natural yet eye-catching wispy effect.', image: '/images/Whisper%20set.jpg' },
    { category: 'BROWS', title: 'Brows Lamination', description: 'Semi-permanent treatment that reshapes and sets brow hairs for a sleek, brushed-up look.', image: '/images/Bwow%20Lamination.jpg' },
    { category: 'LASHES', title: 'Lash Lift', description: 'Perm treatment that curls your natural lashes upward, giving a longer, more lifted appearance.', image: '/images/Lash%20Lift_After%20and%20Before.jpeg' },
    { category: 'BROWS', title: 'Ombré, microshading', description: 'Soft, powdered effect eyebrow technique using tiny dots for a filled-in, makeup-like finish.', image: '/images/Microshading.jpg' },
  ],
  gallery: [
    '/images/IMG-20260826-WA0010.jpg', '/images/IMG-20260826-WA0012.jpg', '/images/IMG-20260826-WA0013.jpg',
    '/images/IMG-20260826-WA0015.jpg', '/images/IMG-20260826-WA0016.jpg', '/images/IMG-20260826-WA0017.jpg',
    '/images/IMG-20260826-WA0018.jpg', '/images/IMG-20260826-WA0019.jpg', '/images/IMG-20260826-WA0021.jpg',
    '/images/IMG-20260826-WA0006.jpg', '/images/IMG-20260826-WA0007.jpg', '/images/IMG-20260826-WA0008.jpg',
    '/images/IMG-20260826-WA0009.jpg',
  ],
  videos: [
    { src: '/videos/VID-20260826-WA0028.mp4', poster: '/images/IMG-20260826-WA0018.jpg' },
    { src: '/videos/VID-20260826-WA0032.mp4', poster: '/images/IMG-20260826-WA0019.jpg' },
    { src: '/videos/VID-20260826-WA0034.mp4', poster: '/images/IMG-20260826-WA0021.jpg' },
    { src: '/videos/VID-20260826-WA0037.mp4', poster: '/images/IMG-20260826-WA0022.jpg' },
    { src: '/videos/VID-20260826-WA0039.mp4', poster: '/images/IMG-20260826-WA0023.jpg' },
    { src: '/videos/VID-20260826-WA0042.mp4', poster: '/images/IMG-20260826-WA0024.jpg' },
    { src: '/videos/VID-20260826-WA0046.mp4', poster: '/images/IMG-20260826-WA0027.jpg' },
    { src: '/videos/VID-20260826-WA0047.mp4', poster: '/images/IMG-20260826-WA0048.jpg' },
    { src: '/videos/VID-20260826-WA0049.mp4', poster: '/images/IMG-20260826-WA0003.jpg' },
    { src: '/videos/VID-20260826-WA0050.mp4', poster: '/images/IMG-20260826-WA0005.jpg' },
    { src: '/videos/VID-20260826-WA0051.mp4', poster: '/images/IMG-20260826-WA0006.jpg' },
    { src: '/videos/VID-20260826-WA0052.mp4', poster: '/images/IMG-20260826-WA0007.jpg' },
    { src: '/videos/VID-20260826-WA0053.mp4', poster: '/images/IMG-20260826-WA0008.jpg' },
  ],
};

const array = (v, key) => (Array.isArray(v) && v.length ? v : DEFAULT_CONTENT[key]);

export async function fetchSiteContent() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API_URL}/api/content/all`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return DEFAULT_CONTENT;
    const json = await res.json();
    const data = json.data || json;
    return {
      heroSlides: array(data.heroSlides, 'heroSlides'),
      heroStats: array(data.heroStats, 'heroStats'),
      categories: array(data.categories, 'categories'),
      featuredServices: array(data.featuredServices, 'featuredServices'),
      gallery: array(data.gallery, 'gallery'),
      videos: array(data.videos, 'videos'),
    };
  } catch (error) {
    return DEFAULT_CONTENT;
  }
}

export function useSiteContent() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    fetchSiteContent().then((c) => {
      if (mounted) {
        setContent(c);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);
  return { content, loading };
}

export async function fetchSiteInfo() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API_URL}/api/content/site`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return DEFAULT_SITE;
    const json = await res.json();
    const data = json.data || json;
    const merged = { ...DEFAULT_SITE, ...data };
    if (merged.phone1) merged.callRaw = merged.phone1.replace(/[^0-9]/g, '');
    else { merged.phone1 = DEFAULT_SITE.phone1; merged.callRaw = DEFAULT_SITE.phone1.replace(/[^0-9]/g, ''); }
    if (merged.phone2) merged.whatsappRaw = merged.phone2.replace(/[^0-9]/g, '');
    else { merged.phone2 = DEFAULT_SITE.phone2; merged.whatsappRaw = DEFAULT_SITE.phone2.replace(/[^0-9]/g, ''); }
    return merged;
  } catch (error) {
    return DEFAULT_SITE;
  }
}

export function useSiteInfo() {
  const [site, setSite] = useState(DEFAULT_SITE);
  useEffect(() => {
    let mounted = true;
    fetchSiteInfo().then((s) => {
      if (mounted) setSite(s);
    });
    return () => { mounted = false; };
  }, []);
  return { site };
}
