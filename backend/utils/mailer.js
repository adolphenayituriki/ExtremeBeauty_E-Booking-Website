const nodemailer = require('nodemailer');

let transporter = null;

const FROM_NAME = 'Extreme Beauty';

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

async function sendBookingConfirmation(to, { name, service, date, time, bookingRef }) {
  const t = getTransporter();
  const fromName = 'Extreme Beauty';

  if (!t) {
    console.log(`[Booking] Email not configured. Booking confirmation for ${to}: ref ${bookingRef}`);
    return { delivered: false };
  }

  const subject = `Booking Confirmed — ${bookingRef}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
      <div style="text-align:center;padding-bottom:20px;border-bottom:1px solid #f0f0f0;">
        <p style="font-size:12px;letter-spacing:3px;color:#b8956a;margin:0 0 4px;">EXTREME BEAUTY</p>
        <p style="font-size:18px;font-weight:600;color:#111;margin:0;">Booking Confirmation</p>
      </div>
      <div style="padding:24px 8px;">
        <p style="font-size:14px;color:#333;line-height:1.6;">Hi ${name || 'there'},</p>
        <p style="font-size:14px;color:#333;line-height:1.6;">Your appointment has been confirmed! Here are the details:</p>
        <div style="background:#f7f5f2;border-radius:10px;padding:18px;margin:18px 0;">
          <table style="width:100%;font-size:14px;color:#333;border-collapse:collapse;">
            <tr><td style="padding:6px 0;font-weight:600;color:#555;">Booking Ref</td><td style="padding:6px 0;text-align:right;font-weight:700;color:#b8956a;">${bookingRef}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;color:#555;">Service</td><td style="padding:6px 0;text-align:right;">${service}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;color:#555;">Date</td><td style="padding:6px 0;text-align:right;">${date}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;color:#555;">Time</td><td style="padding:6px 0;text-align:right;">${time}</td></tr>
          </table>
        </div>
        <p style="font-size:13px;color:#777;line-height:1.6;">You can track your booking status anytime using your reference code on our website.</p>
      </div>
      <div style="border-top:1px solid #f0f0f0;padding-top:14px;text-align:center;">
        <p style="font-size:11px;color:#bbb;margin:0;">Extreme Beauty Lashes &amp; Brows · Nyarutarama, Kigali</p>
      </div>
    </div>
  `;
  const text = `Hi ${name || 'there'},\n\nYour booking is confirmed!\n\nRef: ${bookingRef}\nService: ${service}\nDate: ${date}\nTime: ${time}\n\nTrack your booking on our website.`;

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

  const subject = `Booking ${status} — ${bookingRef}`;
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
      <div style="text-align:center;padding-bottom:20px;border-bottom:1px solid #f0f0f0;">
        <p style="font-size:12px;letter-spacing:3px;color:#b8956a;margin:0 0 4px;">EXTREME BEAUTY</p>
        <p style="font-size:18px;font-weight:600;color:#111;margin:0;">Booking Update</p>
      </div>
      <div style="padding:24px 8px;text-align:center;">
        <p style="font-size:14px;color:#333;line-height:1.6;">Hi ${name || 'there'},</p>
        <div style="display:inline-block;background:#f7f5f2;border:1px solid #b8956a;border-radius:10px;padding:14px 32px;font-size:16px;font-weight:700;color:#b8956a;margin:16px 0;">${statusLabel}</div>
        <p style="font-size:13px;color:#777;line-height:1.6;">Your booking <strong>${bookingRef}</strong> has been <strong>${statusLabel.toLowerCase()}</strong>.</p>
        <p style="font-size:13px;color:#777;line-height:1.6;">Contact us if you have any questions.</p>
      </div>
      <div style="border-top:1px solid #f0f0f0;padding-top:14px;text-align:center;">
        <p style="font-size:11px;color:#bbb;margin:0;">Extreme Beauty Lashes &amp; Brows · Nyarutarama, Kigali</p>
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

module.exports = {
  sendOtpEmail,
  sendReplyEmail,
  sendBookingConfirmation,
  sendBookingStatusUpdate,
  getTransporter,
};
