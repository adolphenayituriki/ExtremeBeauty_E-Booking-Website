import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiInbox, FiLayers, FiArrowRight,
  FiUser, FiMail, FiPhone, FiX, FiMessageSquare, FiTrash2, FiChevronRight, FiLoader,
  FiSend, FiCheck,
} from 'react-icons/fi';
import { adminFetch } from '../../utils/adminApi';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700' },
  confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  completed: { label: 'Completed', color: 'bg-indigo-100 text-indigo-700' },
};

const statusOrder = ['pending', 'approved', 'confirmed', 'cancelled', 'completed'];

const fmtLongDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deletingBooking, setDeletingBooking] = useState(null);
  const [deletingContact, setDeletingContact] = useState(null);
  const [replyingContact, setReplyingContact] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingContactReply, setSendingContactReply] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminFetch('/api/stats');
        setStats(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateBookingStatus = async (id, status) => {
    setUpdatingStatus(id);
    try {
      const updated = await adminFetch(`/api/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setStats((prev) => ({ ...prev, recentBookings: prev.recentBookings.map((b) => (b._id === id ? updated : b)) }));
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking permanently?')) return;
    setDeletingBooking(id);
    try {
      await adminFetch(`/api/bookings/${id}`, { method: 'DELETE' });
      setStats((prev) => ({
        ...prev,
        recentBookings: prev.recentBookings.filter((b) => b._id !== id),
        totals: { ...prev.totals, bookings: prev.totals.bookings - 1 },
      }));
      setSelectedBooking(null);
      toast.success('Booking deleted');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingBooking(null);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    setDeletingContact(id);
    try {
      await adminFetch(`/api/contacts/${id}`, { method: 'DELETE' });
      setStats((prev) => ({
        ...prev,
        recentContacts: prev.recentContacts.filter((c) => c._id !== id),
        totals: { ...prev.totals, contacts: prev.totals.contacts - 1 },
      }));
      setSelectedContact(null);
      toast.success('Message deleted');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingContact(null);
    }
  };

  const handleContactReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Write a reply message first');
      return;
    }
    setSendingContactReply(true);
    try {
      const res = await adminFetch(`/api/contacts/${selectedContact}/reply`, {
        method: 'POST',
        body: JSON.stringify({ subject: replySubject, message: replyMessage }),
      });
      const contact = res.data || res;
      setStats((prev) => ({ ...prev, recentContacts: prev.recentContacts.map((c) => (c._id === contact._id ? contact : c)) }));
      toast.success(res.message || 'Reply sent');
      setReplyingContact(false);
      setReplyMessage('');
      setReplySubject('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSendingContactReply(false);
    }
  };

  const activeBooking = selectedBooking ? stats.recentBookings.find((b) => b._id === selectedBooking) : null;
  const activeContact = selectedContact ? stats.recentContacts.find((c) => c._id === selectedContact) : null;

  const statCards = stats
    ? [
        { label: 'Total Bookings', value: stats.totals.bookings, icon: <FiCalendar size={16} />, to: '/admin/bookings' },
        { label: 'Pending / Approved', value: stats.totals.pending + stats.totals.confirmed, icon: <FiClock size={16} />, to: '/admin/bookings' },
        { label: 'Completed', value: stats.totals.completed, icon: <FiCheckCircle size={16} />, to: '/admin/bookings' },
        { label: 'Cancelled', value: stats.totals.cancelled, icon: <FiXCircle size={16} />, to: '/admin/bookings' },
        { label: 'Messages', value: stats.totals.contacts, icon: <FiInbox size={16} />, to: '/admin/contacts' },
        { label: 'Services', value: stats.totals.services, icon: <FiLayers size={16} />, to: '/admin/services' },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="group relative glass-card rounded-xl p-3 overflow-hidden hover:-translate-y-0.5 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <div className="w-6 h-6 rounded-md bg-white/60 shadow-[inset_0_1px_0_rgba(0,0,0,0.03)] border border-black/5 text-black flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all duration-300">
                {card.icon}
              </div>
              <span className="text-[0.52rem] text-gold/80 font-semibold leading-none">
                {card.label === 'Messages' ? 'Inbox' : card.label === 'Services' ? 'Catalog' : 'Live'}
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-0.5">
              <p className="font-cormorant font-bold leading-none text-[1.1rem] sm:text-[1.25rem] text-black tabular-nums">
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </p>
              {card.delta && <span className="text-[0.52rem] font-medium text-gold leading-none">{card.delta}</span>}
            </div>
            <p className="text-[0.52rem] text-gray-500 uppercase tracking-[1.3px] font-medium leading-none">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent bookings + messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <div className="glass-card rounded-2xl overflow-hidden hover:border-gold/20 transition-colors duration-300">
          <div className="px-4 py-3 border-b border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-black text-gold flex items-center justify-center shrink-0"><FiCalendar size={15} /></span>
              <div>
                <h3 className="text-[0.98rem] font-cormorant font-semibold text-black leading-tight">Recent Bookings</h3>
                <p className="text-[0.6rem] text-gray-400 uppercase tracking-[2px] leading-none mt-0.5">Overview</p>
              </div>
            </div>
            <Link to="/admin/bookings" className="flex items-center gap-1 text-[0.7rem] text-gray-500 hover:text-black font-medium hover:text-gold transition-colors">View all <FiArrowRight size={12} /></Link>
          </div>
          {stats.recentBookings.length === 0 ? (
            <p className="p-5 text-[0.8rem] text-gray-400">No bookings yet.</p>
          ) : (
            <div className="divide-y divide-black/5">
              {stats.recentBookings.slice(0, 5).map((b) => (
                <div key={b._id} onClick={() => setSelectedBooking(b._id)} className="px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-white/70 transition-colors duration-150">
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-[0.7rem] font-semibold shrink-0">
                    {(b.firstName?.[0] || '') + (b.lastName?.[0] || '')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.8rem] font-semibold text-black truncate leading-tight">{b.firstName} {b.lastName}</p>
                    <p className="text-[0.66rem] text-gray-400 truncate mt-0.5">
                      {b.service} <span className="text-gray-300">·</span> <span className="text-black/70 font-medium">{b.bookingRef || ''}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[0.58rem] text-gray-400 whitespace-nowrap">
                      {new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {b.time}
                    </span>
                    <span className={`px-2.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-wider rounded-full ${statusConfig[b.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                      {statusConfig[b.status]?.label || b.status}
                    </span>
                  </div>
                  <FiChevronRight size={15} className="text-gray-200 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent messages */}
        <div className="glass-card rounded-2xl overflow-hidden hover:border-gold/20 transition-colors duration-300">
          <div className="px-4 py-3 border-b border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-black text-gold flex items-center justify-center shrink-0"><FiInbox size={15} /></span>
              <div>
                <h3 className="text-[0.98rem] font-cormorant font-semibold text-black leading-tight">Recent Messages</h3>
                <p className="text-[0.6rem] text-gray-400 uppercase tracking-[2px] leading-none mt-0.5">Inbox</p>
              </div>
            </div>
            <Link to="/admin/contacts" className="flex items-center gap-1 text-[0.7rem] text-gray-500 hover:text-black font-medium hover:text-gold transition-colors">View all <FiArrowRight size={12} /></Link>
          </div>
          {stats.recentContacts.length === 0 ? (
            <p className="p-5 text-[0.8rem] text-gray-400">No messages yet.</p>
          ) : (
            <div className="divide-y divide-black/5">
              {stats.recentContacts.slice(0, 5).map((c) => (
                <div key={c._id} onClick={() => setSelectedContact(c._id)} className="px-4 py-2.5 flex items-start gap-3 cursor-pointer hover:bg-white/70 transition-colors duration-150">
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-[0.7rem] font-semibold shrink-0">
                    {(c.name?.[0] || '?').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[0.8rem] font-medium text-black truncate">{c.name} {c.phone && <span className="text-gray-400 font-normal text-[0.66rem]">({c.phone})</span>}</p>
                      <p className="text-[0.62rem] text-gray-400 shrink-0">{new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <p className="text-[0.72rem] text-black font-semibold truncate mt-0.5">{c.subject}</p>
                    <p className="text-[0.7rem] text-gray-500 truncate mt-0.5">{c.message}</p>
                  </div>
                  <FiChevronRight size={15} className="text-gray-200 shrink-0 mt-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking detail modal */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full sm:max-w-[440px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-fade-in-up">
            <div className="relative bg-gray-950 text-white px-4 py-3 shrink-0">
              <button onClick={() => setSelectedBooking(null)} className="absolute top-2.5 right-2.5 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer z-10" aria-label="Close">
                <FiX size={19} />
              </button>
              <div className="relative flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white text-[0.95rem] font-cormorant font-bold shrink-0">
                  {`${activeBooking.firstName || ''} ${activeBooking.lastName || ''}`.trim().charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 pr-7">
                  <h3 className="text-[1rem] font-cormorant font-semibold leading-tight truncate">{activeBooking.firstName} {activeBooking.lastName}</h3>
                  <div className="flex items-center gap-1.5 text-[0.58rem] text-gray-400 mt-0.5">
                    <span className="text-gray-300">{activeBooking.bookingRef}</span>
                    <span className="text-gray-600">·</span>
                    <span className={`px-1.5 py-px text-[0.55rem] font-semibold uppercase tracking-wider rounded-full ${statusConfig[activeBooking.status]?.color || 'bg-gray-100'}`}>
                      {statusConfig[activeBooking.status]?.label || activeBooking.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mb-3">
                <InfoTile icon={<FiUser size={13} />} label="Client" value={`${activeBooking.firstName} ${activeBooking.lastName}`} />
                <InfoTile icon={<FiMail size={13} />} label="Email" value={activeBooking.email} href={`mailto:${activeBooking.email}`} />
                <InfoTile icon={<FiPhone size={13} />} label="Phone" value={activeBooking.phone} href={`tel:${activeBooking.phone}`} />
                <InfoTile icon={<FiCalendar size={13} />} label="Date" value={fmtLongDate(activeBooking.date)} />
                <InfoTile icon={<FiClock size={13} />} label="Time" value={activeBooking.time} />
                <InfoTile icon={<FiCalendar size={13} />} label="Service" value={activeBooking.service} />
              </div>
              {activeBooking.message && (
                <div className="mb-3">
                  <p className="text-[0.58rem] uppercase tracking-[1.5px] text-gray-400 mb-1 flex items-center gap-1.5"><FiMessageSquare size={11} /> Notes</p>
                  <div className="glass-input border border-black/10 rounded-lg px-3 py-2 bg-white/70"><p className="text-[0.78rem] text-gray-700 leading-snug whitespace-pre-wrap">{activeBooking.message}</p></div>
                </div>
              )}
              <div className="flex items-center justify-between gap-2 flex-wrap border-t border-black/5 pt-3">
                <div className="flex flex-wrap gap-1.5">
                  {statusOrder.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateBookingStatus(activeBooking._id, s)}
                      disabled={updatingStatus === activeBooking._id}
                      className={`px-2.5 py-1 rounded-md text-[0.6rem] font-semibold uppercase tracking-[1px] border transition-all duration-200 cursor-pointer disabled:opacity-60 ${
                        activeBooking.status === s ? `${statusConfig[s].color} border-black/10` : 'bg-white text-gray-500 border-gray-200 hover:border-black/30 hover:text-black'
                      }`}
                    >
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => deleteBooking(activeBooking._id)}
                  disabled={deletingBooking === activeBooking._id}
                  className="flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-lg text-[0.66rem] font-semibold uppercase tracking-[1px] text-red-500 border border-red-200 hover:bg-red-50 cursor-pointer disabled:opacity-50 transition-all bg-white"
                >
                  <FiTrash2 size={12} /> {deletingBooking === activeBooking._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact detail modal */}
      {activeContact && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedContact(null)} />
          <div className="relative w-full sm:max-w-[440px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-fade-in-up">
            <div className="relative bg-gray-950 text-white px-4 py-3 shrink-0">
              <button onClick={() => setSelectedContact(null)} className="absolute top-2.5 right-2.5 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer z-10" aria-label="Close">
                <FiX size={19} />
              </button>
              <div className="relative flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white text-[0.95rem] font-cormorant font-bold shrink-0">
                  {(activeContact.name || '?').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 pr-7">
                  <h3 className="text-[1rem] font-cormorant font-semibold leading-tight truncate">{activeContact.name}</h3>
                  <div className="flex items-center gap-1.5 text-[0.58rem] text-gray-400 mt-0.5">
                    <span className="text-gray-300">{activeContact.email}</span>
                    {activeContact.subject && <><span className="text-gray-600">·</span><span className="text-gold font-medium">{activeContact.subject}</span></>}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mb-3">
                <InfoTile icon={<FiUser size={13} />} label="Name" value={activeContact.name} />
                <InfoTile icon={<FiMail size={13} />} label="Email" value={activeContact.email} href={`mailto:${activeContact.email}`} />
                {activeContact.phone && <InfoTile icon={<FiPhone size={13} />} label="Phone" value={activeContact.phone} href={`tel:${activeContact.phone}`} />}
                <InfoTile icon={<FiCalendar size={13} />} label="Received" value={activeContact.createdAt ? new Date(activeContact.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''} />
              </div>
              <div className="mb-3">
                <p className="text-[0.58rem] uppercase tracking-[1.5px] text-gray-400 mb-1 flex items-center gap-1.5"><FiMessageSquare size={11} /> Message</p>
                <div className="glass-input border border-black/10 rounded-lg px-3 py-2 bg-white/70"><p className="text-[0.8rem] text-gray-700 leading-relaxed whitespace-pre-wrap">{activeContact.message}</p></div>
              </div>
              {Array.isArray(activeContact.replies) && activeContact.replies.length > 0 && (
                <div className="mb-3">
                  <p className="text-[0.58rem] uppercase tracking-[1.5px] text-gray-400 mb-1 flex items-center gap-1.5">
                    <FiCheckCircle size={11} /> Replies {activeContact.replied ? <FiCheck size={11} className="text-gold" /> : null}
                  </p>
                  <div className="space-y-2">
                    {activeContact.replies.map((r, idx) => (
                      <div key={idx} className="glass-input border border-black/10 rounded-lg px-3 py-2 bg-gold/[0.04]">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[0.7rem] text-black font-medium">{r.subject}</p>
                          <span className="text-[0.58rem] text-gray-400">{r.sentAt ? new Date(r.sentAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : ''}</span>
                        </div>
                        <p className="text-[0.78rem] text-gray-700 leading-relaxed whitespace-pre-wrap">{r.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t border-black/5 pt-3">
                {replyingContact ? (
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[0.58rem] uppercase tracking-[1.5px] text-gray-400 mb-1 block">Subject</label>
                      <input
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        placeholder={`Re: ${activeContact.subject || 'your message'}`}
                        className="w-full px-3 py-2 glass-input border border-black/10 text-[0.8rem] text-black outline-none rounded-lg placeholder:text-gray-400 focus:border-gold/50"
                      />
                    </div>
                    <div>
                      <label className="text-[0.58rem] uppercase tracking-[1.5px] text-gray-400 mb-1 block">Reply Message</label>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows="4"
                        placeholder={`Write your reply to ${activeContact.name}...`}
                        className="w-full px-3 py-2 glass-input border border-black/10 text-[0.8rem] text-black outline-none rounded-lg placeholder:text-gray-400 focus:border-gold/50 resize-y"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <button
                        onClick={handleContactReply}
                        disabled={sendingContactReply}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black text-white text-[0.68rem] font-semibold uppercase tracking-[1px] hover:bg-gold cursor-pointer disabled:opacity-50 transition-all duration-300 border-none"
                      >
                        <FiSend size={13} /> {sendingContactReply ? 'Sending...' : 'Send Reply'}
                      </button>
                      <button
                        onClick={() => setReplyingContact(false)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-[0.68rem] font-semibold uppercase tracking-[1px] text-gray-600 hover:text-black hover:border-black/30 cursor-pointer transition-all"
                      >
                        <FiX size={13} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        setReplySubject('');
                        setReplyMessage('');
                        setReplyingContact(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-black text-white text-[0.68rem] font-semibold uppercase tracking-[1px] hover:bg-gold cursor-pointer transition-all duration-300 border-none"
                    >
                      <FiSend size={12} /> Reply
                    </button>
                    <button
                      onClick={() => deleteContact(activeContact._id)}
                      disabled={deletingContact === activeContact._id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[0.66rem] font-semibold uppercase tracking-[1px] text-red-500 border border-red-200 hover:bg-red-50 cursor-pointer disabled:opacity-50 transition-all bg-white"
                    >
                      <FiTrash2 size={12} /> {deletingContact === activeContact._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoTile = ({ icon, label, value, href }) => (
  <div className="flex items-center gap-2.5 border-b border-black/5 py-1.5">
    <span className="text-gray-400 shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[0.55rem] uppercase tracking-[1px] text-gray-400">{label}</p>
      {href ? (
        <a href={href} className="text-[0.78rem] text-black font-medium hover:text-gold break-all">{value}</a>
      ) : (
        <p className="text-[0.78rem] text-black font-medium break-words">{value}</p>
      )}
    </div>
  </div>
);

export default Dashboard;
