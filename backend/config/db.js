const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcrypt');

let dbInstance = null;

async function getDb() {
    if (dbInstance) return dbInstance;

    dbInstance = await open({
        filename: path.join(__dirname, '..', 'bus_ticket_v2.db'),
        driver: sqlite3.Database
    });

    await initializeAndSeed(dbInstance);

    return dbInstance;
}

async function initializeAndSeed(db) {
    const tableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    if (tableExists) return;

    console.log("Initializing SQLite Database V2 and seeding large data...");

    await db.exec(`
        CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT NOT NULL, password TEXT NOT NULL, role TEXT DEFAULT 'user', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE buses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, number TEXT NOT NULL, type TEXT NOT NULL, amenities TEXT, total_seats INTEGER NOT NULL, status TEXT DEFAULT 'active', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE routes (id INTEGER PRIMARY KEY AUTOINCREMENT, bus_id INTEGER NOT NULL, source TEXT NOT NULL, destination TEXT NOT NULL, journey_date TEXT NOT NULL, departure_time TEXT NOT NULL, arrival_time TEXT NOT NULL, duration TEXT, starting_price REAL NOT NULL, FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE);
        CREATE TABLE boarding_points (id INTEGER PRIMARY KEY AUTOINCREMENT, bus_id INTEGER NOT NULL, name TEXT NOT NULL, time TEXT NOT NULL, FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE);
        CREATE TABLE dropping_points (id INTEGER PRIMARY KEY AUTOINCREMENT, bus_id INTEGER NOT NULL, name TEXT NOT NULL, time TEXT NOT NULL, FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE);
        CREATE TABLE seats (id INTEGER PRIMARY KEY AUTOINCREMENT, bus_id INTEGER NOT NULL, route_id INTEGER NOT NULL, seat_number TEXT NOT NULL, preference TEXT, status TEXT DEFAULT 'AVAILABLE', locked_until DATETIME, FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE, FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE);
        CREATE TABLE bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, pnr TEXT NOT NULL UNIQUE, user_id INTEGER NOT NULL, bus_id INTEGER NOT NULL, route_id INTEGER NOT NULL, journey_date TEXT NOT NULL, boarding_point_id INTEGER NOT NULL, dropping_point_id INTEGER NOT NULL, total_fare REAL NOT NULL, discount REAL DEFAULT 0, final_fare REAL NOT NULL, status TEXT DEFAULT 'PENDING', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (bus_id) REFERENCES buses(id), FOREIGN KEY (route_id) REFERENCES routes(id), FOREIGN KEY (boarding_point_id) REFERENCES boarding_points(id), FOREIGN KEY (dropping_point_id) REFERENCES dropping_points(id));
        CREATE TABLE passengers (id INTEGER PRIMARY KEY AUTOINCREMENT, booking_id INTEGER NOT NULL, seat_id INTEGER NOT NULL, name TEXT NOT NULL, age INTEGER NOT NULL, gender TEXT NOT NULL, preference TEXT, FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE, FOREIGN KEY (seat_id) REFERENCES seats(id));
        CREATE TABLE payments (id INTEGER PRIMARY KEY AUTOINCREMENT, booking_id INTEGER NOT NULL, amount REAL NOT NULL, payment_method TEXT, status TEXT DEFAULT 'PENDING', transaction_reference TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE);
        
        -- New Features Tables
        CREATE TABLE coupons (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL UNIQUE, discount_type TEXT NOT NULL, discount_value REAL NOT NULL, min_amount REAL, max_discount REAL, expiry_date DATETIME, status TEXT DEFAULT 'ACTIVE');
        CREATE TABLE wallets (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL UNIQUE, balance REAL DEFAULT 0, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
        CREATE TABLE wallet_transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, wallet_id INTEGER NOT NULL, type TEXT NOT NULL, amount REAL NOT NULL, description TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE);
        CREATE TABLE favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, type TEXT NOT NULL, target_id INTEGER NOT NULL, target_name TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
        CREATE TABLE recent_searches (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, source TEXT NOT NULL, destination TEXT NOT NULL, journey_date TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
        CREATE TABLE notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, title TEXT NOT NULL, message TEXT NOT NULL, type TEXT, is_read BOOLEAN DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
        CREATE TABLE refunds (id INTEGER PRIMARY KEY AUTOINCREMENT, booking_id INTEGER NOT NULL, amount REAL NOT NULL, status TEXT DEFAULT 'INITIATED', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE);
        CREATE TABLE saved_passengers (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, name TEXT NOT NULL, age INTEGER NOT NULL, gender TEXT NOT NULL, relationship TEXT, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
        CREATE TABLE reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, bus_id INTEGER NOT NULL, rating INTEGER NOT NULL, comment TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (bus_id) REFERENCES buses(id));
    `);

    const adminHash = await bcrypt.hash('Admin@123', 10);
    const userHash = await bcrypt.hash('Demo@123', 10);
    await db.run("INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)", ['Admin User', 'admin@busbooker.com', '9876543210', adminHash, 'admin']);
    const demoUserResult = await db.run("INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)", ['Demo User', 'demo@example.com', '1234567890', userHash, 'user']);
    const demoUserId = demoUserResult.lastID;

    // Seed Wallet for Demo User
    await db.run("INSERT INTO wallets (user_id, balance) VALUES (?, ?)", [demoUserId, 500.0]);
    await db.run("INSERT INTO wallet_transactions (wallet_id, type, amount, description) VALUES (?, ?, ?, ?)", [demoUserId, 'CREDIT', 500.0, 'Welcome Bonus']);

    // Seed Coupons
    await db.run("INSERT INTO coupons (code, discount_type, discount_value, min_amount, max_discount, status) VALUES (?, ?, ?, ?, ?, ?)", ['WELCOME100', 'FLAT', 100.0, 500.0, 100.0, 'ACTIVE']);
    await db.run("INSERT INTO coupons (code, discount_type, discount_value, min_amount, max_discount, status) VALUES (?, ?, ?, ?, ?, ?)", ['TRAVEL10', 'PERCENT', 10.0, 0.0, 200.0, 'ACTIVE']);

    const operators = [
        'Sri Venkateswara Travels', 'Coastal Express', 'Andhra Star Travels', 'Royal Roadways', 
        'South India Express', 'BlueLine Travels', 'Deccan Roadways', 'CityLink Travels', 
        'AP Express Travels', 'GreenLine Bus Services', 'Orange Tours & Travels', 
        'Morning Star Travels', 'Kaveri Travels', 'Kaleswari Travels', 'SRS Travels', 'VRL Travels'
    ];
    const types = ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Non-AC Seater', 'Volvo Multi-Axle', 'Electric Bus', 'Luxury Sleeper', 'AC Seater/Sleeper'];
    const amenitiesList = [
        'WiFi, Water Bottle, Blankets', 'Charging Point, Reading Light', 
        'CCTV, Emergency Exit', 'AC, Push Back Seats', 'WiFi, GPS Tracking', 
        'AC, WiFi, Blankets, Snacks', 'Live Tracking, AC, USB Port'
    ];
    
    const baseRoutes = [
        ['Chirala', 'Hyderabad'], ['Hyderabad', 'Chirala'],
        ['Chirala', 'Vijayawada'], ['Vijayawada', 'Chirala'],
        ['Chirala', 'Bangalore'], ['Bangalore', 'Chirala'],
        ['Chirala', 'Chennai'], ['Chennai', 'Chirala'],
        ['Chirala', 'Visakhapatnam'], ['Visakhapatnam', 'Chirala'],
        ['Chirala', 'Tirupati'], ['Tirupati', 'Chirala'],
        ['Chirala', 'Nellore'], ['Nellore', 'Chirala'],
        ['Chirala', 'Ongole'], ['Ongole', 'Chirala'],
        ['Vijayawada', 'Hyderabad'], ['Hyderabad', 'Vijayawada'],
        ['Vijayawada', 'Bangalore'], ['Bangalore', 'Vijayawada'],
        ['Hyderabad', 'Bangalore'], ['Bangalore', 'Hyderabad'],
        ['Hyderabad', 'Chennai'], ['Chennai', 'Hyderabad'],
        ['Hyderabad', 'Tirupati'], ['Tirupati', 'Hyderabad'],
        ['Hyderabad', 'Visakhapatnam'], ['Visakhapatnam', 'Hyderabad'],
        ['Bangalore', 'Chennai'], ['Chennai', 'Bangalore'],
        ['Bangalore', 'Tirupati'], ['Tirupati', 'Bangalore'],
        ['Bangalore', 'Mysore'], ['Mysore', 'Bangalore'],
        ['Vijayawada', 'Chennai'], ['Chennai', 'Vijayawada'],
        ['Vijayawada', 'Visakhapatnam'], ['Visakhapatnam', 'Vijayawada'],
        ['Chennai', 'Tirupati'], ['Tirupati', 'Chennai'],
        ['Chennai', 'Madurai'], ['Madurai', 'Chennai'],
        ['Nellore', 'Bangalore'], ['Bangalore', 'Nellore'],
        ['Nellore', 'Hyderabad'], ['Hyderabad', 'Nellore'],
        ['Ongole', 'Hyderabad'], ['Hyderabad', 'Ongole'],
        ['Guntur', 'Hyderabad'], ['Hyderabad', 'Guntur'],
        ['Guntur', 'Bangalore'], ['Bangalore', 'Guntur'],
        ['Bapatla', 'Hyderabad'], ['Hyderabad', 'Bapatla']
    ];

    let busId = 1;
    let routeId = 1;
    const now = new Date();
    
    // Generate dates: Today, Tomorrow, Day After
    const dates = [];
    for(let i=0; i<7; i++) {
        let d = new Date(now);
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
    }

    for (const [src, dst] of baseRoutes) {
        // 3-6 buses per route
        const numBuses = Math.floor(Math.random() * 4) + 3;
        
        for (let b = 0; b < numBuses; b++) {
            const op = operators[Math.floor(Math.random() * operators.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const amen = amenitiesList[Math.floor(Math.random() * amenitiesList.length)];
            const price = [450, 500, 550, 650, 750, 850, 950, 1100, 1250, 1500, 1800][Math.floor(Math.random() * 11)];
            
            let totalSeats = 40;
            if (type.includes('Sleeper') && type.includes('Seater')) totalSeats = 36;
            else if (type.includes('Sleeper')) totalSeats = 30;
            else if (type.includes('Volvo')) totalSeats = 45;
            else totalSeats = 40;
            
            await db.run("INSERT INTO buses (id, name, number, type, amenities, total_seats) VALUES (?, ?, ?, ?, ?, ?)",
                [busId, op, `AP-${Math.floor(Math.random()*90)+10}-TA-${Math.floor(Math.random()*9000)+1000}`, type, amen, totalSeats]);

            // Add boarding/dropping points
            await db.run("INSERT INTO boarding_points (bus_id, name, time) VALUES (?, ?, ?)", [busId, src + ' Main Stand', '20:00']);
            await db.run("INSERT INTO boarding_points (bus_id, name, time) VALUES (?, ?, ?)", [busId, src + ' Highway', '20:30']);
            
            await db.run("INSERT INTO dropping_points (bus_id, name, time) VALUES (?, ?, ?)", [busId, dst + ' Entrance', '05:00']);
            await db.run("INSERT INTO dropping_points (bus_id, name, time) VALUES (?, ?, ?)", [busId, dst + ' City Center', '06:00']);

            // Create this route for the next 7 days
            for (const date of dates) {
                const hour = 18 + Math.floor(Math.random() * 5); // 18 to 22
                const depTime = `${hour}:00:00`;
                const arrTime = `0${hour-13}:00:00`;
                const duration = `${Math.floor(Math.random() * 5) + 6}h ${Math.floor(Math.random() * 4) * 15}m`;

                await db.run("INSERT INTO routes (id, bus_id, source, destination, journey_date, departure_time, arrival_time, duration, starting_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [routeId, busId, src, dst, date, depTime, arrTime, duration, price]);

                // Insert Seats for this route
                let seatQuery = "INSERT INTO seats (bus_id, route_id, seat_number, status) VALUES ";
                let seatParams = [];
                let placeholders = [];
                
                // Simulate varying availability
                const availabilityScenario = Math.random();
                let isSoldOut = availabilityScenario > 0.95;
                let scarceSeats = availabilityScenario > 0.8 && !isSoldOut; // Only 5-8 seats left
                
                const getStatus = () => {
                    if (isSoldOut) return 'BOOKED';
                    if (scarceSeats) return Math.random() > 0.15 ? 'BOOKED' : 'AVAILABLE';
                    return Math.random() > 0.6 ? 'BOOKED' : 'AVAILABLE'; // Normal fill rate (60% booked)
                };

                if (totalSeats === 30) {
                    for(let s=1; s<=15; s++) {
                        placeholders.push("(?,?,?,?)", "(?,?,?,?)");
                        seatParams.push(busId, routeId, `L${s}`, getStatus());
                        seatParams.push(busId, routeId, `U${s}`, getStatus());
                    }
                } else if (totalSeats === 36) {
                    for(let s=1; s<=12; s++) {
                        placeholders.push("(?,?,?,?)", "(?,?,?,?)", "(?,?,?,?)");
                        seatParams.push(busId, routeId, `L${s}`, getStatus());
                        seatParams.push(busId, routeId, `U${s}`, getStatus());
                        seatParams.push(busId, routeId, `SL${s}`, getStatus());
                    }
                } else if (totalSeats === 45) {
                    for(let r=1; r<=9; r++) {
                        for(let c of ['A','B','C','D','E']) {
                            placeholders.push("(?,?,?,?)");
                            seatParams.push(busId, routeId, `${r}${c}`, getStatus());
                        }
                    }
                } else {
                    for(let r=1; r<=10; r++) {
                        for(let c of ['A','B','C','D']) {
                            placeholders.push("(?,?,?,?)");
                            seatParams.push(busId, routeId, `${r}${c}`, getStatus());
                        }
                    }
                }
                
                if (placeholders.length > 0) {
                    await db.run(seatQuery + placeholders.join(','), seatParams);
                }
                
                routeId++;
            }
            busId++;
        }
    }
}

module.exports = { getDb };
