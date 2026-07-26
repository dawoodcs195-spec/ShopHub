const mongoose = require("mongoose");

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // creates an index automatically
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["subscribed", "unsubscribed"],
      default: "subscribed",
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Do NOT add newsletterSubscriberSchema.index({ email: 1 });
// because `unique: true` already creates that index.

newsletterSubscriberSchema.index({ status: 1 });
newsletterSubscriberSchema.index({ createdAt: -1 });

module.exports = mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);