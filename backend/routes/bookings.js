const express = require('express');
const router = express.Router();
const { getBookings, getBooking, trackBooking, trackByPhone, createBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');

router.get('/track/:ref', trackBooking);
router.get('/track/phone/:phone', trackByPhone);
router.get('/', getBookings);
router.get('/:id', getBooking);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router;
