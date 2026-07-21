import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import { createReview } from "../../services/reviewService";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import ProductInfo from "../../components/products/ProductInfo";
import ProductReviewForm from "../../components/products/ProductReviewForm";
import ProductReviews from "../../components/products/ProductReviews";

const ProductDetails = () => {
    const { id } = useParams();

    const { addToCart } = useCart();
    const { user, token } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(false);

    const [initialRating, setInitialRating] = useState(0);
    const [initialComment, setInitialComment] = useState("");

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);

            const response = await api.get(`/products/${id}`);

            const productData = response.data.product;

            setProduct(productData);

            if (user) {
                const existingReview = productData.reviews.find(
                    (review) =>
                        review.user === user.id ||
                        review.user === user._id
                );

                if (existingReview) {
                    setInitialRating(existingReview.rating);
                    setInitialComment(existingReview.comment);
                } else {
                    setInitialRating(0);
                    setInitialComment("");
                }
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to load product.");
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (reviewData) => {
        try {
            setReviewLoading(true);

            const response = await createReview(
                id,
                reviewData,
                token
            );

            toast.success(response.message);

            await fetchProduct();

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to submit review."
            );
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-2xl">
                Loading Product...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-20 text-2xl">
                Product Not Found
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-5">

            <ProductInfo
                product={product}
                addToCart={addToCart}
            />

            <ProductReviewForm
                onSubmit={handleReviewSubmit}
                loading={reviewLoading}
                initialRating={initialRating}
                initialComment={initialComment}
            />

            <ProductReviews
                reviews={product.reviews}
            />

        </div>
    );
};

export default ProductDetails;