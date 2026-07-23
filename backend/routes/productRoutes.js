const express = require("express");

const {
    createProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/product/productCrudController");

const {
    getAllProducts,
} = require("../controllers/product/productQueryController");

const {
    createOrUpdateReview,
} = require("../controllers/product/reviewController");

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