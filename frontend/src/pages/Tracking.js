import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSearch, FiCalendar, FiClock, FiUser, FiCheckCircle, FiAlertCircle, FiLoader, FiPhone, FiHash } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' },
  completed: { label: 'Completed', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
};

async function safeFetch(url) {
  const response = await fetch(url);
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Expected JSON but received:', text.substring(0, 200));
    throw new Error('The tracking service is currently unavailable. Please try again later.');
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Unable to track this booking.');
  }
  return data;
}

const Tracking = () => {
  const [activeTab, setActiveTab] = useState('phone');
  const [phone, setPhone] = useState('');
  const [refCode, setRefCode] = useState('');
  const [bookings, setBookings] = useState([]);
  const [singleBooking, setSingleBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handlePhoneSearch = async (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\s/g, '');
    if (!cleanPhone) { toast.warning('Please enter your phone number'); return; }
    setLoading(true); setBookings([]); setSingleBooking(null);
    try {
      const data = await safeFetch(`${API_URL}/api/bookings/track/phone/${encodeURIComponent(cleanPhone)}`);
      setBookings(data); setSearched(true);
      toast.success(`Found ${data.length} booking${data.length > 1 ? 's' : ''}`);
    } catch (error) {
      setSearched(true); toast.error(error.message || 'No bookings found for this number');
    } finally { setLoading(false); }
  };

  const handleRefSearch = async (e) => {
    e.preventDefault();
    if (!refCode.trim()) { toast.warning('Please enter your booking reference'); return; }
    setLoading(true); setSingleBooking(null); setBookings([]);
    try {
      const data = await safeFetch(`${API_URL}/api/bookings/track/${refCode.trim().toUpperCase()}`);
      setSingleBooking(data); setSearched(true);
    } catch (error) {
      setSearched(true); toast.error(error.message || 'Booking not found');
    } finally { setLoading(false); }
  };

  const renderTimeline = (status) => {
    const steps = ['pending', 'approved', 'completed'];
    const statusMap = { pending: 0, approved: 1, confirmed: 1, completed: 2, cancelled: -1 };
    const currentIdx = statusMap[status] ?? -1;
    return (
      <div className="flex items-center justify-between max-w-[360px] mx-auto my-5 px-2 relative">
        <div className="absolute top-[9px] left-[12%] right-[12%] h-[2px] bg-gray-200" />
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center relative z-10 flex-1">
            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${i <= currentIdx ? i === currentIdx ? 'bg-gold border-gold scale-125 shadow-[0_0_0_3px_rgba(184,149,106,0.2)]' : 'bg-black border-black' : 'bg-white border-gray-300'}`} />
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

  const renderBookingCard = (b, compact = false) => (
    <div key={b._id || b.bookingRef} className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-4 animate-fade-in-up">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[1.5px] text-gray-400 mb-0.5">Reference</p>
          <p className="text-[1rem] font-cormorant font-bold text-black">{b.bookingRef}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider rounded-full border ${statusConfig[b.status]?.color || statusConfig.approved.color}`}>
          {statusConfig[b.status]?.label || 'Approved'}
        </span>
      </div>

      {renderTimeline(b.status)}

      <div className="p-4">
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: <FiUser size={13} />, label: 'Client', value: `${b.firstName} ${b.lastName}` },
            { icon: <FiCalendar size={13} />, label: 'Date', value: new Date(b.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) },
            { icon: <FiClock size={13} />, label: 'Time', value: b.time },
            { icon: <FiCheckCircle size={13} />, label: 'Service', value: b.service },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-gold">{item.icon}</span>
                <span className="text-[0.6rem] uppercase tracking-[1.5px] text-gray-400 font-medium">{item.label}</span>
              </div>
              <p className="text-[0.8rem] text-black font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {!compact && (
        <div className="px-4 pb-4">
          <div className="flex gap-2">
            <Link to="/booking" className="flex-1 text-center bg-black text-white py-2.5 text-[0.7rem] font-semibold uppercase tracking-[1.5px] rounded-xl transition-all duration-300 hover:bg-gold no-underline">Book New</Link>
            <Link to="/contact" className="flex-1 text-center bg-white text-black py-2.5 text-[0.7rem] font-semibold uppercase tracking-[1.5px] border border-gray-200 rounded-xl transition-all duration-300 hover:border-gold hover:text-gold no-underline">Contact Us</Link>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="pt-[110px] pb-10 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.08)_0%,transparent_70%)]" />
        <div className="container mx-auto px-5 relative z-10">
          <p className="text-[0.75rem] tracking-[4px] uppercase text-gold mb-2 font-medium">Check Status</p>
          <h1 className="text-[1.75rem] sm:text-[2.2rem] lg:text-[2.5rem] mb-2 font-cormorant font-semibold text-white">Track Your Booking</h1>
          <p className="text-gray-400 text-[0.88rem]">Find your appointment using phone number or reference</p>
        </div>
      </div>

      <section className="py-10 px-5">
        <div className="max-w-[520px] mx-auto">

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setActiveTab('phone'); setSearched(false); setBookings([]); setSingleBooking(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[0.75rem] font-semibold uppercase tracking-[1.5px] rounded-lg transition-all duration-300 border-none cursor-pointer ${activeTab === 'phone' ? 'bg-black text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black'}`}
            >
              <FiPhone size={14} /> Phone Number
            </button>
            <button
              onClick={() => { setActiveTab('ref'); setSearched(false); setBookings([]); setSingleBooking(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[0.75rem] font-semibold uppercase tracking-[1.5px] rounded-lg transition-all duration-300 border-none cursor-pointer ${activeTab === 'ref' ? 'bg-black text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black'}`}
            >
              <FiHash size={14} /> Booking Ref
            </button>
          </div>

          {/* Phone Search */}
          {activeTab === 'phone' && (
            <form onSubmit={handlePhoneSearch} className="mb-6 animate-fade-in-up">
              <p className="text-[0.78rem] text-gray-500 mb-3 text-center">Enter the phone number you used when booking</p>
              <div className="flex gap-2">
                <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <FiPhone size={16} className="ml-4 text-gray-400 shrink-0" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 7XX XXX XXX"
                    className="flex-1 px-3 py-3.5 border-none font-body text-[0.88rem] bg-transparent text-black outline-none"
                  />
                </div>
                <button type="submit" disabled={loading} className="bg-black text-white px-5 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[1.5px] border-none cursor-pointer transition-all duration-300 hover:bg-gold disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl flex items-center gap-2 shrink-0">
                  {loading ? <FiLoader size={14} className="animate-spin" /> : <FiSearch size={14} />}
                </button>
              </div>
            </form>
          )}

          {/* Reference Search */}
          {activeTab === 'ref' && (
            <form onSubmit={handleRefSearch} className="mb-6 animate-fade-in-up">
              <p className="text-[0.78rem] text-gray-500 mb-3 text-center">Enter your booking reference (e.g. EB-A1B2C3)</p>
              <div className="flex gap-2">
                <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <FiHash size={16} className="ml-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value.toUpperCase())}
                    placeholder="EB-000000"
                    className="flex-1 px-3 py-3.5 border-none font-body text-[0.88rem] bg-transparent text-black outline-none uppercase"
                    maxLength={9}
                  />
                </div>
                <button type="submit" disabled={loading} className="bg-black text-white px-5 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[1.5px] border-none cursor-pointer transition-all duration-300 hover:bg-gold disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl flex items-center gap-2 shrink-0">
                  {loading ? <FiLoader size={14} className="animate-spin" /> : <FiSearch size={14} />}
                </button>
              </div>
            </form>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-gold rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-[0.85rem]">Looking up your booking...</p>
            </div>
          )}

          {/* Not Found */}
          {searched && !loading && !bookings.length && !singleBooking && (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle size={28} className="text-gray-300" />
              </div>
              <h3 className="text-[1.1rem] font-cormorant font-semibold mb-2">No Bookings Found</h3>
              <p className="text-gray-500 text-[0.82rem] max-w-[300px] mx-auto">
                We couldn't find any bookings matching your {activeTab === 'phone' ? 'phone number' : 'reference'}. Please check and try again.
              </p>
            </div>
          )}

          {/* Multiple Bookings (phone) */}
          {bookings.length > 0 && !loading && (
            <div>
              <p className="text-[0.75rem] text-gray-500 mb-4 text-center">{bookings.length} booking{bookings.length > 1 ? 's' : ''} found</p>
              {bookings.map((b) => renderBookingCard(b))}
            </div>
          )}

          {/* Single Booking (ref) */}
          {singleBooking && !loading && renderBookingCard(singleBooking)}

          {/* Help Text */}
          {!searched && !loading && (
            <div className="text-center mt-8 py-8 border-t border-gray-100">
              <p className="text-[0.78rem] text-gray-400 mb-2">Need help?</p>
              <p className="text-[0.78rem] text-gray-500">Contact us at <a href="tel:+250785069349" className="text-gold font-medium hover:underline">+250 785 069 349</a></p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Tracking;
