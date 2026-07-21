const express = require("express");

const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createOrUpdateReview,
} = require("../controllers/productController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// Public Routes
// ===============================
router.get("/", getAllProducts);

router.get("/:id", getSingleProduct);

// ===============================
// User Routes
// ===============================
router.post(
    "/:id/reviews",
    protect,
    createOrUpdateReview
);

// ===============================
// Admin Routes
// ===============================
router.post(
    "/",
    protect,
    authorize("admin"),
    createProduct
);

router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateProduct
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteProduct
);

module.exports = router;