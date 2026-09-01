export const services = [
  {
    name: "Microblading Eyebrows",
    price: 100000,
    priceFormatted: "RWF 100,000",
    image: "/images/Microblading.jpg",
    category: "Brows",
    description:
      "A semi-permanent tattooing technique that creates natural-looking, fuller eyebrows using fine, hair-like strokes.",
  },
  {
    name: "Microshading Eyebrows",
    price: 100000,
    priceFormatted: "RWF 100,000",
    image: "/images/Ombr%C3%A9,%20microshading.jpg",
    category: "Brows",
    description:
      "A soft, powdered effect technique using tiny dots to create a filled-in, makeup-like finish.",
  },
  {
    name: "Hybrid / Combination Brows",
    price: 100000,
    priceFormatted: "RWF 100,000",
    image: "/images/Hybrid%20%20Combination%20Brows.jpg",
    category: "Brows",
    description:
      "The best of both worlds. Combines microblading strokes at the front with microshading at the tail.",
  },
  {
    name: "Brows Lamination",
    price: 30000,
    priceFormatted: "RWF 30,000",
    image: "/images/Brow%20lamination.jpg",
    category: "Brows",
    description:
      "A semi-permanent treatment that reshapes and sets brow hairs into place for a sleek look.",
  },
  {
    name: "Lash Lift",
    price: 30000,
    priceFormatted: "RWF 30,000",
    image: "/images/Lash%20lift.jpg",
    category: "Lash Lift",
    description:
      "A semi-permanent perm treatment that curls your natural lashes upward for a longer, lifted appearance.",
  },
  {
    name: "Classic Set",
    price: 45000,
    priceFormatted: "RWF 45,000",
    image: "/images/Brows%20Category.jpg",
    category: "Lashes",
    description:
      "One extension applied to each natural lash for a subtle, natural enhancement.",
  },
  {
    name: "Hybrid Set",
    price: 50000,
    priceFormatted: "RWF 50,000",
    image: "/images/Hybride%20set.jpg",
    category: "Lashes",
    description:
      "A mix of classic and volume techniques creating a textured, wispy look.",
  },
  {
    name: "Volume Set",
    price: 55000,
    priceFormatted: "RWF 55,000",
    image: "/images/Volume%20lashes%20set.jpg",
    category: "Lashes",
    description:
      "Multiple lightweight fans applied to each natural lash for a full, dramatic appearance.",
  },
  {
    name: "Mega Volume Set",
    price: 60000,
    priceFormatted: "RWF 60,000",
    image: "/images/Mega%20volume.jpg",
    category: "Lashes",
    description:
      "Ultra-dramatic look using the finest fans of 6-16 lashes per natural lash.",
  },
  {
    name: "Wispy Sets",
    price: 50000,
    priceFormatted: "RWF 45,000 - 60,000",
    image: "/images/Whisper%20set.jpg",
    category: "Lashes",
    description:
      "A trendy, textured style with varying lengths creating a doll-like effect.",
  },
  {
    name: "Lash Removal",
    price: 5000,
    priceFormatted: "RWF 5,000",
    image: "/images/Lash%20removal.jpeg",
    category: "Lashes",
    description:
      "Professional and safe removal of eyelash extensions protecting your natural lashes.",
  },
  {
    name: "Eyebrows Retouch",
    price: 60000,
    priceFormatted: "RWF 60,000",
    image: "/images/Eyebrows.jpg",
    category: "Retouch",
    description:
      "Touch-up and refresh service for previously done microblading, microshading, or combination brows.",
  },
  {
    name: "Training Session",
    price: 0,
    priceFormatted: "On Request",
    image: "/images/Teaching-1.jpeg",
    category: "Training",
    description:
      "Learn the craft of lashes and brows. Certified training, hands-on practice on live models, and essential safety guidance included.",
  },
];

export const categories = [
  { key: "Brows", label: "Eyebrow Treatments" },
  { key: "Lash Lift", label: "Lash Lift & Perm" },
  { key: "Lashes", label: "Eyelash Extensions" },
  { key: "Retouch", label: "Touch-Ups & Retouch" },
  { key: "Training", label: "Training Sessions" },
];

export const getServiceByName = (name) => services.find((s) => s.name === name);

export const getServicesByCategory = (categoryKey) =>
  services.filter((s) => s.category === categoryKey);
