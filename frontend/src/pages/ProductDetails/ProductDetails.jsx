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

const OLD_RECENTLY_VIEWED_KEY = "shophub_recently_viewed";
const RECENTLY_VIEWED_KEY = "diya_expressions_recently_viewed";
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
  // 1) Try new key
  try {
    const rawNew = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const parsedNew = rawNew ? JSON.parse(rawNew) : [];
    if (Array.isArray(parsedNew) && parsedNew.length > 0) return parsedNew;
  } catch {
    // ignore
  }

  // 2) Fallback to old key, migrate to new
  try {
    const rawOld = localStorage.getItem(OLD_RECENTLY_VIEWED_KEY);
    const parsedOld = rawOld ? JSON.parse(rawOld) : [];
    if (Array.isArray(parsedOld) && parsedOld.length > 0) {
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(parsedOld));
        localStorage.removeItem(OLD_RECENTLY_VIEWED_KEY);
      } catch {
        // ignore migration write issues
      }
      return parsedOld;
    }
    return Array.isArray(parsedOld) ? parsedOld : [];
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

  useEffect(() => {
    if (!product?._id) return;

    const item = normalizeRecentlyViewedItem(product);
    if (!item) return;

    const prev = readRecentlyViewed();

    const next = [item, ...prev.filter((p) => p?._id !== item._id)].slice(
      0,
      RECENT_LIMIT
    );

    writeRecentlyViewed(next);
    setRecentlyViewed(next);
  }, [product?._id]);

  useEffect(() => {
    setRecentlyViewed(readRecentlyViewed());
  }, []);

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

      toast.success(response.message || "Review submitted successfully!");
      await fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  const recentlyViewedForPage = useMemo(() => {
    return (recentlyViewed || [])
      .filter((p) => p?._id && p._id !== id)
      .slice(0, 8);
  }, [recentlyViewed, id]);

  if (loading) return <SkeletonProductDetails />;

  if (!product) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-background text-center py-20 text-2xl font-serif text-text-secondary dark:text-dark-muted-foreground">
        Creation Not Found
      </div>
    );
  }

  // ✅ 2-up even on 320px, with slightly tighter gap on very small screens
  const twoUpGrid =
    "grid grid-cols-2 lg:grid-cols-4 gap-3 min-[360px]:gap-4 sm:gap-8";

  return (
    <div className="bg-background dark:bg-dark-background min-h-screen">
      <div className="max-w-7xl mx-auto py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <ProductInfo product={product} />

        <div className="mt-10 sm:mt-12">
          <ProductReviewForm
            onSubmit={handleReviewSubmit}
            loading={reviewLoading}
            initialRating={userReview.rating}
            initialComment={userReview.comment}
          />
        </div>

        <div className="mt-10 sm:mt-12">
          <ProductReviews reviews={product.reviews} />
        </div>

        <Reveal>
          <section className="mt-12 sm:mt-16">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-text-primary dark:text-dark-card-foreground">
                Related Creations
              </h2>
              <p className="mt-3 text-text-secondary dark:text-dark-muted-foreground">
                More pieces from the{" "}
                <span className="font-semibold capitalize">{product.category}</span>{" "}
                collection—crafted with the same care.
              </p>
            </div>

            {relatedLoading ? (
              <div className={twoUpGrid}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonProductCard key={i} />
                ))}
              </div>
            ) : relatedProducts.length === 0 ? (
              <div className="rounded-[24px] sm:rounded-[28px] border border-border dark:border-dark-border bg-card dark:bg-dark-card p-8 sm:p-10 text-center shadow-sm">
                <p className="text-text-secondary dark:text-dark-muted-foreground">
                  No related creations found yet.
                </p>
              </div>
            ) : (
              <div className={twoUpGrid}>
                {relatedProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-12 sm:mt-16">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-text-primary dark:text-dark-card-foreground">
                Recently Viewed
              </h2>
              <p className="mt-3 text-text-secondary dark:text-dark-muted-foreground">
                Your recent discoveries—so you can return to the pieces that caught your eye.
              </p>
            </div>

            {recentlyViewedForPage.length === 0 ? (
              <div className="rounded-[24px] sm:rounded-[28px] border border-border dark:border-dark-border bg-card dark:bg-dark-card p-8 sm:p-10 text-center shadow-sm">
                <p className="text-text-secondary dark:text-dark-muted-foreground">
                  Explore a few creations and they’ll appear here.
                </p>
              </div>
            ) : (
              <div className={twoUpGrid}>
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