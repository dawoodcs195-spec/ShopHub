const Product = require("../../models/Product");

// ===============================
// Create / Update Review
// ===============================
const createOrUpdateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Rating and comment are required.",
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        const existingReview = product.reviews.find(
            (review) =>
                review.user.toString() ===
                req.user._id.toString()
        );

        if (existingReview) {
            existingReview.rating = Number(rating);
            existingReview.comment = comment;
            existingReview.name = req.user.name;
        } else {
            product.reviews.push({
                user: req.user._id,
                name: req.user.name,
                rating: Number(rating),
                comment,
            });
        }

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce(
                (total, review) =>
                    total + review.rating,
                0
            ) / product.reviews.length;

        await product.save();

        return res.status(200).json({
            success: true,
            message: existingReview
                ? "Review updated successfully."
                : "Review added successfully.",
            rating: product.rating,
            numReviews: product.numReviews,
            reviews: product.reviews,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createOrUpdateReview,
};