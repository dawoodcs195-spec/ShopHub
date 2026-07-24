const express = require("express");
const { body, param } = require("express-validator");

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

const validationMiddleware = require("../middleware/validationMiddleware");

const router = express.Router();

// Validation Rules
const createProductValidation = [
    body("name", "Product name is required").notEmpty().trim(),
    body("description", "Product description is required").notEmpty(),
    body("price", "Price must be a positive number").isFloat({ min: 0 }),
    body("category", "Category is required").notEmpty(),
    body("stock", "Stock must be a non-negative integer").isInt({ min: 0 }),
];

const updateProductValidation = [
    param("id", "Invalid Product ID").isMongoId(),
    // Optional validation for fields that might be updated
    body("name").optional().trim(),
    body("price").optional().isFloat({ min: 0 }),
    body("stock").optional().isInt({ min: 0 }),
];

const idParamValidation = [
    param("id", "Invalid Product ID").isMongoId(),
];

const reviewValidation = [
    param("id", "Invalid Product ID").isMongoId(),
    body("rating", "Rating must be an integer between 1 and 5").isInt({ min: 1, max: 5 }),
    body("comment", "Comment is required").notEmpty().trim(),
];


// ===============================
// Public Routes
// ===============================
router.get("/", getAllProducts);
router.get("/:id", idParamValidation, validationMiddleware, getSingleProduct);

// ===============================
// User Routes
// ===============================
router.post("/:id/reviews", protect, reviewValidation, validationMiddleware, createOrUpdateReview);

// ===============================
// Admin Routes
// ===============================
router.post("/", protect, authorize("admin"), createProductValidation, validationMiddleware, createProduct);
router.put("/:id", protect, authorize("admin"), updateProductValidation, validationMiddleware, updateProduct);
router.delete("/:id", protect, authorize("admin"), idParamValidation, validationMiddleware, deleteProduct);

module.exports = router;