const Booking = require('../models/Booking');
const { logChange } = require('../utils/audit');
const { sendBookingConfirmation, sendBookingStatusUpdate, sendAdminNewBooking, sendAdminStatusUpdate } = require('../utils/mailer');

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
    if (!ref) {
      return res.status(400).json({ success: false, message: 'Booking reference is required' });
    }
    const booking = await Booking.findOne({ bookingRef: ref }).select('bookingRef status');
    if (!booking) return res.status(404).json({ success: false, message: 'No booking found with this reference.' });
    res.json({ success: true, data: { exists: true } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const trackByPhone = async (req, res) => {
  try {
    const phone = (req.params.phone || '').trim();
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }
    const count = await Booking.countDocuments({ phone });
    if (!count) return res.status(404).json({ success: false, message: 'No bookings found for this phone number.' });
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyTracking = async (req, res) => {
  try {
    const ref = (req.body.ref || '').trim().toUpperCase();
    const pin = String(req.body.trackingPin || '');
    if (!ref) return res.status(400).json({ success: false, message: 'Booking reference is required.' });
    if (!pin) return res.status(400).json({ success: false, message: 'Please enter your tracking password.' });
    const booking = await Booking.findOne({ bookingRef: ref }).select('+trackingPin');
    if (!booking) return res.status(404).json({ success: false, message: 'No booking found with this reference.' });
    if (!booking.trackingPin) {
      return res.status(403).json({ success: false, message: 'This booking has no tracking password set. Please contact us to verify your booking.' });
    }
    const ok = await booking.matchTrackingPin(pin);
    if (!ok) return res.status(403).json({ success: false, message: 'Incorrect tracking password. Please try again.' });
    const { trackingPin: _pin, ...safe } = booking.toObject();
    res.json({ success: true, data: safe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPhoneTracking = async (req, res) => {
  try {
    const phone = (req.body.phone || '').trim();
    const pin = String(req.body.trackingPin || '');
    if (!phone) return res.status(400).json({ success: false, message: 'Phone number is required.' });
    if (!pin) return res.status(400).json({ success: false, message: 'Please enter your tracking password.' });
    const bookings = await Booking.find({ phone }).sort({ createdAt: -1 }).select('+trackingPin');
    if (!bookings.length) return res.status(404).json({ success: false, message: 'No bookings found for this phone number.' });
    const matched = [];
    for (const b of bookings) {
      if (b.trackingPin && (await b.matchTrackingPin(pin))) {
        const { trackingPin: _pin, ...safe } = b.toObject();
        matched.push(safe);
      }
    }
    res.json({ success: true, data: matched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const { trackingPin, ...rest } = req.body;
    if (!trackingPin || String(trackingPin).length < 4) {
      return res.status(400).json({ success: false, message: 'A tracking password (at least 4 characters) is required to track your booking.' });
    }
    const booking = new Booking(rest);
    booking.bookingRef = 'EB-' + require('crypto').randomBytes(3).toString('hex').toUpperCase();
    booking.status = 'approved';
    booking.trackingPin = String(trackingPin);
    const saved = await booking.save();
    const { trackingPin: _pin, ...safe } = saved.toObject();
    const d = saved.date ? new Date(saved.date) : null;
    const dateStr = d
      ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '';
    const notify = {
      name: `${saved.firstName || ''} ${saved.lastName || ''}`.trim(),
      service: saved.service || 'Salon service',
      date: dateStr,
      time: saved.time || '',
      bookingRef: saved.bookingRef,
      phone: saved.phone || '',
    };
    if (saved.email) {
      try {
        await sendBookingConfirmation(saved.email, notify);
      } catch (e) {
        console.log(`[Booking] Confirmation email error: ${e.message}`);
      }
    }
    try {
      await sendAdminNewBooking({
        name: notify.name,
        service: notify.service,
        date: notify.date,
        time: notify.time,
        bookingRef: notify.bookingRef,
        email: saved.email || '',
        phone: saved.phone || '',
      });
    } catch (e) {
      console.log(`[Booking] Admin notification error: ${e.message}`);
    }
    res.status(201).json({ success: true, data: safe });
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
    logChange(req, 'updated', 'Booking', booking._id, {
      bookingRef: booking.bookingRef,
      status: req.body.status,
      name: `${req.body.firstName || ''} ${req.body.lastName || ''}`.trim() || undefined,
    });
    if (req.body.status && booking.email && req.body.status !== 'approved') {
      try {
        await sendBookingStatusUpdate(booking.email, {
          name: `${booking.firstName || ''} ${booking.lastName || ''}`.trim(),
          bookingRef: booking.bookingRef,
          status: req.body.status,
        });
      } catch (e) {
        console.log(`[Booking] Status update email error: ${e.message}`);
      }
    }
    if (req.body.status && req.body.status !== 'approved') {
      try {
        const adminName = `${booking.firstName || ''} ${booking.lastName || ''}`.trim();
        await sendAdminStatusUpdate({
          name: adminName,
          bookingRef: booking.bookingRef,
          status: req.body.status,
          email: booking.email || '',
          phone: booking.phone || '',
        });
      } catch (e) {
        console.log(`[Booking] Admin status notification error: ${e.message}`);
      }
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    logChange(req, 'deleted', 'Booking', req.params.id, { bookingRef: booking.bookingRef });
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getBookings, getBooking, trackBooking, trackByPhone, verifyTracking, verifyPhoneTracking, createBooking, updateBooking, deleteBooking };
