import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiArrowRight, FiEye, FiStar, FiAward, FiMapPin } from 'react-icons/fi';
import Seo, { SeoJsonLd } from '../utils/Seo';
import { SITE_URL, SITE_NAME } from '../utils/seoData';

const About = () => {
  const features = [
    { title: 'Expert Technicians', text: 'Trained and certified professionals' },
    { title: 'Premium Products', text: 'Only top-quality materials used' },
    { title: 'Hygienic Studio', text: 'Sterilized tools & clean environment' },
    { title: 'Personalized Care', text: 'Customized to your unique style' },
  ];

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Extreme Beauty Lashes & Brows',
    url: `${SITE_URL}/about`,
    description:
      'Extreme Beauty Lashes & Brows is a professional lash and brow studio in Nyarutarama, Kigali, Rwanda specialising in eyelash extensions, lash lift, microblading, microshading, hybrid brows and brow lamination.',
    about: {
      '@type': 'BeautySalon',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      telephone: '+250785069349',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '105 KG 9th Ave, Nyarutarama',
        addressLocality: 'Kigali',
        addressCountry: 'RW',
      },
    },
  };

  return (
    <>
      <Seo
        title="About Us | Extreme Beauty Lashes & Brows"
        description="Learn about Extreme Beauty Lashes & Brows, Kigali's trusted lash and brow studio — expert technicians, premium products and personalized care."
        path="/about"
      />
      <SeoJsonLd id="about-page" data={aboutJsonLd} />
      <div className="pt-[110px] pb-10 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.08)_0%,transparent_70%)]" />
        <div className="container mx-auto px-5 relative z-10">
          <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Our Story</p>
          <h1 className="text-[2.2rem] mb-2 font-cormorant font-semibold text-white">About Extreme Beauty</h1>
          <p className="text-gray-400 text-[0.88rem]">Dedicated to bringing out your natural beauty with precision and artistry</p>
        </div>
      </div>

      <section className="py-16 px-5 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-[1200px] mx-auto px-5 items-center">
          <div className="w-full h-[250px] sm:h-[350px] lg:h-[400px] overflow-hidden rounded-2xl relative group">
            <div className="absolute top-3 left-3 right-[-15px] bottom-[-15px] border-2 border-gold/60 rounded-2xl z-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:top-1.5 group-hover:left-1.5 group-hover:border-gold" />
            <img src="/images/IMG-20260826-WA0022.jpg" alt="Extreme Beauty Studio" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 relative z-10 rounded-2xl shadow-lg" />
          </div>

          <div>
            <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Who We Are</p>
            <h2 className="text-[1.8rem] text-black mb-4 font-cormorant font-semibold">Kigali&apos;s Premier Lash & Brow Studio</h2>
            <p className="text-gray-500 mb-3 leading-[1.7] text-[0.88rem]">
              Extreme Beauty Lashes & Brows is a professional beauty studio located in the heart of Nyarutarama, Kigali. We specialize in creating stunning, natural-looking eyebrows and eyelash enhancements.
            </p>
            <p className="text-gray-500 mb-5 leading-[1.7] text-[0.88rem]">
              Our team of skilled technicians combines artistry with precision techniques to deliver results that exceed expectations. We use only premium products and maintain the highest standards of hygiene.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="glass-card rounded-2xl p-4 flex items-start gap-3 transition-all duration-300 hover:scale-[1.02]">
                  <FiCheck size={16} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[0.82rem] font-semibold text-black mb-0.5">{feature.title}</h4>
                    <p className="text-[0.72rem] text-gray-500">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-5 bg-white">
        <div className="max-w-[900px] mx-auto">
          <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium text-center">Why Kigali&apos;s Lashes &amp; Brows Studio</p>
          <h2 className="text-[1.8rem] mb-4 text-center font-cormorant font-semibold">Kigali&apos;s Trusted Studio for Eyelash Extensions &amp; Eyebrow Microblading</h2>
          <p className="text-gray-500 text-[0.88rem] leading-[1.85] text-center mb-8">
            Extreme Beauty Lashes &amp; Brows in Nyarutarama is a leading beauty salon in Rwanda for
            eyelash extensions, volume lashes, mega volume lashes, lash lift and eyebrow treatments
            including microblading, ombré microshading, hybrid brows and brow lamination. Every
            appointment is delivered by certified lash and brow artists using premium products and
            sterilised equipment, in a spotless studio in the heart of Kigali.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: <FiEye size={18} />, title: 'Lash Extensions', text: 'Classic, hybrid, volume, mega volume and wispy sets for Kigali clients.' },
              { icon: <FiStar size={18} />, title: 'Brow Artistry', text: 'Microblading, microshading, hybrid brows and lamination — natural, defined results.' },
              { icon: <FiAward size={18} />, title: 'Certified Training', text: 'Learn professional lash and brow techniques at our Kigali academy.' },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 flex flex-col items-start text-left">
                <span className="text-gold mb-3">{item.icon}</span>
                <h3 className="text-[0.95rem] font-semibold text-black mb-1">{item.title}</h3>
                <p className="text-[0.78rem] text-gray-500 leading-[1.6]">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <Link to="/services" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[2px] rounded-xl transition-all duration-300 hover:bg-gold no-underline">
              Explore Our Services <FiArrowRight size={14} />
            </Link>
            <Link to="/teaching" className="inline-flex items-center gap-2 border border-gray-200 text-black px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[2px] rounded-xl transition-all duration-300 hover:border-gold hover:text-gold no-underline">
              See Our Training <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-[0.82rem] text-gray-500">
            <span className="flex items-center gap-2"><FiMapPin size={14} className="text-gold" /> 105 KG 9th Ave, Nyarutarama, Kigali, Rwanda</span>
            <span className="hidden sm:block w-px h-3 bg-gray-200" />
            <span>Mon–Sat, 09:00–18:00</span>
          </div>
        </div>
      </section>

      <section className="py-12 px-5 bg-gray-950 text-white text-center">
        <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Visit Us</p>
        <h2 className="text-[2rem] mb-3 text-white font-cormorant font-semibold">Experience the Difference</h2>
        <p className="text-gray-400 max-w-[500px] mx-auto text-[0.88rem] mb-6 leading-relaxed">
          Located in the heart of Nyarutarama, our studio welcomes you to experience world-class beauty services.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/booking" className="btn-primary">Book Appointment</Link>
          <Link to="/contact" className="btn-secondary border-white/20 text-white hover:border-gold hover:text-gold hover:bg-gold/5">Get Directions</Link>
        </div>
      </section>
    </>
  );
};

export default About;
