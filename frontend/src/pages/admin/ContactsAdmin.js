import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FiMail, FiPhone, FiTrash2, FiRefreshCw, FiCalendar, FiChevronRight,
  FiDownload, FiX, FiUser, FiMessageSquare, FiSend, FiCheckCircle, FiCheck,
} from 'react-icons/fi';
import { adminFetch } from '../../utils/adminApi';

const fmtShort = (d) => (d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '');

const ContactsAdmin = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [replying, setReplying] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => { loadContacts(); }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await adminFetch('/api/contacts');
      setContacts(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    const wasSelected = selected === id;
    setDeletingId(id);
    try {
      await adminFetch(`/api/contacts/${id}`, { method: 'DELETE' });
      setContacts((prev) => prev.filter((c) => c._id !== id));
      if (wasSelected) setSelected(null);
      toast.success('Message deleted');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Write a reply message first');
      return;
    }
    setSendingReply(true);
    try {
      const res = await adminFetch(`/api/contacts/${selected}/reply`, {
        method: 'POST',
        body: JSON.stringify({ subject: replySubject, message: replyMessage }),
      });
      const contact = res.data || res;
      setContacts((prev) => prev.map((c) => (c._id === contact._id ? contact : c)));
      toast.success(res.message || 'Reply sent');
      setReplying(false);
      setReplyMessage('');
      setReplySubject('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSendingReply(false);
    }
  };

  const filtered = contacts.filter((c) => {
    const term = search.trim().toLowerCase();
    return (
      !term ||
      (c.name || '').toLowerCase().includes(term) ||
      (c.email || '').toLowerCase().includes(term) ||
      (c.subject || '').toLowerCase().includes(term) ||
      (c.message || '').toLowerCase().includes(term) ||
      (c.phone || '').includes(term)
    );
  });

  const esc = (value) => {
    const s = value === null || value === undefined ? '' : String(value);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const exportCSV = () => {
    const rows = filtered.map((c) => [
      esc(c.name || ''),
      esc(c.email || ''),
      esc(c.phone || ''),
      esc(c.subject || ''),
      esc(new Date(c.createdAt).toLocaleString('en-GB')),
      esc(c.message || ''),
    ]);
    const header = ['Name', 'Email', 'Phone', 'Subject', 'Received At', 'Message'];
    const csv = '\uFEFF' + [header.map(esc).join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `messages-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filtered.length} message${filtered.length === 1 ? '' : 's'}`);
  };

  const active = selected ? contacts.find((c) => c._id === selected) : null;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-3 md:items-center hover:border-gold/20">
        <div className="flex items-center flex-1 glass-input border border-black/10 rounded-xl overflow-hidden">
          <FiMail size={15} className="ml-3.5 text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, subject, message..."
            className="flex-1 px-3 py-2.5 text-[0.82rem] bg-transparent border-none outline-none text-black"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadContacts}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[0.75rem] font-semibold uppercase tracking-[1px] text-gray-600 hover:text-gold hover:border-gold/40 hover:bg-gold/5 cursor-pointer transition-all duration-300"
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-[0.75rem] font-semibold uppercase tracking-[1px] hover:bg-gold cursor-pointer transition-all duration-300 border-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiDownload size={14} /> Download
          </button>
        </div>
      </div>

      {loading && !contacts.length ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gold rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <p className="text-[0.9rem] text-gray-400">{contacts.length === 0 ? 'No messages yet.' : 'No messages match your search.'}</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 bg-black/[0.02]">
                  <th className="px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold">Sender</th>
                  <th className="hidden md:table-cell px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold">Subject</th>
                  <th className="px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold">Received</th>
                  <th className="w-10 px-3 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c._id}
                    onClick={() => setSelected(c._id)}
                    className="border-b border-black/5 last:border-b-0 hover:bg-white/70 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/60 font-semibold text-[0.72rem] shrink-0">
                          {(c.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[0.8rem] font-medium text-black truncate leading-tight flex items-center gap-1.5">
                            {c.name}
                            {c.replied && <FiCheck size={12} className="text-gold shrink-0" />}
                          </p>
                          <p className="text-[0.62rem] text-gray-500 truncate">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 py-2.5">
                      <p className="text-[0.76rem] text-gray-600 truncate max-w-[220px]">{c.subject}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="text-[0.76rem] text-gray-600 whitespace-nowrap">{fmtShort(c.createdAt)}</p>
                    </td>
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

      {/* Detail modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />

          <div className="relative w-full sm:max-w-[440px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-fade-in-up">
            {/* Header */}
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
                  {(active.name || '?').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 pr-7">
                  <h3 className="text-[1rem] font-cormorant font-semibold leading-tight truncate">{active.name}</h3>
                  <div className="flex items-center gap-1.5 text-[0.58rem] text-gray-400 mt-0.5">
                    <span className="text-gray-300">{active.email}</span>
                    {active.subject && <><span className="text-gray-600">·</span><span className="text-gold font-medium">{active.subject}</span></>}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mb-3">
                <InfoTile icon={<FiUser size={13} />} label="Name" value={active.name} />
                <InfoTile icon={<FiMail size={13} />} label="Email" value={active.email} href={`mailto:${active.email}`} />
                {active.phone && <InfoTile icon={<FiPhone size={13} />} label="Phone" value={active.phone} href={`tel:${active.phone}`} />}
                <InfoTile icon={<FiCalendar size={13} />} label="Received" value={active.createdAt ? new Date(active.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''} />
              </div>

              {active.subject && (
                <div className="mb-3">
                  <p className="text-[0.58rem] uppercase tracking-[1.5px] text-gray-400 mb-1 flex items-center gap-1.5">
                    <FiMessageSquare size={11} /> Subject
                  </p>
                  <div className="glass-input border border-black/10 rounded-lg px-3 py-2 bg-white/70">
                    <p className="text-[0.85rem] text-black font-medium">{active.subject}</p>
                  </div>
                </div>
              )}

              <div className="mb-3">
                <p className="text-[0.58rem] uppercase tracking-[1.5px] text-gray-400 mb-1 flex items-center gap-1.5">
                  <FiMessageSquare size={11} /> Message
                </p>
                <div className="glass-input border border-black/10 rounded-lg px-3 py-2 bg-white/70">
                  <p className="text-[0.8rem] text-gray-700 leading-relaxed whitespace-pre-wrap">{active.message}</p>
                </div>
              </div>

              {Array.isArray(active.replies) && active.replies.length > 0 && (
                <div className="mb-3">
                  <p className="text-[0.58rem] uppercase tracking-[1.5px] text-gray-400 mb-1 flex items-center gap-1.5">
                    <FiCheckCircle size={11} /> Replies {active.replied ? <FiCheck size={11} className="text-gold" /> : null}
                  </p>
                  <div className="space-y-2">
                    {active.replies.map((r, idx) => (
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
                {replying ? (
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[0.58rem] uppercase tracking-[1.5px] text-gray-400 mb-1 block">Subject</label>
                      <input
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        placeholder={`Re: ${active.subject || 'your message'}`}
                        className="w-full px-3 py-2 glass-input border border-black/10 text-[0.8rem] text-black outline-none rounded-lg placeholder:text-gray-400 focus:border-gold/50"
                      />
                    </div>
                    <div>
                      <label className="text-[0.58rem] uppercase tracking-[1.5px] text-gray-400 mb-1 block">Reply Message</label>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows="4"
                        placeholder={`Write your reply to ${active.name}...`}
                        className="w-full px-3 py-2 glass-input border border-black/10 text-[0.8rem] text-black outline-none rounded-lg placeholder:text-gray-400 focus:border-gold/50 resize-y"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <button
                        onClick={handleReply}
                        disabled={sendingReply}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black text-white text-[0.68rem] font-semibold uppercase tracking-[1px] hover:bg-gold cursor-pointer disabled:opacity-50 transition-all duration-300 border-none"
                      >
                        <FiSend size={13} /> {sendingReply ? 'Sending...' : 'Send Reply'}
                      </button>
                      <button
                        onClick={() => setReplying(false)}
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
                        setReplying(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-black text-white text-[0.68rem] font-semibold uppercase tracking-[1px] hover:bg-gold cursor-pointer transition-all duration-300 border-none"
                    >
                      <FiSend size={12} /> Reply
                    </button>
                    <button
                      onClick={() => deleteContact(active._id)}
                      disabled={deletingId === active._id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[0.66rem] font-semibold uppercase tracking-[1px] text-red-500 border border-red-200 hover:bg-red-50 cursor-pointer disabled:opacity-50 transition-all bg-white"
                    >
                      <FiTrash2 size={12} /> {deletingId === active._id ? 'Deleting...' : 'Delete'}
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

export default ContactsAdmin;
