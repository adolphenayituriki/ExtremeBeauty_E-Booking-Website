import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiArrowRight, FiArrowLeft, FiLoader, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AdminAuthContext';

const AdminLogin = () => {
  const { requestOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('creds'); // 'creds' | 'otp'
  const [email, setEmail] = useState('www.nayituriki.com@gmail.com');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const codeRef = useRef(null);
  const digitRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (step === 'otp' && digitRefs[0].current) {
      setTimeout(() => digitRefs[0].current?.focus(), 100);
    }
  }, [step]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const sendCode = () => {
    if (!email.trim()) { toast.warning('Enter your email'); return; }
    if (!password) { toast.warning('Enter your password'); return; }
    setLoading(true);
    requestOtp(email.trim(), password)
      .then(() => { setCode(''); setStep('otp'); setCountdown(180); toast.success('Code sent to your email'); })
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  };

  const handleVerify = async (value) => {
    const val = (value || code).trim();
    if (!val) { toast.warning('Enter the code'); return; }
    setLoading(true);
    try {
      await verifyOtp(email.trim(), val);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({
    icon, type, value, onChange, showToggle, onToggle, show,
    placeholder, autoComplete, inputRef, onPaste, onInput, maxLength, inputMode,
  }) => {
    const filled = String(value || '').length > 0;
    return (
      <div className="relative h-14">
        {/* Leading icon */}
        <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${filled ? 'text-gold' : 'text-gray-500'}`}>
          {icon}
        </span>

        {/* Trailing toggle */}
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gold cursor-pointer bg-transparent border-none transition-colors"
            aria-label="Toggle"
          >
            {show ? <FiEyeOff size={17} /> : <FiEye size={17} />}
          </button>
        )}

        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onPaste={onPaste}
          onInput={onInput}
          maxLength={maxLength}
          inputMode={inputMode}
          className="peer h-full w-full bg-transparent text-white outline-none"
          style={{ padding: '20px 40px 6px 44px' }}
        />

        {/* Floating label */}
        <label
          className={`absolute left-11 pointer-events-none transition-all duration-200 peer-focus:top-1.5 peer-focus:text-[0.6rem] peer-focus:uppercase peer-focus:tracking-[1.5px] peer-focus:text-gold ${
            filled ? 'top-1.5 text-[0.6rem] uppercase tracking-[1.5px] text-gold' : 'top-1/2 -translate-y-1/2 text-[0.85rem] text-gray-500'
          }`}
        >
          {placeholder}
        </label>
      </div>
    );
  };

  const buttonBase =
    "w-full relative overflow-hidden rounded-xl border-none cursor-pointer transition-all duration-300 group";

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.12)_0%,transparent_60%)]" />

      <div className="relative z-10 w-full max-w-[380px] animate-fade-in-up">
        <div className="relative">
          <div className="absolute -inset-[2px] rounded-[26px] bg-gradient-to-r from-gold/50 via-gold-light to-gold/50 opacity-70 blur-[1px] hidden sm:block" />

          <div className="relative bg-[#0d0b09] rounded-3xl p-5 sm:p-7 shadow-[0_40px_90px_rgba(0,0,0,0.6)]">
            {step === 'creds' ? (
              <form onSubmit={(e) => { e.preventDefault(); sendCode(); }}>
                <h2 className="text-[1.25rem] sm:text-[1.3rem] font-cormorant font-semibold text-white mb-1">Secure Sign In</h2>
                <p className="text-gray-500 text-[0.75rem] mb-5 sm:mb-6">Two-factor verification</p>

                <div className="space-y-4">
                  <div className="group bg-white/[0.04] border border-white/10 rounded-2xl transition-all duration-200 focus-within:border-gold/50 focus-within:bg-white/[0.06]">
                    <Field
                      icon={<FiMail size={16} />}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      autoComplete="email"
                    />
                  </div>

                  <div className="group bg-white/[0.04] border border-white/10 rounded-2xl transition-all duration-200 focus-within:border-gold/50 focus-within:bg-white/[0.06]">
                    <Field
                      icon={<FiLock size={16} />}
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      autoComplete="current-password"
                      showToggle
                      show={showPass}
                      onToggle={() => setShowPass(!showPass)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`${buttonBase} mt-5 sm:mt-6 bg-gradient-to-r from-gold via-gold-light to-gold text-black py-3 text-[0.76rem] font-bold uppercase tracking-[2px] hover:shadow-[0_10px_30px_rgba(184,149,106,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-11`}
                >
                  {loading ? <FiLoader size={16} className="animate-spin" /> : <><span>Send Code</span> <FiArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
                <h2 className="text-[1.25rem] sm:text-[1.3rem] font-cormorant font-semibold text-white mb-1">Enter Code</h2>
                <p className="text-gray-500 text-[0.75rem] mb-2 break-words">Sent to <span className="text-gold">{email}</span></p>

                <div className="flex items-center gap-2 mb-5">
                  <span className="flex items-center gap-1 text-[0.64rem] font-medium text-emerald-400">
                    <FiCheck size={12} /> Verified
                  </span>
                  <span className="w-px h-3 bg-white/15" />
                  <span className="text-[0.64rem] font-medium text-gray-500">6-digit code</span>
                </div>

                <div className="bg-white/[0.04] border border-white/10 rounded-2xl transition-all duration-200 focus-within:border-gold/50 focus-within:bg-white/[0.06] p-4">
                    <label
                      htmlFor="otp-input"
                      className="block pb-2 text-[0.6rem] uppercase tracking-[1.5px] text-gold pointer-events-none"
                    >
                      Verification code
                    </label>
                    <div className="flex items-center justify-between gap-2" id="otp-input">
                      {[0,1,2,3,4,5].map((i) => (
                        <input
                          key={i}
                          ref={digitRefs[i]}
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          value={code[i] || ''}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length === 2) {
                              const next = code.slice(0, i) + val[0] + val[1];
                              const v = next.slice(0, 6);
                              setCode(v);
                              if (v.length === 6) handleVerify(v);
                              else if (i + 2 < 6) digitRefs[i + 2].current?.focus();
                            } else if (val.length === 1) {
                              const v = code.slice(0, i) + val + code.slice(i + 1);
                              setCode(v);
                              if (i + 1 < 6) digitRefs[i + 1].current?.focus();
                            } else {
                              const v = code.slice(0, i) + code.slice(i + 1);
                              setCode(v);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !code[i] && i > 0) {
                              const v = code.slice(0, i - 1) + code.slice(i + 1);
                              setCode(v);
                              digitRefs[i - 1].current?.focus();
                            }
                            if (e.key === 'ArrowLeft' && i > 0) {
                              e.preventDefault();
                              digitRefs[i - 1].current?.focus();
                            }
                            if (e.key === 'ArrowRight' && i < 5) {
                              e.preventDefault();
                              digitRefs[i + 1].current?.focus();
                            }
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const v = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
                            setCode(v);
                            if (v.length === 6) {
                              handleVerify(v);
                            } else {
                              const idx = Math.min(v.length, 5);
                              digitRefs[idx].current?.focus();
                            }
                          }}
                          className="w-[46px] h-[52px] bg-white/[0.06] border border-white/15 rounded-xl text-center text-white text-[1.2rem] font-mono outline-none focus:border-gold/60 focus:bg-white/[0.08] transition-all duration-200 caret-transparent"
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>
                  </div>

                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className={`${buttonBase} mt-6 bg-gradient-to-r from-gold via-gold-light to-gold text-black py-3 text-[0.76rem] font-bold uppercase tracking-[2px] hover:shadow-[0_10px_30px_rgba(184,149,106,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {loading ? <FiLoader size={16} className="animate-spin" /> : <><span>Verify</span> <FiArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" /></>}
                </button>

                <div className="flex items-center justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => { setStep('creds'); setCode(''); }}
                    className="flex items-center gap-1 text-gray-400 hover:text-gold cursor-pointer bg-transparent border-none text-[0.7rem] font-medium transition-colors"
                  >
                    <FiArrowLeft size={13} /> Back
                  </button>
                  <button
                    type="button"
                    disabled={countdown > 0 || loading}
                    onClick={() => { setCode(''); sendCode(); }}
                    className="text-[0.7rem] text-gray-400 hover:text-gold cursor-pointer bg-transparent border-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[0.72rem] text-gray-500 hover:text-gold transition-colors">
            <FiArrowLeft size={13} /> Back to website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
