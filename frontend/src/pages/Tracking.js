import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiSearch, FiCalendar, FiClock, FiUser, FiCheckCircle, FiAlertCircle, FiLoader,
  FiPhone, FiHash, FiArrowRight, FiArrowLeft, FiShield,
} from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'https://extremebeauty-e-booking-website.onrender.com';

const CONTACTS = [
  { label: 'Call us anytime', number: '+250 785 069 349', href: 'tel:+250785069349' },
  { label: 'WhatsApp available', number: '+250 787 035 643', href: 'https://wa.me/250787035643' },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' },
  completed: { label: 'Completed', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
};

async function safeFetch(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('The tracking service could not complete your request. Please check your password and try again, or contact us for help.');
  }
  const json = await response.json();
  if (!response.ok) {
    const e = new Error(json.message || 'Unable to track this booking.');
    e.status = response.status;
    throw e;
  }
  return json.data !== undefined ? json.data : json;
}

const Tracking = () => {
  const [activeTab, setActiveTab] = useState('ref');
  const [phone, setPhone] = useState('');
  const [refCode, setRefCode] = useState('');

  const [found, setFound] = useState(false);
  const [verifiedBooking, setVerifiedBooking] = useState(null);
  const [verifiedBookings, setVerifiedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const resetState = () => {
    setFound(false); setVerifiedBooking(null);
    setVerifiedBookings([]); setErrorMsg('');
  };

  const switchTab = (tab) => {
    setActiveTab(tab); resetState();
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    setErrorMsg(''); setVerifiedBooking(null); setVerifiedBookings([]);
    if (activeTab === 'ref') {
      if (!refCode.trim()) { toast.warning('Please enter your booking reference'); return; }
      setLoading(true);
      try {
        const booking = await safeFetch(`${API_URL}/api/bookings/track/${refCode.trim().toUpperCase()}`);
        setVerifiedBooking(booking);
        setFound(true);
      } catch (error) {
        setErrorMsg(error.message || 'No booking found with this reference.');
      } finally { setLoading(false); }
    } else {
      const cleanPhone = phone.replace(/\s/g, '');
      if (!cleanPhone) { toast.warning('Please enter your phone number'); return; }
      setLoading(true);
      try {
        const bookings = await safeFetch(`${API_URL}/api/bookings/track/phone/${encodeURIComponent(cleanPhone)}`);
        setVerifiedBookings(bookings);
        setFound(true);
      } catch (error) {
        setErrorMsg(error.message || 'No bookings found for this number.');
      } finally { setLoading(false); }
    }
  };

  const renderTimeline = (status) => {
    const steps = ['pending', 'approved', 'completed'];
    const statusMap = { pending: 0, approved: 1, confirmed: 1, completed: 2, cancelled: -1 };
    const currentIdx = statusMap[status] ?? -1;
    return (
      <div className="flex items-center justify-between max-w-[340px] mx-auto my-5 px-2 relative">
        <div className="absolute top-[9px] left-[14%] right-[14%] h-[2px] bg-gray-200" />
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center relative z-10 flex-1">
            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${i <= currentIdx ? (i === currentIdx ? 'bg-gold border-gold scale-125 shadow-[0_0_0_3px_rgba(184,149,106,0.2)]' : 'bg-black border-black') : 'bg-white border-gray-300'}`} />
            <p className={`text-[0.65rem] mt-1.5 text-center font-medium capitalize ${i <= currentIdx ? 'text-black' : 'text-gray-400'}`}>{step}</p>
          </div>
        ))}
        {status === 'cancelled' && (
          <div className="flex flex-col items-center relative z-10 flex-1">
            <div className="w-4 h-4 rounded-full border-2 bg-red-500 border-red-500 scale-125" />
            <p className="text-[0.65rem] mt-1.5 text-center font-medium text-red-500">Cancelled</p>
          </div>
        )}
      </div>
    );
  };

  const renderBookingCard = (b) => (
    <div key={b._id || b.bookingRef} className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-4 animate-fade-in-up shadow-sm">
      <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-black to-gray-900">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[2px] text-gray-400 mb-0.5">Reference</p>
          <p className="text-[1.05rem] font-cormorant font-bold text-white tracking-wide">{b.bookingRef}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider rounded-full ${statusConfig[b.status]?.color || statusConfig.approved.color}`}>
          {statusConfig[b.status]?.label || 'Approved'}
        </span>
      </div>

      <div className="px-4 pt-2">
        {renderTimeline(b.status)}
      </div>

      <div className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: <FiUser size={13} />, label: 'Client', value: `${b.firstName} ${b.lastName}` },
            { icon: <FiCalendar size={13} />, label: 'Date', value: new Date(b.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) },
            { icon: <FiClock size={13} />, label: 'Time', value: b.time },
            { icon: <FiCheckCircle size={13} />, label: 'Service', value: b.service },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-gold">{item.icon}</span>
                <span className="text-[0.6rem] uppercase tracking-[1.5px] text-gray-400 font-medium">{item.label}</span>
              </div>
              <p className="text-[0.8rem] text-black font-medium capitalize-first">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Link to="/booking" className="flex-1 text-center bg-black text-white py-2.5 text-[0.7rem] font-semibold uppercase tracking-[1.5px] rounded-xl transition-all duration-300 hover:bg-gold no-underline">Book New</Link>
          <Link to="/contact" className="flex-1 text-center bg-white text-black py-2.5 text-[0.7rem] font-semibold uppercase tracking-[1.5px] border border-gray-200 rounded-xl transition-all duration-300 hover:border-gold hover:text-gold no-underline">Contact Us</Link>
        </div>
      </div>
    </div>
  );

  const inputWrap = "flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-gold/60 focus-within:ring-2 focus-within:ring-gold/10 transition-all duration-200";

  return (
    <>
      <div className="pt-[104px] pb-10 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.08)_0%,transparent_70%)]" />
        <div className="container mx-auto px-5 relative z-10">
          <p className="text-[0.72rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Check Status</p>
          <h1 className="text-[1.75rem] sm:text-[2.2rem] lg:text-[2.5rem] mb-2 font-cormorant font-semibold text-white">Track Your Booking</h1>
          <p className="text-gray-400 text-[0.88rem]">Check your booking status using your reference or phone number</p>
          <div className="flex items-center justify-center gap-2 mt-5 text-gray-400 text-[0.72rem]">
            <FiShield size={14} className="text-gold" />
            <span>Your booking details are shown instantly — no password needed.</span>
          </div>
        </div>
      </div>

      <section className="py-10 px-5">
        <div className="max-w-[540px] mx-auto">

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
            <button
              onClick={() => switchTab('ref')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[1.5px] rounded-lg transition-all duration-300 border-none cursor-pointer ${activeTab === 'ref' ? 'bg-black text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black'}`}
            >
              <FiHash size={13} /> Booking Ref
            </button>
            <button
              onClick={() => switchTab('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[1.5px] rounded-lg transition-all duration-300 border-none cursor-pointer ${activeTab === 'phone' ? 'bg-black text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black'}`}
            >
              <FiPhone size={13} /> Phone Number
            </button>
          </div>

          {/* STEP 1: Lookup */}
          {!found && (
            <form onSubmit={handleLookup} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm animate-fade-in-up">
              <p className="text-[0.8rem] text-gray-600 mb-4">
                {activeTab === 'ref'
                  ? 'Enter your booking reference to get started.'
                  : 'Enter the phone number you used when booking.'}
              </p>

              {activeTab === 'ref' ? (
                <>
                  <label className="block text-[0.6rem] font-semibold uppercase tracking-[1.5px] text-gray-400 mb-1.5">Booking Reference</label>
                  <div className={inputWrap}>
                    <FiHash size={15} className="ml-3.5 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={refCode}
                      onChange={(e) => setRefCode(e.target.value.toUpperCase())}
                      placeholder="e.g. EB-A1B2C3"
                      maxLength={9}
                      className="flex-1 px-3 py-2.5 border-none font-body text-[0.85rem] bg-transparent text-black outline-none uppercase placeholder:normal-case"
                    />
                  </div>
                </>
              ) : (
                <>
                  <label className="block text-[0.6rem] font-semibold uppercase tracking-[1.5px] text-gray-400 mb-1.5">Phone Number</label>
                  <div className={inputWrap}>
                    <FiPhone size={15} className="ml-3.5 text-gray-400 shrink-0" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+250 7XX XXX XXX"
                      className="flex-1 px-3 py-2.5 border-none font-body text-[0.85rem] bg-transparent text-black outline-none"
                    />
                  </div>
                </>
              )}

              <button type="submit" disabled={loading} className="w-full mt-3.5 flex items-center justify-center gap-2 bg-black text-white py-2.5 text-[0.72rem] font-semibold uppercase tracking-[1.5px] rounded-lg border-none cursor-pointer transition-all duration-300 hover:bg-gold disabled:bg-gray-300 disabled:cursor-not-allowed">
                {loading ? <FiLoader size={13} className="animate-spin" /> : <FiSearch size={13} />}
                {loading ? 'Checking...' : 'Find Booking'}
              </button>

              {errorMsg && (
                <div className="mt-3.5 flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100 animate-fade-in-up">
                  <FiAlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.78rem] text-red-600 font-medium">{errorMsg}</p>
                    <p className="text-[0.7rem] text-gray-500 mt-2 flex items-center gap-1.5"><FiPhone size={11} className="text-gold" /> Need help? <span className="text-gray-400">Call</span> <a href={CONTACTS[0].href} className="text-gold font-medium hover:underline">{CONTACTS[0].number}</a> <span className="text-gray-300">or</span> <a href={CONTACTS[1].href} target="_blank" rel="noopener noreferrer" className="text-gold font-medium hover:underline">WhatsApp</a></p>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* STEP 2: Results */}
          {found && (
            <div className="animate-fade-in-up">
              {activeTab === 'ref' && verifiedBooking && renderBookingCard(verifiedBooking)}
              {activeTab === 'phone' && (verifiedBookings.length ? (
                <>
                  <p className="text-[0.75rem] text-gray-500 mb-4 text-center">{verifiedBookings.length} booking{verifiedBookings.length > 1 ? 's' : ''} found for this number</p>
                  {verifiedBookings.map(renderBookingCard)}
                </>
              ) : (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
                  <FiAlertCircle size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-[0.82rem]">No bookings found for this number.</p>
                </div>
              ))}
              <button onClick={resetState} className="w-full mt-2 flex items-center justify-center gap-1.5 text-[0.75rem] text-gray-500 hover:text-gold bg-transparent border-none cursor-pointer">
                <FiArrowLeft size={13} /> Search another booking
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Tracking;
