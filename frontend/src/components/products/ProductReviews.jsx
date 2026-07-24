import { motion } from "framer-motion";
import Rating from "../common/Rating";

const ProductReviews = ({ reviews = [] }) => {
    return (
        <div className="bg-surface rounded-[28px] shadow-soft border border-border p-6 sm:p-8 mt-12">
            <h2 className="text-3xl font-serif font-bold text-text-primary mb-6">
                What Our Customers Say
            </h2>

            {reviews.length === 0 ? (
                <p className="text-text-secondary">
                    No reviews yet. Be the first to share your thoughts!
                </p>
            ) : (
                <div className="grid gap-5">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06, duration: 0.45 }}
                            className="rounded-2xl border border-border bg-white p-5 sm:p-6"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-text-primary">
                                        {review.name}
                                    </h3>
                                    <p className="text-sm text-text-secondary">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <Rating value={review.rating} />
                            </div>

                            <p className="mt-4 text-text-secondary leading-relaxed">
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