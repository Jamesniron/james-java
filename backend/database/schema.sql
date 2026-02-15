-- Active: 1770811534415@@127.0.0.1@3306@mysql
-- Database Schema for MySQL

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'STAFF') NOT NULL DEFAULT 'STAFF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number INT NOT NULL UNIQUE,
    type ENUM(
        'Single',
        'Double',
        'Deluxe',
        'Suite'
    ) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    room_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_nights INT,
    total_amount DECIMAL(10, 2),
    status ENUM(
        'PENDING',
        'CONFIRMED',
        'CANCELLED',
        'CHECKED_OUT'
    ) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms (id)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50) DEFAULT 'CASH',
    FOREIGN KEY (reservation_id) REFERENCES reservations (id)
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    username VARCHAR(50),
    action VARCHAR(50) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- Insert Initial Users
INSERT IGNORE INTO
    users (
        id,
        username,
        password_hash,
        role
    )
VALUES (
        1,
        'admin',
        '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
        'ADMIN'
    ),
    (
        2,
        'staff',
        '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgdtix7HE8n.shnV767T1L.A6SBy',
        'STAFF'
    );

-- Insert Initial Rooms
INSERT IGNORE INTO
    rooms (
        room_number,
        type,
        price_per_night
    )
VALUES (101, 'Single', 30000.00),
    (102, 'Single', 30000.00),
    (103, 'Single', 33000.00),
    (104, 'Single', 33000.00),
    (201, 'Double', 45000.00),
    (202, 'Double', 45000.00),
    (203, 'Double', 48000.00),
    (204, 'Double', 48000.00),
    (301, 'Deluxe', 60000.00),
    (302, 'Deluxe', 66000.00),
    (401, 'Suite', 105000.00),
    (402, 'Suite', 120000.00),
    (403, 'Suite', 135000.00);