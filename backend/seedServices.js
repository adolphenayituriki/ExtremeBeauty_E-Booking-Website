require('dotenv').config();
const connectDB = require('./config/db');
const Service = require('./models/Service');

const services = [
  { name: 'Microblading Eyebrows', price: 100000, priceFormatted: 'RWF 100,000', image: '/images/IMG-20260826-WA0023.jpg', category: 'Brows', description: 'A semi-permanent tattooing technique that creates natural-looking, fuller eyebrows using fine, hair-like strokes.', featured: true, active: true, order: 0 },
  { name: 'Microshading Eyebrows', price: 100000, priceFormatted: 'RWF 100,000', image: '/images/IMG-20260826-WA0024.jpg', category: 'Brows', description: 'A soft, powdered effect technique using tiny dots to create a filled-in, makeup-like finish.', featured: true, active: true, order: 1 },
  { name: 'Hybrid / Combination Brows', price: 100000, priceFormatted: 'RWF 100,000', image: '/images/IMG-20260826-WA0027.jpg', category: 'Brows', description: 'The best of both worlds. Combines microblading strokes at the front with microshading at the tail.', featured: false, active: true, order: 2 },
  { name: 'Brows Lamination', price: 30000, priceFormatted: 'RWF 30,000', image: '/images/IMG-20260826-WA0048.jpg', category: 'Brows', description: 'A semi-permanent treatment that reshapes and sets brow hairs into place for a sleek look.', featured: false, active: true, order: 3 },
  { name: 'Lash Lift', price: 30000, priceFormatted: 'RWF 30,000', image: '/images/Lash-Lift.jpg', category: 'Lash Lift', description: 'A semi-permanent perm treatment that curls your natural lashes upward for a longer, lifted appearance.', featured: true, active: true, order: 4 },
  { name: 'Classic Set', price: 45000, priceFormatted: 'RWF 45,000', image: '/images/IMG-20260826-WA0008.jpg', category: 'Lashes', description: 'One extension applied to each natural lash for a subtle, natural enhancement.', featured: true, active: true, order: 5 },
  { name: 'Hybrid Set', price: 50000, priceFormatted: 'RWF 50,000', image: '/images/IMG-20260826-WA0009.jpg', category: 'Lashes', description: 'A mix of classic and volume techniques creating a textured, wispy look.', featured: false, active: true, order: 6 },
  { name: 'Volume Set', price: 55000, priceFormatted: 'RWF 55,000', image: '/images/IMG-20260826-WA0010.jpg', category: 'Lashes', description: 'Multiple lightweight fans applied to each natural lash for a full, dramatic appearance.', featured: false, active: true, order: 7 },
  { name: 'Mega Volume Set', price: 60000, priceFormatted: 'RWF 60,000', image: '/images/IMG-20260826-WA0012.jpg', category: 'Lashes', description: 'Ultra-dramatic look using the finest fans of 6-16 lashes per natural lash.', featured: false, active: true, order: 8 },
  { name: 'Wispy Sets', price: 50000, priceFormatted: 'RWF 45,000 - 60,000', image: '/images/IMG-20260826-WA0013.jpg', category: 'Lashes', description: 'A trendy, textured style with varying lengths creating a doll-like effect.', featured: false, active: true, order: 9 },
  { name: 'Lash Removal', price: 5000, priceFormatted: 'RWF 5,000', image: '/images/IMG-20260826-WA0015.jpg', category: 'Lashes', description: 'Professional and safe removal of eyelash extensions protecting your natural lashes.', featured: false, active: true, order: 10 },
  { name: 'Eyebrows Retouch', price: 60000, priceFormatted: 'RWF 60,000', image: '/images/IMG-20260826-WA0016.jpg', category: 'Retouch', description: 'Touch-up and refresh service for previously done microblading, microshading, or combination brows.', featured: false, active: true, order: 11 },
];

const run = async () => {
  await connectDB();
  const existing = await Service.countDocuments();
  console.log(`Existing services in DB: ${existing}`);

  if (existing > 0) {
    console.log('Services already present. Skipping seed to avoid duplicates.');
    console.log('Run with argument "force" to wipe and reseed.');
    if (process.argv[2] === 'force') {
      await Service.deleteMany({});
      const inserted = await Service.insertMany(services);
      console.log(`Reseeded ${inserted.length} services.`);
    }
  } else {
    const inserted = await Service.insertMany(services);
    console.log(`Seeded ${inserted.length} services successfully.`);
  }
  process.exit(0);
};

run();
