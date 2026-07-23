const Product = require("../../models/Product");

// ===============================
// Get All Products
// ===============================
const getAllProducts = async (req, res) => {
    try {
        const query = {};

        // ===============================
        // Search
        // ===============================
        if (req.query.keyword) {
            query.name = {
                $regex: req.query.keyword,
                $options: "i",
            };
        }

        // ===============================
        // Category Filter
        // ===============================
        if (req.query.category) {
            query.category = req.query.category;
        }

        // ===============================
        // Brand Filter
        // ===============================
        if (req.query.brand) {
            query.brand = req.query.brand;
        }

        // ===============================
        // Price Filter
        // ===============================
        if (
            req.query.minPrice ||
            req.query.maxPrice
        ) {
            query.price = {};

            if (req.query.minPrice) {
                query.price.$gte = Number(
                    req.query.minPrice
                );
            }

            if (req.query.maxPrice) {
                query.price.$lte = Number(
                    req.query.maxPrice
                );
            }
        }

        // ===============================
        // Rating Filter
        // ===============================
        if (req.query.rating) {
            query.rating = {
                $gte: Number(req.query.rating),
            };
        }

        // ===============================
        // Sorting
        // ===============================
        let sort = { createdAt: -1 };

        switch (req.query.sort) {
            case "priceAsc":
                sort = { price: 1 };
                break;

            case "priceDesc":
                sort = { price: -1 };
                break;

            case "rating":
                sort = { rating: -1 };
                break;

            case "oldest":
                sort = { createdAt: 1 };
                break;

            case "newest":
            default:
                sort = { createdAt: -1 };
        }

        // ===============================
        // Pagination
        // ===============================
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const totalProducts =
            await Product.countDocuments(query);

        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            count: products.length,
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(
                totalProducts / limit
            ),
            products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getAllProducts,
};