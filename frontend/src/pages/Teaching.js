import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiAward, FiUsers, FiHeart } from 'react-icons/fi';
import { motion, useInView } from 'framer-motion';

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

const teachingSteps = [
  { title: 'Consultation', image: 'Teaching-1.jpeg', description: 'We begin by understanding your natural features and the look you want to achieve.' },
  { title: 'Design & Mapping', image: 'Teaching-2.jpg', description: 'Your lash line and brows are carefully mapped for perfect proportion and symmetry.' },
  { title: 'Preparation', image: 'Teaching-3.jpg', description: 'Your skin and lashes are gently cleansed and prepped for a flawless application.' },
  { title: 'Application', image: 'Teaching-4.jpg', description: 'Precision placement, lash by lash, technique by technique, for a seamless finish.' },
  { title: 'Refinement', image: 'Teaching-5.jpg', description: 'We perfect every detail, balancing shape and symmetry for a natural result.' },
  { title: 'Aftercare & Guidance', image: 'Teaching-6.jpg', description: 'You leave with clear aftercare guidance to keep your look beautiful for longer.' },
];

const highlights = [
  { icon: <FiAward size={18} />, title: 'Certified Training', text: 'Master techniques from certified pros' },
  { icon: <FiUsers size={18} />, title: 'Hands-On Practice', text: 'Practice on live models, guided' },
  { icon: <FiHeart size={18} />, title: 'Essential Safety', text: 'Hygiene, aftercare & guidance' },
];

const Teaching = () => {
  return (
    <>
      <div className="pt-[110px] pb-10 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.08)_0%,transparent_70%)]" />
        <div className="container mx-auto px-5 relative z-10">
          <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Learn The Craft</p>
          <h1 className="text-[2.2rem] mb-2 font-cormorant font-semibold text-white">Teaching Service</h1>
          <p className="text-gray-400 text-[0.88rem]">How we train, prepare and perfect each treatment</p>
        </div>
      </div>

      <section className="py-16 px-5 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Our Process</p>
            <h2 className="text-[1.8rem] mb-2 text-black font-cormorant font-semibold">How We Create Your Look</h2>
            <p className="text-gray-500 text-[0.88rem] max-w-[520px] mx-auto">Here's how we train, prepare and perfect each treatment.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachingSteps.map((step, index) => (
              <FadeIn key={index} delay={(index % 3) * 0.08}>
                <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-gray-950 hover:border-gold/40 transition-all duration-500">
                  <div className="relative h-36 sm:h-40 overflow-hidden">
                    <img src={`/images/${step.image}`} alt={step.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
                    <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gold text-black flex items-center justify-center text-[0.75rem] font-bold shadow-lg">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="p-4 text-white">
                    <h3 className="text-[0.9rem] mb-1 font-semibold group-hover:text-gold transition-colors duration-300">{step.title}</h3>
                    <p className="text-gray-400 text-[0.75rem] leading-[1.6]">{step.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-5 bg-gray-950 text-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Why Learn With Us</p>
            <h2 className="text-[1.8rem] mb-2 text-white font-cormorant font-semibold">Learn From The Experts</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {highlights.map((h, index) => (
              <FadeIn key={index} delay={index * 0.08}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center hover:border-gold/40 transition-all duration-500">
                  <div className="w-11 h-11 mx-auto mb-3 flex items-center justify-center text-gold">{h.icon}</div>
                  <h3 className="text-[0.95rem] mb-1 font-semibold text-white">{h.title}</h3>
                  <p className="text-gray-200 text-[0.78rem] leading-[1.6]">{h.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-5 bg-white text-black text-center">
        <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Ready To Start</p>
        <h2 className="text-[1.8rem] mb-3 text-black font-cormorant font-semibold">Book Your Training Session</h2>
        <p className="text-gray-500 max-w-[500px] mx-auto text-[0.88rem] mb-6 leading-relaxed">
          Whether you&apos;re looking to book a treatment or learn the craft yourself, we&apos;d love to welcome you.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/booking?service=Training Session" className="btn-primary inline-flex items-center gap-2">
            Book Training Session <FiArrowRight size={13} />
          </Link>
          <Link to="/contact" className="btn-secondary border-black/20 text-black hover:border-gold hover:text-gold hover:bg-gold/5">Get In Touch</Link>
        </div>
      </section>
    </>
  );
};

export default Teaching;
