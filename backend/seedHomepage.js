require('dotenv').config();
const connectDB = require('./config/db');
const Content = require('./models/Content');

const seed = {
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
    { name: 'Brows', description: '4 Services', image: '/images/IMG-20260826-WA0006.jpg', category: 'Brows' },
    { name: 'Lash Lift', description: 'Premium Service', image: '/images/Lash-Lift.jpg', category: 'Lash Lift' },
    { name: 'Eyelash Extensions', description: '6 Styles Available', image: '/images/IMG-20260826-WA0010.jpg', category: 'Lashes' },
    { name: 'Eyebrows Retouch', description: 'Touch-Up Service', image: '/images/IMG-20260826-WA0009.jpg', category: 'Retouch' },
  ],
  featuredServices: [
    { category: 'BROWS', title: 'Microblading Eyebrows', description: 'Semi-permanent tattooing technique that creates natural-looking, fuller eyebrows with hair-like strokes.', image: '/images/IMG-20260826-WA0010.jpg' },
    { category: 'LASHES', title: 'Volume Set', description: 'Multiple lightweight extensions per natural lash creating a full, dramatic look perfect for special occasions.', image: '/images/IMG-20260826-WA0012.jpg' },
    { category: 'LASHES', title: 'Wispy Sets', description: 'Trendy, textured lash style with varying lengths for a natural yet eye-catching wispy effect.', image: '/images/IMG-20260826-WA0013.jpg' },
    { category: 'BROWS', title: 'Brows Lamination', description: 'Semi-permanent treatment that reshapes and sets brow hairs for a sleek, brushed-up look.', image: '/images/IMG-20260826-WA0015.jpg' },
    { category: 'LASHES', title: 'Lash Lift', description: 'Perm treatment that curls your natural lashes upward, giving a longer, more lifted appearance.', image: '/images/IMG-20260826-WA0016.jpg' },
    { category: 'BROWS', title: 'Microshading Eyebrows', description: 'Soft, powdered effect eyebrow technique using tiny dots for a filled-in, makeup-like finish.', image: '/images/IMG-20260826-WA0017.jpg' },
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

const run = async () => {
  await connectDB();
  for (const [key, data] of Object.entries(seed)) {
    const existing = await Content.findOne({ key });
    if (existing && process.argv[2] !== 'force') {
      console.log(`Skip ${key} (already exists). Use "force" to overwrite.`);
      continue;
    }
    await Content.findOneAndUpdate({ key }, { key, data }, { new: true, upsert: true });
    console.log(`Seeded "${key}" (${Array.isArray(data) ? data.length + ' items' : 'object'})`);
  }
  process.exit(0);
};

run();
