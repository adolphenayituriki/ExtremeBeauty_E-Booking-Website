const Booking = require('../models/Booking');
const Contact = require('../models/Contact');

const getNotifications = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 8, 50);
    const [bookings, contacts] = await Promise.all([
      Booking.find().sort({ createdAt: -1 }).limit(limit),
      Contact.find().sort({ createdAt: -1 }).limit(limit),
    ]);

    const recent = [
      ...bookings.map((b) => ({
        kind: 'booking',
        id: b._id,
        title: `${b.firstName || ''} ${b.lastName || ''}`.trim() || 'New booking',
        subtitle: b.service || b.bookingRef || '',
        status: b.status,
        createdAt: b.createdAt,
      })),
      ...contacts.map((c) => ({
        kind: 'message',
        id: c._id,
        title: c.name || 'New message',
        subtitle: c.subject || '',
        createdAt: c.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: {
        recent: recent.slice(0, limit),
        totalBookings: await Booking.countDocuments(),
        totalContacts: await Contact.countDocuments(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getNotifications };
