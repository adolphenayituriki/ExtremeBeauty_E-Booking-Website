const nodemailer = require('nodemailer');

let transporter = null;

const FROM_NAME = 'Extreme Beauty (Rw KGL)';

function getFromAddress() {
  return `"${FROM_NAME}" <${process.env.SMTP_FROM || process.env.EMAIL_USER || 'info@extremebeauty.com'}>`;
}

async function sendViaBrevoApi({ to, subject, html, text, from }) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: FROM_NAME,
        email: from,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
      replyTo: {
        email: from,
      },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Brevo API error ${res.status}`);
  }
  return { delivered: true };
}

function getTransporter() {
  if (transporter) return transporter;

  const useBrevoApi = process.env.BREVO_API_KEY;
  const useResend = !useBrevoApi && process.env.RESEND_API_KEY;
  const useBrevoSmpt = !useBrevoApi && !useResend &&
    process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_PASS;
  const useGmail = !useBrevoApi && !useResend && !useBrevoSmpt &&
    process.env.EMAIL_USER && process.env.EMAIL_PASS &&
    process.env.EMAIL_USER !== 'your_email@gmail.com' &&
    process.env.EMAIL_PASS !== 'your_email_password';

  if (useBrevoApi) {
    transporter = { isBrevoApi: true };
  } else if (useResend) {
    transporter = { isResend: true, apiKey: process.env.RESEND_API_KEY };
  } else if (useBrevoSmpt) {
    transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });
  } else if (useGmail) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  } else {
    transporter = null;
  }
  return transporter;
}

const SERVICE_PRICES = {
  'Microblading Eyebrows': 'RWF 100,000',
  'Microshading Eyebrows': 'RWF 100,000',
  'Hybrid / Combination Brows': 'RWF 100,000',
  'Brows Lamination': 'RWF 30,000',
  'Lash Lift': 'RWF 30,000',
  'Classic Set': 'RWF 45,000',
  'Hybrid Set': 'RWF 50,000',
  'Volume Set': 'RWF 55,000',
  'Mega Volume Set': 'RWF 60,000',
  'Wispy Sets': 'RWF 45,000 - 60,000',
  'Lash Removal': 'RWF 5,000',
  'Eyebrows Retouch': 'RWF 60,000',
  'Training Session': 'On Request',
};

const COMPANY = {
  name: 'Extreme Beauty Lashes & Brows',
  address: '105 KG 9th Ave, Nyarutarama, Kigali, Rwanda',
  phone1: '+250 785 069 349',
  phone2: '+250 787 035 643',
  whatsappNumber: '+250 785 069 349',
  callNumber: '+250 787 035 643',
  whatsappDigits: '250785069349',
  callDigits: '250787035643',
  email: 'extremebeautyrw.com@gmail.com',
  hours: 'Mon - Sat, 9:00AM - 6:00PM',
  maps: 'https://maps.app.goo.gl/JVeG4xNRdoP4Dt4dA',
  instagram: '@extreme_beauty.rw',
};

function getTrackUrl() {
  const base = (process.env.SITE_URL || '').replace(/\/$/, '');
  return base ? `${base}/tracking` : 'https://www.extremebeautyrw.com/tracking';
}

async function sendBookingConfirmation(to, { name, service, date, time, bookingRef, phone }) {
  const t = getTransporter();
  const fromName = 'Extreme Beauty';

  if (!t) {
    console.log(`[Booking] Email not configured. Booking confirmation for ${to}: ref ${bookingRef}`);
    return { delivered: false };
  }

  const price = SERVICE_PRICES[service] || 'On Request';
  const subject = `Booking Confirmed — ${bookingRef}`;
  const html = `
    <div style="font-family:Arial, Helvetica, sans-serif; max-width:620px; margin:auto; background:#ffffff; border:1px solid #e8e1d6; border-radius:14px; overflow:hidden;">
      <div style="background:linear-gradient(135deg, #b8956a 0%, #d4af62 50%, #c9a067 100%); padding:40px 28px; text-align:center;">
        <p style="font-size:26px; letter-spacing:6px; color:#ffffff; margin:0 0 8px; font-weight:700;">EXTREME <span style="font-weight:300;">BEAUTY</span></p>
        <div style="width:44px; height:2px; background:rgba(255,255,255,0.6); margin:0 auto 10px;"></div>
        <p style="font-size:12px; letter-spacing:4px; color:rgba(255,255,255,0.9); margin:0; font-weight:600; text-transform:uppercase;">Booking Confirmation</p>
      </div>
      <div style="padding:36px 38px;">
        <div style="text-align:center; margin-bottom:28px;">
          <div style="width:64px; height:64px; background:#b8956a; border-radius:50%; margin:0 auto 16px; line-height:64px; font-size:30px; color:#ffffff;">&#10003;</div>
          <h2 style="font-size:23px; font-weight:700; color:#111111; margin:0 0 6px;">Hi ${name || 'Valued Client'},</h2>
          <p style="font-size:15px; color:#555555; line-height:1.7; margin:0;">Your appointment has been <strong style="color:#b8956a;">confirmed</strong>!<br>Here are your booking details:</p>
        </div>

        <div style="border:1px solid #f0e9dd; border-radius:12px; overflow:hidden; margin-bottom:22px;">
          <div style="background:#faf6ee; padding:14px 22px; border-bottom:1px solid #f0e9dd; text-align:center;">
            <p style="font-size:11px; letter-spacing:2px; color:#b99b55; margin:0 0 4px; font-weight:700; text-transform:uppercase;">Booking Reference</p>
            <p style="font-size:24px; font-weight:700; color:#b8956a; letter-spacing:2px; margin:0;">${bookingRef}</p>
          </div>
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:14px 22px; border-bottom:1px solid #f3ede2; font-size:13px; color:#8a8272; width:38%; font-weight:600;">Service</td>
              <td style="padding:14px 22px; border-bottom:1px solid #f3ede2; font-size:15px; color:#111111; font-weight:600;">${service}</td>
            </tr>
            <tr>
              <td style="padding:14px 22px; border-bottom:1px solid #f3ede2; font-size:13px; color:#8a8272; font-weight:600;">Price</td>
              <td style="padding:14px 22px; border-bottom:1px solid #f3ede2; font-size:16px; color:#b8956a; font-weight:700;">${price}</td>
            </tr>
            <tr>
              <td style="padding:14px 22px; border-bottom:1px solid #f3ede2; font-size:13px; color:#8a8272; font-weight:600;">Date</td>
              <td style="padding:14px 22px; border-bottom:1px solid #f3ede2; font-size:15px; color:#111111;">${date}</td>
            </tr>
            <tr>
              <td style="padding:14px 22px; border-bottom:1px solid #f3ede2; font-size:13px; color:#8a8272; font-weight:600;">Time</td>
              <td style="padding:14px 22px; border-bottom:1px solid #f3ede2; font-size:15px; color:#111111;">${time}</td>
            </tr>
            ${phone ? `<tr>
              <td style="padding:14px 22px; font-size:13px; color:#8a8272; font-weight:600;">Phone</td>
              <td style="padding:14px 22px; font-size:15px; color:#111111;">${phone}</td>
            </tr>` : ''}
          </table>
        </div>

        <p style="font-size:13px; color:#777777; line-height:1.7; margin:0 0 20px; text-align:center;">You can <strong>track your booking status</strong> anytime using your booking reference code on our website.</p>
        <div style="text-align:center; margin-bottom:26px;">
          <a href="${getTrackUrl()}" style="display:inline-block; background:linear-gradient(135deg, #b8956a 0%, #d4af62 100%); color:#ffffff; text-decoration:none; font-size:13px; letter-spacing:1px; padding:14px 36px; border-radius:40px; text-transform:uppercase; font-weight:700;">Track My Booking</a>
        </div>

        <div style="background:#faf6ee; border:1px solid #f0e9dd; border-radius:12px; padding:22px 24px; margin-bottom:26px;">
          <p style="font-size:13px; font-weight:700; color:#b8956a; text-transform:uppercase; letter-spacing:2px; margin:0 0 14px; text-align:center;">Get in Touch</p>
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:7px 0; font-size:12px; color:#8a8272; width:34%; font-weight:600;">Location</td>
              <td style="padding:7px 0; font-size:13px; color:#111111;"><a href="${COMPANY.maps}" style="color:#111111; text-decoration:underline;">${COMPANY.address}</a></td>
            </tr>
            <tr>
              <td style="padding:7px 0; font-size:12px; color:#8a8272; font-weight:600;">Contact</td>
              <td style="padding:7px 0;">
                <table style="width:100%; border-collapse:separate; border-spacing:6px 0;">
                  <tr>
                    <td style="width:50%; border:1px solid #e6dcc8; border-radius:9px; padding:10px 12px; text-align:center; background:#ffffff;">
                      <p style="margin:0 0 4px; font-size:11px; color:#8a8272; font-weight:700; letter-spacing:1px; text-transform:uppercase;">Call us</p>
                      <a href="tel:${COMPANY.callDigits}" style="font-size:13px; color:#b8956a; font-weight:700; text-decoration:none; white-space:nowrap;">${COMPANY.callNumber}</a>
                    </td>
                    <td style="width:50%; border:1px solid #67c15e; border-radius:9px; padding:10px 12px; text-align:center; background:#f0fbe9;">
                      <p style="margin:0 0 4px; font-size:11px; color:#3e8e3a; font-weight:700; letter-spacing:1px; text-transform:uppercase;">WhatsApp</p>
                      <a href="https://wa.me/${COMPANY.whatsappDigits}" style="font-size:13px; color:#128C7E; font-weight:700; text-decoration:none; white-space:nowrap;">${COMPANY.whatsappNumber}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:7px 0; font-size:12px; color:#8a8272; font-weight:600;">Email</td>
              <td style="padding:7px 0; font-size:13px; color:#111111;">${COMPANY.email}</td>
            </tr>
            <tr>
              <td style="padding:7px 0; font-size:12px; color:#8a8272; font-weight:600;">Working Hours</td>
              <td style="padding:7px 0; font-size:13px; color:#111111;">${COMPANY.hours}</td>
            </tr>
            <tr>
              <td style="padding:7px 0; font-size:12px; color:#8a8272; font-weight:600;">Instagram</td>
              <td style="padding:7px 0; font-size:13px; color:#111111;">${COMPANY.instagram}</td>
            </tr>
          </table>
        </div>

        <div style="text-align:center; padding-top:18px; border-top:1px solid #f3ede2;">
          <p style="font-size:14px; color:#333333; margin:0; font-family:Georgia, serif; font-style:italic;">We look forward to seeing you!</p>
        </div>
      </div>
      <div style="background:#111111; padding:26px 24px; text-align:center;">
        <p style="font-size:13px; color:#d4af62; margin:0 0 6px; font-weight:700; letter-spacing:2px;">${COMPANY.name}</p>
        <p style="font-size:11px; color:#9a8b6f; margin:0;">${COMPANY.address}</p>
        <p style="font-size:11px; color:#9a8b6f; margin:4px 0 0;">${COMPANY.callNumber} \u00B7 ${COMPANY.email} \u00B7 WhatsApp ${COMPANY.whatsappNumber}</p>
      </div>
    </div>
  `;
  const text = `Hi ${name || 'there'},\n\nYour booking is confirmed!\n\nRef: ${bookingRef}\nService: ${service}\nPrice: ${price}\nDate: ${date}\nTime: ${time}\n\nYou can track your booking on our website using your reference code.\n\n${COMPANY.name}\n${COMPANY.address}\nPhone: ${COMPANY.phone1} / ${COMPANY.phone2}\nEmail: ${COMPANY.email}\nHours: ${COMPANY.hours}\nCall: ${COMPANY.callNumber}\nWhatsApp: ${COMPANY.whatsappNumber}`;

  try {
    if (t.isBrevoApi) {
      await sendViaBrevoApi({
        to,
        from: process.env.SMTP_FROM || process.env.EMAIL_USER || 'info@extremebeauty.com',
        subject,
        html,
        text,
      });
    } else {
      await t.sendMail({
        from: getFromAddress(),
        to,
        subject,
        html,
        text,
        reply_to: process.env.SMTP_FROM || process.env.EMAIL_USER || undefined,
      });
    }
    return { delivered: true };
  } catch (e) {
    console.log(`[Booking] Email delivery failed for ${to}: ${e.message}`);
    return { delivered: false, error: e.message };
  }
}

async function sendBookingStatusUpdate(to, { name, bookingRef, status }) {
  const t = getTransporter();
  const fromName = 'Extreme Beauty';

  if (!t) {
    console.log(`[Booking] Email not configured. Status update for ${to}: ${status}`);
    return { delivered: false };
  }

  const statusColors = {
    approved: '#2e7d32',
    confirmed: '#b8956a',
    cancelled: '#c62828',
    completed: '#555555',
    pending: '#ef9a2a',
  };
  const color = statusColors[status] || '#b8956a';

  const subject = `Booking ${status} — ${bookingRef}`;
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  const html = `
    <div style="font-family:Arial, Helvetica, sans-serif; max-width:600px; margin:auto; background:#ffffff; border:1px solid #e8e1d6; border-radius:14px; overflow:hidden;">
      <div style="background:linear-gradient(135deg, #b8956a 0%, #d4af62 50%, #c9a067 100%); padding:32px 28px; text-align:center;">
        <p style="font-size:22px; letter-spacing:6px; color:#ffffff; margin:0 0 8px; font-weight:700;">EXTREME <span style="font-weight:300;">BEAUTY</span></p>
        <div style="width:44px; height:2px; background:rgba(255,255,255,0.6); margin:0 auto 10px;"></div>
        <p style="font-size:11px; letter-spacing:4px; color:rgba(255,255,255,0.85); margin:0; font-weight:600; text-transform:uppercase;">Booking Update</p>
      </div>
      <div style="padding:34px 36px; text-align:center;">
        <h2 style="font-size:22px; font-weight:700; color:#111111; margin:0 0 8px;">Hi ${name || 'there'},</h2>
        <p style="font-size:14px; color:#555555; line-height:1.7; margin:0 0 20px;">Your booking status has been updated.</p>
        <div style="display:inline-block; background:${color}; color:#ffffff; border-radius:30px; padding:12px 34px; font-size:16px; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:20px;">${statusLabel}</div>
        <p style="font-size:14px; color:#333333; line-height:1.7; margin:0;">Booking Reference: <strong style="color:#b8956a; letter-spacing:1px;">${bookingRef}</strong></p>
        <div style="background:#faf6ee; border:1px solid #f0e9dd; border-radius:10px; padding:18px; margin:24px 0 0;">
          <p style="font-size:13px; color:#777777; line-height:1.7; margin:0;">To view the full details or check for any further updates, please visit our website and track your booking with your reference code.</p>
        </div>
        <div style="text-align:center; margin-top:24px;">
          <a href="${getTrackUrl()}" style="display:inline-block; background:linear-gradient(135deg, #b8956a 0%, #d4af62 100%); color:#ffffff; text-decoration:none; font-size:13px; letter-spacing:1px; padding:14px 36px; border-radius:40px; text-transform:uppercase; font-weight:700;">Track Booking</a>
        </div>
        <p style="font-size:13px; color:#888888; line-height:1.7; margin:22px 0 0;">If you have any questions, please contact us. We're happy to help!</p>
      </div>
      <div style="background:#111111; padding:24px 24px; text-align:center;">
        <p style="font-size:13px; color:#d4af62; margin:0 0 4px; font-weight:700; letter-spacing:2px;">EXTREME BEAUTY LASHES &amp; BROWS</p>
        <p style="font-size:11px; color:#9a8b6f; margin:0;">105 KG 9th Ave, Nyarutarama, Kigali · +250 785 069 349</p>
      </div>
    </div>
  `;
  const text = `Hi ${name || 'there'},\n\nYour booking ${bookingRef} has been ${statusLabel.toLowerCase()}.\n\nContact us if you have any questions.`;

  try {
    if (t.isBrevoApi) {
      await sendViaBrevoApi({
        to,
        from: process.env.SMTP_FROM || process.env.EMAIL_USER || 'info@extremebeauty.com',
        subject,
        html,
        text,
      });
    } else {
      await t.sendMail({
        from: getFromAddress(),
        to,
        subject,
        html,
        text,
        reply_to: process.env.SMTP_FROM || process.env.EMAIL_USER || undefined,
      });
    }
    return { delivered: true };
  } catch (e) {
    console.log(`[Booking] Status update email failed for ${to}: ${e.message}`);
    return { delivered: false, error: e.message };
  }
}

async function sendOtpEmail(to, code) {
  const t = getTransporter();

  if (!t) {
    console.log(`[OTP] Email not configured. OTP for ${to}: ${code}`);
    return { delivered: false, code };
  }

  const subject = 'Your Extreme Beauty admin verification code';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
      <div style="text-align:center;padding-bottom:20px;border-bottom:1px solid #f0f0f0;">
        <p style="font-size:12px;letter-spacing:3px;color:#b8956a;margin:0 0 4px;">EXTREME BEAUTY</p>
        <p style="font-size:18px;font-weight:600;color:#111;margin:0;">Admin Sign-In Verification</p>
      </div>
      <div style="padding:24px 8px;text-align:center;">
        <p style="font-size:14px;color:#555;margin:0 0 16px;">Use the code below to verify your sign-in. This code expires in 3 minutes.</p>
        <div style="display:inline-block;background:#f7f5f2;border:1px dashed #b8956a;border-radius:10px;padding:14px 32px;letter-spacing:8px;font-size:28px;font-weight:700;color:#111;">${code}</div>
        <p style="font-size:12px;color:#999;margin-top:18px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
      <div style="border-top:1px solid #f0f0f0;padding-top:14px;text-align:center;">
        <p style="font-size:11px;color:#bbb;margin:0;">Extreme Beauty Lashes &amp; Brows · Nyarutarama, Kigali</p>
      </div>
    </div>
  `;

  const text = `Use code ${code} to sign in to your Extreme Beauty admin dashboard. It expires in 3 minutes. If you didn't request this, ignore this email.`;

  if (t.isBrevoApi) {
    try {
      await sendViaBrevoApi({
        to,
        from: process.env.SMTP_FROM || process.env.EMAIL_USER || 'info@extremebeauty.com',
        subject,
        html,
        text,
      });
      return { delivered: true };
    } catch (e) {
      console.log(`[OTP] Brevo delivery failed. OTP for ${to}: ${code}`);
      return { delivered: false, code };
    }
  }

  if (t.isResend) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${t.apiKey}`,
        },
        body: JSON.stringify({
          from: `"${FROM_NAME}" <${process.env.RESEND_FROM || process.env.EMAIL_USER || 'onboarding@resend.dev'}>`,
          to,
          subject,
          html,
          text,
          reply_to: process.env.EMAIL_USER || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(`[OTP] Resend delivery failed. OTP for ${to}: ${code}`);
        return { delivered: false, code };
      }
      return { delivered: true };
    } catch (e) {
      console.log(`[OTP] Resend error. OTP for ${to}: ${code}`);
      return { delivered: false, code };
    }
  }

  try {
    await t.sendMail({
      from: getFromAddress(),
      to,
      subject,
      html,
      text,
    });
    return { delivered: true };
  } catch (e) {
    console.log(`[OTP] delivery failed. OTP for ${to}: ${code}`);
    return { delivered: false, code };
  }
}

async function sendReplyEmail(to, { subject, message, originalSubject }) {
  const t = getTransporter();

  if (!t) {
    console.log(`[Reply] Email not configured. Reply for ${to}: ${message}`);
    return { delivered: false };
  }

  const safeMessage = String(message || '').replace(/\n/g, '<br/>');
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
      <div style="text-align:center;padding-bottom:18px;border-bottom:1px solid #f0f0f0;">
        <p style="font-size:12px;letter-spacing:3px;color:#b8956a;margin:0 0 4px;">EXTREME BEAUTY</p>
        <p style="font-size:18px;font-weight:600;color:#111;margin:0;">Studio Reply</p>
      </div>
      <div style="padding:22px 6px;">
        <p style="font-size:14px;color:#333;line-height:1.6;">${safeMessage}</p>
        <div style="margin-top:20px;padding:14px;background:#f7f5f2;border-left:3px solid #b8956a;border-radius:8px;font-size:12px;color:#888;line-height:1.6;">
          <p style="margin:0 0 4px;color:#555;font-weight:600;">Your original message${originalSubject ? ` — ${originalSubject}` : ''}</p>
        </div>
      </div>
      <div style="border-top:1px solid #f0f0f0;padding-top:14px;text-align:center;">
        <p style="font-size:11px;color:#bbb;margin:0;">Extreme Beauty Lashes &amp; Brows · Nyarutarama, Kigali</p>
      </div>
    </div>
  `;

  const text = message;
  const sendOptions = {
    subject: subject || 'Reply from Extreme Beauty',
    html,
    text,
    reply_to: process.env.EMAIL_USER || undefined,
  };

  if (t.isBrevoApi) {
    try {
      await sendViaBrevoApi({
        to,
        from: process.env.SMTP_FROM || process.env.EMAIL_USER || 'info@extremebeauty.com',
        subject: sendOptions.subject,
        html: sendOptions.html,
        text: sendOptions.text,
      });
      return { delivered: true };
    } catch (e) {
      console.log(`[Reply] Brevo delivery failed for ${to}: ${e.message}`);
      return { delivered: false, error: e.message };
    }
  }

  if (t.isResend) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${t.apiKey}`,
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${process.env.RESEND_FROM || process.env.EMAIL_USER || 'onboarding@resend.dev'}>`,
          to,
          ...sendOptions,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(`[Reply] Resend delivery failed for ${to}`);
        return { delivered: false, error: data.message || 'Delivery failed' };
      }
      return { delivered: true };
    } catch (e) {
      console.log(`[Reply] Resend error for ${to}`);
      return { delivered: false, error: e.message };
    }
  }

  try {
    await t.sendMail({
      from: getFromAddress(),
      to,
      subject: sendOptions.subject,
      html,
      text,
    });
    return { delivered: true };
  } catch (e) {
    console.log(`[Reply] delivery failed for ${to}: ${e.message}`);
    return { delivered: false, error: e.message };
  }
}

