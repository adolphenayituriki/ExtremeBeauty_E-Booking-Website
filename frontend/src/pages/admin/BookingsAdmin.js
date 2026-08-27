import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FiSearch, FiUser, FiCalendar, FiClock, FiMail, FiPhone, FiTrash2, FiChevronDown,
  FiChevronRight, FiRefreshCw, FiLoader, FiDownload, FiX, FiMessageSquare,
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
const fmtShortDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '';

const BookingsAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await adminFetch('/api/bookings');
      setBookings(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setSavingId(id);
    try {
      const updated = await adminFetch(`/api/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setBookings((prev) => prev.map((b) => (b._id === id ? updated : b)));
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSavingId(null);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking permanently?')) return;
    const wasSelected = selected === id;
    setDeletingId(id);
    try {
      await adminFetch(`/api/bookings/${id}`, { method: 'DELETE' });
      setBookings((prev) => prev.filter((b) => b._id !== id));
      if (wasSelected) setSelected(null);
      toast.success('Booking deleted');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      (b.bookingRef || '').toLowerCase().includes(term) ||
      `${b.firstName} ${b.lastName}`.toLowerCase().includes(term) ||
      (b.email || '').toLowerCase().includes(term) ||
      (b.phone || '').includes(term) ||
      (b.service || '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCount = (s) => (s === 'all' ? bookings.length : bookings.filter((b) => b.status === s).length);

  const esc = (value) => {
    const s = value === null || value === undefined ? '' : String(value);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const fmtCSVDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB') : '');
  const fmtCSVDateTime = (d) => (d ? new Date(d).toLocaleString('en-GB') : '');

  const exportCSV = () => {
    const rows = filtered.map((b) => [
      esc(b.bookingRef || ''),
      esc(`${b.firstName || ''} ${b.lastName || ''}`.trim()),
      esc(b.email || ''),
      esc(b.phone || ''),
      esc(b.service || ''),
      esc(fmtCSVDate(b.date)),
      esc(b.time || ''),
      esc((statusConfig[b.status]?.label || b.status || '').toLowerCase()),
      esc(fmtCSVDateTime(b.createdAt)),
      esc(b.message || ''),
    ]);
    const header = ['Booking Ref', 'Name', 'Email', 'Phone', 'Service', 'Date', 'Time', 'Status', 'Created At', 'Notes'].map(esc);
    const csv = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const stamp = new Date().toISOString().slice(0, 10);
    link.download = `bookings-${statusFilter === 'all' ? 'all' : statusFilter}-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filtered.length} booking${filtered.length === 1 ? '' : 's'}`);
  };

  const active = selected ? bookings.find((b) => b._id === selected) : null;
  const activeStatus = active ? active.status : null;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-3 md:items-center hover:border-gold/20">
        <div className="flex items-center flex-1 glass-input border border-black/10 rounded-xl overflow-hidden">
          <FiSearch size={15} className="ml-3.5 text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ref, email, phone, service..."
            className="flex-1 px-3 py-2.5 text-[0.82rem] bg-transparent border-none outline-none text-black"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none glass-input border border-black/10 rounded-xl px-3.5 py-2.5 pr-10 text-[0.82rem] text-black outline-none cursor-pointer"
          >
            <option value="all">All Statuses ({statusCount('all')})</option>
            {statusOrder.map((s) => (
              <option key={s} value={s}>{statusConfig[s].label} ({statusCount(s)})</option>
            ))}
          </select>
          <FiChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadBookings}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[0.75rem] font-semibold uppercase tracking-[1px] text-gray-600 hover:text-gold hover:border-gold/40 hover:bg-gold/5 cursor-pointer transition-all duration-300"
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            title="Download the currently filtered list as CSV"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-[0.75rem] font-semibold uppercase tracking-[1px] hover:bg-gold cursor-pointer transition-all duration-300 border-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiDownload size={14} /> Download
          </button>
        </div>
      </div>

      {loading && !bookings.length ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gold rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary chips */}
          <div className="flex flex-wrap gap-2">
            {statusOrder.map((s) => (
              <span key={s} className={`px-3 py-1 rounded-full text-[0.64rem] font-semibold uppercase tracking-wider ${statusConfig[s].color}`}>
                {statusConfig[s].label} <span className="opacity-70">· {statusCount(s)}</span>
              </span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <p className="text-[0.9rem] text-gray-400">No bookings match your filters.</p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  {/* Header */}
                  <thead>
                    <tr className="border-b border-black/10 bg-black/[0.02]">
                      <th className="px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold">Booker</th>
                      <th className="hidden md:table-cell px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold">Service</th>
                      <th className="px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold">Date &amp; Time</th>
                      <th className="px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold text-right">Status</th>
                      <th className="w-10 px-3 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b) => (
                      <tr
                        key={b._id}
                        onClick={() => setSelected(b._id)}
                        className="border-b border-black/5 last:border-b-0 hover:bg-white/70 transition-colors duration-150 cursor-pointer"
                      >
                        {/* Booker */}
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/60 font-semibold text-[0.72rem] shrink-0">
                              {`${b.firstName || ''} ${b.lastName || ''}`.trim().charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[0.8rem] font-medium text-black truncate leading-tight">{b.firstName} {b.lastName}</p>
                              <p className="text-[0.62rem] text-gray-500 truncate">
                                <span className="text-gray-600 font-medium">{b.bookingRef}</span>
                                {b.email ? <> · {b.email}</> : null}
                              </p>
                            </div>
                          </div>
                        </td>
                        {/* Service */}
                        <td className="hidden md:table-cell px-4 py-2.5">
                          <p className="text-[0.76rem] text-gray-600 truncate max-w-[180px]">{b.service}</p>
                        </td>
                        {/* Date & Time */}
                        <td className="px-4 py-2.5">
                          <p className="text-[0.76rem] text-gray-600 font-medium whitespace-nowrap">{fmtShortDate(b.date)}</p>
                          <p className="text-[0.62rem] text-gray-400">{b.time}</p>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-2.5 text-right">
                          <select
                            value={b.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateStatus(b._id, e.target.value)}
                            disabled={savingId === b._id}
                            className={`appearance-none px-2 py-1 pr-6 text-[0.6rem] font-semibold uppercase tracking-wider rounded-full border-none outline-none cursor-pointer ${statusConfig[b.status]?.color || 'bg-gray-100'}`}
                          >
                            {statusOrder.map((s) => (
                              <option key={s} value={s}>{statusConfig[s].label}</option>
                            ))}
                          </select>
                        </td>
                        {/* Chevron */}
                        <td className="px-3 py-2.5 text-right">
                          <FiChevronRight size={15} className="text-gray-300 inline-block" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modern detail modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />

          <div className="relative w-full sm:max-w-[440px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-fade-in-up">
            {/* Compact header */}
            <div className="relative bg-gray-950 text-white px-4 py-3 shrink-0">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2.5 right-2.5 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer z-10"
                aria-label="Close"
              >
                <FiX size={19} />
              </button>
              <div className="relative flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white text-[0.95rem] font-cormorant font-bold shrink-0">
                  {`${active.firstName || ''} ${active.lastName || ''}`.trim().charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 pr-7">
                  <h3 className="text-[1rem] font-cormorant font-semibold leading-tight truncate">{active.firstName} {active.lastName}</h3>
                  <div className="flex items-center gap-1.5 text-[0.58rem] text-gray-400 mt-0.5">
                    <span className="text-gray-300">{active.bookingRef}</span>
                    <span className="text-gray-600">·</span>
                    <span className={`px-1.5 py-px text-[0.55rem] font-semibold uppercase tracking-wider rounded-full ${statusConfig[active.status]?.color || 'bg-gray-100'}`}>
                      {statusConfig[active.status]?.label || active.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {/* Info: compact 2-col rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mb-3">
                <InfoTile icon={<FiUser size={13} />} label="Client" value={`${active.firstName} ${active.lastName}`} />
                <InfoTile icon={<FiMail size={13} />} label="Email" value={active.email} href={`mailto:${active.email}`} />
                <InfoTile icon={<FiPhone size={13} />} label="Phone" value={active.phone} href={`tel:${active.phone}`} />
                <InfoTile icon={<FiCalendar size={13} />} label="Date" value={fmtLongDate(active.date)} />
                <InfoTile icon={<FiClock size={13} />} label="Time" value={active.time} />
                <InfoTile icon={<FiCalendar size={13} />} label="Service" value={active.service} />
              </div>

              {/* Notes */}
              {active.message && (
                <div className="mb-3">
                  <p className="text-[0.58rem] uppercase tracking-[1.5px] text-gray-400 mb-1 flex items-center gap-1.5">
                    <FiMessageSquare size={11} /> Notes
                  </p>
                  <div className="glass-input border border-black/10 rounded-lg px-3 py-2 bg-white/70">
                    <p className="text-[0.78rem] text-gray-700 leading-snug whitespace-pre-wrap">{active.message}</p>
                  </div>
                </div>
              )}

              {/* Status + Delete on one row */}
              <div className="flex items-center justify-between gap-2 border-t border-black/5 pt-3">
                <div className="flex flex-wrap gap-1.5">
                  {statusOrder.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(active._id, s)}
                      disabled={savingId === active._id}
                      className={`px-2.5 py-1 rounded-md text-[0.6rem] font-semibold uppercase tracking-[1px] border transition-all duration-200 cursor-pointer disabled:opacity-60 ${
                        activeStatus === s
                          ? `${statusConfig[s].color} border-black/10`
                          : 'bg-white text-gray-500 border-gray-200 hover:border-black/30 hover:text-black'
                      }`}
                    >
                      {savingId === active._id && activeStatus !== s ? null : statusConfig[s].label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => deleteBooking(active._id)}
                  disabled={deletingId === active._id}
                  className="flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-lg text-[0.66rem] font-semibold uppercase tracking-[1px] text-red-500 border border-red-200 hover:bg-red-50 cursor-pointer disabled:opacity-50 transition-all bg-white"
                >
                  <FiTrash2 size={12} /> {deletingId === active._id ? 'Deleting...' : 'Delete'}
                </button>
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

export default BookingsAdmin;
