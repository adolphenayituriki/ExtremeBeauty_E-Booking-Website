const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const useResend = process.env.RESEND_API_KEY;
  const useGmail = process.env.EMAIL_USER && process.env.EMAIL_PASS &&
    process.env.EMAIL_USER !== 'your_email@gmail.com' &&
    process.env.EMAIL_PASS !== 'your_email_password';

  if (useResend) {
    transporter = { isResend: true, apiKey: process.env.RESEND_API_KEY };
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

async function sendOtpEmail(to, code) {
  const t = getTransporter();
  const fromName = 'Extreme Beauty';

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

  const subjectText = `Your verification code is ${code}`;
  const text = `Use code ${code} to sign in to your Extreme Beauty admin dashboard. It expires in 3 minutes. If you didn't request this, ignore this email.`;

  if (t.isResend) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${t.apiKey}`,
        },
        body: JSON.stringify({
          from: `${fromName} <${process.env.RESEND_FROM || process.env.EMAIL_USER || 'onboarding@resend.dev'}>`,
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
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });
    return { delivered: true };
  } catch (e) {
    console.log(`[OTP] Gmail delivery failed. OTP for ${to}: ${code}`);
    return { delivered: false, code };
  }
}

async function sendReplyEmail(to, { subject, message, originalSubject }) {
  const t = getTransporter();
  const fromName = 'Extreme Beauty';

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

  if (t.isResend) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${t.apiKey}`,
        },
        body: JSON.stringify({
          from: `${fromName} <${process.env.RESEND_FROM || process.env.EMAIL_USER || 'onboarding@resend.dev'}>`,
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
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to,
      subject: sendOptions.subject,
      html,
      text,
    });
    return { delivered: true };
  } catch (e) {
    console.log(`[Reply] Gmail delivery failed for ${to}`);
    return { delivered: false, error: e.message };
  }
}

module.exports = { sendOtpEmail, sendReplyEmail, getTransporter };
