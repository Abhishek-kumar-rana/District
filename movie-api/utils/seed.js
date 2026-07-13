// Run with: npm run seed
// Resets data/db.json back to its initial state (3 users + 10 movies).
const fs = require("fs");
const path = require("path");

const moviesSeed = require("../data/movies.seed.json");
const { generateSeats } = require("../models/seatModel");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

// Give every seeded movie its own auto-generated 50-seat map + a price,
// same as what happens automatically on POST /api/movies.
const moviesWithSeats = moviesSeed.map((m) => ({
  ...m,
  price: m.price || 200,
  seats: generateSeats(),
}));

const initialData = {
  users: [
    {
      id: 1,
      name: "Super Admin",
      email: "superadmin@example.com",
      password: "11111111",
      role: "superadmin",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@example.com",
      password: "11111111",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Test User",
      email: "user@example.com",
      password: "11111111",
      role: "user",
      createdAt: new Date().toISOString(),
    },
  ],
  movies: moviesWithSeats,
  bookings: [],
};

fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
console.log("✅ Database seeded at", DB_PATH);
console.log(`   Users: ${initialData.users.length}, Movies: ${initialData.movies.length}`);
