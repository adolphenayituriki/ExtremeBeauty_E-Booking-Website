import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiStar, FiEye, FiPlay, FiCalendar, FiCheck, FiX } from 'react-icons/fi';
import { motion, useInView } from 'framer-motion';
import { useSiteContent } from '../utils/content';
import { allCategories as serviceCategories } from './Services';
import Seo from '../utils/Seo';

const FadeIn = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const defaultHeroSlides = [
  { type: 'image', src: '/images/Hero-bg-Image-1.jpg', title: 'Where Beauty Meets Artistry', subtitle: 'Extreme Beauty Lashes & Brows' },
  { type: 'video', src: '/videos/VID-20260826-WA0028.mp4', title: 'Precision & Perfection', subtitle: 'Extreme Beauty Lashes & Brows' },
  { type: 'image', src: '/images/Hero-bg-Image-2.jpg', title: 'Your Transformation Starts Here', subtitle: 'Extreme Beauty Lashes & Brows' },
  { type: 'video', src: '/videos/VID-20260826-WA0034.mp4', title: 'Define Your Elegance', subtitle: 'Extreme Beauty Lashes & Brows' },
  { type: 'image', src: '/images/Hero-bg-Image-3.jpg', title: 'Experience the Art of Beauty', subtitle: 'Extreme Beauty Lashes & Brows' },
];

const defaultCarouselImages = [
  '/images/IMG-20260826-WA0010.jpg',
  '/images/IMG-20260826-WA0012.jpg',
  '/images/IMG-20260826-WA0013.jpg',
  '/images/IMG-20260826-WA0015.jpg',
  '/images/IMG-20260826-WA0016.jpg',
  '/images/IMG-20260826-WA0017.jpg',
  '/images/IMG-20260826-WA0018.jpg',
  '/images/IMG-20260826-WA0019.jpg',
  '/images/IMG-20260826-WA0021.jpg',
  '/images/IMG-20260826-WA0006.jpg',
  '/images/IMG-20260826-WA0007.jpg',
  '/images/IMG-20260826-WA0008.jpg',
  '/images/IMG-20260826-WA0009.jpg',
];

