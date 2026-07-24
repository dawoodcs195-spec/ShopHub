import { motion } from 'framer-motion';
import Rating from "../common/Rating";

const ProductReviews = ({ reviews = [] }) => {
    return (
        <div className="bg-surface rounded-lg shadow-soft p-6 sm:p-8 mt-12">
            <h2 className="text-3xl font-serif font-bold text-text-primary mb-6">
                What Our Customers Say
            </h2>

            {reviews.length === 0 ? (
                <p className="text-text-secondary">
                    No reviews yet. Be the first to share your thoughts!
                </p>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review._id}
                            className="border-t border-border pt-6 first:border-t-0 first:pt-0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-text-primary">
                                    {review.name}
                                </h3>
                                <span className="text-sm text-text-secondary">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <Rating value={review.rating} />
                            <p className="mt-3 text-text-secondary leading-relaxed">
                                {review.comment}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductReviews;