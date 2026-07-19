const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("🔄 Connecting to MongoDB...");

        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");
        console.log(`Host: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;