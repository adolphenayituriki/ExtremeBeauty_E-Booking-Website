import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiShare2, FiLink, FiCheck } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { SITE_URL, SITE_NAME } from '../utils/seoData';

const MENU_WIDTH = 210;

const ShareButton = ({
  path,
  title,
  text,
  label = 'Share',
  iconOnly = false,
  className = '',
  buttonClassName = 'border-white/20 text-white hover:border-gold hover:text-gold hover:bg-gold/5',
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const url = path
    ? `${SITE_URL}${path}`
    : (typeof window !== 'undefined' ? window.location.href : SITE_URL);
  const shareText = text || (title ? `${title} | ${SITE_NAME}` : SITE_NAME);

  const positionMenu = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    let left = rect.right - MENU_WIDTH;
    if (left < 8) left = 8;
    const maxLeft = window.innerWidth - MENU_WIDTH - 8;
    if (left > maxLeft) left = maxLeft;
    setCoords({ top: rect.bottom + 8, left });
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (e) => {
      if (
        (btnRef.current && btnRef.current.contains(e.target)) ||
        (menuRef.current && menuRef.current.contains(e.target))
      ) {
        return;
      }
      setOpen(false);
    };
    const handleReposition = () => positionMenu();

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [open, positionMenu]);

  const handleTrigger = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: shareText, text: shareText, url });
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }
    positionMenu();
    setOpen((prev) => !prev);
  };

  const copyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1600);
    } catch (error) {
      setOpen(false);
    }
  };

  const encUrl = encodeURIComponent(url);
  const encText = encodeURIComponent(shareText);

  const options = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encText}%20${encUrl}`, icon: <FaWhatsapp size={16} />, color: '#25D366' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`, icon: <FaFacebookF size={14} />, color: '#1877F2' },
    { label: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${encText}&url=${encUrl}`, icon: <FaTwitter size={14} />, color: '#000000' },
  ];

  return (
    <>
      <button
        type="button"
        ref={btnRef}
        onClick={handleTrigger}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Share this service"
        className={
          iconOnly
            ? `inline-flex items-center justify-center w-11 h-11 rounded-xl border cursor-pointer bg-transparent transition-all duration-300 ${buttonClassName}`
            : `inline-flex items-center gap-2 px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[1.5px] rounded-xl border cursor-pointer bg-transparent transition-all duration-300 ${buttonClassName}`
        }
      >
        <FiShare2 size={iconOnly ? 15 : 14} /> {!iconOnly && label}
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: 'fixed', top: coords.top, left: coords.left, width: MENU_WIDTH }}
            className="z-[120] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-black/5 p-2 animate-fade-in"
          >
            <p className="px-3 pt-1.5 pb-2 text-[0.6rem] font-semibold uppercase tracking-[1.5px] text-gray-400">
              Share this service
            </p>
            {options.map((o) => (
              <a
                key={o.label}
                href={o.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[0.78rem] font-medium text-gray-700 no-underline transition-colors duration-200 hover:bg-gray-50"
              >
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-white shrink-0"
                  style={{ background: o.color }}
                >
                  {o.icon}
                </span>
                {o.label}
              </a>
            ))}
            <button
              type="button"
              onClick={copyLink}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[0.78rem] font-medium text-gray-700 cursor-pointer bg-transparent border-none transition-colors duration-200 hover:bg-gray-50"
            >
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${copied ? 'bg-gold text-black' : 'bg-gray-900 text-white'}`}
              >
                {copied ? <FiCheck size={14} /> : <FiLink size={14} />}
              </span>
              {copied ? 'Link copied!' : 'Copy link'}
            </button>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ShareButton;
