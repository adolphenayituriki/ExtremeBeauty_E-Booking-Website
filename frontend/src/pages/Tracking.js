import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSearch, FiCalendar, FiClock, FiUser, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const statusConfig = {
  pending: { label: 'Pending', icon: FiClock, description: 'Your booking is being reviewed.' },
  confirmed: { label: 'Confirmed', icon: FiCheckCircle, description: 'Your appointment is confirmed. See you there!' },
  cancelled: { label: 'Cancelled', icon: FiAlertCircle, description: 'This booking has been cancelled.' },
  completed: { label: 'Completed', icon: FiCheckCircle, description: 'This appointment has been completed.' },
};

const Tracking = () => {
  const [refCode, setRefCode] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!refCode.trim()) { toast.warning('Please enter a booking reference'); return; }
    setLoading(true); setBooking(null);
    try {
      const response = await fetch(`${API_URL}/api/bookings/track/${refCode.trim().toUpperCase()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Booking not found');
      setBooking(data); setSearched(true);
    } catch (error) {
      setSearched(true); toast.error(error.message || 'Booking not found');
    } finally { setLoading(false); }
  };

  const renderTimeline = (status) => {
    const steps = ['pending', 'confirmed', 'completed'];
    const currentIdx = status === 'cancelled' ? -1 : steps.indexOf(status);
    return (
      <div className="flex items-center justify-between max-w-[400px] mx-auto my-6 px-4 relative">
        <div className="absolute top-[10px] left-[10%] right-[10%] h-[2px] bg-gray-200" />
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center relative z-10 flex-1">
            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${i <= currentIdx ? i === currentIdx ? 'bg-gold border-gold scale-125 shadow-[0_0_0_3px_rgba(184,149,106,0.2)]' : 'bg-black border-black' : 'bg-white border-gray-300'}`} />
            <p className={`text-[0.7rem] mt-1.5 text-center font-medium ${i <= currentIdx ? 'text-black' : 'text-gray-400'}`}>{step.charAt(0).toUpperCase() + step.slice(1)}</p>
            {i < steps.length - 1 && i < currentIdx && <div className="absolute top-[10px] left-[60%] w-[80%] h-[2px] bg-black z-[-1]" />}
          </div>
        ))}
        {status === 'cancelled' && (
          <div className="flex flex-col items-center relative z-10 flex-1">
            <div className="w-4 h-4 rounded-full border-2 bg-red-500 border-red-500 scale-125" />
            <p className="text-[0.7rem] mt-1.5 text-center font-medium text-red-500">Cancelled</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="pt-[110px] pb-10 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.08)_0%,transparent_70%)]" />
        <div className="container mx-auto px-5 relative z-10">
          <p className="text-[0.75rem] tracking-[4px] uppercase text-gold mb-2 font-medium animate-header-subtitle">Check Status</p>
          <h1 className="text-[2.5rem] mb-2 animate-header-title">Track Your Booking</h1>
          <p className="text-gray-400 text-[0.9rem] animate-header-subtitle">Enter your booking reference to see appointment status</p>
        </div>
      </div>

      <section className="py-12 px-5">
        <div className="max-w-[600px] mx-auto px-5">
          <form className="flex mb-6" onSubmit={handleSearch}>
            <div className="flex items-center flex-1 bg-white border border-gray-200">
              <FiSearch size={18} className="ml-3 text-gray-400 shrink-0" />
              <input type="text" value={refCode} onChange={(e) => setRefCode(e.target.value.toUpperCase())} placeholder="EB-A1B2C3" className="flex-1 px-3 py-3 border-none font-body text-[0.9rem] bg-transparent text-black outline-none" maxLength={9} />
            </div>
            <button type="submit" disabled={loading} className="bg-black text-white px-6 py-3 text-[0.8rem] font-semibold uppercase tracking-[2px] border-none cursor-pointer transition-all duration-300 hover:bg-gold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2">
              {loading ? <FiLoader size={14} className="animate-spin" /> : 'Track'}
            </button>
          </form>

          {loading && (
            <div className="text-center py-10">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-gold rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-[0.85rem]">Looking up your booking...</p>
            </div>
          )}

          {searched && !loading && !booking && (
            <div className="text-center py-10 animate-fade-in-up">
              <FiAlertCircle size={40} className="text-gray-300 mx-auto mb-3" />
              <h3 className="text-[1.2rem] mb-1">Booking Not Found</h3>
              <p className="text-gray-500 text-[0.85rem]">No booking matches &quot;{refCode}&quot;. Please check and try again.</p>
            </div>
          )}

          {booking && !loading && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[1px] rounded-full mb-3 ${booking.status === 'pending' ? 'bg-amber-100 text-amber-700' : booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'}`}>
                  {statusConfig[booking.status]?.icon && React.createElement(statusConfig[booking.status].icon, { size: 12 })}
                  {' '}{statusConfig[booking.status]?.label || booking.status}
                </span>
                <h2 className="text-[1.8rem] font-heading">{booking.bookingRef}</h2>
                <p className="text-gray-500 text-[0.85rem] mt-1">{statusConfig[booking.status]?.description}</p>
              </div>

              {renderTimeline(booking.status)}

              <div className="bg-white border border-gray-200 p-5 mb-4">
                <h3 className="text-[1rem] font-heading mb-3 pb-2 border-b border-gray-200">Appointment Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: <FiUser size={14} />, label: 'Client', value: `${booking.firstName} ${booking.lastName}` },
                    { icon: <FiCalendar size={14} />, label: 'Date', value: new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                    { icon: <FiClock size={14} />, label: 'Time', value: booking.time },
                    { icon: <FiCheckCircle size={14} />, label: 'Service', value: booking.service },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="text-gold mt-0.5 shrink-0">{item.icon}</div>
                      <div>
                        <p className="text-[0.65rem] uppercase tracking-[1.5px] text-gray-500 mb-0.5">{item.label}</p>
                        <p className="text-[0.8rem] text-black font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-5 mb-4">
                <h3 className="text-[1rem] font-heading mb-2">Location</h3>
                <p className="text-gray-500 text-[0.85rem] mb-2">105 KG 9th Ave, Nyarutarama, Kigali</p>
                <a href="https://maps.app.goo.gl/JVeG4xNRdoP4Dt4dA" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-black px-5 py-2 text-[0.8rem] font-semibold uppercase tracking-[1.5px] border-2 border-black cursor-pointer transition-all duration-300 hover:bg-black hover:text-white">View on Map</a>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/booking" className="flex-1 text-center bg-black text-white py-3 text-[0.8rem] font-semibold uppercase tracking-[2px] border-2 border-black transition-all duration-300 hover:bg-gold hover:border-gold">Book New</Link>
                <Link to="/contact" className="flex-1 text-center bg-white text-black py-3 text-[0.8rem] font-semibold uppercase tracking-[2px] border-2 border-black transition-all duration-300 hover:bg-black hover:text-white">Contact Us</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Tracking;
