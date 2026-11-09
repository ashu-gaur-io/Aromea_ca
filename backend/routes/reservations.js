const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST api/reservations
// @desc    Make a seat reservation
// @access  Private
router.post('/', auth, (req, res) => {
    const { date, time, guests, seating_type } = req.body;

    db.run(
        `INSERT INTO SEAT_RESERVATIONS (user_id, date, time, guests, seating_type, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [req.user.id, date, time, guests, seating_type, 'pending'],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            res.json({
                reservation_id: this.lastID,
                user_id: req.user.id,
                date,
                time,
                guests,
                seating_type,
                status: 'pending'
            });
        }
    );
});

// @route   GET api/reservations
// @desc    Get user reservations
// @access  Private
router.get('/', auth, (req, res) => {
    db.all(
        'SELECT * FROM SEAT_RESERVATIONS WHERE user_id = ? ORDER BY date DESC, time DESC',
        [req.user.id],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            res.json(rows);
        }
    );
});

// @route   GET api/reservations/all
// @desc    Get all reservations (Admin only)
// @access  Private/Admin
router.get('/all', auth, admin, (req, res) => {
    const query = `
        SELECT r.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
        FROM SEAT_RESERVATIONS r
        LEFT JOIN USERS u ON r.user_id = u.user_id
        ORDER BY r.date DESC, r.time DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
        res.json(rows);
    });
});

// @route   PUT api/reservations/:id
// @desc    Update reservation details (User)
// @access  Private
router.put('/:id', auth, (req, res) => {
    const { date, time, guests, seating_type } = req.body;
    
    // Only allow updating if it matches the user
    db.run(
        'UPDATE SEAT_RESERVATIONS SET date = ?, time = ?, guests = ?, seating_type = ? WHERE reservation_id = ? AND user_id = ?',
        [date, time, guests, seating_type, req.params.id, req.user.id],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            if (this.changes === 0) {
                return res.status(404).json({ msg: 'Reservation not found or unauthorized' });
            }
            res.json({ msg: 'Reservation updated successfully' });
        }
    );
});

// @route   PUT api/reservations/:id/status
// @desc    Update reservation status (Admin only)
// @access  Private/Admin
router.put('/:id/status', auth, admin, (req, res) => {
    const { status } = req.body;
    db.run(
        'UPDATE SEAT_RESERVATIONS SET status = ? WHERE reservation_id = ?',
        [status, req.params.id],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            if (this.changes === 0) {
                return res.status(404).json({ msg: 'Reservation not found' });
            }
            res.json({ msg: 'Reservation status updated successfully' });
        }
    );
});

// @route   DELETE api/reservations/:id
// @desc    Delete/Cancel a reservation
// @access  Private (User/Admin)
router.delete('/:id', auth, (req, res) => {
    // If not admin, ensure reservation belongs to user
    const query = req.user.role === 'admin'
        ? 'DELETE FROM SEAT_RESERVATIONS WHERE reservation_id = ?'
        : 'DELETE FROM SEAT_RESERVATIONS WHERE reservation_id = ? AND user_id = ?';

    const params = req.user.role === 'admin'
        ? [req.params.id]
        : [req.params.id, req.user.id];

    db.run(query, params, function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
        if (this.changes === 0) {
            return res.status(404).json({ msg: 'Reservation not found or unauthorized' });
        }
        res.json({ msg: 'Reservation deleted successfully' });
    });
});

module.exports = router;
