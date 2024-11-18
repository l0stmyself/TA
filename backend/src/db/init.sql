CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    pickup_location JSONB NOT NULL,
    drop_location JSONB NOT NULL,
    status VARCHAR(50) NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    driver_contact VARCHAR(50) NOT NULL,
    driver_photo TEXT NOT NULL,
    vehicle_model VARCHAR(100) NOT NULL,
    vehicle_plate VARCHAR(50) NOT NULL,
    driver_rating DECIMAL(3,1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    distance DECIMAL(4,2) NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    store_id INTEGER NOT NULL REFERENCES stores(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES carts(id),
    item_id INTEGER NOT NULL REFERENCES items(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cart_id, item_id)
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    store_id INTEGER NOT NULL REFERENCES stores(id),
    delivery_address TEXT NOT NULL,
    delivery_lat DECIMAL(10, 8) NOT NULL,
    delivery_lng DECIMAL(11, 8) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    item_id INTEGER NOT NULL REFERENCES items(id),
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data for stores
INSERT INTO stores (name, category, distance, image_url) VALUES
('Campus Bookstore', 'Stationary', 0.5, '/images/stores/bookstore.jpg'),
('Quick Mart', 'Groceries', 1.2, '/images/stores/quickmart.jpg'),
('Health Plus Pharmacy', 'Medicines', 0.8, '/images/stores/pharmacy.jpg'),
('Fresh Foods Market', 'Groceries', 2.5, '/images/stores/freshfoods.jpg'),
('Student Supply Hub', 'Stationary', 1.5, '/images/stores/supplyhub.jpg'),
('Med World', 'Medicines', 3.0, '/images/stores/medworld.jpg'),
('Campus Cafe', 'Food', 0.3, '/images/stores/cafe.jpg'),
('Grocery Express', 'Groceries', 4.0, '/images/stores/grocery.jpg'),
('Food Court Central', 'Food', 0.7, '/images/stores/foodcourt.jpg'),
('University Pharmacy', 'Medicines', 1.0, '/images/stores/unipharm.jpg');

-- Seed data for items (showing a few examples, repeat similar pattern for more items)
INSERT INTO items (store_id, name, category, price, description, image_url) VALUES
(1, 'Notebook Set', 'Stationary', 12.99, 'Pack of 3 high-quality notebooks with ruled pages', '/images/items/notebooks.jpg'),
(1, 'Pen Pack', 'Stationary', 5.99, 'Set of 10 ballpoint pens in various colors', '/images/items/pens.jpg'),
(2, 'Fresh Milk', 'Groceries', 3.99, 'Fresh dairy milk - 1 liter', '/images/items/milk.jpg'),
(2, 'Bread', 'Groceries', 2.99, 'Freshly baked whole wheat bread', '/images/items/bread.jpg');

-- Add more item seed data as needed

-- Add more items for each store
INSERT INTO items (store_id, name, category, price, description, image_url) VALUES
-- Campus Bookstore (id: 1)
(1, 'Scientific Calculator', 'Stationary', 29.99, 'Advanced scientific calculator with 240 functions', '/images/items/calculator.jpg'),
(1, 'Highlighter Set', 'Stationary', 8.99, 'Pack of 6 fluorescent highlighters', '/images/items/highlighters.jpg'),
(1, 'Sticky Notes', 'Stationary', 4.99, '400 sheets in assorted colors', '/images/items/sticky-notes.jpg'),

-- Quick Mart (id: 2)
(2, 'Instant Noodles Pack', 'Groceries', 6.99, 'Pack of 6 instant noodles', '/images/items/noodles.jpg'),
(2, 'Energy Drink 6-Pack', 'Groceries', 9.99, 'Pack of 6 energy drinks', '/images/items/energy-drinks.jpg'),
(2, 'Chips Variety Pack', 'Groceries', 12.99, 'Assorted flavors of chips', '/images/items/chips.jpg'),

-- Health Plus Pharmacy (id: 3)
(3, 'Pain Relief Tablets', 'Medicines', 7.99, 'Pack of 20 tablets for headache and body pain', '/images/items/pain-relief.jpg'),
(3, 'First Aid Kit', 'Medicines', 24.99, 'Complete first aid kit for emergencies', '/images/items/first-aid.jpg'),
(3, 'Vitamin C Supplements', 'Medicines', 15.99, '60 tablets of Vitamin C', '/images/items/vitamin-c.jpg'),

-- Campus Cafe (id: 7)
(7, 'Chicken Sandwich', 'Food', 6.99, 'Fresh grilled chicken sandwich with lettuce and mayo', '/images/items/sandwich.jpg'),
(7, 'Coffee', 'Food', 3.99, 'Freshly brewed coffee', '/images/items/coffee.jpg'),
(7, 'Caesar Salad', 'Food', 8.99, 'Fresh caesar salad with grilled chicken', '/images/items/salad.jpg');

-- Add more items for other stores following the same pattern