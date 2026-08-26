import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiDownload, FiSearch, FiCalendar, FiClock, FiUser, FiPhone, FiMail, FiMessageSquare, FiArrowRight, FiChevronDown } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Booking = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    service: '', date: '', time: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const services = [
    { group: 'BROWS', items: ['Microblading Eyebrows', 'Microshading Eyebrows', 'Hybrid / Combination Brows', 'Brows Lamination'] },
    { group: 'LASHES', items: ['Lash Lift'] },
    { group: 'EYELASH EXTENSIONS', items: ['Classic Set', 'Hybrid Set', 'Volume Set', 'Mega Volume Set', 'Wispy Sets', 'Lash Removal'] },
    { group: 'RETOUCH', items: ['Eyebrows Retouch'] },
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create booking');
      setBookingResult(data);
      toast.success('Booking confirmed!');
    } catch (error) {
      toast.error(error.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadReceipt = () => {
    if (!bookingResult) return;
    const dateStr = new Date(bookingResult.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const createdStr = new Date(bookingResult.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const receipt = `EXTREME BEAUTY LASHES & BROWS - BOOKING RECEIPT\n\nBooking Reference: ${bookingResult.bookingRef}\nStatus: ${bookingResult.status.toUpperCase()}\nDate Created: ${createdStr}\n\nCLIENT: ${bookingResult.firstName} ${bookingResult.lastName}\nEmail: ${bookingResult.email}\nPhone: ${bookingResult.phone}\n\nSERVICE: ${bookingResult.service}\nDate: ${dateStr}\nTime: ${bookingResult.time}\n${bookingResult.message ? `Notes: ${bookingResult.message}\n` : ''}\nLOCATION: 105 KG 9th Ave, Nyarutarama, Kigali\nPhone: +250 785069349 / +250 787035643\n\nTrack: ${window.location.origin}/tracking\n\nThank you for choosing Extreme Beauty!`;
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ExtremeBeauty-${bookingResult.bookingRef}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const inputBase = "w-full px-4 py-3 glass-input text-[0.85rem] text-black outline-none rounded-xl placeholder:text-gray-400";
  const labelBase = "block text-[0.7rem] font-semibold uppercase tracking-[1.5px] text-gray-500 mb-2";

  if (bookingResult) {
    const dateStr = new Date(bookingResult.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return (
      <>
        {/* Confirmation header */}
        <div className="pt-[110px] pb-10 bg-gray-950 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.08)_0%,transparent_70%)]" />
          <div className="container mx-auto px-5 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <FiCheckCircle size={30} className="text-emerald-400" />
            </div>
            <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Confirmation</p>
            <h1 className="text-[2rem] mb-2">Booking Confirmed</h1>
            <p className="text-gray-400 text-[0.85rem]">Your appointment has been successfully booked</p>
          </div>
        </div>

        <section className="py-10 px-5 bg-white">
          <div className="max-w-[560px] mx-auto animate-confirmation-slide">
            {/* Ref card */}
            <div className="glass border border-gray-200/60 rounded-2xl p-6 md:p-8 text-center mb-5">
              <p className="text-[0.65rem] uppercase tracking-[2px] text-gray-400 mb-1">Your Booking Reference</p>
              <h2 className="text-[1.8rem] font-heading text-black mb-1">{bookingResult.bookingRef}</h2>
              <p className="text-[0.78rem] text-gray-400">Save this code to track your booking</p>
            </div>

            {/* Details */}
            <div className="glass border border-gray-200/60 rounded-2xl p-6 md:p-8 mb-5">
              <h3 className="text-[0.9rem] font-semibold mb-4 pb-3 border-b border-gray-100">Booking Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <FiUser size={15} className="text-gray-400" />, label: 'Client', value: `${bookingResult.firstName} ${bookingResult.lastName}` },
                  { icon: <FiMail size={15} className="text-gray-400" />, label: 'Email', value: bookingResult.email },
                  { icon: <FiPhone size={15} className="text-gray-400" />, label: 'Phone', value: bookingResult.phone },
                  { icon: <FiCalendar size={15} className="text-gray-400" />, label: 'Date', value: dateStr },
                  { icon: <FiClock size={15} className="text-gray-400" />, label: 'Time', value: bookingResult.time },
                  { icon: <FiMessageSquare size={15} className="text-gray-400" />, label: 'Service', value: bookingResult.service },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 glass rounded-xl">
                    <div className="mt-0.5 shrink-0">{item.icon}</div>
                    <div className="min-w-0">
                      <p className="text-[0.62rem] uppercase tracking-[1.5px] text-gray-400 mb-0.5">{item.label}</p>
                      <p className="text-[0.82rem] text-black font-medium truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {bookingResult.message && (
                <div className="mt-3 p-3 glass rounded-xl">
                  <p className="text-[0.62rem] uppercase tracking-[1.5px] text-gray-400 mb-0.5">Notes</p>
                  <p className="text-[0.82rem] text-gray-600">{bookingResult.message}</p>
                </div>
              )}
              <div className="mt-4 text-center">
                <span className={`inline-block px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[1px] rounded-full ${bookingResult.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-200' : bookingResult.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : bookingResult.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'}`}>{bookingResult.status}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <button onClick={downloadReceipt} className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3.5 text-[0.75rem] font-semibold uppercase tracking-[2px] rounded-xl border-none cursor-pointer transition-all duration-300 hover:bg-gold">
                <FiDownload size={14} /> Download Receipt
              </button>
              <Link to="/tracking" className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3.5 text-[0.75rem] font-semibold uppercase tracking-[2px] border border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold text-center">
                <FiSearch size={14} /> Track Booking
              </Link>
            </div>

            <div className="text-center">
              <p className="text-[0.78rem] text-gray-400 mb-3">We will confirm your appointment shortly.</p>
              <div className="flex flex-wrap justify-center gap-5">
                <Link to="/" className="text-[0.78rem] text-gray-500 hover:text-gold transition-colors">Back to Home</Link>
                <Link to="/services" className="text-[0.78rem] text-gray-500 hover:text-gold transition-colors">View Services</Link>
                <Link to="/contact" className="text-[0.78rem] text-gray-500 hover:text-gold transition-colors">Contact Us</Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Page header */}
      <div className="pt-[110px] pb-10 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.08)_0%,transparent_70%)]" />
        <div className="container mx-auto px-5 relative z-10">
          <p className="text-[0.7rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Schedule Your Visit</p>
          <h1 className="text-[2rem] mb-2">Book an Appointment</h1>
          <p className="text-gray-400 text-[0.85rem]">Fill in the form below to reserve your spot</p>
        </div>
      </div>

      {/* Form */}
      <section className="py-10 px-5 bg-white">
        <div className="max-w-[560px] mx-auto">
          <form className="glass rounded-2xl p-6 md:p-8" onSubmit={handleSubmit}>
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

            {/* Service */}
            <div className="mb-4">
              <label htmlFor="service" className={labelBase}>Select Service *</label>
              <div className="relative">
                <select id="service" name="service" value={formData.service} onChange={handleChange} required className={`${inputBase} appearance-none pr-10`}>
                  <option value="">Choose a service...</option>
                  {services.map((group) => (
                    <optgroup key={group.group} label={group.group}>
                      {group.items.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <FiChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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

            {/* Submit */}
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 text-[0.78rem] font-semibold uppercase tracking-[2px] rounded-xl border-none cursor-pointer transition-all duration-300 hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed" disabled={submitting}>
              {submitting ? 'Submitting...' : <>Confirm Booking <FiArrowRight size={14} /></>}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Booking;
