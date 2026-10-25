const { getDb } = require('../config/db');

exports.createBooking = async (req, res) => {
    let db;
    try {
        db = await getDb();
        const { busId, routeId, journeyDate, boardingPointId, droppingPointId, seatIds, passengers, paymentMethod, discount = 0 } = req.body;
        const userId = req.user.id;

        if (!seatIds || seatIds.length === 0 || !passengers || passengers.length !== seatIds.length) {
            return res.status(400).json({ message: 'Invalid seat or passenger details' });
        }

        await db.run('BEGIN TRANSACTION');

        const placeholders = seatIds.map(() => '?').join(',');
        const seats = await db.all(`SELECT id, status FROM seats WHERE id IN (${placeholders})`, seatIds);

        for (const seat of seats) {
            if (seat.status !== 'AVAILABLE') {
                await db.run('ROLLBACK');
                return res.status(400).json({ message: 'Sorry, one or more selected seats have already been booked.' });
            }
        }

        const route = await db.get('SELECT starting_price FROM routes WHERE id = ?', [routeId]);
        const farePerSeat = parseFloat(route?.starting_price || 0);
        const baseFare = farePerSeat * seatIds.length;
        const taxes = baseFare * 0.05;
        const discountAmount = Math.max(0, parseFloat(discount) || 0);
        const finalFare = Math.max(0, (baseFare + taxes) - discountAmount);

        const pnr = 'BT' + new Date().getFullYear() + Math.floor(100000 + Math.random() * 900000);

        const bookingResult = await db.run(
            `INSERT INTO bookings (pnr, user_id, bus_id, route_id, journey_date, boarding_point_id, dropping_point_id, total_fare, discount, final_fare, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')`,
            [pnr, userId, busId, routeId, journeyDate, boardingPointId, droppingPointId, baseFare, discountAmount, finalFare]
        );
        const bookingId = bookingResult.lastID;

        await db.run(`UPDATE seats SET status = 'BOOKED' WHERE id IN (${placeholders})`, seatIds);

        for (let i = 0; i < passengers.length; i++) {
            const p = passengers[i];
            await db.run(
                `INSERT INTO passengers (booking_id, seat_id, name, age, gender) VALUES (?, ?, ?, ?, ?)`,
                [bookingId, seatIds[i], p.name, p.age, p.gender]
            );
        }

        await db.run(
            `INSERT INTO payments (booking_id, amount, payment_method, status, transaction_reference) VALUES (?, ?, ?, 'SUCCESS', ?)`,
            [bookingId, finalFare, paymentMethod || 'Card', 'TXN' + Math.floor(Math.random() * 10000000)]
        );

        await db.run('COMMIT');
        res.status(201).json({ message: 'Ticket Confirmed', bookingId, pnr, finalFare });

    } catch (error) {
        if (db) await db.run('ROLLBACK').catch(e => console.error("Rollback error:", e));
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Server error during booking' });
    }
};

exports.getBookingByPnr = async (req, res) => {
    try {
        const db = await getDb();
        const booking = await db.get(`
            SELECT b.*, bu.name as bus_name, bu.number as bus_number, bu.type as bus_type, r.source, r.destination, r.departure_time, r.arrival_time,
                   bp.name as boarding_point_name, bp.time as boarding_time, dp.name as dropping_point_name, dp.time as dropping_time
            FROM bookings b
            JOIN buses bu ON b.bus_id = bu.id
            JOIN routes r ON b.route_id = r.id
            JOIN boarding_points bp ON b.boarding_point_id = bp.id
            JOIN dropping_points dp ON b.dropping_point_id = dp.id
            WHERE b.pnr = ?
        `, [req.params.pnr]);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const passengers = await db.all(`
            SELECT p.*, s.seat_number 
            FROM passengers p 
            JOIN seats s ON p.seat_id = s.id 
            WHERE p.booking_id = ?
        `, [booking.id]);

        res.json({ ...booking, passengers });
    } catch (error) {
        console.error('Get booking by PNR error:', error);
        res.status(500).json({ message: 'Server error fetching booking by PNR' });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const db = await getDb();
        const bookings = await db.all(`
            SELECT b.*, bu.name as bus_name, r.source, r.destination 
            FROM bookings b 
            JOIN buses bu ON b.bus_id = bu.id 
            JOIN routes r ON b.route_id = r.id
            WHERE b.user_id = ? 
            ORDER BY b.created_at DESC
        `, [req.user.id]);
        res.json(bookings);
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ message: 'Server error fetching bookings' });
    }
};

exports.getBookingDetails = async (req, res) => {
    try {
        const db = await getDb();
        const booking = await db.get(`
            SELECT b.*, bu.name as bus_name, bu.number as bus_number, r.source, r.destination, r.departure_time, r.arrival_time,
                   bp.name as boarding_point_name, dp.name as dropping_point_name
            FROM bookings b
            JOIN buses bu ON b.bus_id = bu.id
            JOIN routes r ON b.route_id = r.id
            JOIN boarding_points bp ON b.boarding_point_id = bp.id
            JOIN dropping_points dp ON b.dropping_point_id = dp.id
            WHERE b.id = ? AND b.user_id = ?
        `, [req.params.id, req.user.id]);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const passengers = await db.all(`
            SELECT p.*, s.seat_number 
            FROM passengers p 
            JOIN seats s ON p.seat_id = s.id 
            WHERE p.booking_id = ?
        `, [booking.id]);

        res.json({ ...booking, passengers });
    } catch (error) {
        console.error('Get booking details error:', error);
        res.status(500).json({ message: 'Server error fetching booking details' });
    }
};

exports.cancelBooking = async (req, res) => {
    let db;
    try {
        db = await getDb();
        await db.run('BEGIN TRANSACTION');

        const booking = await db.get('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        
        if (!booking) {
            await db.run('ROLLBACK');
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        if (booking.status === 'CANCELLED') {
            await db.run('ROLLBACK');
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        const bookingId = booking.id;
        await db.run('UPDATE bookings SET status = "CANCELLED" WHERE id = ?', [bookingId]);

        const passengers = await db.all('SELECT seat_id FROM passengers WHERE booking_id = ?', [bookingId]);
        if (passengers.length > 0) {
            const seatIds = passengers.map(p => p.seat_id);
            const placeholders = seatIds.map(() => '?').join(',');
            await db.run(`UPDATE seats SET status = 'AVAILABLE' WHERE id IN (${placeholders})`, seatIds);
        }

        await db.run('COMMIT');
        res.json({ message: 'Your ticket has been cancelled successfully.' });
    } catch (error) {
        if (db) await db.run('ROLLBACK').catch(e => console.error("Rollback error:", e));
        console.error('Cancel booking error:', error);
        res.status(500).json({ message: 'Server error cancelling booking' });
    }
};
