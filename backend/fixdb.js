// fixdb.js — Run this ONCE to fix your database immediately
// Usage: node fixdb.js
// Place this file inside your backend/ folder

const sqlite3 = require('sqlite3').verbose();
const path    = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'aromea.db'), err => {
    if (err) { console.error('Cannot open DB:', err.message); process.exit(1); }
    console.log('Connected to aromea.db');
});

async function fix() {
    try {
        // Step 1: Clear old data
        await run('DELETE FROM ORDER_ITEMS');
        await run('DELETE FROM ONLINE_ORDERS');
        await run('DELETE FROM MENU_ITEMS');
        await run('DELETE FROM CATEGORIES');
        console.log('✅ Old data cleared');

        // Step 2: Insert correct categories
        await run(`INSERT INTO CATEGORIES (category_id, name, description) VALUES
            (1, 'Coffee',       'Rich and aromatic coffee beverages'),
            (2, 'Snacks',       'Delicious snacks and light bites'),
            (3, 'Desserts',     'Sweet treats and desserts'),
            (4, 'High Protein', 'Protein-rich meals and shakes'),
            (5, 'Beverages',    'Refreshing drinks and smoothies')`);
        console.log('✅ Categories inserted');

        // Step 3: Insert correct 13 menu items
        // is_veg: 1=Veg, 0=Non-Veg
        const items = [
            // Coffee
            [1,  1, 'Classic Espresso',          'Rich and bold single origin espresso shot.',                    1.00,   1, 1],
            [2,  1, 'Caramel Macchiato',          'Espresso with steamed milk and sweet caramel drizzle.',        200.00, 1, 1],
            [7,  1, 'Matcha Latte',               'Premium green tea powder whisked with steamed oat milk.',      180.00, 0, 1],
            [13, 1, 'Cold Brew',                  'Smooth chilled cold brew with a perfect balance of flavor.',   120.00, 1, 1],
            [16, 1, 'Mocha',                      'Rich combination of espresso and velvety chocolate milk.',     180.00, 1, 1],
            // Snacks
            [3,  2, 'Avocado Toast',              'Sourdough toast with smashed avocado and cherry tomatoes.',    180.00, 1, 1],
            [4,  2, 'Grilled Paneer Sandwich',    'Paneer grilled with spices, lettuce, tomato and creamy mayo.',350.00, 1, 1],
            [8,  2, 'Smoked Salmon Bagel',        'Toasted bagel with cream cheese, smoked salmon and capers.',  385.00, 1, 0],
            // Desserts
            [5,  3, 'Tiramisu',                   'Italian dessert with coffee-soaked ladyfingers and mascarpone.',225.00,1, 0],
            [6,  3, 'Vegan Chocolate Brownie',    'Fudgy brownie made with almond flour and dark chocolate.',    215.00, 1, 1],
            // High Protein
            [10, 4, 'Egg White Spinach Omelette', 'Fluffy egg whites, feta cheese and spinach. (25g Protein)',   150.00, 1, 0], // non-veg (eggs)
            [9,  4, 'Grilled Chicken Quinoa Bowl','Power bowl 35g protein, fresh greens and house vinaigrette.', 275.00, 1, 0],
            [12, 4, 'Açaí Superfood Bowl',        'Açaí with chia seeds, peanut butter and almonds. (15g Protein)',215.00,1, 1],
        ];

        for (const [item_id, category_id, name, description, price, is_available, is_veg] of items) {
            await run(
                `INSERT INTO MENU_ITEMS (item_id, category_id, name, description, price, is_available, is_veg)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [item_id, category_id, name, description, price, is_available, is_veg]
            );
        }

        console.log('✅ 13 menu items inserted correctly');
        console.log('');
        console.log('=================================');
        console.log('DATABASE FIXED SUCCESSFULLY!');
        console.log('Items in DB:');
        
        const rows = await all('SELECT item_id, name, price FROM MENU_ITEMS ORDER BY category_id, item_id');
        rows.forEach(r => console.log(`  [${r.item_id}] ${r.name} — ₹${r.price}`));
        console.log('=================================');
        console.log('Now run: node server.js');

    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        db.close();
    }
}

function run(sql, params = []) {
    return new Promise((res, rej) => db.run(sql, params, function(err) { err ? rej(err) : res(this); }));
}

function all(sql, params = []) {
    return new Promise((res, rej) => db.all(sql, params, (err, rows) => err ? rej(err) : res(rows)));
}

fix();
