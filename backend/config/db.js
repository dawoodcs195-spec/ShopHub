const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    // ✅ Ensure analytics indexes exist (unique + TTL)
    // TTL deletions are handled by MongoDB's TTL monitor (runs periodically).
    try {
      const DailyVisitor = require("../models/DailyVisitor");
      const DailySiteStat = require("../models/DailySiteStat");

      await DailyVisitor.syncIndexes();
      await DailySiteStat.syncIndexes();

      console.log("✅ Analytics indexes synced (DailyVisitor TTL/unique + DailySiteStat)");
    } catch (indexError) {
      console.warn("⚠️ Could not sync analytics indexes:", indexError?.message || indexError);
    }
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;