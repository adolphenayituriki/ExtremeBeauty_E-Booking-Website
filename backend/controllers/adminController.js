const Admin = require('../models/Admin');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const { logChange } = require('../utils/audit');
const { sendOtpEmail, sendManagerInvitationEmail } = require('../utils/mailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'extremebeauty_secret', {
    expiresIn: '7d',
  });
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An admin with this email already exists' });
    }
    const admin = await Admin.create({ name, email, password });
    const token = generateToken(admin._id);
    res.status(201).json({
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
    res.status(400).json({ success: false, message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
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

const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;
    if (req.body.password) {
      admin.password = req.body.password;
    }
    await admin.save();
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
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: 1 });
    res.json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists' });
    }
    const admin = await Admin.create({ name, email, password, role: 'admin' });
    logChange(req, 'created', 'Manager', admin._id, { name, email, role: 'admin' });
    sendManagerInvitationEmail(email, { name, password }).catch(e => console.log(`[Manager] Invitation email failed: ${e.message}`));
    res.status(201).json({ success: true, data: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const target = await Admin.findById(req.params.id);
    if (!target) return res.status(404).json({ success: false, message: 'User not found' });

    const current = await Admin.findById(req.admin._id);
    if (target.role === 'superadmin' && current.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'You cannot modify the studio owner' });
    }
    if (req.params.id === String(req.admin._id)) {
      return res.status(400).json({ success: false, message: 'Use the Profile area to edit your own details' });
    }

    target.name = req.body.name || target.name;
    target.email = req.body.email || target.email;
    if (req.body.password) {
      if (String(req.body.password).length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      target.password = req.body.password;
    }
    await target.save();
    logChange(req, 'updated', 'Manager', target._id, {
      name: target.name,
      email: target.email,
      changedPassword: Boolean(req.body.password),
    });
    res.json({ success: true, data: { _id: target._id, name: target.name, email: target.email, role: target.role } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const target = await Admin.findById(req.params.id);
    if (!target) return res.status(404).json({ success: false, message: 'User not found' });
    if (target.role === 'superadmin') {
      return res.status(400).json({ success: false, message: 'The studio owner cannot be removed' });
    }
    await Admin.findByIdAndDelete(req.params.id);
    logChange(req, 'deleted', 'Manager', req.params.id, { name: target.name, email: target.email });
    res.json({ success: true, message: 'Manager removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const OTP_TTL_MINUTES = 3;
const OTP_LENGTH = 6;

function generateOtpCode() {
  let code = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

const requestPasswordChangeOtp = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is required' });
    }

    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (!(await admin.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await Otp.deleteMany({ email: admin.email });
    await Otp.create({ email: admin.email, code, expiresAt });

    await sendOtpEmail(admin.email, code);
    res.json({
      success: true,
      message: 'Verification code sent to your email',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const confirmPasswordChange = async (req, res) => {
  try {
    const { code, newPassword } = req.body;
    if (!code || !newPassword) {
      return res.status(400).json({ success: false, message: 'Verification code and new password are required' });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const otp = await Otp.findOne({ email: admin.email, used: false }).sort({ createdAt: -1 });
    if (!otp) {
      return res.status(400).json({ success: false, message: 'No active verification code. Please request a new one.' });
    }

    if (otp.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'This code has expired. Please request a new one.' });
    }

    if (otp.code !== String(code).trim()) {
      return res.status(400).json({ success: false, message: 'Incorrect verification code' });
    }

    otp.used = true;
    await otp.save();

    admin.password = newPassword;
    await admin.save();

    logChange(req, 'updated', 'Admin', admin._id, { changedPassword: true });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'extremebeauty_secret', { expiresIn: '7d' });
    res.json({
      success: true,
      message: 'Password changed successfully',
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

module.exports = { registerAdmin, loginAdmin, getMe, updateProfile, getAdmins, createAdmin, updateAdmin, deleteAdmin, requestPasswordChangeOtp, confirmPasswordChange };
