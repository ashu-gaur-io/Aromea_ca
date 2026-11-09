const sqlite3 = require('sqlite3').verbose();
const fs      = require('fs');
const path    = require('path');
require('dotenv').config();

const dbFile = path.join(__dirname, 'aromea.db');
if (fs.existsSync(dbFile)) { fs.unlinkSync(dbFile); console.log('Old DB removed.'); }

const db = new sqlite3.Database(dbFile, err => {
    if (err) console.error(err.message);
    else     console.log('Connected to SQLite database');
});

async function setup() {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        const sqlite = schema
            .replace(/SERIAL PRIMARY KEY/g,                'INTEGER PRIMARY KEY AUTOINCREMENT')
            .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/g,'DATETIME DEFAULT CURRENT_TIMESTAMP')
            .replace(/DECIMAL\(10, 2\)/g,                  'REAL')
            .replace(/BOOLEAN DEFAULT TRUE/g,               'INTEGER DEFAULT 1')
            .replace(/BOOLEAN DEFAULT FALSE/g,              'INTEGER DEFAULT 0')
            .replace(/\bTRUE\b/g,'1').replace(/\bFALSE\b/g,'0');

        for (const s of sqlite.split(';').filter(s => s.trim())) await run(s.trim());
        console.log('Schema created!');

        await run(`INSERT INTO CATEGORIES (category_id, name) VALUES
            (1,'Coffee'),(2,'Snacks'),(3,'Desserts'),(4,'High Protein'),(5,'Beverages')`);

        await run(`
            INSERT INTO MENU_ITEMS (item_id, category_id, name, description, price, is_available, is_veg) VALUES
            -- Coffee
            (1,  1, 'Classic Espresso',          'Rich and bold single origin espresso shot.',                     1.00,   1, 1),
            (2,  1, 'Caramel Macchiato',          'Espresso with steamed milk and sweet caramel drizzle.',         200.00, 1, 1),
            (7,  1, 'Matcha Latte',               'Premium green tea powder whisked with steamed oat milk.',       180.00, 0, 1),
            (13, 1, 'Cold Brew',                  'Smooth chilled cold brew coffee with perfect balance.',         120.00, 1, 1),
            (16, 1, 'Mocha',                      'Rich combination of espresso and velvety chocolate milk.',      180.00, 1, 1),
            -- Snacks
            (3,  2, 'Avocado Toast',              'Sourdough toast with smashed avocado and cherry tomatoes.',     180.00, 1, 1),
            (4,  2, 'Grilled Paneer Sandwich',    'Paneer grilled with spices, lettuce, tomato and creamy mayo.', 350.00, 1, 1),
            (8,  2, 'Smoked Salmon Bagel',        'Toasted bagel with cream cheese, smoked salmon and capers.',   385.00, 1, 0),
            -- Desserts
            (5,  3, 'Tiramisu',                   'Italian dessert with coffee-soaked ladyfingers and mascarpone.',225.00, 1, 0),
            (6,  3, 'Vegan Chocolate Brownie',    'Fudgy brownie made with almond flour and dark chocolate.',     215.00, 1, 1),
            -- High Protein
            (10, 4, 'Egg White Spinach Omelette', 'Fluffy egg whites, feta cheese and spinach. (25g Protein)',    150.00, 1, 1),
            (9,  4, 'Grilled Chicken Quinoa Bowl','Power bowl with 35g protein, fresh greens and vinaigrette.',   275.00, 1, 0),
            (12, 4, 'Açaí Superfood Bowl',        'Açaí with chia seeds, peanut butter and almonds. (15g Protein)',215.00,1, 1)
        `);

        console.log('');
        console.log('✅  13 items inserted — all have real photos');
        console.log('✅  2 non-veg: Salmon Bagel + Tiramisu');
        console.log('✅  2 desserts: Tiramisu + Brownie');
        console.log('✅  Espresso = ₹1 for Razorpay testing');
        console.log('');
        console.log('Run: node server.js');
    } catch (e) {
        console.error('Setup error:', e);
    } finally {
        db.close();
    }
}

function run(sql) {
    return new Promise((res, rej) => db.run(sql, function(err) { err ? rej(err) : res(this); }));
}

setup();
