import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import StarRatingInput from "../common/StarRatingInput";

const ProductReviewForm = ({
    onSubmit,
    loading = false,
    initialRating = 0,
    initialComment = "",
}) => {
    const { user } = useAuth();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        setRating(initialRating);
        setComment(initialComment);
    }, [initialRating, initialComment]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login to write a review.");
            return;
        }

        if (rating === 0) {
            toast.error("Please select a rating.");
            return;
        }

        if (!comment.trim()) {
            toast.error("Please enter your review.");
            return;
        }

        onSubmit({
            rating,
            comment,
        });
    };

    if (!user) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 mt-10">

                <h2 className="text-2xl font-bold mb-4">
                    Write a Review
                </h2>

                <p className="text-gray-500">
                    Please login to write a review.
                </p>

            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-8 mt-10">

            <h2 className="text-2xl font-bold mb-6">
                Write a Review
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                <div>

                    <label className="font-semibold block mb-3">
                        Rating
                    </label>

                    <StarRatingInput
                        rating={rating}
                        setRating={setRating}
                    />

                </div>

                <div>

                    <label className="font-semibold block mb-3">
                        Comment
                    </label>

                    <textarea
                        rows={5}
                        value={comment}
                        onChange={(e) =>
                            setComment(e.target.value)
                        }
                        className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write your review..."
                    />

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading
                        ? "Submitting..."
                        : "Submit Review"}
                </button>

            </form>

        </div>
    );
};

export default ProductReviewForm;