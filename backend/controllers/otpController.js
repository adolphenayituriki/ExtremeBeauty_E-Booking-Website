const Otp = require('../models/Otp');
const Admin = require('../models/Admin');
const { sendOtpEmail } = require('../utils/mailer');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'extremebeauty_secret', {
    expiresIn: '7d',
  });
};

const OTP_TTL_MINUTES = 3;
const OTP_LENGTH = 6;

function generateOtp() {
  let code = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

const requestOtp = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'No admin account found with this email' });
    }

    if (!(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, code, expiresAt });

    const result = await sendOtpEmail(email, code);
    res.json({
      success: true,
      message: 'Verification code sent to your email',
      delivered: result.delivered,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const code = String(req.body.code || '').trim();

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and code are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'No admin account found with this email' });
    }

    const otp = await Otp.findOne({ email, used: false }).sort({ createdAt: -1 });
    if (!otp) {
      return res.status(400).json({ success: false, message: 'No active verification code. Please request a new one.' });
    }

    if (otp.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'This code has expired. Please request a new one.' });
    }

    if (otp.code !== code) {
      return res.status(400).json({ success: false, message: 'Incorrect verification code' });
    }

    otp.used = true;
    await otp.save();

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = generateToken(admin._id);
    res.json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { requestOtp, verifyOtp };
