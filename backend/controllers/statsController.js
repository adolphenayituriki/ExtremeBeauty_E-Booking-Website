const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const Service = require('../models/Service');

const getStats = async (req, res) => {
  try {
    const [totalBookings, pendingBookings, confirmedBookings, completedBookings, cancelledBookings,
      totalContacts, totalServices, recentBookings, recentContacts] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: { $in: ['approved', 'confirmed'] } }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Contact.countDocuments(),
      Service.countDocuments(),
      Booking.find().sort({ createdAt: -1 }).limit(8),
      Contact.find().sort({ createdAt: -1 }).limit(6),
    ]);

    res.json({
      success: true,
      data: {
        totals: {
          bookings: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
          contacts: totalContacts,
          services: totalServices,
        },
        recentBookings,
        recentContacts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats };
