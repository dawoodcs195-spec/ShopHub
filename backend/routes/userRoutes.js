const express = require("express");

const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    toggleWishlist,
    getWishlist,
} = require("../controllers/userController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// Public Routes
// ===============================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// ===============================
// Protected User Routes
// ===============================

// Get Profile
router.get("/profile", protect, getUserProfile);

// Update Profile
router.put("/profile", protect, updateUserProfile);

// Change Password
router.put(
    "/change-password",
    protect,
    changePassword
);

// ===============================
// Wishlist
// ===============================

// Get Wishlist
router.get(
    "/wishlist",
    protect,
    getWishlist
);

// Add / Remove Wishlist Item
router.post(
    "/wishlist/:productId",
    protect,
    toggleWishlist
);

// ===============================
// Admin Test Route
// ===============================
router.get(
    "/admin",
    protect,
    authorize("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome Admin!",
        });
    }
);

module.exports = router;