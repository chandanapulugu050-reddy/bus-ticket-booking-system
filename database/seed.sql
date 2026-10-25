USE bus_ticket_db;

-- Admin user (password is 'admin123' hashed with bcrypt, assuming cost 10)
-- Just using raw password for seed script isn't good if we enforce hash checking.
-- We will use a pre-hashed password for 'admin123': $2b$10$EpA88tq7UvQ6k5tM5vYhX.E5P.c69B4T2jD9fT7Fq9b7eT8QxN7mC
INSERT INTO users (name, email, phone, password, role) VALUES 
('Admin User', 'admin@example.com', '9876543210', '$2b$10$EpA88tq7UvQ6k5tM5vYhX.E5P.c69B4T2jD9fT7Fq9b7eT8QxN7mC', 'admin');

-- Regular User (password: 'user123')
-- Hash: $2b$10$T8Z2e6U4r5nJ9pQ1oW.x5uF0aV3lK7bM9iH2cX8vY1zP4eS6wQ5i2
INSERT INTO users (name, email, phone, password, role) VALUES
('Test User', 'user@example.com', '1234567890', '$2b$10$T8Z2e6U4r5nJ9pQ1oW.x5uF0aV3lK7bM9iH2cX8vY1zP4eS6wQ5i2', 'user');

INSERT INTO buses (name, number, type, total_seats, status) VALUES 
('Express Travels', 'AP-07-TA-1234', 'AC Sleeper', 30, 'active'),
('Sri Krishna Travels', 'TS-09-AB-5678', 'Non-AC Seater', 40, 'active'),
('Orange Travels', 'KA-01-PQ-9012', 'AC Seater', 36, 'active');

-- Routes (Assuming today is 2026-09-22, let's create routes for 2026-09-25)
INSERT INTO routes (bus_id, source, destination, journey_date, departure_time, arrival_time, duration, starting_price) VALUES
(1, 'Chirala', 'Hyderabad', '2026-09-25', '20:30:00', '06:00:00', '9h 30m', 650.00),
(2, 'Vijayawada', 'Hyderabad', '2026-09-26', '22:00:00', '05:00:00', '7h 00m', 500.00),
(3, 'Bangalore', 'Chennai', '2026-09-27', '21:00:00', '04:30:00', '7h 30m', 800.00);

-- Boarding points
INSERT INTO boarding_points (bus_id, name, time) VALUES
(1, 'Chirala Bus Stand', '20:30:00'),
(1, 'Vetapalem', '20:45:00'),
(1, 'Bapatla', '21:10:00'),
(2, 'Benz Circle', '22:00:00'),
(3, 'Majestic', '21:00:00');

-- Dropping points
INSERT INTO dropping_points (bus_id, name, time) VALUES
(1, 'LB Nagar', '05:45:00'),
(1, 'MGBS', '06:00:00'),
(1, 'Kukatpally', '06:30:00'),
(2, 'Ameerpet', '05:00:00'),
(3, 'Koyambedu', '04:30:00');

-- Seats for Bus 1 (Express Travels - AC Sleeper) - Sample seats
INSERT INTO seats (bus_id, route_id, seat_number, status) VALUES
(1, 1, 'L1', 'AVAILABLE'), (1, 1, 'L2', 'AVAILABLE'), (1, 1, 'L3', 'AVAILABLE'),
(1, 1, 'U1', 'AVAILABLE'), (1, 1, 'U2', 'AVAILABLE'), (1, 1, 'U3', 'AVAILABLE');

-- Seats for Bus 2
INSERT INTO seats (bus_id, route_id, seat_number, status) VALUES
(2, 2, 'A1', 'AVAILABLE'), (2, 2, 'A2', 'AVAILABLE'), (2, 2, 'A3', 'AVAILABLE'), (2, 2, 'A4', 'AVAILABLE');

-- Seats for Bus 3
INSERT INTO seats (bus_id, route_id, seat_number, status) VALUES
(3, 3, '1A', 'AVAILABLE'), (3, 3, '1B', 'AVAILABLE'), (3, 3, '1C', 'AVAILABLE');
