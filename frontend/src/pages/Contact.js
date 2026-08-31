import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiArrowRight, FiSend, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useSiteInfo } from '../utils/content';
import Seo from '../utils/Seo';

const API_URL = process.env.REACT_APP_API_URL || 'https://extremebeauty-e-booking-website.onrender.com';

async function safePost(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    console.error('Expected JSON but received non-JSON response');
    throw new Error('The server is currently unavailable. Please try again later.');
  }
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || 'Request failed.');
  }
  return json.data !== undefined ? json.data : json;
}

const Contact = () => {
  const { site } = useSiteInfo();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.warning('Please enter your name'); return; }
    if (!formData.email.trim()) { toast.warning('Please enter your email'); return; }
    if (!formData.subject.trim()) { toast.warning('Please enter a subject'); return; }
    if (!formData.message.trim()) { toast.warning('Please enter your message'); return; }
    setSubmitting(true);
    try {
      await safePost(`${API_URL}/api/contacts`, formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase = "w-full px-4 py-3 glass-input text-[0.85rem] text-black outline-none rounded-xl placeholder:text-gray-400";
  const labelBase = "block text-[0.7rem] font-semibold uppercase tracking-[1.5px] text-gray-500 mb-2";
  const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const contactInfo = [
    { icon: <FiMapPin size={18} />, title: 'Location', value: site.address, href: site.mapsUrl },
    { icon: <FiPhone size={18} />, title: 'Phone', value: site.phone1, sub: 'Call us anytime', href: `tel:${site.callRaw}` },
    { icon: <FiMessageSquare size={18} />, title: 'WhatsApp', value: site.phone2, sub: 'Available', href: `https://wa.me/${site.whatsappRaw}` },
    { icon: <FiMail size={18} />, title: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: <FiClock size={18} />, title: 'Working Hours', value: site.workingHours },
  ];

  return (
    <>
      <Seo
        title="Contact Us | Extreme Beauty Lashes & Brows"
        description="Get in touch with Extreme Beauty Lashes & Brows in Kigali, Rwanda. Call, WhatsApp or send us a message to book your lash and brow appointment."
        path="/contact"
      />
      <div className="pt-[110px] pb-10 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.08)_0%,transparent_70%)]" />
        <div className="container mx-auto px-5 relative z-10">
          <p className="text-[0.68rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Get In Touch</p>
          <h1 className="text-[2.2rem] mb-2 font-cormorant font-semibold text-white">Contact Us</h1>
          <p className="text-gray-400 text-[0.88rem]">We&apos;d love to hear from you. Reach out anytime.</p>
        </div>
      </div>

      <section className="py-14 px-5 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10">

            {/* Left */}
            <div>
              <p className="text-[0.68rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Let&apos;s Connect</p>
              <h2 className="text-[1.6rem] mb-2 font-cormorant font-semibold">Get in Touch</h2>
              <p className="text-gray-500 text-[0.85rem] leading-relaxed mb-8">
                Have a question about our services? Reach out and we&apos;ll respond as soon as possible.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {contactInfo.map((item, i) => (
                  <div key={i} className="glass-card p-4 rounded-2xl hover:border-gold/30 transition-all duration-300 group">
                    <div className="text-gold mb-3">{item.icon}</div>
                    <h4 className="text-[0.68rem] font-semibold uppercase tracking-[1.5px] text-gray-400 mb-1.5">{item.title}</h4>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-[0.85rem] text-black hover:text-gold transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-[0.85rem] text-black">{item.value}</p>
                    )}
                    {item.sub && <p className="text-[0.85rem] text-black mt-0.5">{item.sub}</p>}
                  </div>
                ))}
              </div>

              <div className="rounded-2xl overflow-hidden border border-gray-200/60">
                <iframe title="Extreme Beauty Location" src={mapsEmbed} width="100%" height="220" style={{ border: 0, display: 'block' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>

            {/* Right - Form */}
            <div>
              <div className="glass rounded-2xl p-6 md:p-8">
                <div className="mb-6">
                  <p className="text-[0.68rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Send a Message</p>
                  <h3 className="text-[1.3rem] font-cormorant font-semibold">We&apos;re Here to Help</h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className={labelBase}>Name *</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" className={inputBase} />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelBase}>Phone</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+250 7XX XXX XXX" className={inputBase} />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className={labelBase}>Email *</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className={inputBase} />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="subject" className={labelBase}>Subject *</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="How can we help?" className={inputBase} />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="message" className={labelBase}>Message *</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="Tell us more..." rows="4" className={`${inputBase} resize-y min-h-[100px]`} />
                  </div>
                  <button type="submit" className="group/btn inline-flex items-center justify-center gap-2 w-full py-3.5 bg-black text-white text-[0.75rem] font-semibold uppercase tracking-[2px] rounded-xl border-none cursor-pointer transition-all duration-300 hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed" disabled={submitting}>
                    {submitting ? 'Sending...' : <>Send Message <FiArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" /></>}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
