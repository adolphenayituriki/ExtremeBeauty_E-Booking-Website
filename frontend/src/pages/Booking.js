import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiSearch, FiCalendar, FiClock, FiUser, FiPhone, FiMail, FiMessageSquare, FiArrowRight, FiChevronDown, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { services, categories, getServiceByName } from '../data/services';
import Receipt from '../components/Receipt';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }
  return data;
}

const Booking = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    service: '', date: '', time: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      const svc = getServiceByName(serviceParam);
      if (svc) {
        setSelectedService(svc);
        setFormData((prev) => ({ ...prev, service: svc.name }));
        setStep(2);
      }
    }
  }, [searchParams]);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  const handleServiceSelect = (svc) => {
    setSelectedService(svc);
    setFormData((prev) => ({ ...prev, service: svc.name }));
    setStep(2);
    toast.info(`Selected: ${svc.name} — ${svc.priceFormatted}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName.trim()) { toast.warning('Please enter your first name'); return; }
    if (!formData.lastName.trim()) { toast.warning('Please enter your last name'); return; }
    if (!formData.email.trim()) { toast.warning('Please enter your email'); return; }
    if (!formData.phone.trim()) { toast.warning('Please enter your phone number'); return; }
    if (!formData.date) { toast.warning('Please select a preferred date'); return; }
    if (!formData.time) { toast.warning('Please select a preferred time'); return; }
    setSubmitting(true);
    try {
      const data = await safePost(`${API_URL}/api/bookings`, formData);
      setBookingResult(data);
      toast.success('Booking confirmed successfully!');
    } catch (error) {
      toast.error(error.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const inputBase = "w-full px-4 py-3.5 bg-white border border-gray-200 text-[0.85rem] text-black outline-none rounded-xl placeholder:text-gray-400 transition-all duration-200 focus:border-gold focus:ring-2 focus:ring-gold/10";
  const labelBase = "block text-[0.7rem] font-semibold uppercase tracking-[1.5px] text-gray-500 mb-2";

  if (bookingResult) {
    const dateStr = new Date(bookingResult.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const bookedService = services.find((s) => s.name === bookingResult.service);

    return (
      <>
        {/* ── Header ── */}
        <div className="pt-[110px] pb-12 bg-gray-950 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.08)_0%,transparent_70%)]" />
          <div className="container mx-auto px-5 relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
              <FiCheckCircle size={38} className="text-emerald-400" />
            </div>
            <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Confirmation</p>
            <h1 className="text-[2.2rem] font-cormorant font-semibold text-white mb-3">Thank You!</h1>
            <p className="text-gray-400 text-[0.85rem] max-w-md mx-auto mb-5">
              Your appointment has been successfully booked. We'll be in touch shortly to confirm the details.
            </p>
            {bookingResult._id && (
              <span className="inline-block px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[1.5px] rounded-full bg-white/5 border border-white/10 text-gray-300">
                Ref: {bookingResult._id.slice(-8).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <section className="py-10 px-5 bg-white">
          <div className="max-w-[560px] mx-auto">

            {/* ── Service Summary Card ── */}
            {bookedService && (
              <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm">
                <div className="relative h-[160px]">
                  <img src={bookedService.image} alt={bookedService.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute top-4 right-4 inline-block px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[1px] rounded-full bg-emerald-500 text-white">
                    Approved
                  </span>
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/70 text-[0.68rem] tracking-[2px] uppercase mb-1">{bookedService.category}</p>
                        <h3 className="text-white text-[1.3rem] font-cormorant font-semibold">{bookedService.name}</h3>
                      </div>
                      <div className="bg-gold text-black text-[0.88rem] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap">{bookedService.priceFormatted}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Appointment Details ── */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <h3 className="text-[0.9rem] font-semibold text-black">Appointment Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <FiCalendar size={16} className="text-gold" />, label: 'Date', value: dateStr },
                  { icon: <FiClock size={16} className="text-gold" />, label: 'Time', value: bookingResult.time },
                  { icon: <FiUser size={16} className="text-gold" />, label: 'Client', value: `${bookingResult.firstName} ${bookingResult.lastName}` },
                  { icon: <FiPhone size={16} className="text-gold" />, label: 'Phone', value: bookingResult.phone },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="mt-0.5 shrink-0">{item.icon}</div>
                    <div className="min-w-0">
                      <p className="text-[0.62rem] uppercase tracking-[1.5px] text-gray-400 mb-1">{item.label}</p>
                      <p className="text-[0.82rem] text-black font-medium truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {bookingResult.email && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 mt-3">
                  <div className="mt-0.5 shrink-0"><FiMail size={16} className="text-gold" /></div>
                  <div className="min-w-0">
                    <p className="text-[0.62rem] uppercase tracking-[1.5px] text-gray-400 mb-1">Email</p>
                    <p className="text-[0.82rem] text-black font-medium truncate">{bookingResult.email}</p>
                  </div>
                </div>
              )}

              {bookingResult.message && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 mt-3">
                  <div className="mt-0.5 shrink-0"><FiMessageSquare size={16} className="text-gold" /></div>
                  <div className="min-w-0">
                    <p className="text-[0.62rem] uppercase tracking-[1.5px] text-gray-400 mb-1">Notes</p>
                    <p className="text-[0.82rem] text-gray-600">{bookingResult.message}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Download Receipt ── */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <h3 className="text-[0.9rem] font-semibold text-black">Download Receipt</h3>
              </div>
              <Receipt booking={bookingResult} />
            </div>

            {/* ── Action Buttons ── */}
            <div className="space-y-3">
              <Link
                to="/tracking"
                className="flex items-center justify-center gap-2 w-full bg-black text-white py-3.5 text-[0.75rem] font-semibold uppercase tracking-[2px] rounded-xl border-none cursor-pointer transition-all duration-300 hover:bg-gold text-center"
              >
                <FiSearch size={14} /> Track Your Booking
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[2px] text-black border border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold bg-white text-center"
                >
                  Home
                </Link>
                <Link
                  to="/services"
                  className="flex items-center justify-center gap-2 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[2px] text-black border border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold bg-white text-center"
                >
                  Services
                </Link>
              </div>
            </div>

          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="pt-[110px] pb-10 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.08)_0%,transparent_70%)]" />
        <div className="container mx-auto px-5 relative z-10">
          <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Schedule Your Visit</p>
          <h1 className="text-[2rem] mb-2 font-cormorant font-semibold text-white">Book an Appointment</h1>
          <p className="text-gray-400 text-[0.85rem]">Choose your service and reserve your spot</p>
        </div>
      </div>

      <section className="py-12 px-5 bg-white">
        <div className="max-w-[960px] mx-auto">

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-0 mb-12">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Confirm' },
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.72rem] font-semibold transition-all duration-300 ${
                    step >= s.num ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s.num ? <FiCheck size={14} /> : s.num}
                  </div>
                  <span className={`text-[0.78rem] font-medium hidden sm:block ${step >= s.num ? 'text-black' : 'text-gray-400'}`}>{s.label}</span>
                </div>
                {i < 2 && (
                  <div className={`w-12 h-[2px] mx-3 rounded-full transition-all duration-300 ${step > s.num ? 'bg-black' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* STEP 1: Service Selection */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-[1.4rem] font-cormorant font-semibold text-black mb-2">Choose Your Service</h2>
                <p className="text-[0.82rem] text-gray-400">Select the treatment you'd like to book</p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`px-5 py-2.5 rounded-full text-[0.82rem] font-medium border transition-all duration-300 cursor-pointer ${
                    activeCategory === 'all'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  All Services
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-5 py-2.5 rounded-full text-[0.82rem] font-medium border transition-all duration-300 cursor-pointer ${
                      activeCategory === cat.key
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {categories
                .filter((cat) => activeCategory === 'all' || activeCategory === cat.key)
                .map((cat) => {
                const catServices = services.filter((s) => s.category === cat.key);
                return (
                  <div key={cat.key} className="mb-8">
                    <div className="mb-4">
                      <p className="text-[0.82rem] tracking-[3px] uppercase font-cormorant font-semibold text-gray-900 border-b border-gold/30 pb-2">{cat.label}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {catServices.map((svc) => (
                        <button
                          key={svc.name}
                          type="button"
                          onClick={() => handleServiceSelect(svc)}
                          className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-200 bg-white text-left transition-all duration-300 cursor-pointer hover:border-gold/40 hover:shadow-[0_4px_20px_rgba(184,149,106,0.1)]"
                        >
                          <img src={svc.image} alt={svc.name} className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-300" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[0.88rem] font-semibold text-black mb-1 group-hover:text-gold transition-colors">{svc.name}</p>
                            <p className="text-[0.78rem] text-gold font-bold">{svc.priceFormatted}</p>
                          </div>
                          <FiArrowRight size={16} className="text-gray-300 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 2: Service Preview + Details */}
          {step === 2 && selectedService && (
            <div className="animate-fade-in">
              {/* Service Preview Card */}
              <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm">
                <div className="relative h-[200px]">
                  <img src={selectedService.image} alt={selectedService.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/40 backdrop-blur-sm text-white text-[0.68rem] font-medium px-3 py-1.5 rounded-full">{selectedService.category}</span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/70 text-[0.68rem] tracking-[2px] uppercase mb-1">Selected Service</p>
                        <h3 className="text-white text-[1.3rem] font-cormorant font-semibold">{selectedService.name}</h3>
                      </div>
                      <div className="bg-gold text-black text-[0.78rem] sm:text-[0.88rem] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap">{selectedService.priceFormatted}</div>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-white">
                  <p className="text-[0.82rem] text-gray-500 leading-[1.7]">{selectedService.description}</p>
                  <button onClick={() => setStep(1)} className="mt-3 flex items-center gap-1.5 text-[0.78rem] text-gold font-medium hover:underline cursor-pointer bg-transparent border-none p-0">
                    <FiArrowLeft size={13} /> Change service
                  </button>
                </div>
              </div>

              {/* Details Form */}
              <div className="text-center mb-6">
                <h2 className="text-[1.4rem] font-cormorant font-semibold text-black mb-2">Your Details</h2>
                <p className="text-[0.82rem] text-gray-400">Fill in your information to complete the booking</p>
              </div>

              <form className="rounded-2xl p-6 md:p-8 border border-gray-200 bg-white" onSubmit={handleSubmit}>
                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className={labelBase}>First Name *</label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Your first name" className={inputBase} />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelBase}>Last Name *</label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Your last name" className={inputBase} />
                  </div>
                </div>

                {/* Contact row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="email" className={labelBase}>Email *</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className={inputBase} />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelBase}>Phone *</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+250 7XX XXX XXX" className={inputBase} />
                  </div>
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="date" className={labelBase}>Preferred Date *</label>
                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required min={getMinDate()} className={`${inputBase} appearance-none`} />
                  </div>
                  <div>
                    <label htmlFor="time" className={labelBase}>Preferred Time *</label>
                    <div className="relative">
                      <select id="time" name="time" value={formData.time} onChange={handleChange} required className={`${inputBase} appearance-none pr-10`}>
                        <option value="">Select time...</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                      <FiChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label htmlFor="message" className={labelBase}>Additional Notes</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Any special requests or notes..." rows="3" className={`${inputBase} resize-y min-h-[80px]`} />
                </div>

                {/* Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={selectedService.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.78rem] text-gray-400 mb-0.5">Booking for</p>
                      <p className="text-[0.88rem] font-semibold text-black truncate">{selectedService.name}</p>
                    </div>
                    <span className="text-[0.88rem] font-bold text-gold">{selectedService.priceFormatted}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-3" />
                  <div className="grid grid-cols-2 gap-3 text-[0.82rem]">
                    <div className="flex items-center gap-2">
                      <FiCalendar size={13} className="text-gray-400" />
                      <span className="text-black font-medium">{formData.date || 'Select date'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={13} className="text-gray-400" />
                      <span className="text-black font-medium">{formData.time || 'Select time'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="px-5 py-3.5 border border-gray-200 rounded-xl text-[0.78rem] font-semibold uppercase tracking-[1.5px] text-gray-600 cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold bg-white">
                    Back
                  </button>
                  <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3.5 text-[0.78rem] font-semibold uppercase tracking-[2px] rounded-xl border-none cursor-pointer transition-all duration-300 hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed" disabled={submitting}>
                    {submitting ? 'Confirming...' : <>Confirm Booking <FiArrowRight size={14} /></>}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default Booking;
