const express = require("express");
const { body, param } = require("express-validator");

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
    forgotPassword,
    resetPassword,
} = require("../controllers/passwordController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

const validate = require("../middleware/validationMiddleware");

const router = express.Router();

// ===============================
// Validation Rules
// ===============================

const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ min: 2, max: 50 })
        .withMessage(
            "Name must be between 2 and 50 characters."
        ),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email.")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 })
        .withMessage(
            "Password must be at least 6 characters."
        ),

    validate,
];

const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email.")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required."),

    validate,
];

const forgotPasswordValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email.")
        .normalizeEmail(),

    validate,
];

const resetPasswordValidation = [
    param("token")
        .notEmpty()
        .withMessage("Reset token is required."),

    body("password")
        .isLength({ min: 6 })
        .withMessage(
            "Password must be at least 6 characters."
        ),

    validate,
];

const updateProfileValidation = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage(
            "Name must be between 2 and 50 characters."
        ),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email.")
        .normalizeEmail(),

    validate,
];

const changePasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage(
            "Current password is required."
        ),

    body("newPassword")
        .isLength({ min: 6 })
        .withMessage(
            "New password must be at least 6 characters."
        ),

    validate,
];

// ===============================
// Public Routes
// ===============================

// Register
router.post(
    "/register",
    registerValidation,
    registerUser
);

// Login
router.post(
    "/login",
    loginValidation,
    loginUser
);

// Forgot Password
router.post(
    "/forgot-password",
    forgotPasswordValidation,
    forgotPassword
);

// Reset Password
router.put(
    "/reset-password/:token",
    resetPasswordValidation,
    resetPassword
);

// ===============================
// Protected User Routes
// ===============================

// Get Profile
router.get(
    "/profile",
    protect,
    getUserProfile
);

// Update Profile
router.put(
    "/profile",
    protect,
    updateProfileValidation,
    updateUserProfile
);

// Change Password
router.put(
    "/change-password",
    protect,
    changePasswordValidation,
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