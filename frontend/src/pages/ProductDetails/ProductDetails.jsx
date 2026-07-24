import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import { createReview } from "../../services/reviewService";
import { getProducts } from "../../services/productService";

import { useAuth } from "../../context/AuthContext";

import ProductInfo from "../../components/products/ProductInfo";
import ProductReviewForm from "../../components/products/ProductReviewForm";
import ProductReviews from "../../components/products/ProductReviews";
import SkeletonProductDetails from "../../components/products/SkeletonProductDetails";
import SkeletonProductCard from "../../components/products/SkeletonProductCard";
import ProductCard from "../../components/products/ProductCard";
import Reveal from "../../components/common/Reveal";

const RECENTLY_VIEWED_KEY = "shophub_recently_viewed";
const RECENT_LIMIT = 8;

const normalizeRecentlyViewedItem = (product) => {
    if (!product?._id) return null;

    return {
        _id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        rating: product.rating,
        numReviews: product.numReviews,
        image: product.image,
    };
};

const readRecentlyViewed = () => {
    try {
        const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const writeRecentlyViewed = (items) => {
    try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));
    } catch {
        // ignore storage write issues silently
    }
};

const ProductDetails = () => {
    const { id } = useParams();
    const { user, token } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [reviewLoading, setReviewLoading] = useState(false);
    const [userReview, setUserReview] = useState({
        rating: 0,
        comment: "",
    });

    // Related + Recently Viewed
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(false);

    const [recentlyViewed, setRecentlyViewed] = useState([]);

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
                    setUserReview({
                        rating: existingReview.rating,
                        comment: existingReview.comment,
                    });
                } else {
                    setUserReview({ rating: 0, comment: "" });
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

    // Recently viewed: update on product load
    useEffect(() => {
        if (!product?._id) return;

        const item = normalizeRecentlyViewedItem(product);
        if (!item) return;

        const prev = readRecentlyViewed();

        // de-dupe by _id, place current first
        const next = [item, ...prev.filter((p) => p?._id !== item._id)].slice(
            0,
            RECENT_LIMIT
        );

        writeRecentlyViewed(next);
        setRecentlyViewed(next);
    }, [product?._id]); // intentionally depends on id change only

    // Also load recently viewed on first mount (so section appears immediately)
    useEffect(() => {
        setRecentlyViewed(readRecentlyViewed());
    }, []);

    // Related products by category
    useEffect(() => {
        const loadRelated = async () => {
            if (!product?._id || !product?.category) return;

            try {
                setRelatedLoading(true);

                const data = await getProducts({
                    category: product.category,
                    sort: "rating",
                    limit: 8,
                    page: 1,
                });

                const list = Array.isArray(data?.products) ? data.products : [];

                // Exclude current product
                const filtered = list.filter((p) => p?._id !== product._id);

                setRelatedProducts(filtered.slice(0, 8));
            } catch (error) {
                console.error(error);
                setRelatedProducts([]);
            } finally {
                setRelatedLoading(false);
            }
        };

        loadRelated();
    }, [product?._id, product?.category]);

    const handleReviewSubmit = async (reviewData) => {
        try {
            setReviewLoading(true);
            const response = await createReview(id, reviewData, token);

            toast.success(
                response.message || "Review submitted successfully!"
            );

            await fetchProduct();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to submit review."
            );
        } finally {
            setReviewLoading(false);
        }
    };

    const recentlyViewedForPage = useMemo(() => {
        // Hide current product from "recently viewed" list on its own page
        return (recentlyViewed || []).filter((p) => p?._id && p._id !== id).slice(0, 8);
    }, [recentlyViewed, id]);

    if (loading) {
        return <SkeletonProductDetails />;
    }

    if (!product) {
        return (
            <div className="text-center py-20 text-2xl font-serif text-text-secondary dark:text-dark-muted-foreground">
                Creation Not Found
            </div>
        );
    }

    return (
        <div className="bg-[#FCFAF7] min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <ProductInfo product={product} />

                <ProductReviewForm
                    onSubmit={handleReviewSubmit}
                    loading={reviewLoading}
                    initialRating={userReview.rating}
                    initialComment={userReview.comment}
                />

                <ProductReviews reviews={product.reviews} />

                {/* ===============================
                    Related Creations
                =============================== */}
                <Reveal>
                    <section className="mt-16">
                        <div className="flex items-end justify-between gap-6 mb-8">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A26]">
                                    Related Creations
                                </h2>
                                <p className="mt-3 text-[#6B655F]">
                                    More pieces from the{" "}
                                    <span className="font-semibold capitalize">
                                        {product.category}
                                    </span>{" "}
                                    collection—crafted with the same care.
                                </p>
                            </div>
                        </div>

                        {relatedLoading ? (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <SkeletonProductCard key={i} />
                                ))}
                            </div>
                        ) : relatedProducts.length === 0 ? (
                            <div className="rounded-[28px] border border-[#EFE6DC] bg-white p-10 text-center shadow-sm">
                                <p className="text-[#6B655F]">
                                    No related creations found yet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {relatedProducts.map((p) => (
                                    <ProductCard key={p._id} product={p} />
                                ))}
                            </div>
                        )}
                    </section>
                </Reveal>

                {/* ===============================
                    Recently Viewed
                =============================== */}
                <Reveal>
                    <section className="mt-16">
                        <div className="flex items-end justify-between gap-6 mb-8">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A26]">
                                    Recently Viewed
                                </h2>
                                <p className="mt-3 text-[#6B655F]">
                                    Your recent discoveries—so you can return to the pieces that caught your eye.
                                </p>
                            </div>
                        </div>

                        {recentlyViewedForPage.length === 0 ? (
                            <div className="rounded-[28px] border border-[#EFE6DC] bg-white p-10 text-center shadow-sm">
                                <p className="text-[#6B655F]">
                                    Explore a few creations and they’ll appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {recentlyViewedForPage.map((p) => (
                                    <ProductCard key={p._id} product={p} />
                                ))}
                            </div>
                        )}
                    </section>
                </Reveal>
            </div>
        </div>
    );
};

export default ProductDetails;