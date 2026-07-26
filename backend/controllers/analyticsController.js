const DailySiteStat = require("../models/DailySiteStat");
const DailyVisitor = require("../models/DailyVisitor");

const getUTCDateKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// POST /api/analytics/visit
// Body: { visitorId: "..." }
exports.trackVisit = async (req, res, next) => {
  try {
    const { visitorId } = req.body;

    if (!visitorId || typeof visitorId !== "string" || visitorId.length < 8) {
      return res.status(400).json({ message: "visitorId is required" });
    }

    const dateKey = getUTCDateKey();

    // Always increment total visits for today
    await DailySiteStat.findOneAndUpdate(
      { dateKey },
      { $inc: { totalVisits: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Try to create the "unique visitor for today" marker
    try {
      await DailyVisitor.create({ dateKey, visitorId });

      // Only if created successfully => increment uniqueVisitors
      await DailySiteStat.updateOne(
        { dateKey },
        { $inc: { uniqueVisitors: 1 } }
      );
    } catch (err) {
      // Duplicate key => already counted as unique today
      if (err && err.code !== 11000) throw err;
    }

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};