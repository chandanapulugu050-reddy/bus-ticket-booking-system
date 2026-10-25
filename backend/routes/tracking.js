const express = require('express');
const router = express.Router();
const { getDb } = require('../config/db');

// --- SIMULATED GPS TRACKING ---
router.get('/live/:pnr', async (req, res) => {
    try {
        const db = await getDb();
        const booking = await db.get(`
            SELECT b.*, r.source, r.destination, r.departure_time, r.arrival_time, bus.name as operator, bus.number as bus_number
            FROM bookings b
            JOIN routes r ON b.route_id = r.id
            JOIN buses bus ON b.bus_id = bus.id
            WHERE b.pnr = ?
        `, [req.params.pnr]);

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Simulate progress based on time
        const now = new Date();
        const journeyStartStr = booking.journey_date + 'T' + booking.departure_time;
        const journeyEndStr = booking.journey_date + 'T' + (booking.arrival_time < booking.departure_time ? '23:59:59' : booking.arrival_time); // Simplification for demo
        
        // Return a mock simulated state
        res.json({
            pnr: booking.pnr,
            bus_number: booking.bus_number,
            operator: booking.operator,
            source: booking.source,
            destination: booking.destination,
            progress_percentage: Math.floor(Math.random() * 100), // Random demo progress
            eta: booking.arrival_time,
            distance_remaining: Math.floor(Math.random() * 200) + ' km',
            status: 'On Time',
            last_updated: new Date().toISOString()
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
