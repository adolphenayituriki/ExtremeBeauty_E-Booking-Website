import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Receipt = ({ booking }) => {
  const receiptRef = useRef(null);

  const dateStr = new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const createdStr = new Date(booking.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
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

  const statusColor = {
    approved: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
    confirmed: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
    pending: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
    cancelled: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    completed: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  }[booking.status] || { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={receiptRef}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#ffffff',
          fontFamily: "'Inter', sans-serif",
          padding: '0',
          borderRadius: '16px',
          border: '1px solid #e5e5e5',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Gold top bar */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #b8956a, #d4b896, #b8956a)' }} />

        {/* Header */}
        <div style={{ padding: '24px 20px 20px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <img
            src="/logo/Logo-White-BG.jpg"
            alt="Extreme Beauty"
            style={{ height: '36px', margin: '0 auto 16px', objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <div>
              <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px', color: '#999', margin: '0 0 4px' }}>Receipt No.</p>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#111', margin: 0, fontFamily: "'Montserrat', sans-serif", letterSpacing: '1px' }}>{receiptId}</p>
            </div>
            <div style={{
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              background: statusColor.bg,
              color: statusColor.text,
              border: `1px solid ${statusColor.border}`,
            }}>
              {booking.status === 'approved' ? 'Approved' : booking.status === 'confirmed' ? 'Confirmed' : booking.status === 'cancelled' ? 'Cancelled' : booking.status === 'completed' ? 'Completed' : 'Approved'}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>

          {/* Client */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#b8956a' }} />
              <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2.5px', color: '#b8956a', margin: 0, fontWeight: 700 }}>Client Information</p>
            </div>
            <div style={{ background: '#fafafa', borderRadius: '12px', padding: '16px 18px', border: '1px solid #f0f0f0' }}>
              {[
                { label: 'Full Name', value: `${booking.firstName} ${booking.lastName}` },
                { label: 'Email', value: booking.email },
                { label: 'Phone', value: booking.phone },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none' }}>
                  <span style={{ fontSize: '11px', color: '#999' }}>{item.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#b8956a' }} />
              <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2.5px', color: '#b8956a', margin: 0, fontWeight: 700 }}>Service Details</p>
            </div>
            <div style={{ background: '#fafafa', borderRadius: '12px', padding: '16px 18px', border: '1px solid #f0f0f0' }}>
              {[
                { label: 'Service', value: booking.service },
                { label: 'Date', value: dateStr },
                { label: 'Time', value: booking.time },
                ...(booking.message ? [{ label: 'Notes', value: booking.message }] : []),
              ].map((item, i, arr) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <span style={{ fontSize: '11px', color: '#999' }}>{item.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#111', textAlign: 'right', maxWidth: '60%' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#b8956a' }} />
              <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2.5px', color: '#b8956a', margin: 0, fontWeight: 700 }}>Location</p>
            </div>
            <div style={{ background: '#fafafa', borderRadius: '12px', padding: '16px 18px', border: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: '12px', color: '#333', margin: '0 0 2px', fontWeight: 500 }}>105 KG 9th Ave, Nyarutarama</p>
              <p style={{ fontSize: '12px', color: '#333', margin: '0 0 8px', fontWeight: 500 }}>Kigali, Rwanda</p>
              <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>+250 785 069 349 / +250 787 035 643</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 20px', background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <p style={{ fontSize: '10px', color: '#999', margin: 0 }}>Booked on {createdStr}</p>
            <p style={{ fontSize: '10px', color: '#b8956a', margin: 0, fontWeight: 500 }}>
              https://extreme-beauty.vercel.app/tracking
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 0 0', borderTop: '1px solid #e8e8e8' }}>
            <p style={{ fontSize: '12px', color: '#666', margin: 0, fontStyle: 'italic' }}>
              Thank you for choosing Extreme Beauty!
            </p>
          </div>
        </div>

        {/* Gold bottom bar */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #b8956a, #d4b896, #b8956a)' }} />
      </div>

      {/* Download buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-[480px]">
        <button onClick={downloadPDF} className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3.5 text-[0.75rem] font-semibold uppercase tracking-[2px] rounded-xl border-none cursor-pointer transition-all duration-300 hover:bg-gold">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Download PDF
        </button>
        <button onClick={downloadImage} className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3.5 text-[0.75rem] font-semibold uppercase tracking-[2px] border border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          Download Image
        </button>
      </div>
    </div>
  );
};

export default Receipt;
