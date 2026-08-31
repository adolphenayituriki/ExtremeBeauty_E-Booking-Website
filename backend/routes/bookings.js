const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getBookings, getBooking, trackBooking, trackByPhone, createBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');

router.get('/track/:ref', trackBooking);
router.get('/track/phone/:phone', trackByPhone);
router.get('/', getBookings);
router.get('/:id', getBooking);
router.post('/', createBooking);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
