import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiArrowRight, FiHeart } from 'react-icons/fi';

const STORAGE_KEY = 'eb_new_service_notice_v1';

const NewServiceNotice = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === 'dismissed';
    } catch {
      dismissed = false;
    }
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch {
      /* ignore storage errors */
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-50 w-[calc(100%-2rem)] max-w-[330px] animate-fade-in-up">
      <div className="relative flex overflow-hidden bg-gray-950/95 backdrop-blur-md border border-gold/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45)] text-white">
        <div className="relative flex-1 min-w-0 p-3.5">
          <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[2px] text-gold mb-2">
            <FiHeart size={11} /> New Service
          </span>
          <h4 className="text-[1.05rem] font-cormorant font-semibold mb-1 leading-tight">
            Lip Blush is here
          </h4>
          <p className="text-gray-400 text-[0.72rem] leading-[1.55] mb-3">
            A luxurious semi-permanent lip enhancement for a soft, radiant finish.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/service/lipbrush"
              onClick={close}
              className="inline-flex items-center gap-1.5 bg-gold text-black px-3.5 py-2 rounded-lg text-[0.68rem] font-semibold uppercase tracking-[1.5px] hover:bg-gold-light transition-colors no-underline"
            >
              View <FiArrowRight size={12} />
            </Link>
            <button
              type="button"
              onClick={close}
              className="text-[0.7rem] text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              Maybe later
            </button>
          </div>
        </div>

        <div className="relative w-[100px] shrink-0">
          <img
            src="/images/Lipbrush.jpeg"
            alt="Lip Blush treatment at Extreme Beauty"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/40" />
          <button
            type="button"
            onClick={close}
            aria-label="Dismiss notification"
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/50 backdrop-blur text-white hover:bg-black/70 transition-colors cursor-pointer border-none"
          >
            <FiX size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewServiceNotice;
