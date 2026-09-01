import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FiUserPlus, FiShield, FiTrash2, FiRefreshCw, FiX, FiEdit2, FiCheckCircle,
  FiActivity, FiUsers, FiMail, FiPhone, FiClock,
} from 'react-icons/fi';
import { adminFetch } from '../../utils/adminApi';
import { useAuth } from '../../context/AdminAuthContext';

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never');
const fmtTime = (d) => (d ? new Date(d).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '');

const actionColor = {
  created: 'bg-emerald-100 text-emerald-700',
  updated: 'bg-amber-100 text-amber-700',
  deleted: 'bg-red-100 text-red-700',
  replied: 'bg-gold/15 text-gold',
};

const entityLabel = {
  Manager: 'Manager',
  Message: 'Message',
  Service: 'Service',
  Content: 'Content',
  Booking: 'Booking',
};

const AdminsAdmin = () => {
  const { admin: me } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { mode: 'add' } | { mode: 'edit', admin }
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [view, setView] = useState('team'); // 'team' | 'activity'
  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminFetch('/api/admin/admins');
      setAdmins(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadActivity = async () => {
    setActivityLoading(true);
    try {
      const data = await adminFetch('/api/admin/audit');
      setActivity(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (view === 'activity') loadActivity();
  }, [view]);

  const openAdd = () => {
    setForm({ name: '', email: '', password: '' });
    setModal({ mode: 'add' });
  };

  const openEdit = (adm) => {
    setForm({ name: adm.name, email: adm.email, password: '' });
    setModal({ mode: 'edit', admin: adm });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    if (modal.mode === 'add' && !form.password) {
      toast.error('A password is required');
      return;
    }
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        await adminFetch('/api/admin/admins', {
          method: 'POST',
          body: JSON.stringify(form),
        });
        toast.success('Manager added — invitation email sent');
      } else {
        const payload = { name: form.name, email: form.email };
        if (form.password) payload.password = form.password;
        await adminFetch(`/api/admin/admins/${modal.admin._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        toast.success('Manager updated');
      }
      setModal(null);
      load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (adm) => {
    if (!window.confirm(`Remove ${adm.name} as a manager? They will lose access to the dashboard.`)) return;
    setDeletingId(adm._id);
    try {
      await adminFetch(`/api/admin/admins/${adm._id}`, { method: 'DELETE' });
      setAdmins((prev) => prev.filter((a) => a._id !== adm._id));
      toast.success('Manager removed');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toolbar / intro */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-3 md:items-center justify-between hover:border-gold/20">
        <div>
          <p className="text-[0.6rem] tracking-[3px] uppercase text-gold font-medium">Team Access</p>
          <h3 className="text-[1rem] font-cormorant font-semibold text-black leading-tight mt-0.5">
            Manage Managers
          </h3>
          <p className="text-[0.72rem] text-gray-500 mt-1">
            Managers get the same dashboard access as you, but they cannot add or remove other team members.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[0.75rem] font-semibold uppercase tracking-[1px] text-gray-600 hover:text-gold hover:border-gold/40 hover:bg-gold/5 cursor-pointer transition-all duration-300"
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-[0.75rem] font-semibold uppercase tracking-[1px] hover:bg-gold cursor-pointer transition-all duration-300 border-none"
          >
            <FiUserPlus size={14} /> Add Manager
          </button>
        </div>
      </div>

      {/* View toggle */}
      <div className="glass-card rounded-2xl p-1.5 flex gap-1 w-fit">
        {[
          { key: 'team', label: 'Team', icon: <FiUsers size={14} /> },
          { key: 'activity', label: 'Activity Log', icon: <FiActivity size={14} /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setView(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[0.72rem] font-semibold uppercase tracking-[1px] transition-all duration-200 cursor-pointer ${
              view === t.key ? 'bg-black text-white' : 'text-gray-500 hover:text-black bg-transparent border-none'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {view === 'team' ? (
        <>
      {loading && !admins.length ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gold rounded-full animate-spin" />
        </div>
      ) : admins.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <p className="text-[0.9rem] text-gray-400">No team members yet.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 bg-black/[0.02]">
                  <th className="px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold">Member</th>
                  <th className="hidden md:table-cell px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold">Role</th>
                  <th className="hidden sm:table-cell px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold">Last Login</th>
                  <th className="w-24 px-3 py-2.5 text-right text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => {
                  const isOwner = a.role === 'superadmin';
                  const isMe = a._id === me?._id;
                  return (
                    <tr key={a._id} className="border-b border-black/5 last:border-b-0 hover:bg-white/70 transition-colors duration-150">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-[0.72rem] shrink-0 ${isOwner ? 'bg-gold' : 'bg-black'}`}>
                            {(a.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[0.8rem] font-medium text-black truncate leading-tight flex items-center gap-1.5">
                              {a.name} {isMe && <span className="text-[0.58rem] text-gray-400 font-normal">(you)</span>}
                            </p>
                            <p className="text-[0.62rem] text-gray-500 truncate">{a.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-semibold uppercase tracking-wider ${isOwner ? 'bg-gold/15 text-gold' : 'bg-black/5 text-gray-600'}`}>
                          {isOwner && <FiShield size={10} />} {isOwner ? 'Owner' : 'Manager'}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-2.5">
                        <p className="text-[0.76rem] text-gray-600">{a.lastLogin ? fmtDate(a.lastLogin) : 'Never'}</p>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        {!isOwner ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEdit(a)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 border border-gray-200 hover:text-black hover:border-black/30 cursor-pointer transition-all bg-white"
                              aria-label="Edit"
                            >
                              <FiEdit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(a)}
                              disabled={deletingId === a._id}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 border border-red-200 hover:bg-red-50 cursor-pointer transition-all bg-white disabled:opacity-50"
                              aria-label="Remove"
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[0.6rem] text-gray-400"><FiCheckCircle size={12} /> Protected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative w-full sm:max-w-[420px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-fade-in-up">
            <div className="relative bg-gray-950 text-white px-4 py-3.5 shrink-0">
              <button onClick={() => setModal(null)} className="absolute top-2.5 right-2.5 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer z-10" aria-label="Close">
                <FiX size={19} />
              </button>
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-gold shrink-0">
                  {modal.mode === 'add' ? <FiUserPlus size={15} /> : <FiEdit2 size={15} />}
                </span>
                <div>
                  <h3 className="text-[1rem] font-cormorant font-semibold leading-tight">
                    {modal.mode === 'add' ? 'Add Manager' : `Edit ${modal.admin.name}`}
                  </h3>
                  <p className="text-[0.6rem] text-gray-400 mt-0.5">{modal.mode === 'add' ? 'Give a team member dashboard access' : 'Update manager details or password'}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
              <div>
                <label className="text-[0.6rem] font-semibold uppercase tracking-[1.2px] text-gray-500 mb-1.5 block">Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Alice Manager"
                  className="w-full px-3 py-2 glass-input border border-black/10 text-[0.82rem] text-black outline-none rounded-lg placeholder:text-gray-400 focus:border-gold/50"
                />
              </div>
              <div>
                <label className="text-[0.6rem] font-semibold uppercase tracking-[1.2px] text-gray-500 mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="manager@email.com"
                  className="w-full px-3 py-2 glass-input border border-black/10 text-[0.82rem] text-black outline-none rounded-lg placeholder:text-gray-400 focus:border-gold/50"
                />
              </div>
              <div>
                <label className="text-[0.6rem] font-semibold uppercase tracking-[1.2px] text-gray-500 mb-1.5 block">
                  {modal.mode === 'add' ? 'Temporary Password' : 'New Password (optional)'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={modal.mode === 'add' ? 'At least 6 characters' : 'Leave blank to keep current'}
                  className="w-full px-3 py-2 glass-input border border-black/10 text-[0.82rem] text-black outline-none rounded-lg placeholder:text-gray-400 focus:border-gold/50"
                />
                {modal.mode === 'add' && (
                  <p className="text-[0.62rem] text-gray-400 mt-1.5">Their sign-in details (email + password) will be emailed to the manager automatically. They'll also receive an OTP code on login.</p>
                )}
              </div>
            </div>
            <div className="px-4 py-3 border-t border-black/5 flex justify-end gap-2">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-[0.72rem] font-semibold uppercase tracking-[1px] text-gray-600 hover:text-black hover:border-black/30 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-black text-white text-[0.72rem] font-semibold uppercase tracking-[1px] rounded-lg hover:bg-gold cursor-pointer disabled:opacity-50 transition-all duration-300 border-none"
              >
                {saving ? 'Saving...' : modal.mode === 'add' ? 'Add Manager' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/5">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-black text-gold flex items-center justify-center shrink-0"><FiActivity size={15} /></span>
              <div>
                <h3 className="text-[0.95rem] font-cormorant font-semibold text-black leading-tight">Activity Log</h3>
                <p className="text-[0.6rem] text-gray-400 uppercase tracking-[2px] leading-none mt-0.5">Who changed what</p>
              </div>
            </div>
            <button
              onClick={loadActivity}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-[0.7rem] font-semibold uppercase tracking-[1px] text-gray-600 hover:text-gold hover:border-gold/40 hover:bg-gold/5 cursor-pointer transition-all duration-300"
            >
              <FiRefreshCw size={13} className={activityLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
          {activityLoading && !activity.length ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gold rounded-full animate-spin" />
            </div>
          ) : activity.length === 0 ? (
            <div className="p-14 text-center">
              <p className="text-[0.85rem] text-gray-400">No activity recorded yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5 max-h-[560px] overflow-y-auto">
              {activity.map((log) => (
                <div key={log._id} className="px-4 py-3 flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[0.62rem] font-semibold uppercase shrink-0 ${actionColor[log.action] || 'bg-black/5 text-gray-500'}`}>
                    {log.action}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.8rem] text-black leading-snug">
                      <span className="font-semibold">{log.adminName || 'System'}</span>{' '}
                      <span className="text-gray-500">{log.action} {entityLabel[log.entity] || log.entity}</span>
                      {log.details?.name || log.details?.bookingRef || log.details?.subject || log.details?.email ? (
                        <span className="text-gray-500"> — <span className="text-gold font-medium">{log.details.name || log.details.bookingRef || log.details.subject || log.details.email}</span></span>
                      ) : null}
                      {log.details?.status && <span className="text-gray-400"> · status → <span className="text-black/70">{log.details.status}</span></span>}
                    </p>
                    <p className="text-[0.62rem] text-gray-400 mt-0.5 flex items-center gap-1.5">
                      <FiClock size={10} /> {fmtTime(log.createdAt)}
                      {log.adminEmail && <span>· {log.adminEmail}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminsAdmin;
