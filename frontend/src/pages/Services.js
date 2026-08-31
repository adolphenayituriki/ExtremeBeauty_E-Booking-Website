import React, { useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowRight, FiEye, FiStar, FiCheckCircle, FiSearch, FiX } from 'react-icons/fi';
import Seo from '../utils/Seo';

export const allCategories = [
  {
    title: 'Brows',
    key: 'Brows',
    label: 'Eyebrow Treatments',
    icon: <FiEye size={20} />,
    services: [
      { name: 'Microblading Eyebrows', description: 'A semi-permanent tattooing technique that creates natural-looking, fuller eyebrows using fine, hair-like strokes.', image: '/images/IMG-20260826-WA0023.jpg', price: 'RWF 100,000' },
      { name: 'Microshading Eyebrows', description: 'A soft, powdered effect technique using tiny dots to create a filled-in, makeup-like finish.', image: '/images/IMG-20260826-WA0024.jpg', price: 'RWF 100,000' },
      { name: 'Hybrid / Combination Brows', description: 'The best of both worlds. Combines microblading strokes at the front with microshading at the tail.', image: '/images/IMG-20260826-WA0027.jpg', price: 'RWF 100,000' },
      { name: 'Brows Lamination', description: 'A semi-permanent treatment that reshapes and sets brow hairs into place for a sleek look.', image: '/images/IMG-20260826-WA0048.jpg', price: 'RWF 30,000' },
    ],
  },
  {
    title: 'Lash Lift',
    key: 'Lash Lift',
    label: 'Lash Lift & Perm',
    icon: <FiStar size={20} />,
    services: [
      { name: 'Lash Lift', description: 'A semi-permanent perm treatment that curls your natural lashes upward for a longer, lifted appearance.', image: '/images/Lash-Lift.jpg', price: 'RWF 30,000' },
    ],
  },
  {
    title: 'Eyelash Extensions',
    key: 'Lashes',
    label: 'Eyelash Extensions',
    icon: <FiEye size={20} />,
    services: [
      { name: 'Classic Set', description: 'One extension applied to each natural lash for a subtle, natural enhancement.', image: '/images/IMG-20260826-WA0008.jpg', price: 'RWF 45,000' },
      { name: 'Hybrid Set', description: 'A mix of classic and volume techniques creating a textured, wispy look.', image: '/images/IMG-20260826-WA0009.jpg', price: 'RWF 50,000' },
      { name: 'Volume Set', description: 'Multiple lightweight fans applied to each natural lash for a full, dramatic appearance.', image: '/images/IMG-20260826-WA0010.jpg', price: 'RWF 55,000' },
      { name: 'Mega Volume Set', description: 'Ultra-dramatic look using the finest fans of 6-16 lashes per natural lash.', image: '/images/IMG-20260826-WA0012.jpg', price: 'RWF 60,000' },
      { name: 'Wispy Sets', description: 'A trendy, textured style with varying lengths creating a doll-like effect.', image: '/images/IMG-20260826-WA0013.jpg', price: 'RWF 45,000 – 60,000' },
      { name: 'Lash Removal', description: 'Professional and safe removal of eyelash extensions protecting your natural lashes.', image: '/images/IMG-20260826-WA0015.jpg', price: 'RWF 5,000' },
    ],
  },
  {
    title: 'Eyebrows Retouch',
    key: 'Retouch',
    label: 'Touch-Ups & Retouch',
    icon: <FiCheckCircle size={20} />,
    services: [
      { name: 'Eyebrows Retouch', description: 'Touch-up and refresh service for previously done microblading, microshading, or combination brows.', image: '/images/IMG-20260826-WA0016-retouch.jpg', price: 'RWF 60,000' },
    ],
  },
];

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';

  const filteredCategories = useMemo(() => {
    let cats = allCategories;

    if (categoryFilter) {
      cats = cats.filter(c => c.key === categoryFilter || c.title === categoryFilter);
    }

    if (query) {
      const q = query.toLowerCase();
      cats = cats.map(cat => ({
        ...cat,
        services: cat.services.filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
        ),
      })).filter(cat => cat.services.length > 0);
    }

    return cats;
  }, [query, categoryFilter]);

  const totalResults = filteredCategories.reduce((acc, c) => acc + c.services.length, 0);
  const isFiltering = query || categoryFilter;

  const clearFilters = () => setSearchParams({});

  return (
    <>
      <Seo
        title="Services & Prices | Extreme Beauty Lashes & Brows"
        description="Explore lash & brow services and prices at Extreme Beauty Lashes & Brows, Kigali: microblading, eyelash extensions, lash lift, brow lamination and more."
        path="/services"
      />
      <div className="pt-[110px] pb-10 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.08)_0%,transparent_70%)]" />
        <div className="container mx-auto px-5 relative z-10">
          <p className="text-[0.68rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Our Offerings</p>
          <h1 className="text-[2.2rem] mb-2 font-cormorant font-semibold text-white">Our Services</h1>
          <p className="text-gray-400 text-[0.88rem]">Professional beauty services crafted to enhance your natural beauty</p>
        </div>
      </div>

      {isFiltering && (
        <div className="bg-white/80 backdrop-blur border-b border-gray-100 py-4 px-5">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiSearch size={16} className="text-gray-400" />
              <span className="text-[0.85rem] text-gray-600">
                Showing <span className="font-semibold text-black">{totalResults}</span> result{totalResults !== 1 ? 's' : ''}
                {query && <span> for "<span className="font-semibold text-gold">{query}</span>"</span>}
                {categoryFilter && <span> in <span className="font-semibold text-gold">{categoryFilter}</span></span>}
              </span>
            </div>
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-[0.78rem] text-gray-400 hover:text-black transition-colors border-none bg-transparent cursor-pointer">
              <FiX size={14} /> Clear filters
            </button>
          </div>
        </div>
      )}

      {filteredCategories.length === 0 ? (
        <section className="py-20 px-5 bg-white">
          <div className="text-center max-w-[400px] mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FiSearch size={28} className="text-gray-300" />
            </div>
            <h2 className="text-[1.5rem] mb-2 font-cormorant font-semibold">No services found</h2>
            <p className="text-gray-500 text-[0.88rem] mb-6">
              {query && `No results for "${query}"`} {categoryFilter && `in ${categoryFilter}`}. Try a different search.
            </p>
            <button onClick={clearFilters} className="bg-black text-white px-6 py-3 text-[0.8rem] font-semibold uppercase tracking-[1.5px] rounded-xl border-none cursor-pointer transition-all duration-300 hover:bg-gold">
              View All Services
            </button>
          </div>
        </section>
      ) : (
        <>
          {filteredCategories.map((category) => (
            <section key={category.key} id={category.key} className="py-20 px-5 bg-white scroll-mt-[100px]">
              <div className="max-w-[1200px] mx-auto">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="text-gold">{category.icon}</span>
                      <span className="text-[0.68rem] tracking-[4px] uppercase text-gold font-medium">{category.label}</span>
                    </div>
                    <h2 className="text-[1.8rem] font-cormorant font-semibold">{category.title}</h2>
                  </div>
                  <span className="text-[0.78rem] text-gray-400 hidden sm:block">{category.services.length} service{category.services.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {category.services.map((service) => (
                    <div key={service.name} className="glass-card rounded-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-gold/30 group">
                      <div className="h-[180px] overflow-hidden">
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-[1.02]" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-[0.95rem] font-semibold transition-colors duration-300 group-hover:text-gold mb-1.5">{service.name}</h3>
                        <span className="text-[0.82rem] font-bold text-gold mb-3 block">{service.price}</span>
                        <p className="text-gray-500 text-[0.8rem] leading-[1.6] mb-4">{service.description}</p>
                        <button onClick={() => { toast.info(`Booking ${service.name}...`); setTimeout(() => navigate(`/booking?service=${encodeURIComponent(service.name)}`), 400); }} className="group/btn inline-flex items-center justify-center gap-2 w-full py-3 border border-gray-200 text-[0.72rem] font-semibold uppercase tracking-[1.5px] text-black rounded-xl transition-all duration-300 hover:bg-gold hover:text-white hover:border-gold cursor-pointer bg-transparent">
                          Book Now
                          <FiArrowRight size={13} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </>
      )}

      <section className="py-20 px-5 bg-gray-950 text-white text-center">
        <p className="text-[0.68rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Not Sure Which Service?</p>
        <h2 className="text-[2rem] mb-3 text-white font-cormorant font-semibold">Let Us Help You Choose</h2>
        <p className="text-gray-400 max-w-[500px] mx-auto text-[0.88rem] mb-6 leading-relaxed">
          Contact us for a free consultation. Our experts will help you find the perfect service.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/contact" className="btn-primary">Contact Us</Link>
          <Link to="/booking" className="btn-secondary border-white/20 text-white hover:border-gold hover:text-gold hover:bg-gold/5">Book Consultation</Link>
        </div>
      </section>
    </>
  );
};

export default Services;
