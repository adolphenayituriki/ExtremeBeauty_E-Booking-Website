import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiPhone, FiMail, FiMapPin, FiArrowUpRight } from 'react-icons/fi';
import { useSiteInfo } from '../utils/content';

const WHATSAPP_NUMBER = '250787035643';

const Footer = () => {
  const { site } = useSiteInfo();
  const instagramUrl = site.instagram.startsWith('@')
    ? `https://instagram.com/${site.instagram.slice(1)}`
    : site.instagram;
  const instagramHandle = site.instagram.replace('@', '');

  return (
    <footer className="bg-gray-950 text-white relative overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-gold/[0.03] rounded-full blur-[100px]" />

      {/* Newsletter CTA */}
      <div className="border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-[1.1rem] mb-1 font-cormorant font-semibold">Stay Connected</h3>
              <p className="text-gray-500 text-[0.8rem]">Follow us on Instagram for the latest updates and offers.</p>
            </div>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-black text-[0.72rem] font-semibold uppercase tracking-[1.5px] rounded-xl transition-all duration-300 hover:bg-gold-light shrink-0">
              <FiInstagram size={14} /> Follow Us
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-10 pb-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] gap-8 lg:gap-6">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 lg:pr-6">
            <Link to="/" className="inline-block mb-4">
              <img src="/logo/Logo-White-BG.jpg" alt="Extreme Beauty" className="h-[40px] w-auto object-contain hover:scale-105 transition-transform duration-300" />
            </Link>
            <p className="text-gray-500 text-[0.78rem] leading-[1.7] mb-5">
              Your destination for premium lashes and brows services in Kigali.
            </p>
            <div className="flex gap-2">
              {[
                { icon: <FiInstagram size={15} />, href: instagramUrl, label: 'Instagram', external: true },
                { icon: <FiPhone size={15} />, href: `tel:${site.callRaw}`, label: 'Call' },
                { icon: <FiMail size={15} />, href: `mailto:${site.email}`, label: 'Email' },
                { icon: <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, href: `https://wa.me/${WHATSAPP_NUMBER}`, label: 'WhatsApp', external: true },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  aria-label={item.label}
                  className="w-9 h-9 border border-white/[0.08] flex items-center justify-center text-gray-500 rounded-lg hover:bg-gold hover:text-black hover:border-gold transition-all duration-300"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[0.65rem] font-semibold uppercase tracking-[2px] text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/booking', label: 'Book Now' },
                { to: '/tracking', label: 'Track Booking' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-500 text-[0.78rem] hover:text-gold transition-colors duration-200 flex items-center gap-1.5 group">
                    <FiArrowUpRight size={10} className="text-gray-700 group-hover:text-gold transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[0.65rem] font-semibold uppercase tracking-[2px] text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {[
                { label: 'Brows', category: 'Brows' },
                { label: 'Lash Lift', category: 'Lash Lift' },
                { label: 'Eyelash Extensions', category: 'Lashes' },
                { label: 'Eyebrows Retouch', category: 'Retouch' },
              ].map((service) => (
                <li key={service.label}>
                  <Link to={`/services?category=${service.category}`} className="text-gray-500 text-[0.78rem] hover:text-gold transition-colors duration-200 flex items-center gap-1.5 group">
                    <FiArrowUpRight size={10} className="text-gray-700 group-hover:text-gold transition-colors" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-[0.65rem] font-semibold uppercase tracking-[2px] text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              {[
                { icon: <FiPhone size={12} />, value: site.phone1, sub: 'Call us anytime', href: `tel:${site.callRaw}` },
                { icon: <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, value: site.phone2, sub: 'WhatsApp available', href: `https://wa.me/${site.whatsappRaw}`, external: true },
                { icon: <FiMapPin size={12} />, value: site.address.split(',')[0] || site.address, sub: site.address, href: site.mapsUrl, external: true },
                { icon: <FiMail size={12} />, value: site.email, sub: 'Email us', href: `mailto:${site.email}` },
              ].map((item, i) => (
                <li key={i}>
                  <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} className="text-gray-500 text-[0.78rem] hover:text-gold transition-colors duration-200 flex items-start gap-2.5">
                    <span className="w-7 h-7 bg-white/[0.04] border border-white/[0.06] flex items-center justify-center rounded-lg shrink-0 mt-[-1px]">
                      <span className="text-gray-400">{item.icon}</span>
                    </span>
                    <div>
                      <p className="text-white text-[0.78rem]">{item.value}</p>
                      <p className="text-gray-600 text-[0.68rem]">{item.sub}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-5 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-600 text-[0.68rem] tracking-wide">
              &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <Link to="/tracking" className="text-gray-600 text-[0.68rem] hover:text-gold transition-colors flex items-center gap-1">
                <FiArrowUpRight size={9} /> Track Booking
              </Link>
              <Link to="/contact" className="text-gray-600 text-[0.68rem] hover:text-gold transition-colors flex items-center gap-1">
                <FiArrowUpRight size={9} /> Contact
              </Link>
              <Link to="/admin" className="text-gray-600 text-[0.68rem] hover:text-gold transition-colors flex items-center gap-1">
                <FiArrowUpRight size={9} /> Admin
              </Link>
            </div>
          </div>

          {/* Developer credit */}
          <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-center">
            <a
              href="https://www.bitscoding.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Developed by BitsCoding Company"
              className="group flex items-center gap-2 text-gray-500 text-[0.68rem] hover:text-gold transition-colors duration-200"
            >
              <span>Developed by</span>
              <img
                src="/images/BitsCoding.jpeg"
                alt="BitsCoding Company"
                loading="lazy"
                decoding="async"
                className="h-6 w-6 object-cover rounded-full ring-1 ring-white/20 group-hover:ring-gold/60 transition-all duration-200"
              />
              <span className="font-medium group-hover:text-gold">BitsCoding Company</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
