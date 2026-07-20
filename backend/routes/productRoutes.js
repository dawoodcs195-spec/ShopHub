const express = require("express");

const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public Route
router.get("/", getAllProducts);

router.get("/:id", getSingleProduct);



// Admin Only
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