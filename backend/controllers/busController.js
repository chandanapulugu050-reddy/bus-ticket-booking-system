const { getDb } = require('../config/db');

exports.searchBuses = async (req, res) => {
    try {
        const { source, destination, date } = req.query;
        if (!source || !destination || !date) {
            return res.status(400).json({ message: 'Please provide source, destination, and date' });
        }

        const db = await getDb();
        const query = `
            SELECT b.id, b.name, b.number, b.type, b.amenities, r.id as route_id, r.departure_time, r.arrival_time, 
                   r.duration, r.starting_price, b.total_seats,
                   (SELECT COUNT(*) FROM seats WHERE route_id = r.id AND status = 'AVAILABLE') as available_seats
            FROM routes r
            JOIN buses b ON r.bus_id = b.id
            WHERE r.source = ? AND r.destination = ? AND r.journey_date = ? AND b.status = 'active'
        `;

        const buses = await db.all(query, [source, destination, date]);
        res.json(buses);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error during bus search' });
    }
};

exports.getBusDetails = async (req, res) => {
    try {
        const busId = req.params.id;
        const routeId = req.query.route_id;

        const db = await getDb();
        const bus = await db.get('SELECT * FROM buses WHERE id = ?', [busId]);
        
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        let routeDetails = {};
        if (routeId) {
             const route = await db.get('SELECT * FROM routes WHERE id = ?', [routeId]);
             if (route) routeDetails = route;
        }

        const boardingPoints = await db.all('SELECT * FROM boarding_points WHERE bus_id = ? ORDER BY time ASC', [busId]);
        const droppingPoints = await db.all('SELECT * FROM dropping_points WHERE bus_id = ? ORDER BY time ASC', [busId]);

        res.json({
            ...bus,
            route: routeDetails,
            boardingPoints,
            droppingPoints
        });
    } catch (error) {
        console.error('Bus details error:', error);
        res.status(500).json({ message: 'Server error fetching bus details' });
    }
};

exports.getBusSeats = async (req, res) => {
    try {
        const busId = req.params.id;
        const routeId = req.query.route_id;
        if (!routeId) return res.status(400).json({ message: 'route_id is required' });

        const db = await getDb();
        const seats = await db.all('SELECT id, seat_number, status FROM seats WHERE bus_id = ? AND route_id = ?', [busId, routeId]);
        
        res.json(seats);
    } catch (error) {
        console.error('Seats error:', error);
        res.status(500).json({ message: 'Server error fetching seats' });
    }
};
