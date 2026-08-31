import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import Seo from '../utils/Seo';

const About = () => {
  const features = [
    { title: 'Expert Technicians', text: 'Trained and certified professionals' },
    { title: 'Premium Products', text: 'Only top-quality materials used' },
    { title: 'Hygienic Studio', text: 'Sterilized tools & clean environment' },
    { title: 'Personalized Care', text: 'Customized to your unique style' },
  ];

  return (
    <>
      <Seo
        title="About Us | Extreme Beauty Lashes & Brows"
        description="Learn about Extreme Beauty Lashes & Brows, Kigali's trusted lash and brow studio — expert technicians, premium products and personalized care."
        path="/about"
      />
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
