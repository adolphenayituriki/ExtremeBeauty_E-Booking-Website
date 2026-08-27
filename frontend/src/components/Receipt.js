import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Receipt = ({ booking }) => {
  const receiptRef = useRef(null);

  const dateStr = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const createdStr = new Date(booking.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  const receiptId = booking.bookingRef || 'EB-000000';

  const downloadImage = async () => {
    const el = receiptRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const link = document.createElement('a');
    link.download = `ExtremeBeauty-Receipt-${receiptId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadPDF = async () => {
    const el = receiptRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ExtremeBeauty-Receipt-${receiptId}.pdf`);
  };

  const row = (label, value, last = false) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 0',
      borderBottom: last ? 'none' : '1px solid #f0f0f0',
    }}>
      <span style={{ fontSize: '10px', color: '#999' }}>{label}</span>
      <span style={{ fontSize: '11px', fontWeight: 600, color: '#111', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <div
        ref={receiptRef}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#ffffff',
          fontFamily: "'Inter', sans-serif",
          borderRadius: '14px',
          border: '1px solid #e5e5e5',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Gold top bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #b8956a, #d4b896, #b8956a)' }} />

        {/* Header */}
        <div style={{ padding: '18px 20px 14px', textAlign: 'center', borderBottom: '1.5px dashed #e8e8e8' }}>
          <img
            src="/logo/Logo-White-BG.jpg"
            alt="Extreme Beauty"
            style={{ height: '30px', margin: '0 auto 8px', objectFit: 'contain' }}
          />
          <p style={{ fontSize: '9px', color: '#bbb', margin: 0, letterSpacing: '0.5px' }}>
            105 KG 9th Ave, Nyarutarama, Kigali
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '14px' }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#bbb', margin: '0 0 3px' }}>Receipt No.</p>
              <p style={{ fontSize: '16px', fontWeight: 800, color: '#111', margin: 0, fontFamily: "'Montserrat', sans-serif", letterSpacing: '2px' }}>
                {receiptId}
              </p>
            </div>
            <div style={{
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '8px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              background: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0',
            }}>
              Approved
            </div>
          </div>
        </div>

        {/* Body — single compact card */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{ background: '#fafafa', borderRadius: '10px', padding: '12px 16px', border: '1px solid #f0f0f0' }}>
            {row('Service', booking.service)}
            {row('Date', dateStr)}
            {row('Time', booking.time)}
            {row('Client', `${booking.firstName} ${booking.lastName}`)}
            {row('Phone', booking.phone)}
            {booking.email && row('Email', booking.email)}
            {booking.message && row('Notes', booking.message, true)}
          </div>

          {/* Tracking ref */}
          <div style={{
            marginTop: '14px',
            padding: '10px 16px',
            background: '#fafafa',
            borderRadius: '10px',
            border: '1px solid #f0f0f0',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: "'Montserrat', monospace",
              fontSize: '13px',
              fontWeight: 800,
              color: '#111',
              letterSpacing: '3px',
            }}>
              {receiptId}
            </div>
            <p style={{ fontSize: '8px', color: '#bbb', margin: '4px 0 0', letterSpacing: '0.5px' }}>
              extreme-beauty.vercel.app/tracking
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 20px', background: '#fafafa', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
          <p style={{ fontSize: '9px', color: '#999', margin: '0 0 4px' }}>Booked on {createdStr}</p>
          <p style={{ fontSize: '10px', color: '#888', margin: 0, fontStyle: 'italic' }}>
            Thank you for choosing Extreme Beauty!
          </p>
        </div>

        {/* Gold bottom bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #b8956a, #d4b896, #b8956a)' }} />
      </div>

      {/* Download buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5 mt-5 w-full max-w-[340px]">
        <button onClick={downloadPDF} className="flex-1 flex items-center justify-center gap-1.5 bg-black text-white py-2 text-[0.68rem] font-semibold uppercase tracking-[1.5px] rounded-lg border-none cursor-pointer transition-all duration-300 hover:bg-gold">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Download PDF
        </button>
        <button onClick={downloadImage} className="flex-1 flex items-center justify-center gap-1.5 bg-white text-black py-2 text-[0.68rem] font-semibold uppercase tracking-[1.5px] border border-gray-200 rounded-lg cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          Download Image
        </button>
      </div>
    </div>
  );
};

export default Receipt;
