const Booking = require('../models/Booking');

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const trackBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingRef: req.params.ref });
    if (!booking) return res.status(404).json({ message: 'Booking not found with this reference' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const trackByPhone = async (req, res) => {
  try {
    const bookings = await Booking.find({ phone: req.params.phone }).sort({ createdAt: -1 });
    if (!bookings.length) return res.status(404).json({ message: 'No bookings found for this phone number' });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const crypto = require('crypto');
    const booking = new Booking(req.body);
    booking.bookingRef = 'EB-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    booking.status = 'approved';
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBookings, getBooking, trackBooking, trackByPhone, createBooking, updateBooking, deleteBooking };