const Home = () => {
  const [currentHero, setCurrentHero] = useState(0);
  const [heroAnimating, setHeroAnimating] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef(null);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [videoIndex, setVideoIndex] = useState(0);

  const { content } = useSiteContent();

  const defaultCategories = [
    { name: 'Brows', description: '4 Services', image: '/images/IMG-20260826-WA0006.jpg', icon: <FiEye size={18} />, category: 'Brows' },
    { name: 'Lash Lift', description: 'Premium Service', image: '/images/Lash-Lift.jpg', icon: <FiStar size={18} />, category: 'Lash Lift' },
    { name: 'Eyelash Extensions', description: '6 Styles Available', image: '/images/IMG-20260826-WA0010.jpg', icon: <FiEye size={18} />, category: 'Lashes' },
    { name: 'Eyebrows Retouch', description: 'Touch-Up Service', image: '/images/IMG-20260826-WA0009.jpg', icon: <FiCheck size={18} />, category: 'Retouch' },
  ];

  const defaultFeaturedServices = [
    { category: 'BROWS', title: 'Microblading Eyebrows', description: 'Semi-permanent tattooing technique that creates natural-looking, fuller eyebrows with hair-like strokes.', image: '/images/Microblading.jpg' },
    { category: 'LASHES', title: 'Volume Set', description: 'Multiple lightweight extensions per natural lash creating a full, dramatic look perfect for special occasions.', image: '/images/Volume%20Set.jpg' },
    { category: 'LASHES', title: 'Wispy Sets', description: 'Trendy, textured lash style with varying lengths for a natural yet eye-catching wispy effect.', image: '/images/Whisper%20set.jpg' },
    { category: 'BROWS', title: 'Brows Lamination', description: 'Semi-permanent treatment that reshapes and sets brow hairs for a sleek, brushed-up look.', image: '/images/Bwow%20Lamination.jpg' },
    { category: 'LASHES', title: 'Lash Lift', description: 'Perm treatment that curls your natural lashes upward, giving a longer, more lifted appearance.', image: '/images/Lash%20Lift_After%20and%20Before.jpeg' },
    { category: 'BROWS', title: 'Microshading Eyebrows', description: 'Soft, powdered effect eyebrow technique using tiny dots for a filled-in, makeup-like finish.', image: '/images/Microshading.jpg' },
  ];

  const teachingSteps = [
    { title: 'Consultation', image: 'Teaching-1.jpeg', description: 'We begin by understanding your natural features and the look you want to achieve.' },
    { title: 'Design & Mapping', image: 'Teaching-2.jpg', description: 'Your lash line and brows are carefully mapped for perfect proportion and symmetry.' },
    { title: 'Application', image: 'Teaching-4.jpg', description: 'Precision placement, lash by lash, technique by technique, for a seamless finish.' },
    { title: 'Refinement', image: 'Teaching-5.jpg', description: 'We perfect every detail, balancing shape and symmetry for a natural result.' },
    { title: 'Aftercare & Guidance', image: 'Teaching-6.jpg', description: 'You leave with clear aftercare guidance to keep your look beautiful for longer.' },
  ];

  const heroSlides = content?.heroSlides || defaultHeroSlides;
  const carouselImages = content?.gallery || defaultCarouselImages;
  const categories = content?.categories || defaultCategories;
  const categoriesWithServices = categories.map((cat) => {
    const match = serviceCategories.find(
      (sc) => sc.key === cat.category || sc.title === cat.category || sc.title === cat.name
    );
    return { ...cat, services: match ? match.services : [] };
  });
  const featuredServices = content?.featuredServices || defaultFeaturedServices;
  const heroStats = content?.heroStats || [
    { value: '2000+', label: 'Happy Clients' },
    { value: '12+', label: 'Services' },
    { value: '5★', label: 'Rating' },
  ];
  const pageVideos = content?.videos || [
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
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroAnimating(true);
      setTimeout(() => {
        setCurrentHero((prev) => (prev + 1) % heroSlides.length);
        setHeroAnimating(false);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (carouselPaused) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => {
        if (prev >= carouselImages.length - 3) return 0;
        return prev + 1;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [carouselPaused]);

  const scrollCarousel = useCallback((dir) => {
    setCarouselIndex((prev) => {
      if (dir === 'left') return prev <= 0 ? carouselImages.length - 3 : prev - 1;
      return prev >= carouselImages.length - 3 ? 0 : prev + 1;
    });
  }, []);

  const slide = heroSlides[currentHero];

  return (
    <>
      <Seo
        title="Extreme Beauty Lashes & Brows | Beauty Salon in Kigali, Rwanda"
        description="Extreme Beauty Lashes & Brows — Kigali's trusted lash & brow studio. Microblading, eyelash extensions, lash lift and brow lamination. Book your appointment today."
        path="/"
      />
      {/* ===== 1. HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center bg-gray-950 text-white overflow-hidden pt-[70px] lg:pt-[80px]">
        <div className="absolute inset-0 z-0">
          {heroSlides.map((s, i) => (
            <div key={i} className={`hero-bg-slide ${i === currentHero ? 'active' : ''} ${heroAnimating && i === currentHero ? 'exiting' : ''}`}>
              {s.type === 'video' ? (
                i === currentHero ? (
                  <video src={s.src} autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(/images/Hero-bg-Image-1.jpg)' }} />
                )
              ) : (
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${s.src})` }} />
              )}
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60" />
        
          <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] lg:w-[400px] lg:h-[400px] bg-gold/[0.06] rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full py-8 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-6 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-4 font-medium">
                {slide.subtitle}
              </p>
              <h1 className="text-[1.6rem] sm:text-4xl sm:text-5xl lg:text-[3.2rem] leading-[1.1] mb-5 font-cormorant font-semibold text-white">
                {slide.title}
              </h1>
              <p className="text-[0.88rem] text-gray-300 mb-7 max-w-[420px] leading-[1.6]">
                Extreme Beauty Lashes & Brows offers world-class beauty services in the heart of Kigali.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link to="/booking" className="btn-primary">Book Appointment</Link>
                <Link to="/services" className="btn-secondary border-white/20 text-white hover:border-gold hover:text-gold hover:bg-gold/5">Our Services</Link>
              </div>
              <div className="flex flex-wrap gap-5 sm:gap-7 lg:gap-10">
                {heroStats.map((stat, i) => (
                  <div key={i} className="relative">
                    <h3 className="text-[1.7rem] font-cormorant font-bold text-gold">{stat.value}</h3>
                    <p className="text-[0.65rem] uppercase tracking-[2px] text-gray-400">{stat.label}</p>
                    {i < 2 && <div className="absolute right-[-18px] top-1/2 -translate-y-1/2 w-px h-7 bg-white/10" />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Brand Card - Premium Business Card Style */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="bg-white/[0.08] backdrop-blur-md border border-white/[0.15] rounded-3xl p-8 w-[340px] relative overflow-hidden">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-gold/30 rounded-tl-3xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-gold/30 rounded-br-3xl" />

                {/* Logo directly on card */}
                <div className="text-center mb-5">
                  <img src="/logo/removebg-preview.png" alt="Extreme Beauty" className="h-[60px] mx-auto object-contain" />
                  <p className="text-gold text-[0.58rem] uppercase tracking-[5px] font-medium mt-3">Kigali, Rwanda</p>
                </div>

                {/* Divider */}
                <div className="w-10 h-[1px] bg-gold/40 mx-auto mb-5" />

                {/* Tagline */}
                <div className="text-center">
                  <p className="font-cormorant text-gold/80 text-[1rem] italic leading-[1.6]" style={{ fontWeight: 400 }}>
                    "Life is short but your<br />lashes shouldn't be!"
                  </p>
                </div>

                {/* Bottom divider */}
                <div className="w-10 h-[1px] bg-gold/40 mx-auto mt-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Dots only */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroSlides.map((_, index) => (
            <button key={index} className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 cursor-pointer p-0 ${index === currentHero ? 'bg-gold border-gold scale-125' : 'bg-transparent border-white/20 hover:border-gold'}`} onClick={() => { setCurrentHero(index); setHeroAnimating(false); }} aria-label={`Slide ${index + 1}`} />
          ))}
        </div>
      </section>

      {/* ===== 2. CATEGORIES ===== */}
      <section className="py-20 px-5 bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,149,106,0.04)_0%,transparent_60%)]" />
        <div className="relative">
          <FadeIn>
            <div className="text-center mb-8">
              <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">What We Offer</p>
              <h2 className="text-[2rem] mb-2 font-cormorant font-semibold">Our Categories</h2>
              <p className="text-gray-500 text-[0.85rem]">Discover our professional beauty services</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1200px] mx-auto px-5">
            {categoriesWithServices.map((cat, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <Link to={`/services?category=${encodeURIComponent(cat.category || cat.name)}`} className="group block overflow-hidden rounded-2xl bg-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:-translate-y-1">
                  <div className="relative p-2 pb-0">
                    <div className="relative h-[150px] overflow-hidden rounded-t-xl border border-white/10">
                      <img src={cat.image} alt={cat.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <span className="absolute top-4 right-4 text-[0.55rem] font-bold uppercase tracking-[1px] text-gold bg-black/60 backdrop-blur border border-gold/30 px-2 py-0.5 rounded-full">
                      {cat.services.length}
                    </span>
                  </div>

                  <div className="relative mx-2 mb-2 mt-[-10px] rounded-b-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/80" />
                    <div className="relative p-4 backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-xl">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-gold shrink-0">{cat.icon}</span>
                        <h3 className="text-[1rem] text-white font-semibold group-hover:text-gold transition-colors duration-300 truncate">{cat.name}</h3>
                      </div>

                      <ul className="space-y-1.5 mb-3.5">
                        {cat.services.map((s) => (
                          <li key={s.name} className="flex items-center justify-between gap-2 text-[0.68rem] leading-[1.2]">
                            <span className="text-gray-100 flex items-center min-w-0">
                              <span className="text-gold mr-1.5 shrink-0">•</span>
                              <span className="truncate">{s.name}</span>
                            </span>
                            <span className="text-white font-semibold whitespace-nowrap shrink-0">{s.price}</span>
                          </li>
                        ))}
                      </ul>

                      <span className="flex items-center justify-center gap-1.5 w-full py-2 text-[0.63rem] font-semibold uppercase tracking-[2px] text-black bg-gold rounded-lg transition-all duration-300 group-hover:bg-gold-light">
                        View All <FiArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. FEATURED SERVICES ===== */}
      <section className="py-20 px-5 bg-white relative">
        <div className="max-w-[1200px] mx-auto relative">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Popular Services</p>
              <h2 className="text-[2rem] mb-3 font-cormorant font-semibold">Featured Treatments</h2>
              <p className="text-gray-500 text-[0.88rem] max-w-[480px] mx-auto">Handpicked services our clients love most. Each treatment is crafted with precision and care.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredServices.map((service, index) => (
              <FadeIn key={index} delay={index * 0.08}>
                <div className="group glass-card rounded-2xl overflow-hidden cursor-pointer" onClick={() => setSelectedService(service)}>
                  <div className="relative h-[220px] overflow-hidden flex items-center justify-center">
                    <img src={service.image} alt={service.title} loading="lazy" decoding="async" className={`w-full h-full transition-transform duration-700 ${(service.title === 'Volume Set') ? 'object-[50%_120%]' : (service.title === 'Lash Lift') ? 'object-cover object-bottom' : 'object-cover object-top group-hover:scale-[1.04]'}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="absolute top-3 left-3 glass text-[0.62rem] font-semibold uppercase tracking-[1.5px] text-gold px-2.5 py-1 rounded-full">{service.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[1.05rem] mb-1.5 group-hover:text-gold transition-colors duration-300">{service.title}</h3>
                    <p className="text-gray-500 text-[0.8rem] leading-[1.6] mb-4 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100/60">
                      <span className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[1.5px] text-gold transition-all duration-300">
                        View Details <FiArrowRight size={13} />
                      </span>
                      <Link to={`/booking?service=${encodeURIComponent(service.title)}`} onClick={(e) => e.stopPropagation()} className="text-[0.7rem] text-gray-400 hover:text-gold transition-colors duration-300">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center gap-2 bg-black text-white px-7 py-3 text-[0.75rem] font-semibold uppercase tracking-[2px] rounded-xl transition-all duration-300 hover:bg-gold hover:shadow-[0_8px_30px_rgba(184,149,106,0.3)]">
              View All Services <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 4. TEACHING ===== */}
      <section className="py-14 px-5 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(184,149,106,0.06)_0%,transparent_60%)]" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-gold/[0.04] rounded-full blur-[120px]" />
        <div className="max-w-[1200px] mx-auto relative">
          <FadeIn>
            <div className="text-center mb-8">
              <p className="text-[0.65rem] tracking-[4px] uppercase text-gold mb-1.5 font-medium">Learn The Craft</p>
              <h2 className="text-[1.7rem] mb-1.5 text-white font-cormorant font-semibold">How We Create Your Look</h2>
              <p className="text-gray-400 text-[0.82rem] max-w-[520px] mx-auto">Here's how we train, prepare and perfect each treatment.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
            {teachingSteps.slice(0, 3).map((step, index) => (
              <FadeIn key={index} delay={index * 0.08}>
                <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] hover:border-gold/40 transition-all duration-500">
                  <div className="relative h-28 sm:h-32 lg:h-36 overflow-hidden">
                    <img src={`/images/${step.image}`} alt={step.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
                    <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gold text-black flex items-center justify-center text-[0.75rem] font-bold shadow-lg">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-[0.85rem] mb-0.5 text-white group-hover:text-gold transition-colors duration-300">{step.title}</h3>
                    <p className="text-gray-400 text-[0.7rem] leading-[1.5]">{step.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/teaching" className="inline-flex items-center gap-2 bg-gold text-black px-7 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[2px] rounded-lg transition-all duration-300 hover:bg-gold-light hover:shadow-[0_8px_30px_rgba(184,149,106,0.3)]">
              See The Full Process <FiArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 5. GALLERY ===== */}
      <section className="py-20 px-5 bg-white relative">
        <div className="max-w-[1200px] mx-auto relative">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
            {/* Left - Carousel */}
            <div>
              <div className="mb-8">
                <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Our Work</p>
                <h2 className="text-[2rem] mb-2 font-cormorant font-semibold">Gallery Showcase</h2>
                <p className="text-gray-500 text-[0.88rem]">A glimpse into the artistry behind every treatment.</p>
              </div>
              <div className="relative" onMouseEnter={() => setCarouselPaused(true)} onMouseLeave={() => setCarouselPaused(false)}>
                <div className="overflow-hidden">
                  <div className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" ref={carouselRef} style={{ transform: `translateX(-${carouselIndex * (100 / 3)}%)` }}>
                    {carouselImages.map((img, i) => (
                      <div key={i} className="flex-shrink-0 w-1/3 px-1.5">
                        <div className="h-[280px] overflow-hidden rounded-2xl glass-card hover:transform-none">
                          <img src={img} alt={`Gallery ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => scrollCarousel('left')} className="absolute left-2 sm:left-[-16px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 glass flex items-center justify-center text-gray-600 cursor-pointer transition-all duration-300 hover:bg-gold hover:text-white hover:border-gold rounded-xl shadow-sm">
                  <FiChevronLeft size={17} />
                </button>
                <button onClick={() => scrollCarousel('right')} className="absolute right-2 sm:right-[-16px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 glass flex items-center justify-center text-gray-600 cursor-pointer transition-all duration-300 hover:bg-gold hover:text-white hover:border-gold rounded-xl shadow-sm">
                  <FiChevronRight size={17} />
                </button>
              </div>
              <div className="flex justify-center gap-1.5 mt-4">
                {carouselImages.slice(0, carouselImages.length - 2).map((_, i) => (
                  <button key={i} className={`h-1.5 rounded-full border-none cursor-pointer transition-all duration-300 ${i === carouselIndex ? 'bg-gold w-5' : 'bg-gray-300 hover:bg-gray-400 w-1.5'}`} onClick={() => setCarouselIndex(i)} />
                ))}
              </div>
            </div>

            {/* Right - Impressions */}
            <div className="pt-0 lg:pt-[72px]">
              <div className="mb-5">
                <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Client Impressions</p>
                <h2 className="text-[1.5rem] mb-1 font-cormorant font-semibold">Trusted by Hundreds</h2>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <FiStar key={s} size={13} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-[0.88rem] text-gray-600 leading-[1.8]">
                  From the consultation to the final result, everything was seamless. My brows look so natural. People keep asking where I got them done. Best lash experience in Kigali. The volume set was exactly what I wanted, full but still lightweight. The brow lamination completely changed my look. Clean studio, friendly staff, and results that lasted.
                </p>
              </div>
            </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== 5. VIDEOS ===== */}
      <section className="py-20 px-5 bg-gray-950 text-white">
        <div className="max-w-[1200px] mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">See Our Work</p>
              <h2 className="text-[2rem] mb-2 text-white font-cormorant font-semibold">Featured Videos</h2>
            </div>
          </FadeIn>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: `translateX(-${videoIndex * 33.333}%)` }}>
                {pageVideos.map((video, i) => (
                  <div key={i} className="flex-shrink-0 min-w-[50%] sm:min-w-[33.333%] px-2.5">
                    <div className="relative overflow-hidden rounded-2xl cursor-pointer group">
                      <video src={video.src} controls muted playsInline preload="none" poster={video.poster} className="w-full h-[180px] sm:h-[220px] lg:h-[260px] object-cover block transition-all duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                          <FiPlay size={18} className="text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Arrows */}
            <button onClick={() => setVideoIndex((prev) => prev <= 0 ? 10 : prev - 1)} className="absolute left-2 sm:left-[-16px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:bg-gold hover:text-black hover:border-gold rounded-full">
              <FiChevronLeft size={18} />
            </button>
            <button onClick={() => setVideoIndex((prev) => prev >= 10 ? 0 : prev + 1)} className="absolute right-2 sm:right-[-16px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:bg-gold hover:text-black hover:border-gold rounded-full">
              <FiChevronRight size={18} />
            </button>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {[...Array(11)].map((_, i) => (
              <button key={i} className={`h-1.5 rounded-full border-none cursor-pointer transition-all duration-300 ${i === videoIndex ? 'bg-gold w-5' : 'bg-white/20 hover:bg-white/40 w-1.5'}`} onClick={() => setVideoIndex(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. CTA ===== */}
      <section className="py-16 px-5 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/[0.06] rounded-full blur-[120px]" />
        </div>
        <FadeIn>
          <div className="text-center max-w-[550px] mx-auto relative z-10">
            <h2 className="text-[1.8rem] sm:text-[2.2rem] leading-[1.1] mb-3 font-cormorant font-semibold text-white">
              Ready For Your Transformation?
            </h2>
            <p className="text-gray-400 max-w-[400px] mx-auto text-[0.85rem] mb-7 leading-[1.6]">
              Don't wait to look and feel your best. Our expert artists are ready to bring out your natural beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link to="/booking" className="btn-primary">Book Appointment</Link>
              <a href="https://wa.me/250787035643" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-transparent text-white px-9 py-3.5 text-xs font-semibold uppercase tracking-[2px] border-2 border-white/20 rounded-xl cursor-pointer transition-all duration-[400ms] hover:border-gold hover:text-gold hover:bg-gold/5">
                Chat on WhatsApp
              </a>
            </div>
            <div className="flex items-center justify-center gap-5 text-gray-500 text-[0.72rem]">
              <span className="flex items-center gap-1.5">
                <FiCalendar size={11} className="text-gold/60" /> Same-day bookings
              </span>
              <span className="w-px h-3 bg-white/10" />
              <span className="flex items-center gap-1.5">
                <FiCheck size={11} className="text-gold/60" /> Free consultation
              </span>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedService(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-[440px] bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden animate-fade-in" onClick={(e) => e.stopPropagation()}>
            {/* Image */}
            <div className="relative h-[240px]">
              <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 w-9 h-9 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer border-none transition-all duration-300 hover:bg-black/50">
                <FiX size={18} />
              </button>
              <div className="absolute top-4 left-4">
                <span className="bg-white/20 backdrop-blur-md text-white text-[0.65rem] font-semibold px-3 py-1.5 rounded-full">{selectedService.category}</span>
              </div>
              <div className="absolute bottom-4 left-5 right-5">
                <h3 className="text-white text-[1.3rem] mb-1">{selectedService.title}</h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 text-[0.85rem] leading-[1.7] mb-6">{selectedService.description}</p>
              <div className="flex gap-3">
                <Link to={`/booking?service=${encodeURIComponent(selectedService.title)}`} className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 text-[0.75rem] font-semibold uppercase tracking-[1.5px] rounded-xl transition-all duration-300 hover:bg-gold text-center no-underline">
                  Book Now <FiArrowRight size={13} />
                </Link>
                <button onClick={() => setSelectedService(null)} className="px-5 py-3 border border-gray-200 rounded-xl text-[0.75rem] font-semibold uppercase tracking-[1.5px] text-gray-600 cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold bg-white">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
