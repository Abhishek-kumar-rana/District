// Run with: npm run seed
// Resets data/db.json back to its initial state (2 users + 10 movies).
const fs = require("fs");
const path = require("path");

const moviesSeed = require("../data/movies.seed.json");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

const initialData = {
  users: [
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Test User",
      email: "user@example.com",
      password: "user123",
      role: "user",
      createdAt: new Date().toISOString(),
    },
  ],
  movies: moviesSeed,
};

fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
console.log("✅ Database seeded at", DB_PATH);
console.log(`   Users: ${initialData.users.length}, Movies: ${initialData.movies.length}`);
