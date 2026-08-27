import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiInstagram, FiPhone, FiMail, FiMapPin, FiSearch, FiCalendar, FiChevronDown } from 'react-icons/fi';
import { useSiteInfo } from '../utils/content';

const allServices = [
  'Microblading Eyebrows', 'Microshading Eyebrows', 'Hybrid / Combination Brows', 'Brows Lamination',
  'Lash Lift', 'Classic Set', 'Hybrid Set', 'Volume Set', 'Mega Volume Set',
  'Wispy Sets', 'Lash Removal', 'Eyebrows Retouch',
];

const categoryMap = {
  'All Services': null,
  'Lashes': 'Lashes',
  'Brows': 'Brows',
  'Lash Lift': 'Lash Lift',
  'Retouch': 'Eyebrows Retouch',
};

const categoryLinks = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'All Services', category: 'All Services' },
  { path: '/services', label: 'Lashes', category: 'Lashes' },
  { path: '/services', label: 'Brows', category: 'Brows' },
  { path: '/services', label: 'Lash Lift', category: 'Lash Lift' },
  { path: '/about', label: 'About Us' },
  { path: '/teaching', label: 'Teaching' },
  { path: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const { site } = useSiteInfo();
  const instagramUrl = site.instagram.startsWith('@')
    ? `https://instagram.com/${site.instagram.slice(1)}`
    : site.instagram;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchCategory, setSearchCategory] = useState('All Services');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShowSuggestions(false);
    setShowCategoryDropdown(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const filteredSuggestions = searchQuery.length > 0
    ? allServices.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      if (searchCategory !== 'All Services') {
        params.set('category', searchCategory);
      }
      navigate(`/services?${params.toString()}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    const params = new URLSearchParams();
    params.set('q', suggestion);
    navigate(`/services?${params.toString()}`);
  };

  const handleCategorySelect = (cat) => {
    setSearchCategory(cat);
    setShowCategoryDropdown(false);
    const params = new URLSearchParams();
    if (cat !== 'All Services') {
      params.set('category', cat);
    }
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    navigate(`/services?${params.toString()}`);
  };

  const handleMobileCategoryClick = (link) => {
    if (link.category) {
      const params = new URLSearchParams();
      if (link.category !== 'All Services') {
        params.set('category', link.category);
      }
      navigate(`/services?${params.toString()}`);
    } else {
      navigate(link.path);
    }
  };

  return (
    <>
      {/* ===== TOP UTILITY BAR ===== */}
      <div className={`fixed top-0 w-full z-50 text-[0.65rem] hidden lg:block transition-all duration-500 ${scrolled ? 'opacity-0 -translate-y-full pointer-events-none h-0' : 'opacity-100 translate-y-0 h-[26px]'}`}>
        <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-md border-b border-white/5" />
        <div className="relative flex items-center justify-between px-6 lg:px-10 h-[26px] max-w-[1400px] mx-auto text-gray-400">
          <div className="flex items-center gap-5">
            <a href={`tel:${site.callRaw}`} className="flex items-center gap-1.5 hover:text-gold transition-colors duration-200">
              <FiPhone size={10} /> {site.phone1}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-1.5 hover:text-gold transition-colors duration-200">
              <FiMail size={10} /> {site.email}
            </a>
            <span className="flex items-center gap-1.5">
              <FiMapPin size={10} /> {site.address}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors duration-200" aria-label="Instagram">
              <FiInstagram size={12} />
            </a>
            <span className="w-px h-3 bg-white/10" />
            <Link to="/tracking" className="hover:text-gold transition-colors duration-200">Track Booking</Link>
            <span className="w-px h-3 bg-white/10" />
            <Link to="/admin" className="hover:text-gold transition-colors duration-200">Admin</Link>
          </div>
        </div>
      </div>

      {/* ===== MAIN NAVIGATION BAR ===== */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled
          ? 'top-0 bg-white/80 backdrop-blur-xl border-b border-black/[0.04] shadow-[0_1px_20px_rgba(0,0,0,0.06)]'
          : 'top-0 lg:top-[26px] bg-white/60 backdrop-blur-lg border-b border-black/[0.03]'
      }`}>
        <div className="flex items-center justify-between px-4 lg:px-10 h-[56px] lg:h-[60px] max-w-[1400px] mx-auto gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <div className="w-[140px] h-[46px] flex items-center justify-center overflow-hidden">
              <img src="/logo/removebg-preview.png" alt="Extreme Beauty" className="w-full h-full object-contain scale-[2.5] transition-all duration-300 hover:scale-[2.7]" />
            </div>
          </Link>

          {/* Category dropdown - desktop */}
          <div className="hidden lg:flex items-center relative" ref={dropdownRef}>
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-1.5 text-[0.78rem] font-medium text-gray-600 hover:text-black transition-colors px-3 py-2 border border-gray-200/60 rounded-xl hover:border-gold/40 bg-white/50 whitespace-nowrap"
            >
              {searchCategory} <FiChevronDown size={14} className={`transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-2xl py-2 min-w-[180px] z-50">
                {Object.keys(categoryMap).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full text-left px-4 py-2.5 text-[0.8rem] transition-colors hover:bg-gold/5 ${searchCategory === cat ? 'text-gold font-semibold' : 'text-gray-600 hover:text-black'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-[520px] relative">
            <div className="flex w-full rounded-xl border border-gray-200/60 overflow-hidden transition-all duration-300 focus-within:border-gold/40 focus-within:shadow-[0_0_20px_rgba(184,149,106,0.08)] bg-white/50 backdrop-blur-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                placeholder="Search lashes, brows, beauty services..."
                className="flex-1 px-4 py-2.5 text-[0.82rem] text-black bg-transparent outline-none placeholder:text-gray-400"
              />
              <button type="submit" className="bg-gold hover:bg-gold-light text-white px-5 flex items-center justify-center transition-colors duration-300">
                <FiSearch size={17} />
              </button>
            </div>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 glass border border-gray-200/60 shadow-xl rounded-2xl py-2 z-50">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(suggestion); }}
                    className="w-full text-left px-4 py-2.5 text-[0.82rem] text-gray-600 hover:bg-gold/5 hover:text-black flex items-center gap-2.5 transition-colors"
                  >
                    <FiSearch size={13} className="text-gray-400 shrink-0" />
                    <span dangerouslySetInnerHTML={{
                      __html: suggestion.replace(
                        new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
                        '<span class="font-semibold text-gold">$1</span>'
                      )
                    }} />
                  </button>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1 px-4 py-2">
                  <p className="text-[0.7rem] text-gray-400">Press Enter to search all results</p>
                </div>
              </div>
            )}
          </form>

          {/* Right actions - desktop */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link to="/tracking" className="flex items-center gap-1.5 text-[0.75rem] text-gray-500 hover:text-black transition-colors px-3 py-2 rounded-xl hover:bg-gray-100/50">
              <FiCalendar size={15} />
              <span className="font-medium">Bookings</span>
            </Link>
            <Link to="/booking" className="bg-black text-white !px-5 !py-2.5 text-[0.75rem] font-semibold uppercase tracking-[1.5px] rounded-xl transition-all duration-300 hover:bg-gold hover:shadow-[0_4px_20px_rgba(184,149,106,0.3)] flex items-center gap-1.5">
              <FiCalendar size={14} /> Book Now
            </Link>
          </div>

          {/* Mobile: search + menu */}
          <div className="flex lg:hidden items-center gap-2">
            <button onClick={() => { setMobileOpen(true); setTimeout(() => { const input = document.querySelector('.mobile-search-input'); if (input) input.focus(); }, 300); }} className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-black transition-colors bg-transparent border-none cursor-pointer p-0">
              <FiSearch size={20} />
            </button>
            <Link to="/booking" className="bg-black text-white !px-4 !py-2 text-[0.75rem] font-semibold uppercase tracking-wider rounded-lg">
              Book
            </Link>
            <button className="p-2.5 cursor-pointer z-[60]" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? <FiX size={22} className="text-black" /> : <FiMenu size={22} className="text-black" />}
            </button>
          </div>
        </div>

        {/* Category row - desktop */}
        <div className="hidden lg:block border-t border-gray-100/60 bg-white/40">
          <div className="flex items-center gap-1 px-6 lg:px-10 max-w-[1400px] mx-auto h-[36px] overflow-x-auto">
            {categoryLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => {
                  if (link.category) {
                    handleCategorySelect(link.category);
                  } else {
                    navigate(link.path);
                  }
                }}
                className={`text-[0.72rem] font-medium px-3 py-1 rounded-lg whitespace-nowrap transition-all duration-200 border-none cursor-pointer bg-transparent ${
                  isActive(link.path) && (!link.category || link.category === searchCategory)
                    ? 'text-gold bg-gold/10 font-semibold'
                    : 'text-gray-500 hover:text-black hover:bg-gray-100/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ===== MOBILE MENU ===== */}
      <div className={`fixed inset-0 z-[55] lg:hidden transition-all duration-500 ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-sm glass shadow-[-10px_0_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/80 hover:bg-gold hover:text-white text-black border-none cursor-pointer transition-all duration-300 z-10 shadow-sm"
          >
            <FiX size={22} />
          </button>
          <div className="px-5 pt-20 pb-3">
            <form onSubmit={handleSearch} className="flex rounded-xl border border-gray-200/60 overflow-hidden bg-white/50">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search services..." className="mobile-search-input flex-1 px-4 py-2.5 text-[0.85rem] outline-none bg-transparent text-black placeholder:text-gray-400" />
              <button type="submit" className="bg-gold text-white px-4"><FiSearch size={16} /></button>
            </form>
          </div>

          <div className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
            <div className="flex flex-col gap-1">
              {categoryLinks.map((link, i) => (
                <button
                  key={i}
                  onClick={() => { handleMobileCategoryClick(link); setMobileOpen(false); }}
                  className={`text-left text-[0.9rem] font-medium py-2.5 px-3 rounded-xl transition-all duration-300 border-none cursor-pointer bg-transparent ${
                    isActive(link.path) && (!link.category || link.category === searchCategory)
                      ? 'text-gold bg-gold/10' : 'text-gray-600 hover:text-black hover:bg-gray-100/50'
                  }`}
                  style={{ transitionDelay: mobileOpen ? `${150 + i * 50}ms` : '0ms' }}
                >
                  {link.label}
                </button>
              ))}
            </div>
            <Link to="/booking" className="mt-5 bg-black text-white py-3 text-center text-[0.8rem] font-semibold uppercase tracking-[2px] rounded-xl transition-all duration-300 hover:bg-gold">
              Book Now
            </Link>
            <div className="mt-auto pt-5 border-t border-gray-100 flex gap-3">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gold hover:text-white hover:border-gold transition-all duration-300 rounded-xl">
                <FiInstagram size={15} />
              </a>
              <a href={`tel:${site.callRaw}`} className="w-9 h-9 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gold hover:text-white hover:border-gold transition-all duration-300 rounded-xl">
                <FiPhone size={15} />
              </a>
              <a href={`https://wa.me/${site.whatsappRaw}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300 rounded-xl">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
