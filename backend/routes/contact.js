const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST api/contact
// @desc    Submit a contact message
// @access  Public
router.post('/', (req, res) => {
    const { name, email, subject, message } = req.body;

    db.run(
        `INSERT INTO CONTACT_MESSAGES (name, email, subject, message)
         VALUES (?, ?, ?, ?)`,
        [name, email, subject, message],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            res.json({
                message_id: this.lastID,
                name,
                email,
                subject,
                message,
                submitted_at: new Date().toISOString()
            });
        }
    );
});

// @route   GET api/contact
// @desc    Get all contact messages (Admin only)
// @access  Private/Admin
router.get('/', auth, admin, (req, res) => {
    db.all(
        'SELECT * FROM CONTACT_MESSAGES ORDER BY submitted_at DESC',
        [],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            res.json(rows);
        }
    );
});

// @route   DELETE api/contact/:id
// @desc    Delete a contact message (Admin only)
// @access  Private/Admin
router.delete('/:id', auth, admin, (req, res) => {
    db.run(
        'DELETE FROM CONTACT_MESSAGES WHERE message_id = ?',
        [req.params.id],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            if (this.changes === 0) {
                return res.status(404).json({ msg: 'Message not found' });
            }
            res.json({ msg: 'Message deleted successfully' });
        }
    );
});

module.exports = router;
