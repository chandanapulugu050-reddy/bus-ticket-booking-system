const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { getDb } = require('../config/db');

// Get all favorites for user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const db = await getDb();
        // Fetch favorites and join with buses and their next available route
        const favorites = await db.all(`
            SELECT f.id as favorite_id, f.target_id as bus_id, f.created_at,
                   b.*, 
                   r.id as route_id, r.source, r.destination, r.departure_time, r.arrival_time, r.duration, r.starting_price
            FROM favorites f
            JOIN buses b ON f.target_id = b.id
            LEFT JOIN routes r ON b.id = r.bus_id
            WHERE f.user_id = ? AND f.type = 'bus'
            GROUP BY f.id
            ORDER BY f.id DESC
        `, [req.user.id]);
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching favorites' });
    }
});

// Toggle favorite
router.post('/toggle', authMiddleware, async (req, res) => {
    try {
        const { type, target_id, target_name } = req.body;
        const db = await getDb();
        
        // Check if exists
        const existing = await db.get('SELECT id FROM favorites WHERE user_id = ? AND type = ? AND target_id = ?', 
            [req.user.id, type, target_id]);
            
        if (existing) {
            await db.run('DELETE FROM favorites WHERE id = ?', [existing.id]);
            res.json({ message: 'Removed from favorites', action: 'removed' });
        } else {
            await db.run('INSERT INTO favorites (user_id, type, target_id, target_name) VALUES (?, ?, ?, ?)', 
                [req.user.id, type, target_id, target_name]);
            res.json({ message: 'Added to favorites', action: 'added' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error toggling favorite' });
    }
});

module.exports = router;
