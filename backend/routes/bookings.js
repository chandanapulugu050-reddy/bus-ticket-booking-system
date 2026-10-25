const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookingDetails, cancelBooking, getBookingByPnr } = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createBooking);
router.get('/my', authMiddleware, getMyBookings);
router.get('/pnr/:pnr', getBookingByPnr);
router.get('/:id', authMiddleware, getBookingDetails);
router.post('/:id/cancel', authMiddleware, cancelBooking);

module.exports = router;

