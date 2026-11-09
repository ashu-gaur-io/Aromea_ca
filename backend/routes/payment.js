const express  = require('express');
const router   = express.Router();
const Razorpay = require('razorpay');
const crypto   = require('crypto');
const auth     = require('../middleware/auth');

const RAZORPAY_KEY_ID     = process.env.RAZORPAY_KEY_ID?.trim();
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET?.trim();

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.error('Razorpay keys missing in .env');
}

const razorpay = new Razorpay({
    key_id:     RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
});

// GET /api/payment/key  — returns public key to frontend
router.get('/key', (req, res) => {
    if (!RAZORPAY_KEY_ID) return res.status(500).json({ msg: 'Razorpay Key ID not configured' });
    res.json({ key: RAZORPAY_KEY_ID });
});

// POST /api/payment/create-order
// IMPORTANT: frontend sends amount already in PAISE (multiplied by 100 in cart.html)
// Do NOT multiply again here
router.post('/create-order', auth, async (req, res) => {
    try {
        let { amount } = req.body;
        // Frontend sends rupees (e.g. 1.05)
        // Razorpay needs paise (multiply by 100)
        amount = Math.round(Number(amount) * 100);
        if (!amount || amount < 100) amount = 100; // minimum 100 paise = ₹1

        const order = await razorpay.orders.create({
            amount,             // paise — already correct from frontend
            currency: 'INR',
            receipt: 'rcpt_' + Date.now()
        });

        res.json({ id: order.id, amount: order.amount, currency: order.currency });
    } catch (err) {
        console.error('create-order error:', err);
        res.status(500).json({ msg: 'Payment gateway error', details: err.message });
    }
});

// POST /api/payment/verify
router.post('/verify', auth, (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
            return res.status(400).json({ msg: 'Missing verification fields' });

        const expected = crypto
            .createHmac('sha256', RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (expected === razorpay_signature)
            res.json({ verified: true });
        else
            res.status(400).json({ msg: 'Signature mismatch — verification failed' });
    } catch (err) {
        console.error('verify error:', err);
        res.status(500).json({ msg: 'Verification error', details: err.message });
    }
});

module.exports = router;
