const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

// Reads the whole db.json file synchronously
function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

// Writes the whole db.json file synchronously
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// Generates the next numeric id for a collection (users / movies)
function nextId(collectionArray) {
  if (!collectionArray.length) return 1;
  return Math.max(...collectionArray.map((item) => item.id)) + 1;
}

module.exports = { readDB, writeDB, nextId };