async function sendAdminNewBooking({ name, service, date, time, bookingRef, email, phone }) {
  const to = process.env.ADMIN_EMAIL || process.env.SMTP_FROM || process.env.EMAIL_USER;
  if (!to) {
    console.log('[Booking] No admin email configured for new-booking notification.');
    return { delivered: false };
  }
  const t = getTransporter();
  if (!t) {
    console.log('[Booking] Email not configured. Skipping admin new-booking notification.');
    return { delivered: false };
  }
  const price = SERVICE_PRICES[service] || 'On Request';
  const subject = `New Booking Received — ${bookingRef}`;
  const html = `
    <div style="font-family:Arial, Helvetica, sans-serif; max-width:600px; margin:auto; background:#ffffff; border:1px solid #e8e1d6; border-radius:14px; overflow:hidden;">
      <div style="background:linear-gradient(135deg, #b8956a 0%, #d4af62 50%, #c9a067 100%); padding:30px 28px; text-align:center;">
        <p style="font-size:21px; letter-spacing:5px; color:#ffffff; margin:0 0 8px; font-weight:700;">EXTREME <span style="font-weight:300;">BEAUTY</span></p>
        <div style="width:44px; height:2px; background:rgba(255,255,255,0.6); margin:0 auto 10px;"></div>
        <p style="font-size:11px; letter-spacing:4px; color:rgba(255,255,255,0.85); margin:0; font-weight:600; text-transform:uppercase;">Studio Notification</p>
      </div>
      <div style="padding:30px 36px;">
        <h2 style="font-size:20px; font-weight:700; color:#111111; margin:0 0 8px;">New Booking Request</h2>
        <p style="font-size:14px; color:#555555; line-height:1.7; margin:0 0 22px;">A new appointment has just been placed. Here are the details:</p>
        <table style="width:100%; border-collapse:collapse; border:1px solid #f0e9dd; border-radius:10px;">
          <tr>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; background:#faf6ee; font-size:12px; color:#8a8272; width:38%; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Client</td>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; font-size:14px; color:#111111; font-weight:600;">${name || '—'}</td>
          </tr>
          <tr>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; background:#faf6ee; font-size:12px; color:#8a8272; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Reference</td>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; font-size:14px; color:#b8956a; font-weight:700;">${bookingRef}</td>
          </tr>
          <tr>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; background:#faf6ee; font-size:12px; color:#8a8272; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Service</td>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; font-size:14px; color:#111111;">${service}</td>
          </tr>
          <tr>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; background:#faf6ee; font-size:12px; color:#8a8272; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Price</td>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; font-size:14px; color:#b8956a; font-weight:700;">${price}</td>
          </tr>
          <tr>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; background:#faf6ee; font-size:12px; color:#8a8272; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Date</td>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; font-size:14px; color:#111111;">${date}</td>
          </tr>
          <tr>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; background:#faf6ee; font-size:12px; color:#8a8272; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Time</td>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; font-size:14px; color:#111111;">${time}</td>
          </tr>
          <tr>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; background:#faf6ee; font-size:12px; color:#8a8272; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Email</td>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; font-size:14px; color:#111111;">${email || '—'}</td>
          </tr>
          <tr>
            <td style="padding:13px 20px; background:#faf6ee; font-size:12px; color:#8a8272; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Phone</td>
            <td style="padding:13px 20px; font-size:14px; color:#111111;">${phone || '—'}</td>
          </tr>
        </table>
      </div>
      <div style="background:#111111; padding:22px 24px; text-align:center;">
        <p style="font-size:12px; color:#d4af62; margin:0; font-weight:600; letter-spacing:1px;">EXTREME BEAUTY LASHES &amp; BROWS</p>
      </div>
    </div>
  `;
  const text = `New booking received!\n\nClient: ${name}\nRef: ${bookingRef}\nService: ${service}\nDate: ${date}\nTime: ${time}\nEmail: ${email}\nPhone: ${phone}`;

  try {
    if (t && t.isBrevoApi) {
      await sendViaBrevoApi({
        to,
        from: process.env.SMTP_FROM || process.env.EMAIL_USER || 'info@extremebeauty.com',
        subject,
        html,
        text,
      });
    } else if (t) {
      await t.sendMail({
        from: getFromAddress(),
        to,
        subject,
        html,
        text,
      });
    } else {
      throw new Error('Email not configured');
    }
    return { delivered: true };
  } catch (e) {
    console.log(`[Booking] Admin new-booking email failed: ${e.message}`);
    return { delivered: false, error: e.message };
  }
}

