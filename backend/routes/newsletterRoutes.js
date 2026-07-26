const express = require("express");

const {
  subscribeNewsletter,
  getSubscribers,
  unsubscribeSubscriber,
} = require("../controllers/newsletterController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/subscribe", subscribeNewsletter);

// Admin
router.get("/subscribers", protect, authorize("admin"), getSubscribers);
router.patch("/subscribers/:id/unsubscribe", protect, authorize("admin"), unsubscribeSubscriber);

module.exports = router;