const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    db.get('SELECT * FROM USERS WHERE email = ?', [email], async (err, user) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        try {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert User
            db.run(
                'INSERT INTO USERS (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
                [name, email, hashedPassword, phone, 'customer'],
                function(err) {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).send('Server error');
                    }

                    const newUserId = this.lastID;

                    // Return JWT
                    const payload = { user: { id: newUserId, role: 'customer' } };

                    jwt.sign(
                        payload,
                        process.env.JWT_SECRET,
                        { expiresIn: 360000 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({ token, user: { id: newUserId, name, email, role: 'customer' } });
                        }
                    );
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    db.get('SELECT * FROM USERS WHERE email = ?', [email], async (err, user) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        try {
            // Match password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            // Return JWT
            const payload = { user: { id: user.user_id, role: user.role } };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, user: { id: user.user_id, name: user.name, email: user.email, role: user.role } });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });
});

// @route   GET api/auth
// @desc    Get logged in user details
// @access  Private
router.get('/', (req, res) => {
    db.get(
        'SELECT user_id, name, email, phone, role, created_at FROM USERS WHERE user_id = ?',
        [req.user.id],
        (err, user) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server error');
            }

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            res.json(user);
        }
    );
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    const { name, phone, password } = req.body;

    try {
        let updateQuery = 'UPDATE USERS SET name = ?, phone = ?';
        let queryParams = [name, phone];

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateQuery += ', password = ?';
            queryParams.push(hashedPassword);
        }

        updateQuery += ' WHERE user_id = ?';
        queryParams.push(req.user.id);

        db.run(updateQuery, queryParams, function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            res.json({ msg: 'Profile updated successfully' });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/all
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/all', auth, admin, (req, res) => {
    db.all(
        'SELECT user_id, name, email, phone, role, created_at FROM USERS ORDER BY created_at DESC',
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

// @route   PUT api/auth/:id/role
// @desc    Update user role (Admin only)
// @access  Private/Admin
router.put('/:id/role', auth, admin, (req, res) => {
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
        return res.status(400).json({ msg: 'Invalid role' });
    }

    db.run(
        'UPDATE USERS SET role = ? WHERE user_id = ?',
        [role, req.params.id],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            if (this.changes === 0) {
                return res.status(404).json({ msg: 'User not found' });
            }
            res.json({ msg: 'User role updated successfully' });
        }
    );
});

// @route   DELETE api/auth/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/:id', auth, admin, (req, res) => {
    db.run(
        'DELETE FROM USERS WHERE user_id = ?',
        [req.params.id],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            if (this.changes === 0) {
                return res.status(404).json({ msg: 'User not found' });
            }
            res.json({ msg: 'User deleted successfully' });
        }
    );
});

module.exports = router;