async function sendAdminStatusUpdate({ name, bookingRef, status, email, phone }) {
  const to = process.env.ADMIN_EMAIL || process.env.SMTP_FROM || process.env.EMAIL_USER;
  if (!to) {
    console.log('[Booking] No admin email configured for status notification.');
    return { delivered: false };
  }
  const t = getTransporter();
  if (!t) {
    console.log('[Booking] Email not configured. Skipping admin status notification.');
    return { delivered: false };
  }
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  const subject = `Booking ${statusLabel} — ${bookingRef}`;
  const html = `
    <div style="font-family:Arial, Helvetica, sans-serif; max-width:600px; margin:auto; background:#ffffff; border:1px solid #e8e1d6; border-radius:14px; overflow:hidden;">
      <div style="background:linear-gradient(135deg, #b8956a 0%, #d4af62 50%, #c9a067 100%); padding:30px 28px; text-align:center;">
        <p style="font-size:21px; letter-spacing:5px; color:#ffffff; margin:0 0 8px; font-weight:700;">EXTREME <span style="font-weight:300;">BEAUTY</span></p>
        <div style="width:44px; height:2px; background:rgba(255,255,255,0.6); margin:0 auto 10px;"></div>
        <p style="font-size:11px; letter-spacing:4px; color:rgba(255,255,255,0.85); margin:0; font-weight:600; text-transform:uppercase;">Booking Status Update</p>
      </div>
      <div style="padding:30px 36px;">
        <h2 style="font-size:20px; font-weight:700; color:#111111; margin:0 0 8px;">Booking status changed</h2>
        <p style="font-size:14px; color:#555555; line-height:1.7; margin:0 0 22px;">The status of the following booking was updated by the studio:</p>
        <table style="width:100%; border-collapse:collapse; border:1px solid #f0e9dd; border-radius:10px;">
          <tr>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; background:#faf6ee; font-size:12px; color:#8a8272; width:38%; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Client</td>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; font-size:14px; color:#111111; font-weight:600;">${name || '—'}</td>
          </tr>
          <tr>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; background:#faf6ee; font-size:12px; color:#8a8272; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Reference</td>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; font-size:14px; color:#b8956a; font-weight:700;">${bookingRef}</td>
          </tr>
          <tr>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; background:#faf6ee; font-size:12px; color:#8a8272; font-weight:700; text-transform:uppercase; letter-spacing:1px;">New Status</td>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; font-size:14px; color:#111111; font-weight:700;">${statusLabel}</td>
          </tr>
          <tr>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; background:#faf6ee; font-size:12px; color:#8a8272; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Email</td>
            <td style="padding:13px 20px; border-bottom:1px solid #f3ede2; font-size:14px; color:#111111;">${email || '—'}</td>
          </tr>
          <tr>
            <td style="padding:13px 20px; background:#faf6ee; font-size:12px; color:#8a8272; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Phone</td>
            <td style="padding:13px 20px; font-size:14px; color:#111111;">${phone || '—'}</td>
          </tr>
        </table>
      </div>
      <div style="background:#111111; padding:22px 24px; text-align:center;">
        <p style="font-size:12px; color:#d4af62; margin:0; font-weight:600; letter-spacing:1px;">EXTREME BEAUTY LASHES &amp; BROWS</p>
      </div>
    </div>
  `;
  const text = `Booking ${bookingRef} for ${name} has been updated to: ${statusLabel}.\n\nEmail: ${email}\nPhone: ${phone}`;

  try {
    if (t.isBrevoApi) {
      await sendViaBrevoApi({
        to,
        from: process.env.SMTP_FROM || process.env.EMAIL_USER || 'info@extremebeauty.com',
        subject,
        html,
        text,
      });
    } else if (t) {
      await t.sendMail({ from: getFromAddress(), to, subject, html, text });
    } else {
      throw new Error('Email not configured');
    }
    return { delivered: true };
  } catch (e) {
    console.log(`[Booking] Admin status email failed: ${e.message}`);
    return { delivered: false, error: e.message };
  }
}

module.exports = {
  sendOtpEmail,
  sendReplyEmail,
  sendBookingConfirmation,
  sendBookingStatusUpdate,
  sendAdminNewBooking,
  sendAdminStatusUpdate,
  getTransporter,
};