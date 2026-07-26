const mongoose = require("mongoose");

const DailyVisitorSchema = new mongoose.Schema(
  {
    dateKey: { type: String, required: true, index: true }, // YYYY-MM-DD
    visitorId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

// Prevent double-counting unique visitors per day
DailyVisitorSchema.index({ dateKey: 1, visitorId: 1 }, { unique: true });

// TTL: automatically remove visitor markers after 90 days
DailyVisitorSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 }
);

module.exports = mongoose.model("DailyVisitor", DailyVisitorSchema);