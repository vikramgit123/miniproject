// backend/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri); // Removed deprecated options

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("skillNavigator");
    console.log("✅ Connected to MongoDB Atlas (Modern Connection)");
    return db;
  } catch (err) {
    console.error("❌ Atlas connection error:", err);
    process.exit(1);
  }
}

function getDB() {
  if (!db) throw new Error("Database not connected!");
  return db;
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});

module.exports = { connectDB, getDB };