const mongoose = require("mongoose");

let cached = global.__mongoose;
if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null, indexesSynced: false };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not set");

    cached.promise = mongoose
      .connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 30000,
      })
      .then((m) => m);
  }

  cached.conn = await cached.promise;

  // Sync indexes only once per warm instance (optional)
  if (!cached.indexesSynced) {
    cached.indexesSynced = true;
    try {
      const DailyVisitor = require("../models/DailyVisitor");
      const DailySiteStat = require("../models/DailySiteStat");
      await DailyVisitor.syncIndexes();
      await DailySiteStat.syncIndexes();
    } catch (err) {
      console.warn("Index sync skipped:", err?.message || err);
    }
  }

  return cached.conn;
}

module.exports = connectDB;