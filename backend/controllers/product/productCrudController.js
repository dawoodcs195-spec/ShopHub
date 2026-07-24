const Product = require("../../models/Product");
const cloudinary = require("../../config/cloudinary");

// ===============================
// Create Product
// ===============================
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, brand, stock, image } = req.body;

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

        const product = await Product.create({
            name: name.trim(),
            description,
            price,
            category,
            brand,
            stock,
            image,
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
        if (req.body.name && req.body.name.trim().toLowerCase() !== product.name.toLowerCase()) {
            const existingProduct = await Product.findOne({
                name: { $regex: `^${req.body.name.trim()}$`, $options: "i" },
                _id: { $ne: product._id },
            });

            if (existingProduct) {
                return res.status(400).json({
                    success: false,
                    message: "A product with this name already exists.",
                });
            }
        }

        // Handle image replacement on Cloudinary
        if (req.body.image && req.body.image.public_id && product.image?.public_id && req.body.image.public_id !== product.image.public_id) {
            await cloudinary.uploader.destroy(product.image.public_id);
        }
        
        const updateData = { ...req.body };
        if(updateData.name) {
            updateData.name = updateData.name.trim();
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

        // Delete image from Cloudinary if it exists
        if (product.image?.public_id) {
            await cloudinary.uploader.destroy(product.image.public_id);
        }

        await product.deleteOne();

        return res.status(200).json({
            success: true, // Should be true on successful deletion
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