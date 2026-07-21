const express = require("express");

const {
    uploadImage,
    uploadAvatar,
} = require("../controllers/uploadController");

const upload = require("../middleware/uploadMiddleware");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// Product Image Upload
// ===============================
router.post(
    "/",
    protect,
    authorize("admin"),
    upload.single("image"),
    uploadImage
);

// ===============================
// Avatar Upload
// ===============================
router.post(
    "/avatar",
    protect,
    upload.single("image"),
    uploadAvatar
);

module.exports = router;