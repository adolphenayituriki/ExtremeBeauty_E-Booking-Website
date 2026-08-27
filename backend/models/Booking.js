const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const bookingSchema = new mongoose.Schema({
  bookingRef: {
    type: String,
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  service: {
    type: String,
    required: [true, 'Service selection is required'],
    enum: [
      'Microblading Eyebrows',
      'Microshading Eyebrows',
      'Hybrid / Combination Brows',
      'Brows Lamination',
      'Lash Lift',
      'Classic Set',
      'Hybrid Set',
      'Volume Set',
      'Mega Volume Set',
      'Wispy Sets',
      'Lash Removal',
      'Eyebrows Retouch',
    ],
  },
  date: {
    type: Date,
    required: [true, 'Preferred date is required'],
  },
  time: {
    type: String,
    required: [true, 'Preferred time is required'],
  },
  message: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'confirmed', 'cancelled', 'completed'],
    default: 'approved',
  },
  trackingPin: {
    type: String,
    select: false,
  },
}, {
  timestamps: true,
});

bookingSchema.pre('save', async function (next) {
  if (!this.bookingRef) {
    this.bookingRef = 'EB-' + crypto.randomBytes(3).toString('hex').toUpperCase();
  }
  if (this.isModified('trackingPin') && this.trackingPin) {
    const salt = await bcrypt.genSalt(10);
    this.trackingPin = await bcrypt.hash(this.trackingPin, salt);
  }
  next();
});

bookingSchema.methods.matchTrackingPin = async function (enteredPin) {
  if (!this.trackingPin) return false;
  return await bcrypt.compare(enteredPin, this.trackingPin);
};

module.exports = mongoose.model('Booking', bookingSchema);
