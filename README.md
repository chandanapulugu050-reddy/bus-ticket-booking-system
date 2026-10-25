# Bus Ticket Confirmation System

This is a complete, real-world style Bus Ticket Confirmation System built as a college full-stack development project. It features user authentication, real-time bus and seat searches, seat selection, double-booking prevention, and digital ticket confirmation.

## Features

*   **Authentication**: Register and login with JWT and bcrypt.
*   **Bus Search**: Search buses by source, destination, and date.
*   **Seat Selection**: Visual seat layout showing Available, Selected, and Booked seats.
*   **Concurrency Handling**: Database-level transactions ensure double-booking prevention.
*   **Booking Summary & Payment**: Review details and simulate payment.
*   **Ticket Confirmation**: Generates a realistic printable ticket with a PNR and QR code.
*   **My Bookings**: View booking history and cancel tickets.

## Technology Stack

*   **Frontend**: React.js, Vite, Tailwind CSS, React Router, Lucide Icons.
*   **Backend**: Node.js, Express.js.
*   **Database**: MySQL.
*   **Security**: JWT for API auth, bcrypt for password hashing.

## Architecture & Database Design

The system uses a 3-tier architecture. The frontend (React) communicates via REST API to the Node.js backend, which interfaces with a normalized MySQL database.
The core database tables include `users`, `buses`, `routes`, `seats`, `bookings`, `passengers`, `boarding_points`, and `dropping_points`. 
Relationships are normalized (e.g. `bookings` has a foreign key to `users` and `buses`). 
Double booking is prevented using `FOR UPDATE` row-level locks on the `seats` table during checkout.

## Installation & Setup

### Prerequisites
*   Node.js installed (v16+)
*   MySQL Server installed and running on port 3306

### 1. Database Setup
1. Log into your MySQL server (e.g. `mysql -u root -p`).
2. Run the `database/schema.sql` script to create the tables.
3. Run the `database/seed.sql` script to insert sample buses, routes, and admin users.

### 2. Backend Setup
1. Open terminal and navigate to `/backend`.
2. Install dependencies: `npm install`
3. Edit `/backend/.env` with your actual MySQL credentials (update `DB_USER` and `DB_PASSWORD`).
4. Start the server: `npm run dev` (Runs on `http://localhost:5000`)

### 3. Frontend Setup
1. Open another terminal and navigate to `/frontend`.
2. Install dependencies: `npm install`
3. Start the Vite server: `npm run dev` (Runs on `http://localhost:5173`)

## Sample Demo Data

**Admin Credentials**:
*   Email: `admin@example.com`
*   Password: `admin123`

**Test User Credentials**:
*   Email: `user@example.com`
*   Password: `user123`

**Sample Search**:
*   From: Chirala
*   To: Hyderabad
*   Date: 2026-09-25

## Future Enhancements
*   Integrate a real payment gateway (Razorpay/Stripe).
*   Integrate SMS/Email notification on ticket confirmation.
*   Build a complete interactive admin dashboard.
*   Add Live GPS Bus Tracking simulation.
