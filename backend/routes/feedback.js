const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST api/feedback
// @desc    Submit feedback
// @access  Private (or Public, but ER diagram links user_id)
router.post('/', auth, (req, res) => {
    const { item_id, rating, message } = req.body;

    db.run(
        `INSERT INTO FEEDBACK (user_id, item_id, rating, message)
         VALUES (?, ?, ?, ?)`,
        [req.user.id, item_id || null, rating, message],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            res.json({
                feedback_id: this.lastID,
                user_id: req.user.id,
                item_id: item_id || null,
                rating,
                message,
                submitted_at: new Date().toISOString()
            });
        }
    );
});

// @route   GET api/feedback
// @desc    Get all feedback
// @access  Public
router.get('/', (req, res) => {
    const query = `
        SELECT f.*, u.name as customer_name, m.name as item_name
        FROM FEEDBACK f
        LEFT JOIN USERS u ON f.user_id = u.user_id
        LEFT JOIN MENU_ITEMS m ON f.item_id = m.item_id
        ORDER BY f.submitted_at DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
        res.json(rows);
    });
});

// @route   GET api/feedback/item/:id
// @desc    Get feedback for a specific menu item
// @access  Public
router.get('/item/:id', (req, res) => {
    const query = `
        SELECT f.*, u.name as customer_name
        FROM FEEDBACK f
        LEFT JOIN USERS u ON f.user_id = u.user_id
        WHERE f.item_id = ?
        ORDER BY f.submitted_at DESC
    `;
    db.all(query, [req.params.id], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
        res.json(rows);
    });
});

// @route   PUT api/feedback/:id
// @desc    Update feedback
// @access  Private (User only)
router.put('/:id', auth, (req, res) => {
    const { rating, message } = req.body;
    db.run(
        'UPDATE FEEDBACK SET rating = ?, message = ? WHERE feedback_id = ? AND user_id = ?',
        [rating, message, req.params.id, req.user.id],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            if (this.changes === 0) {
                return res.status(404).json({ msg: 'Feedback not found or unauthorized' });
            }
            res.json({ msg: 'Feedback updated successfully' });
        }
    );
});

// @route   DELETE api/feedback/:id
// @desc    Delete feedback
// @access  Private (User/Admin)
router.delete('/:id', auth, (req, res) => {
    const query = req.user.role === 'admin'
        ? 'DELETE FROM FEEDBACK WHERE feedback_id = ?'
        : 'DELETE FROM FEEDBACK WHERE feedback_id = ? AND user_id = ?';

    const params = req.user.role === 'admin'
        ? [req.params.id]
        : [req.params.id, req.user.id];

    db.run(query, params, function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
        if (this.changes === 0) {
            return res.status(404).json({ msg: 'Feedback not found or unauthorized' });
        }
        res.json({ msg: 'Feedback deleted successfully' });
    });
});

module.exports = router;
