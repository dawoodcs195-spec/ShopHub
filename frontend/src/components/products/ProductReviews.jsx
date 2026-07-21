import Rating from "../common/Rating";

const ProductReviews = ({ reviews = [] }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-8 mt-10">

            <h2 className="text-2xl font-bold mb-6">
                Customer Reviews
            </h2>

            {reviews.length === 0 ? (
                <p className="text-gray-500">
                    No reviews yet. Be the first to review this product.
                </p>
            ) : (
                <div className="space-y-6">

                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="border-b last:border-b-0 pb-6"
                        >
                            <div className="flex items-center justify-between mb-2">

                                <h3 className="text-lg font-semibold">
                                    {review.name}
                                </h3>

                                <span className="text-sm text-gray-500">
                                    {new Date(
                                        review.createdAt
                                    ).toLocaleDateString()}
                                </span>

                            </div>

                            <Rating value={review.rating} />

                            <p className="mt-3 text-gray-700 leading-relaxed">
                                {review.comment}
                            </p>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default ProductReviews;