const Product = require("../../models/Product");
const cloudinary = require("../../config/cloudinary");

// ===============================
// Helpers
// ===============================
const asImageArray = (images) => {
    if (!images) return [];
    if (!Array.isArray(images)) return [];
    return images
        .map((img) => {
            if (!img) return null;
            if (typeof img === "string") return { url: img, public_id: "" };
            return {
                url: img.url || "",
                public_id: img.public_id || "",
            };
        })
        .filter((img) => img && img.url);
};

const uniquePublicIds = (arr) => {
    const set = new Set();
    for (const id of arr) {
        if (id) set.add(id);
    }
    return [...set];
};

const destroyCloudinaryIds = async (publicIds) => {
    const ids = uniquePublicIds(publicIds);
    for (const id of ids) {
        try {
            await cloudinary.uploader.destroy(id);
        } catch (e) {
            // Do not fail the request for cleanup issues
            console.error("Cloudinary destroy failed for:", id, e.message);
        }
    }
};

// ===============================
// Create Product
// ===============================
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            brand,
            stock,
            image,
            images,
        } = req.body;

        // Custom validation: check for existing product name
        const existingProduct = await Product.findOne({
            name: { $regex: `^${name.trim()}$`, $options: "i" },
        });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "A product with this name already exists.",
            });
        }

        const parsedImages = asImageArray(images);
        const coverFromBody = image && image.url ? image : null;

        // Backward compatible:
        // - if images[] provided -> use it
        // - else use image as single -> convert to images[]
        const finalImages =
            parsedImages.length > 0
                ? parsedImages
                : coverFromBody
                ? [coverFromBody]
                : [];

        if (finalImages.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one product image is required.",
            });
        }

        // Cover image = first gallery image
        const finalCover = finalImages[0];

        const product = await Product.create({
            name: name.trim(),
            description,
            price,
            category,
            brand,
            stock,
            image: finalCover,
            images: finalImages,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully.",
            product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// Get Single Product
// ===============================
const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// Update Product
// ===============================
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        // Custom validation: if name is being changed, check for conflicts
        if (
            req.body.name &&
            req.body.name.trim().toLowerCase() !==
                product.name.toLowerCase()
        ) {
            const existingProduct = await Product.findOne({
                name: {
                    $regex: `^${req.body.name.trim()}$`,
                    $options: "i",
                },
                _id: { $ne: product._id },
            });

            if (existingProduct) {
                return res.status(400).json({
                    success: false,
                    message: "A product with this name already exists.",
                });
            }
        }

        const updateData = { ...req.body };
        if (updateData.name) updateData.name = updateData.name.trim();

        // If images[] is provided, treat it as canonical gallery
        const incomingImages = asImageArray(updateData.images);

        if (updateData.images !== undefined) {
            if (incomingImages.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one product image is required.",
                });
            }

            updateData.images = incomingImages;
            updateData.image = incomingImages[0]; // cover = first
        } else {
            // Backward compatibility: handle single image update if used anywhere
            if (
                updateData.image &&
                updateData.image.public_id &&
                product.image?.public_id &&
                updateData.image.public_id !== product.image.public_id
            ) {
                await destroyCloudinaryIds([product.image.public_id]);
            }
        }

        // Cloudinary cleanup when gallery changes
        if (updateData.images) {
            const oldIds = [
                ...(product.images || []).map((img) => img.public_id),
                product.image?.public_id,
            ].filter(Boolean);

            const newIds = [
                ...(updateData.images || []).map((img) => img.public_id),
                updateData.image?.public_id,
            ].filter(Boolean);

            const newSet = new Set(newIds);
            const removed = oldIds.filter((id) => !newSet.has(id));

            await destroyCloudinaryIds(removed);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            product: updatedProduct,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// Delete Product
// ===============================
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        const idsToDelete = [
            ...(product.images || []).map((img) => img.public_id),
            product.image?.public_id,
        ].filter(Boolean);

        await destroyCloudinaryIds(idsToDelete);

        await product.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
};