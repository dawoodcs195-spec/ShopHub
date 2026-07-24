// frontend/src/components/products/ProductReviewForm.jsx

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom"; // Import Link for better navigation

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
            toast.error("Please log in to write a review.");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating.");
            return;
        }
        if (!comment.trim()) {
            toast.error("Please enter your review comment.");
            return;
        }
        onSubmit({ rating, comment });
    };

    if (!user) {
        return (
            <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl shadow-md p-6 sm:p-8 mt-12">
                <h3 className="text-2xl font-serif font-bold text-card-foreground dark:text-dark-card-foreground mb-2">
                    Share Your Thoughts
                </h3>
                <p className="text-muted-foreground dark:text-dark-muted-foreground">
                    Please <Link to="/login" className="text-primary dark:text-dark-primary font-semibold hover:underline">log in</Link> to write a review.
                </p>
            </div>
        );
    }
    
    const hasExistingReview = initialRating > 0;
    console.log("Current Rating:", rating);
    return (
        <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl shadow-md p-6 sm:p-8 mt-12">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-card-foreground dark:text-dark-card-foreground mb-6">
                {hasExistingReview ? 'Update Your Review' : 'Write a Review'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="font-semibold text-card-foreground dark:text-dark-card-foreground block mb-2">Your Rating</label>
                    <StarRatingInput rating={rating} setRating={setRating} />
                </div>
                <div>
                    <label htmlFor="comment" className="font-semibold text-card-foreground dark:text-dark-card-foreground block mb-2">Your Comment</label>
                    <textarea
                        id="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-lg p-4 text-card-foreground dark:text-dark-card-foreground placeholder:text-muted-foreground dark:placeholder:text-dark-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-dark-ring"
                        placeholder="What did you like or dislike? How did you use the product?"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground font-semibold py-2.5 px-6 rounded-lg shadow-sm hover:bg-primary/90 dark:hover:bg-dark-primary/90 transition-all duration-300 disabled:bg-muted dark:disabled:bg-dark-muted disabled:text-muted-foreground dark:disabled:text-dark-muted-foreground disabled:cursor-not-allowed"
                    >
                        {loading ? "Submitting..." : (hasExistingReview ? 'Update Review' : 'Submit Review')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductReviewForm;