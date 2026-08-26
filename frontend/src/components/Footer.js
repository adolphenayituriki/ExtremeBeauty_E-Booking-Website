import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiPhone, FiMail, FiMapPin, FiArrowUpRight, FiArrowRight } from 'react-icons/fi';

const WHATSAPP_NUMBER = '250785069349';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white relative overflow-hidden">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-gold/[0.03] rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-gold/[0.02] rounded-full blur-[100px]" />

      {/* Newsletter CTA */}
      <div className="border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-[1.3rem] mb-1 font-cormorant font-semibold">Stay Connected</h3>
              <p className="text-gray-500 text-[0.85rem]">Follow us on Instagram for the latest updates, offers, and beauty inspiration.</p>
            </div>
            <a href="https://instagram.com/extreme_beauty.rw" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black text-[0.78rem] font-semibold uppercase tracking-[1.5px] rounded-xl transition-all duration-300 hover:bg-gold-light hover:shadow-[0_8px_30px_rgba(184,149,106,0.3)] shrink-0">
              <FiInstagram size={16} /> Follow Us <FiArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-14 pb-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:pr-8">
            <Link to="/" className="inline-block mb-5">
              <img src="/logo/Logo-White-BG.jpg" alt="Extreme Beauty" className="h-[48px] w-auto object-contain hover:scale-105 transition-transform duration-300" />
            </Link>
            <p className="text-gray-500 text-[0.82rem] leading-[1.8] mb-6">
              Your destination for premium lashes and brows services in Kigali. We bring out your natural beauty with precision and artistry.
            </p>
            <div className="flex gap-2">
              {[
                { icon: <FiInstagram size={16} />, href: 'https://instagram.com/extreme_beauty.rw', label: 'Instagram', external: true },
                { icon: <FiPhone size={16} />, href: 'tel:+250785069349', label: 'Phone' },
                { icon: <FiMail size={16} />, href: 'mailto:info@extremebeauty.rw', label: 'Email' },
                { icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, href: `https://wa.me/${WHATSAPP_NUMBER}`, label: 'WhatsApp', external: true },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  aria-label={item.label}
                  className="w-11 h-11 border border-white/[0.08] flex items-center justify-center text-gray-500 rounded-xl hover:bg-gold hover:text-black hover:border-gold transition-all duration-300"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[0.7rem] font-semibold uppercase tracking-[2px] text-white mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/booking', label: 'Book Now' },
                { to: '/tracking', label: 'Track Booking' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-500 text-[0.82rem] hover:text-gold transition-colors duration-200 flex items-center gap-1.5 group">
                    <FiArrowUpRight size={11} className="text-gray-700 group-hover:text-gold transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[0.7rem] font-semibold uppercase tracking-[2px] text-white mb-5">Services</h4>
            <ul className="space-y-3">
              {[
                { label: 'Brows', category: 'Brows' },
                { label: 'Lash Lift', category: 'Lash Lift' },
                { label: 'Eyelash Extensions', category: 'Lashes' },
                { label: 'Eyebrows Retouch', category: 'Retouch' },
              ].map((service) => (
                <li key={service.label}>
                  <Link to={`/services?category=${service.category}`} className="text-gray-500 text-[0.82rem] hover:text-gold transition-colors duration-200 flex items-center gap-1.5 group">
                    <FiArrowUpRight size={11} className="text-gray-700 group-hover:text-gold transition-colors" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[0.7rem] font-semibold uppercase tracking-[2px] text-white mb-5">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+250785069349" className="text-gray-500 text-[0.82rem] hover:text-gold transition-colors duration-200 flex items-start gap-3">
                  <span className="w-8 h-8 bg-white/[0.04] border border-white/[0.06] flex items-center justify-center rounded-xl shrink-0 mt-[-2px]">
                    <FiPhone size={13} className="text-gray-400" />
                  </span>
                  <div>
                    <p className="text-white text-[0.82rem]">+250 785 069 349</p>
                    <p className="text-gray-600 text-[0.72rem]">Call us anytime</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+250787035643" className="text-gray-500 text-[0.82rem] hover:text-gold transition-colors duration-200 flex items-start gap-3">
                  <span className="w-8 h-8 bg-white/[0.04] border border-white/[0.06] flex items-center justify-center rounded-xl shrink-0 mt-[-2px]">
                    <FiPhone size={13} className="text-gray-400" />
                  </span>
                  <div>
                    <p className="text-white text-[0.82rem]">+250 787 035 643</p>
                    <p className="text-gray-600 text-[0.72rem]">WhatsApp available</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="https://maps.app.goo.gl/JVeG4xNRdoP4Dt4dA" target="_blank" rel="noopener noreferrer" className="text-gray-500 text-[0.82rem] hover:text-gold transition-colors duration-200 flex items-start gap-3">
                  <span className="w-8 h-8 bg-white/[0.04] border border-white/[0.06] flex items-center justify-center rounded-xl shrink-0 mt-[-2px]">
                    <FiMapPin size={13} className="text-gray-400" />
                  </span>
                  <div>
                    <p className="text-white text-[0.82rem]">105 KG 9th Ave</p>
                    <p className="text-gray-600 text-[0.72rem]">Nyarutarama, Kigali</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@extremebeauty.rw" className="text-gray-500 text-[0.82rem] hover:text-gold transition-colors duration-200 flex items-start gap-3">
                  <span className="w-8 h-8 bg-white/[0.04] border border-white/[0.06] flex items-center justify-center rounded-xl shrink-0 mt-[-2px]">
                    <FiMail size={13} className="text-gray-400" />
                  </span>
                  <div>
                    <p className="text-white text-[0.82rem]">info@extremebeauty.rw</p>
                    <p className="text-gray-600 text-[0.72rem]">Email us</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-[0.72rem] tracking-wide">
            &copy; {new Date().getFullYear()} Extreme Beauty Lashes & Brows. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/tracking" className="text-gray-600 text-[0.72rem] hover:text-gold transition-colors flex items-center gap-1">
              <FiArrowUpRight size={10} /> Track Booking
            </Link>
            <Link to="/contact" className="text-gray-600 text-[0.72rem] hover:text-gold transition-colors flex items-center gap-1">
              <FiArrowUpRight size={10} /> Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
