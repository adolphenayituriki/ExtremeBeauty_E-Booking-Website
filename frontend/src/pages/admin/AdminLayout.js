import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiGrid, FiCalendar, FiInbox, FiLayers, FiFileText, FiLogOut, FiUsers,
  FiMenu, FiX, FiExternalLink, FiBell, FiCheckCircle, FiArrowRight, FiClock, FiLock, FiLoader,
} from 'react-icons/fi';
import { useAuth } from '../../context/AdminAuthContext';
import { adminFetch } from '../../utils/adminApi';
import { SITE_URL } from '../../utils/apiConfig';

const SEEN_KEY = 'eb_admin_last_seen';

const fmtTime = (d) => {
  if (!d) return '';
  const date = new Date(d);
  const now = new Date();
  const diffMs = now - date;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

const BASE_NAV = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid size={17} />, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: <FiCalendar size={17} /> },
  { to: '/admin/contacts', label: 'Messages', icon: <FiInbox size={17} /> },
  { to: '/admin/services', label: 'Services & Prices', icon: <FiLayers size={17} /> },
  { to: '/admin/content', label: 'Site Content', icon: <FiFileText size={17} /> },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const isOwner = admin?.role === 'superadmin';
  const NAV = isOwner
    ? [...BASE_NAV, { to: '/admin/admins', label: 'Team', icon: <FiUsers size={17} /> }]
    : BASE_NAV;
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const [showPw, setShowPw] = useState(false);
  const [pwStep, setPwStep] = useState(1);
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwOtp, setPwOtp] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const lastSeen = () => {
    const v = localStorage.getItem(SEEN_KEY);
    return v ? new Date(parseInt(v, 10)) : new Date(0);
  };

  const unreadCount = notifs.filter((n) => new Date(n.createdAt) > lastSeen()).length;

  const loadNotifications = async () => {
    try {
      const data = await adminFetch('/api/admin/notifications');
      setNotifs(data.recent || []);
    } catch (error) {
      /* bell is non-critical; ignore errors silently */
    }
  };

  useEffect(() => {
    loadNotifications();
    const id = setInterval(loadNotifications, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const markAllRead = () => {
    localStorage.setItem(SEEN_KEY, String(Date.now()));
    setNotifOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out');
    navigate('/admin/login');
  };

  const requestPasswordOtp = async () => {
    if (!pwCurrent.trim()) { toast.error('Enter your current password'); return; }
    setPwLoading(true);
    try {
      await adminFetch('/api/admin/change-password/request', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: pwCurrent }),
      });
      toast.success('Verification code sent to your email');
      setPwStep(2);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPwLoading(false);
    }
  };

  const confirmPasswordChange = async () => {
    if (!pwOtp.trim() || !pwNew.trim()) { toast.error('Enter the code and your new password'); return; }
    if (pwNew.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    setPwLoading(true);
    try {
      const res = await adminFetch('/api/admin/change-password/confirm', {
        method: 'POST',
        body: JSON.stringify({ code: pwOtp, newPassword: pwNew }),
      });
      if (res.token) localStorage.setItem('eb_admin_token', res.token);
      toast.success('Password changed successfully');
      setShowPw(false); setPwStep(1); setPwCurrent(''); setPwOtp(''); setPwNew('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPwLoading(false);
    }
  };

  const openPw = () => { setShowPw(true); setPwStep(1); setPwCurrent(''); setPwOtp(''); setPwNew(''); };

  const current = NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)));

  const left = current?.to?.replace('/admin', '')?.replace('/', '');
  const eyebrow = left ? `Admin · ${current.label}` : 'Admin Panel';

  const linkClass = ({ isActive }) =>
    `relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.82rem] font-medium transition-all duration-200 ${
      isActive
        ? 'bg-white/10 text-white'
        : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'
    }`;

  return (
    <div className="min-h-screen bg-[#faf8f6] flex">
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-[205px] bg-gray-950 text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand top */}
        <div className="px-6 pt-6 pb-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center justify-center flex-1">
              <div className="w-[140px] h-[46px] flex items-center justify-center overflow-hidden">
                <img src="/logo/removebg-preview.png" alt="Extreme Beauty" className="w-full h-full object-contain scale-[4] brightness-0 invert transition-all duration-300 hover:scale-[4.2] mt-6" />
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white bg-transparent border-none cursor-pointer shrink-0">
              <FiX size={20} />
            </button>
          </div>
          <p className="mt-3 text-[0.58rem] text-white uppercase tracking-[3px] pl-1 text-center">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto pt-6">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={() => setSidebarOpen(false)}>
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-gold" />}
                  <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white font-semibold text-[0.78rem]">
              {(admin?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[0.78rem] font-medium truncate">{admin?.name || 'Admin'}</p>
              <p className="text-[0.6rem] text-gray-400 truncate">{admin?.role || 'Administrator'}</p>
            </div>
          </div>
          <button
            onClick={openPw}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.72rem] font-semibold uppercase tracking-[1.5px] border border-gold/25 text-gold hover:text-black hover:bg-gold cursor-pointer transition-all duration-200 bg-transparent mb-2"
          >
            <FiLock size={14} /> Change Password
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.72rem] font-semibold uppercase tracking-[1.5px] border border-white/10 text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/10 cursor-pointer transition-all duration-200 bg-transparent"
          >
            <FiLogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Page header band (modern: gold accent + soft glow + icon title) */}
        <header className="sticky top-0 z-20 relative bg-gray-950 text-white border-b border-white/10">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,149,106,0.14)_0%,transparent_55%)] pointer-events-none" />
            <div className="absolute -bottom-14 -right-10 w-52 h-52 rounded-full bg-gold/[0.06] blur-2xl pointer-events-none" />
          </div>
          <div className="relative z-10 flex items-center justify-between gap-4 px-5 lg:px-8 py-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-300 hover:text-white bg-transparent border-none cursor-pointer shrink-0">
                <FiMenu size={22} />
              </button>
              <div className="min-w-0">
                <p className="text-[0.5rem] tracking-[3px] uppercase text-gold font-medium mb-0.5">{eyebrow}</p>
                <h1 className="flex items-center gap-2 text-[1.05rem] font-cormorant font-semibold text-white leading-none">
                  <span className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-gold shrink-0">
                    {current?.icon}
                  </span>
                  <span className="truncate">{current?.label || 'Admin'}</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-300 hover:text-gold hover:bg-white/10 border border-white/15 bg-white/[0.06] cursor-pointer transition-all duration-300"
                aria-label="Notifications"
              >
                <FiBell size={15} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-gold text-black text-[0.55rem] font-bold flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="fixed md:absolute left-2 right-2 top-[4.25rem] md:left-auto md:right-0 md:top-11 z-50 w-auto md:w-[360px] max-h-[min(70vh,calc(100vh-5.5rem))] md:max-h-[min(520px,calc(100vh-4rem))] bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden text-black animate-fade-in-up flex flex-col">
                  <div className="px-5 py-4 border-b border-black/5 flex items-center justify-between">
                    <div>
                      <p className="text-[1.05rem] font-cormorant font-semibold text-black leading-tight">Notifications</p>
                      <p className="text-[0.62rem] text-gray-400 mt-0.5">
                        {unreadCount > 0 ? `${unreadCount} new ${unreadCount === 1 ? 'update' : 'updates'}` : "You're all caught up"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="flex items-center gap-1 text-[0.62rem] font-semibold uppercase tracking-[1px] text-gold hover:underline cursor-pointer bg-transparent border-none"
                        >
                          <FiCheckCircle size={11} /> Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-black hover:bg-black/5 cursor-pointer transition-all duration-150 bg-transparent border-none"
                        aria-label="Close notifications"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                  {notifs.length === 0 ? (
                    <div className="p-12 text-center">
                      <FiBell size={26} className="mx-auto text-gray-200" strokeWidth={1.5} />
                      <p className="text-[0.8rem] text-gray-400 mt-3">No new activity yet.</p>
                    </div>
                  ) : (
                    <div className="flex-1 min-h-0 overflow-y-auto py-1.5">
                      {notifs.slice(0, 12).map((n) => {
                        const isNew = new Date(n.createdAt) > lastSeen();
                        const to = n.kind === 'booking' ? '/admin/bookings' : '/admin/contacts';
                        return (
                          <Link
                            key={`${n.kind}-${n.id}`}
                            to={to}
                            onClick={() => setNotifOpen(false)}
                            className={`group relative flex items-start gap-3.5 px-5 py-3 transition-all duration-150 cursor-pointer ${isNew ? '' : 'opacity-60 hover:opacity-100'}`}
                          >
                            {isNew && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r bg-gold" />}
                            {n.kind === 'booking'
                              ? <FiCalendar size={17} className="text-black group-hover:text-gold mt-0.5 shrink-0 transition-colors duration-150" strokeWidth={1.5} />
                              : <FiInbox size={17} className="text-black group-hover:text-gold mt-0.5 shrink-0 transition-colors duration-150" strokeWidth={1.5} />}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[0.8rem] font-medium text-black truncate leading-tight">{n.title}</p>
                                {isNew && <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />}
                              </div>
                              <p className="text-[0.68rem] text-gray-500 truncate mt-1">
                                {n.kind === 'booking' ? 'New booking' : 'New message'}{n.subtitle ? ` · ${n.subtitle}` : ''}
                              </p>
                              <p className="text-[0.62rem] text-gray-400 mt-0.5 flex items-center gap-1">
                                <FiClock size={10} /> {fmtTime(n.createdAt)}
                              </p>
                            </div>
                            <FiArrowRight size={13} className="text-gray-300 group-hover:text-gold mt-1.5 shrink-0 transition-colors duration-150" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                  <Link
                    to="/admin"
                    onClick={() => setNotifOpen(false)}
                    className="block text-center py-3 text-[0.64rem] font-semibold uppercase tracking-[1.5px] text-gray-500 hover:text-gold bg-black/[0.02] border-t border-black/5 cursor-pointer transition-colors duration-200"
                  >
                    View Dashboard
                  </Link>
                </div>
              )}
            </div>
            <a
              href={`${SITE_URL}/`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.68rem] font-semibold uppercase tracking-[1.5px] text-white bg-white/[0.06] border border-white/15 backdrop-blur-sm hover:bg-gold hover:text-black hover:border-gold cursor-pointer transition-all duration-300 whitespace-nowrap"
            >
              <FiExternalLink size={12} /> View Site
            </a>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-7">
          <Outlet />
        </main>
      </div>

      {/* Change Password modal */}
      {showPw && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPw(false)} />
          <div className="relative w-full sm:max-w-[400px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="bg-gray-950 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><FiLock size={15} /></span>
                <h3 className="text-[1rem] font-cormorant font-semibold">Change Password</h3>
              </div>
              <button onClick={() => setShowPw(false)} className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer" aria-label="Close"><FiX size={19} /></button>
            </div>
            <div className="px-5 py-4">
              {pwStep === 1 ? (
                <div className="space-y-3.5">
                  <p className="text-[0.78rem] text-gray-500">Enter your current password to receive a verification code.</p>
                  <div>
                    <label className="text-[0.6rem] uppercase tracking-[1.5px] text-gray-400 mb-1 block font-medium">Current Password</label>
                    <input type="password" value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)} placeholder="Enter current password" className="w-full px-3 py-2.5 glass-input border border-black/10 text-[0.82rem] text-black outline-none rounded-lg placeholder:text-gray-400 focus:border-gold/50" />
                  </div>
                  <button onClick={requestPasswordOtp} disabled={pwLoading} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-black text-white text-[0.72rem] font-semibold uppercase tracking-[1.5px] hover:bg-gold cursor-pointer disabled:opacity-50 transition-all duration-300 border-none">
                    {pwLoading ? <><FiLoader size={14} className="animate-spin" /> Sending...</> : <>Send Verification Code <FiArrowRight size={13} /></>}
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <p className="text-[0.78rem] text-gray-500">Enter the 6-digit code sent to your email and your new password.</p>
                  <div>
                    <label className="text-[0.6rem] uppercase tracking-[1.5px] text-gray-400 mb-1 block font-medium">Verification Code</label>
                    <input type="text" value={pwOtp} onChange={(e) => setPwOtp(e.target.value)} placeholder="000000" maxLength={6} className="w-full px-3 py-2.5 glass-input border border-black/10 text-[0.82rem] text-black outline-none rounded-lg placeholder:text-gray-400 focus:border-gold/50 text-center tracking-[6px] font-mono" />
                  </div>
                  <div>
                    <label className="text-[0.6rem] uppercase tracking-[1.5px] text-gray-400 mb-1 block font-medium">New Password</label>
                    <input type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} placeholder="Min. 6 characters" className="w-full px-3 py-2.5 glass-input border border-black/10 text-[0.82rem] text-black outline-none rounded-lg placeholder:text-gray-400 focus:border-gold/50" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setPwStep(1)} className="flex-1 py-2.5 rounded-lg border border-gray-200 bg-white text-[0.72rem] font-semibold uppercase tracking-[1px] text-gray-600 hover:text-black hover:border-black/30 cursor-pointer transition-all">Back</button>
                    <button onClick={confirmPasswordChange} disabled={pwLoading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-black text-white text-[0.72rem] font-semibold uppercase tracking-[1.5px] hover:bg-gold cursor-pointer disabled:opacity-50 transition-all duration-300 border-none">
                      {pwLoading ? <><FiLoader size={14} className="animate-spin" /> Saving...</> : <>Change Password <FiCheckCircle size={13} /></>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
