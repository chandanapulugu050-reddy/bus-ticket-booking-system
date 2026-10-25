const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { getDb } = require('../config/db');

// DASHBOARD STATS
router.get('/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        const users = await db.get('SELECT COUNT(*) as count FROM users WHERE role = "user"');
        const buses = await db.get('SELECT COUNT(*) as count FROM buses');
        const bookings = await db.get('SELECT COUNT(*) as count FROM bookings');
        const confirmedBookings = await db.get('SELECT COUNT(*) as count FROM bookings WHERE status = "CONFIRMED"');
        const cancelledBookings = await db.get('SELECT COUNT(*) as count FROM bookings WHERE status = "CANCELLED"');

        res.json({
            totalUsers: users.count,
            totalBuses: buses.count,
            totalBookings: bookings.count,
            confirmedBookings: confirmedBookings.count,
            cancelledBookings: cancelledBookings.count
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- BUSES CRUD ---
router.get('/buses', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        const buses = await db.all('SELECT * FROM buses ORDER BY id DESC');
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching buses' });
    }
});

router.post('/buses', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, number, type, amenities, total_seats, status } = req.body;
        const db = await getDb();
        const result = await db.run(
            'INSERT INTO buses (name, number, type, amenities, total_seats, status) VALUES (?, ?, ?, ?, ?, ?)',
            [name, number, type, amenities, total_seats, status || 'active']
        );
        res.json({ id: result.lastID, message: 'Bus created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating bus' });
    }
});

router.put('/buses/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, number, type, amenities, total_seats, status } = req.body;
        const db = await getDb();
        await db.run(
            'UPDATE buses SET name=?, number=?, type=?, amenities=?, total_seats=?, status=? WHERE id=?',
            [name, number, type, amenities, total_seats, status, req.params.id]
        );
        res.json({ message: 'Bus updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating bus' });
    }
});

router.delete('/buses/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        await db.run('DELETE FROM buses WHERE id=?', [req.params.id]);
        res.json({ message: 'Bus deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting bus' });
    }
});

// --- ROUTES CRUD ---
router.get('/routes', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        const routes = await db.all(`
            SELECT r.*, b.name as bus_name, b.number as bus_number 
            FROM routes r 
            JOIN buses b ON r.bus_id = b.id 
            ORDER BY r.id DESC
        `);
        res.json(routes);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching routes' });
    }
});

router.post('/routes', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { bus_id, source, destination, journey_date, departure_time, arrival_time, duration, starting_price } = req.body;
        const db = await getDb();
        const result = await db.run(
            'INSERT INTO routes (bus_id, source, destination, journey_date, departure_time, arrival_time, duration, starting_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [bus_id, source, destination, journey_date, departure_time, arrival_time, duration, starting_price]
        );
        res.json({ id: result.lastID, message: 'Route created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating route' });
    }
});

router.put('/routes/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { bus_id, source, destination, journey_date, departure_time, arrival_time, duration, starting_price } = req.body;
        const db = await getDb();
        await db.run(
            'UPDATE routes SET bus_id=?, source=?, destination=?, journey_date=?, departure_time=?, arrival_time=?, duration=?, starting_price=? WHERE id=?',
            [bus_id, source, destination, journey_date, departure_time, arrival_time, duration, starting_price, req.params.id]
        );
        res.json({ message: 'Route updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating route' });
    }
});

router.delete('/routes/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        await db.run('DELETE FROM routes WHERE id=?', [req.params.id]);
        res.json({ message: 'Route deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting route' });
    }
});

// --- USERS CRUD ---
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        const users = await db.all('SELECT id, name, email, phone, role, created_at FROM users ORDER BY id DESC');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

router.put('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, email, phone, role } = req.body;
        const db = await getDb();
        await db.run(
            'UPDATE users SET name=?, email=?, phone=?, role=? WHERE id=?',
            [name, email, phone, role, req.params.id]
        );
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user' });
    }
});

router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        await db.run('DELETE FROM users WHERE id=?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// --- BOOKINGS CRUD ---
router.get('/bookings', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        const bookings = await db.all(`
            SELECT b.*, u.name as user_name, u.email as user_email, bus.name as bus_name, r.source, r.destination 
            FROM bookings b 
            JOIN users u ON b.user_id = u.id 
            JOIN buses bus ON b.bus_id = bus.id 
            JOIN routes r ON b.route_id = r.id 
            ORDER BY b.id DESC
        `);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

router.put('/bookings/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const db = await getDb();
        await db.run('UPDATE bookings SET status=? WHERE id=?', [status, req.params.id]);
        res.json({ message: 'Booking status updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating booking' });
    }
});

// Coupons
router.get('/coupons', adminMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        const coupons = await db.all("SELECT * FROM coupons ORDER BY id DESC");
        res.json(coupons);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching coupons" });
    }
});

// Refunds
router.get('/refunds', adminMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        const refunds = await db.all("SELECT * FROM refunds ORDER BY created_at DESC");
        res.json(refunds);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching refunds" });
    }
});
router.put('/refunds/:id/process', adminMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        await db.run("UPDATE refunds SET status = 'COMPLETED' WHERE id = ?", [req.params.id]);
        res.json({ message: "Refund processed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error processing refund" });
    }
});

// Reviews
router.get('/reviews', adminMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        const reviews = await db.all(`
            SELECT r.*, u.name as user_name, b.name as bus_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            JOIN buses b ON r.bus_id = b.id 
            ORDER BY r.created_at DESC
        `);
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching reviews" });
    }
});

// Stats
router.get('/stats', adminMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        const totalRevenue = await db.get("SELECT SUM(final_fare) as total FROM bookings WHERE status = 'CONFIRMED'");
        const totalBookings = await db.get("SELECT COUNT(*) as count FROM bookings");
        res.json({ 
            totalRevenue: totalRevenue.total || 0,
            totalBookings: totalBookings.count || 0
        });
    } catch (err) {
        res.status(500).json({ message: "Server error fetching stats" });
    }
});

module.exports = router;
