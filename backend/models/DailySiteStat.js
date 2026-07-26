const mongoose = require("mongoose");

const DailySiteStatSchema = new mongoose.Schema(
  {
    // YYYY-MM-DD (UTC)
    dateKey: { type: String, required: true, unique: true, index: true },
    totalVisits: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailySiteStat", DailySiteStatSchema);