const express = require('express');
const router = express.Router();
const { searchBuses, getBusDetails, getBusSeats } = require('../controllers/busController');

router.get('/search', searchBuses);
router.get('/:id', getBusDetails);
router.get('/:id/seats', getBusSeats);

module.exports = router;
