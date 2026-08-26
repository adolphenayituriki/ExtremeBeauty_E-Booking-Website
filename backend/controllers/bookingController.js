const Booking = require('../models/Booking');

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const trackBooking = async (req, res) => {
  try {
    const ref = (req.params.ref || '').trim().toUpperCase();
    console.log('[Track] Received ref:', ref);
    if (!ref) {
      return res.status(400).json({ success: false, message: 'Booking reference is required' });
    }
    const booking = await Booking.findOne({ bookingRef: ref });
    console.log('[Track] Found:', booking ? booking.bookingRef : 'null');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found with this reference' });
    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('[Track] Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const trackByPhone = async (req, res) => {
  try {
    const phone = (req.params.phone || '').trim();
    console.log('[TrackPhone] Received phone:', phone);
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }
    const bookings = await Booking.find({ phone }).sort({ createdAt: -1 });
    console.log('[TrackPhone] Found:', bookings.length, 'bookings');
    if (!bookings.length) return res.status(404).json({ success: false, message: 'No bookings found for this phone number' });
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('[TrackPhone] Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    booking.bookingRef = 'EB-' + require('crypto').randomBytes(3).toString('hex').toUpperCase();
    booking.status = 'approved';
    const saved = await booking.save();
    res.status(201).json({ success: true, data: saved.toObject() });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getBookings, getBooking, trackBooking, trackByPhone, createBooking, updateBooking, deleteBooking };
