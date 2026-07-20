const express = require("express");

const {
    registerUser,
    loginUser,
    getUserProfile,
} = require("../controllers/userController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected Profile Route
router.get("/profile", protect, getUserProfile);

// Admin Test Route
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