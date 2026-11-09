const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET api/menu
// @desc    Get all menu items and categories
// @access  Public
router.get('/', (req, res) => {
    console.log('Menu route called');
    const query = `
        SELECT m.item_id, m.name, m.description, m.price, m.is_available, m.is_veg, c.name as category_name
        FROM MENU_ITEMS m
        LEFT JOIN CATEGORIES c ON m.category_id = c.category_id
    `;

    db.all(query, [], (err, rows) => {
        console.log('Query result:', err, rows ? rows.length : 'no rows');
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).send('Server Error');
        }
        res.json(rows);
    });
});

// @route   GET api/menu/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', (req, res) => {
    db.all('SELECT * FROM CATEGORIES', [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
        res.json(rows);
    });
});

// @route   POST api/menu/categories
// @desc    Create a category
// @access  Private/Admin
router.post('/categories', auth, admin, (req, res) => {
    const { name, description } = req.body;
    db.run(
        'INSERT INTO CATEGORIES (name, description) VALUES (?, ?)',
        [name, description],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            res.json({ category_id: this.lastID, name, description });
        }
    );
});

// @route   PUT api/menu/categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put('/categories/:id', auth, admin, (req, res) => {
    const { name, description } = req.body;
    db.run(
        'UPDATE CATEGORIES SET name = ?, description = ? WHERE category_id = ?',
        [name, description, req.params.id],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            res.json({ msg: 'Category updated successfully' });
        }
    );
});

// @route   DELETE api/menu/categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete('/categories/:id', auth, admin, (req, res) => {
    db.run(
        'DELETE FROM CATEGORIES WHERE category_id = ?',
        [req.params.id],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            res.json({ msg: 'Category deleted successfully' });
        }
    );
});

// @route   POST api/menu
// @desc    Create a menu item
// @access  Private/Admin
router.post('/', auth, admin, (req, res) => {
    const { category_id, name, description, price, is_available, is_veg } = req.body;
    db.run(
        'INSERT INTO MENU_ITEMS (category_id, name, description, price, is_available, is_veg) VALUES (?, ?, ?, ?, ?, ?)',
        [category_id, name, description, price, is_available, is_veg],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            res.json({ item_id: this.lastID, msg: 'Menu item created successfully' });
        }
    );
});

// @route   PUT api/menu/:id
// @desc    Update a menu item
// @access  Private/Admin
router.put('/:id', auth, admin, (req, res) => {
    const { category_id, name, description, price, is_available, is_veg } = req.body;
    db.run(
        'UPDATE MENU_ITEMS SET category_id = ?, name = ?, description = ?, price = ?, is_available = ?, is_veg = ? WHERE item_id = ?',
        [category_id, name, description, price, is_available, is_veg, req.params.id],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            res.json({ msg: 'Menu item updated successfully' });
        }
    );
});

// @route   PATCH api/menu/:id/price
// @desc    Update only the price of a menu item
// @access  Private/Admin
router.patch('/:id/price', auth, admin, (req, res) => {
    const { price } = req.body;
    db.run(
        'UPDATE MENU_ITEMS SET price = ? WHERE item_id = ?',
        [price, req.params.id],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            res.json({ msg: 'Price updated successfully' });
        }
    );
});


// @route   DELETE api/menu/:id
// @desc    Delete a menu item
// @access  Private/Admin
router.delete('/:id', auth, admin, (req, res) => {
    db.run(
        'DELETE FROM MENU_ITEMS WHERE item_id = ?',
        [req.params.id],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            res.json({ msg: 'Menu item deleted successfully' });
        }
    );
});

module.exports = router;
