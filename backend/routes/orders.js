const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST api/orders
// @desc    Place a new order
// @access  Private
router.post('/', auth, (req, res) => {
    const { items, total_amount, payment_mode, delivery_type } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ msg: 'Order items cannot be empty' });
    }

    // Begin transaction
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Insert into ONLINE_ORDERS
        db.run(
            `INSERT INTO ONLINE_ORDERS (user_id, total_amount, status, payment_mode, delivery_type)
             VALUES (?, ?, ?, ?, ?)`,
            [req.user.id, total_amount, 'pending', payment_mode, delivery_type],
            function(err) {
                if (err) {
                    console.error('ONLINE_ORDERS INSERT ERROR:', err.message);
                    db.run('ROLLBACK');
                    return res.status(500).json({ msg: 'Failed to create order. Please try again.', details: err.message });
                }

                const orderId = this.lastID;

                // Insert into ORDER_ITEMS
                let completed = 0;
                const totalItems = items.length;

                items.forEach((item, index) => {
                    const { item_id, quantity, unit_price, subtotal } = item;
                    db.run(
                        `INSERT INTO ORDER_ITEMS (order_id, item_id, quantity, unit_price, subtotal)
                         VALUES (?, ?, ?, ?, ?)`,
                        [orderId, item_id, quantity, unit_price, subtotal],
                        function(err) {
                            if (err) {
                                console.error('ORDER_ITEM INSERT ERROR:', err.message, { orderId, item });
                                db.run('ROLLBACK');
                                return res.status(500).json({ msg: 'Order item save failed', error: err.message });
                            }

                            completed++;
                            if (completed === totalItems) {
                                // Commit transaction
                                db.run('COMMIT', (err) => {
                                    if (err) {
                                        console.error('COMMIT ERROR:', err.message);
                                        return res.status(500).json({ msg: 'Order commit failed', error: err.message });
                                    }
                                    res.json({ msg: 'Order placed successfully', order_id: orderId });
                                });
                            }
                        }
                    );
                });
            }
        );
    });
});

// @route   GET api/orders
// @desc    Get logged in user orders
// @access  Private
router.get('/', auth, (req, res) => {
    const query = `
        SELECT o.order_id, o.total_amount, o.status, o.payment_mode, o.delivery_type, o.order_date,
               oi.item_id, oi.quantity, oi.unit_price, oi.subtotal,
               mi.name as item_name, mi.description as item_description
        FROM ONLINE_ORDERS o
        LEFT JOIN ORDER_ITEMS oi ON o.order_id = oi.order_id
        LEFT JOIN MENU_ITEMS mi ON oi.item_id = mi.item_id
        WHERE o.user_id = ?
        ORDER BY o.order_date DESC
    `;

    db.all(query, [req.user.id], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }

        // Group orders with their items
        const orders = {};
        rows.forEach(row => {
            if (!orders[row.order_id]) {
                orders[row.order_id] = {
                    order_id: row.order_id,
                    total_amount: row.total_amount,
                    status: row.status,
                    payment_mode: row.payment_mode,
                    delivery_type: row.delivery_type,
                    order_date: row.order_date,
                    items: []
                };
            }

            if (row.item_id) {
                orders[row.order_id].items.push({
                    item_id: row.item_id,
                    name: row.item_name,
                    description: row.item_description,
                    quantity: row.quantity,
                    unit_price: row.unit_price,
                    subtotal: row.subtotal
                });
            }
        });

        res.json(Object.values(orders));
    });
});

// @route   GET api/orders/all
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/all', auth, admin, (req, res) => {
    const query = `
        SELECT o.order_id, o.total_amount, o.status, o.payment_mode, o.delivery_type, o.order_date,
               u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
               oi.item_id, oi.quantity, oi.unit_price, oi.subtotal,
               mi.name as item_name
        FROM ONLINE_ORDERS o
        LEFT JOIN USERS u ON o.user_id = u.user_id
        LEFT JOIN ORDER_ITEMS oi ON o.order_id = oi.order_id
        LEFT JOIN MENU_ITEMS mi ON oi.item_id = mi.item_id
        ORDER BY o.order_date DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }

        // Group orders with their items
        const orders = {};
        rows.forEach(row => {
            if (!orders[row.order_id]) {
                orders[row.order_id] = {
                    order_id: row.order_id,
                    customer_name: row.customer_name,
                    customer_email: row.customer_email,
                    customer_phone: row.customer_phone,
                    total_amount: row.total_amount,
                    status: row.status,
                    payment_mode: row.payment_mode,
                    delivery_type: row.delivery_type,
                    order_date: row.order_date,
                    items: []
                };
            }

            if (row.item_id) {
                orders[row.order_id].items.push({
                    item_id: row.item_id,
                    name: row.item_name,
                    quantity: row.quantity,
                    unit_price: row.unit_price,
                    subtotal: row.subtotal
                });
            }
        });

        res.json(Object.values(orders));
    });
});

// @route   PUT api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id/status', auth, admin, (req, res) => {
    const { status } = req.body;
    db.run(
        'UPDATE ONLINE_ORDERS SET status = ? WHERE order_id = ?',
        [status, req.params.id],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            }
            if (this.changes === 0) {
                return res.status(404).json({ msg: 'Order not found' });
            }
            res.json({ msg: 'Order status updated successfully' });
        }
    );
});

// @route   DELETE api/orders/:id
// @desc    Delete/Cancel an order
// @access  Private (User/Admin)
router.delete('/:id', auth, (req, res) => {
    // If not admin, ensure order belongs to user
    const query = req.user.role === 'admin'
        ? 'DELETE FROM ONLINE_ORDERS WHERE order_id = ?'
        : 'DELETE FROM ONLINE_ORDERS WHERE order_id = ? AND user_id = ?';

    const params = req.user.role === 'admin'
        ? [req.params.id]
        : [req.params.id, req.user.id];

    db.run(query, params, function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
        if (this.changes === 0) {
            return res.status(404).json({ msg: 'Order not found or user not authorized' });
        }
        res.json({ msg: 'Order deleted successfully' });
    });
});

module.exports = router;
