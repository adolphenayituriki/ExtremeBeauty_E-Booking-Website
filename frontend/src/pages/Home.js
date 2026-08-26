import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiStar, FiEye, FiPlay, FiCalendar, FiCheck, FiX } from 'react-icons/fi';

const heroSlides = [
  { type: 'image', src: '/images/Hero-bg-Image-1.jpg', title: 'Where Beauty Meets Artistry', subtitle: 'Extreme Beauty Lashes & Brows' },
  { type: 'video', src: '/videos/VID-20260826-WA0028.mp4', title: 'Precision & Perfection', subtitle: 'Extreme Beauty Lashes & Brows' },
  { type: 'image', src: '/images/Hero-bg-Image-2.jpg', title: 'Your Transformation Starts Here', subtitle: 'Extreme Beauty Lashes & Brows' },
  { type: 'video', src: '/videos/VID-20260826-WA0034.mp4', title: 'Define Your Elegance', subtitle: 'Extreme Beauty Lashes & Brows' },
  { type: 'image', src: '/images/Hero-bg-Image-3.jpg', title: 'Experience the Art of Beauty', subtitle: 'Extreme Beauty Lashes & Brows' },
];

const carouselImages = [
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

  const categories = [
    { name: 'Brows', description: '4 Services', image: '/images/IMG-20260826-WA0006.jpg', icon: <FiEye size={18} />, category: 'Brows' },
    { name: 'Lash Lift', description: 'Premium Service', image: '/images/IMG-20260826-WA0007.jpg', icon: <FiStar size={18} />, category: 'Lash Lift' },
    { name: 'Eyelash Extensions', description: '6 Styles Available', image: '/images/IMG-20260826-WA0008.jpg', icon: <FiEye size={18} />, category: 'Lashes' },
    { name: 'Eyebrows Retouch', description: 'Touch-Up Service', image: '/images/IMG-20260826-WA0009.jpg', icon: <FiCheck size={18} />, category: 'Retouch' },
  ];

  const featuredServices = [
    { category: 'BROWS', title: 'Microblading Eyebrows', description: 'Semi-permanent tattooing technique that creates natural-looking, fuller eyebrows with hair-like strokes.', image: '/images/IMG-20260826-WA0010.jpg' },
    { category: 'LASHES', title: 'Volume Set', description: 'Multiple lightweight extensions per natural lash creating a full, dramatic look perfect for special occasions.', image: '/images/IMG-20260826-WA0012.jpg' },
    { category: 'LASHES', title: 'Wispy Sets', description: 'Trendy, textured lash style with varying lengths for a natural yet eye-catching wispy effect.', image: '/images/IMG-20260826-WA0013.jpg' },
    { category: 'BROWS', title: 'Brows Lamination', description: 'Semi-permanent treatment that reshapes and sets brow hairs for a sleek, brushed-up look.', image: '/images/IMG-20260826-WA0015.jpg' },
    { category: 'LASHES', title: 'Lash Lift', description: 'Perm treatment that curls your natural lashes upward, giving a longer, more lifted appearance.', image: '/images/IMG-20260826-WA0016.jpg' },
    { category: 'BROWS', title: 'Microshading Eyebrows', description: 'Soft, powdered effect eyebrow technique using tiny dots for a filled-in, makeup-like finish.', image: '/images/IMG-20260826-WA0017.jpg' },
  ];

  const slide = heroSlides[currentHero];

  return (
    <>
      {/* ===== 1. HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center bg-gray-950 text-white overflow-hidden pt-[70px] lg:pt-[80px]">
        <div className="absolute inset-0 z-0">
          {heroSlides.map((s, i) => (
            <div key={i} className={`hero-bg-slide ${i === currentHero ? 'active' : ''} ${heroAnimating && i === currentHero ? 'exiting' : ''}`}>
              {s.type === 'video' ? (
                <video src={s.src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
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
            <div>
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
                {[
                  { value: '500+', label: 'Happy Clients' },
                  { value: '12+', label: 'Services' },
                  { value: '5\u2605', label: 'Rating' },
                ].map((stat, i) => (
                  <div key={i} className="relative">
                    <h3 className="text-[1.7rem] font-cormorant font-bold text-gold">{stat.value}</h3>
                    <p className="text-[0.65rem] uppercase tracking-[2px] text-gray-400">{stat.label}</p>
                    {i < 2 && <div className="absolute right-[-18px] top-1/2 -translate-y-1/2 w-px h-7 bg-white/10" />}
                  </div>
                ))}
              </div>
            </div>

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
          <div className="text-center mb-12">
            <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">What We Offer</p>
            <h2 className="text-[2rem] mb-2 font-cormorant font-semibold">Our Categories</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1200px] mx-auto px-5">
            {categories.map((cat, index) => (
              <Link to={`/services?category=${cat.category}`} key={index} className="relative h-[320px] overflow-hidden cursor-pointer rounded-2xl group glass-card">
                <div className="w-full h-full overflow-hidden">
                  <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] grayscale-[30%] group-hover:grayscale-0 group-hover:scale-[1.12]" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-gold mb-2">{cat.icon}</div>
                  <h3 className="text-[1.15rem] text-white mb-1 group-hover:text-gold transition-colors duration-300">{cat.name}</h3>
                  <p className="text-[0.68rem] uppercase tracking-[2px] text-gray-300">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. FEATURED SERVICES ===== */}
      <section className="py-20 px-5 bg-white relative">
        <div className="max-w-[1200px] mx-auto relative">
          <div className="text-center mb-12">
            <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Popular Services</p>
            <h2 className="text-[2rem] mb-3 font-cormorant font-semibold">Featured Treatments</h2>
            <p className="text-gray-500 text-[0.88rem] max-w-[480px] mx-auto">Handpicked services our clients love most. Each treatment is crafted with precision and care.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredServices.map((service, index) => (
              <div key={index} className="group glass-card rounded-2xl overflow-hidden cursor-pointer" onClick={() => setSelectedService(service)}>
                <div className="relative h-[220px] overflow-hidden">
                  <img src={service.image} alt={service.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center gap-2 bg-black text-white px-7 py-3 text-[0.75rem] font-semibold uppercase tracking-[2px] rounded-xl transition-all duration-300 hover:bg-gold hover:shadow-[0_8px_30px_rgba(184,149,106,0.3)]">
              View All Services <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 4. GALLERY ===== */}
      <section className="py-20 px-5 bg-white relative">
        <div className="max-w-[1200px] mx-auto relative">
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
                        <div className="aspect-[3/4] overflow-hidden rounded-2xl glass-card hover:transform-none">
                          <img src={img} alt={`Gallery ${i + 1}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
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
        </div>
      </section>

      {/* ===== 5. VIDEOS ===== */}
      <section className="py-20 px-5 bg-gray-950 text-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">See Our Work</p>
            <h2 className="text-[2rem] mb-2 text-white font-cormorant font-semibold">Featured Videos</h2>
          </div>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: `translateX(-${videoIndex * 33.333}%)` }}>
                {[
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
                ].map((video, i) => (
                  <div key={i} className="flex-shrink-0 min-w-[50%] sm:min-w-[33.333%] px-2.5">
                    <div className="relative overflow-hidden rounded-2xl cursor-pointer group">
                      <video src={video.src} controls muted poster={video.poster} className="w-full h-[180px] sm:h-[220px] lg:h-[260px] object-cover block transition-all duration-500 group-hover:scale-105" />
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
      <section className="py-20 px-5 bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.05)_0%,transparent_70%)]" />
        <div className="text-center max-w-[700px] mx-auto relative">
          <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FiCalendar size={24} className="text-gold" />
          </div>
          <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Ready For Your Transformation?</p>
          <h2 className="text-[2rem] mb-3 font-cormorant font-semibold">Book Your Appointment Today</h2>
          <p className="text-gray-500 max-w-[500px] mx-auto text-[0.88rem] mb-8 leading-relaxed">
            Don't wait to look and feel your best. Schedule your appointment now.
          </p>
          <Link to="/booking" className="btn-primary">Book Now</Link>
        </div>
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
