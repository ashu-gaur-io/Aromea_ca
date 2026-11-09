-- schema.sql
-- Create Enum types if needed or just use VARCHAR. Using VARCHAR with CHECK constraints is safer across environments.

CREATE TABLE IF NOT EXISTS CATEGORIES (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS MENU_ITEMS (
    item_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES CATEGORIES(category_id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_veg BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS USERS (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS CONTACT_MESSAGES (
    message_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ONLINE_ORDERS (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES USERS(user_id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
    payment_mode VARCHAR(50),
    delivery_type VARCHAR(50) DEFAULT 'delivery' CHECK (delivery_type IN ('delivery', 'pickup')),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ORDER_ITEMS (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES ONLINE_ORDERS(order_id) ON DELETE CASCADE,
    item_id INT REFERENCES MENU_ITEMS(item_id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS FEEDBACK (
    feedback_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES USERS(user_id) ON DELETE SET NULL,
    item_id INT REFERENCES MENU_ITEMS(item_id) ON DELETE SET NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    message TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS SEAT_RESERVATIONS (
    reservation_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES USERS(user_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    guests INT NOT NULL,
    seating_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);
