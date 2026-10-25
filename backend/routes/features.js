const express = require('express');
const router = express.Router();
const { getDb } = require('../config/db');

// --- COUPONS ---
router.post('/coupons/validate', async (req, res) => {
    try {
        const { code, amount } = req.body;
        const db = await getDb();
        const coupon = await db.get('SELECT * FROM coupons WHERE code = ? AND status = ?', [code, 'ACTIVE']);

        if (!coupon) return res.status(400).json({ valid: false, message: 'Invalid or expired coupon' });
        
        if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
            return res.status(400).json({ valid: false, message: 'Coupon expired' });
        }
        
        if (coupon.min_amount && amount < coupon.min_amount) {
            return res.status(400).json({ valid: false, message: `Minimum amount ₹${coupon.min_amount} required` });
        }

        let discount = 0;
        if (coupon.discount_type === 'FLAT') {
            discount = coupon.discount_value;
        } else if (coupon.discount_type === 'PERCENT') {
            discount = (amount * coupon.discount_value) / 100;
        }
        
        if (coupon.max_discount && discount > coupon.max_discount) {
            discount = coupon.max_discount;
        }

        res.json({ valid: true, discount, final_amount: amount - discount, message: 'Coupon applied successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- WALLET ---
router.get('/wallet/:userId', async (req, res) => {
    try {
        const db = await getDb();
        const wallet = await db.get('SELECT * FROM wallets WHERE user_id = ?', [req.params.userId]);
        if (!wallet) return res.json({ balance: 0 });
        
        const transactions = await db.all('SELECT * FROM wallet_transactions WHERE wallet_id = ? ORDER BY created_at DESC', [wallet.id]);
        res.json({ ...wallet, transactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
