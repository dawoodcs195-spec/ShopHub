const NewsletterSubscriber = require("../models/NewsletterSubscriber");

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());

/**
 * Public: Subscribe
 * POST /api/newsletter/subscribe
 */
const subscribeNewsletter = async (req, res) => {
  try {
    const emailRaw = String(req.body?.email || "").trim();

    if (!emailRaw) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    if (!isValidEmail(emailRaw)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }

    const email = emailRaw.toLowerCase();

    const existing = await NewsletterSubscriber.findOne({ email });

    // If already subscribed
    if (existing && existing.status === "subscribed") {
      return res.status(200).json({
        success: true,
        message: "You're already subscribed — welcome back.",
      });
    }

    // If exists but unsubscribed -> resubscribe
    if (existing && existing.status === "unsubscribed") {
      existing.status = "subscribed";
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = null;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Welcome back — you're subscribed again.",
      });
    }

    // New subscriber
    await NewsletterSubscriber.create({
      email,
      status: "subscribed",
      subscribedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "You're subscribed. Welcome to Diya Expressions studio updates.",
    });
  } catch (error) {
    // Handle duplicate unique email race condition
    if (error?.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "You're already subscribed — welcome back.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to subscribe. Please try again.",
    });
  }
};

/**
 * Admin: List subscribers
 * GET /api/newsletter/subscribers?keyword=&status=&page=&limit=
 */
const getSubscribers = async (req, res) => {
  try {
    const keyword = String(req.query.keyword || "").trim();
    const status = String(req.query.status || "").trim(); // subscribed | unsubscribed
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    if (keyword) {
      query.email = { $regex: keyword, $options: "i" };
    }

    if (status === "subscribed" || status === "unsubscribed") {
      query.status = status;
    }

    const totalSubscribers = await NewsletterSubscriber.countDocuments(query);

    const subscribers = await NewsletterSubscriber.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      totalSubscribers,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalSubscribers / limit)),
      subscribers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load subscribers.",
    });
  }
};

/**
 * Admin: Unsubscribe
 * PATCH /api/newsletter/subscribers/:id/unsubscribe
 */
const unsubscribeSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await NewsletterSubscriber.findById(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found.",
      });
    }

    if (subscriber.status === "unsubscribed") {
      return res.status(200).json({
        success: true,
        message: "Subscriber is already unsubscribed.",
        subscriber,
      });
    }

    subscriber.status = "unsubscribed";
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return res.status(200).json({
      success: true,
      message: "Subscriber unsubscribed successfully.",
      subscriber,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to unsubscribe subscriber.",
    });
  }
};

module.exports = {
  subscribeNewsletter,
  getSubscribers,
  unsubscribeSubscriber,
};