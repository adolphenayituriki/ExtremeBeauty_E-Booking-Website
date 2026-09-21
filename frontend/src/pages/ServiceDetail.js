import React, { useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiChevronRight, FiChevronDown, FiStar, FiClock, FiShield, FiHeart } from 'react-icons/fi';
import Seo, { SeoJsonLd } from '../utils/Seo';
import { services, getServiceBySlug } from '../data/services';
import { buildServiceMeta, SITE_NAME } from '../utils/seoData';

const perCategory = (targetCategory) => services.filter((s) => s.category === targetCategory);

const whyBook = [
  { icon: <FiCheck size={15} />, title: 'Trained Professionals', text: 'Delivered by certified, experienced lash and brow artists.' },
  { icon: <FiShield size={15} />, title: 'Premium & Hygienic', text: 'Top-grade products, sterilised tools and a spotless studio.' },
  { icon: <FiClock size={15} />, title: 'Personalised Care', text: 'Every treatment is tailored to your features and desired look.' },
  { icon: <FiHeart size={15} />, title: 'Client Favourite', text: 'Trusted by 2,000+ happy clients across Kigali, Rwanda.' },
];

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = useMemo(() => getServiceBySlug(slug), [slug]);

  const meta = useMemo(() => (service ? buildServiceMeta(service) : null), [service]);

  const [openFaq, setOpenFaq] = useState(0);

  if (!service || !meta) {
    return <Navigate to="/services" replace />;
  }

  const sameCategory = perCategory(service.category).filter((s) => s.slug !== service.slug);
  const related = sameCategory.length
    ? sameCategory
    : services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        path={meta.path}
        type="service"
        image={meta.image}
      />
      <SeoJsonLd id={`service-${service.slug}`} data={meta.jsonLd} />
      <SeoJsonLd id={`breadcrumb-${service.slug}`} data={meta.breadcrumbJsonLd} />
      <SeoJsonLd id={`faq-${service.slug}`} data={meta.faqJsonLd} />

      {/* Breadcrumbs */}
      <div className="pt-[110px] bg-gray-950 text-white">
        <div className="max-w-[1200px] mx-auto px-5 pt-6 pb-2 text-[0.72rem] flex items-center gap-1.5 text-gray-400">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <FiChevronRight size={11} className="text-gray-600" />
          <Link to="/services" className="hover:text-gold transition-colors">Services</Link>
          <FiChevronRight size={11} className="text-gray-600" />
          <span className="text-gray-300 truncate">{service.name}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="pb-10 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.08)_0%,transparent_70%)]" />
        <div className="container mx-auto px-5 relative z-10">
          <p className="text-[0.68rem] tracking-[4px] uppercase text-gold mb-2 font-medium">{service.category}</p>
          <h1 className="text-[2.2rem] mb-2 font-cormorant font-semibold text-white">{service.name}</h1>
          <p className="text-gray-400 text-[0.85rem] max-w-[560px] mx-auto leading-relaxed">
            {service.description}
          </p>
          <div className="flex items-center justify-center gap-2.5 mt-4">
            <span className="text-[0.95rem] font-bold text-gold">{service.priceFormatted}</span>
            <span className="w-px h-3.5 bg-white/10" />
            <span className="inline-flex items-center gap-1 text-[0.72rem] text-gray-400">
              <FiStar size={11} className="text-gold fill-gold" /> 5★ Rated in Kigali
            </span>
          </div>
        </div>
      </div>

      {/* Detail */}
      <section className="py-14 px-5 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 max-w-[1200px] mx-auto items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-3 -left-3 border-t-2 border-l-2 border-gold w-24 h-24 rounded-tl-2xl" />
            <div className="relative overflow-hidden rounded-2xl glass-card">
              <img
                src={service.image}
                alt={`${service.name} - ${SITE_NAME} in Kigali`}
                className="w-full h-[340px] sm:h-[420px] object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">About This Service</p>
            <h2 className="text-[1.9rem] mb-4 font-cormorant font-semibold text-black">
              {service.name} in Nyarutarama, Kigali
            </h2>
            <p className="text-gray-500 text-[0.88rem] leading-[1.8] mb-4">
              {service.description} At {SITE_NAME}, we combine artistry with precision to deliver
              natural, long-lasting results tailored to your features.
            </p>
            <p className="text-gray-500 text-[0.88rem] leading-[1.8] mb-7">
              Book your {service.name} online in just a few minutes or visit our studio at
              105 KG 9th Ave, Nyarutarama, Kigali. Same-day appointments are often available.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {whyBook.map((item, i) => (
                <div key={i} className="glass-card rounded-2xl p-4 flex items-start gap-3">
                  <span className="text-gold mt-0.5 shrink-0">{item.icon}</span>
                  <div>
                    <h4 className="text-[0.82rem] font-semibold text-black mb-0.5">{item.title}</h4>
                    <p className="text-[0.72rem] text-gray-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/booking?service=${encodeURIComponent(service.name)}`}
                className="btn-primary inline-flex items-center gap-2"
              >
                Book {service.name} <FiArrowRight size={14} />
              </Link>
              <Link to="/contact" className="btn-secondary border-black/20 text-black hover:border-gold hover:text-gold hover:bg-gold/5">
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 px-5 bg-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium text-center">You May Also Like</p>
          <h2 className="text-[1.8rem] mb-8 text-center font-cormorant font-semibold text-black">Other Popular Treatments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((s) => {
              const m = buildServiceMeta(s);
              return (
                <Link key={s.slug} to={m.path} className="group glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-gold/30 no-underline">
                  <div className="h-[190px] overflow-hidden bg-black/5">
                    <img src={s.image} alt={s.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="p-5">
                    <p className="text-[0.62rem] tracking-[2.5px] uppercase text-gold font-medium mb-1">{s.category}</p>
                    <h3 className="text-[1rem] font-semibold text-black group-hover:text-gold transition-colors duration-300 mb-1.5">{s.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[0.8rem] font-bold text-gold">{s.priceFormatted}</span>
                      <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold uppercase tracking-[1px] text-gray-400 group-hover:text-gold transition-colors">
                        View <FiArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 bg-black text-white px-7 py-3 text-[0.75rem] font-semibold uppercase tracking-[2px] rounded-xl transition-all duration-300 hover:bg-gold">
              View All Services <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-[760px] mx-auto">
          <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium text-center">Common Questions</p>
          <h2 className="text-[1.8rem] mb-2 text-center font-cormorant font-semibold text-black">
            {service.name} in Kigali — Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-[0.85rem] text-center mb-8 max-w-[560px] mx-auto leading-relaxed">
            Everything you need to know about {service.name.toLowerCase()} at Extreme Beauty Lashes & Brows, Nyarutarama, Kigali.
          </p>
          <div className="space-y-4">
            {meta.faqs.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border border-gray-200 rounded-xl bg-white overflow-hidden transition-colors duration-300">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer bg-transparent"
                    aria-expanded={isOpen}
                  >
                    <h3 className="font-medium text-[0.95rem] font-cormorant text-gray-900">{item.q}</h3>
                    <FiChevronDown
                      size={18}
                      className={`text-gold flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="px-5 pb-4 text-gray-500 text-[0.85rem] leading-[1.7]">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-5 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.06)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-[520px] mx-auto">
          <h2 className="text-[1.9rem] mb-3 text-white font-cormorant font-semibold">Ready for Your {service.name}?</h2>
          <p className="text-gray-400 text-[0.85rem] mb-6 leading-relaxed">
            Book online now or visit us in Nyarutarama, Kigali. Let our artists bring out your natural beauty.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to={`/booking?service=${encodeURIComponent(service.name)}`} className="btn-primary">Book Appointment</Link>
            <Link to="/contact" className="btn-secondary border-white/20 text-white hover:border-gold hover:text-gold hover:bg-gold/5">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;