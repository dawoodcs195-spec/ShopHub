import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from 'framer-motion';

import api from "../../services/api";
import { createReview } from "../../services/reviewService";

import { useAuth } from "../../context/AuthContext";

import ProductInfo from "../../components/products/ProductInfo";
import ProductReviewForm from "../../components/products/ProductReviewForm";
import ProductReviews from "../../components/products/ProductReviews";

// Skeleton Loader Component
const ProductDetailsSkeleton = () => (
    <div className="max-w-7xl mx-auto py-12 px-5 animate-pulse">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
                <div className="bg-gray-200 aspect-square rounded-lg"></div>
            </div>
            <div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-12 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-16 bg-gray-300 rounded w-1/2"></div>
            </div>
        </div>
    </div>
);


const ProductDetails = () => {
    const { id } = useParams();
    const { user, token } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [userReview, setUserReview] = useState({ rating: 0, comment: '' });

    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/products/${id}`);
            const productData = response.data.product;
            setProduct(productData);

            if (user && productData.reviews) {
                const existingReview = productData.reviews.find(
                    (review) => review.user === user._id
                );
                if (existingReview) {
                    setUserReview({ rating: existingReview.rating, comment: existingReview.comment });
                } else {
                    setUserReview({ rating: 0, comment: '' });
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load product details.");
        } finally {
            setLoading(false);
        }
    }, [id, user]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleReviewSubmit = async (reviewData) => {
        try {
            setReviewLoading(true);
            const response = await createReview(id, reviewData, token);
            toast.success(response.message || "Review submitted successfully!");
            await fetchProduct(); // Refetch to get the updated reviews list
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review.");
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) {
        return <ProductDetailsSkeleton />;
    }

    if (!product) {
        return (
            <div className="text-center py-20 text-2xl font-serif text-text-secondary">
                Creation Not Found
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <ProductInfo product={product} />
                <ProductReviewForm
                    onSubmit={handleReviewSubmit}
                    loading={reviewLoading}
                    initialRating={userReview.rating}
                    initialComment={userReview.comment}
                />
                <ProductReviews reviews={product.reviews} />
            </div>
        </div>
    );
};

export default ProductDetails;