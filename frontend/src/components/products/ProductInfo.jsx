// frontend/src/components/products/ProductInfo.jsx

import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FaHeart,
    FaRegHeart,
    FaPlus,
    FaMinus,
    FaShoppingCart,
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
    FaShieldAlt,
    FaTruck,
    FaShareAlt,
    FaLink,
} from "react-icons/fa";

import Rating from "../common/Rating";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const RECENTLY_VIEWED_KEY = "shophub_recently_viewed";

const readRecentlyViewed = () => {
    try {
        const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const ProductInfo = ({ product }) => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [quantity, setQuantity] = useState(1);

    // Lightbox
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // Mini recently viewed strip
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    const wishlisted = isInWishlist(product._id);

    const productUrl = useMemo(() => {
        try {
            const origin = window.location.origin;
            return `${origin}/product/${product._id}`;
        } catch {
            return `/product/${product._id}`;
        }
    }, [product._id]);

    const images = useMemo(() => {
        const list = [];

        if (Array.isArray(product?.images) && product.images.length > 0) {
            for (const img of product.images) {
                const url = typeof img === "string" ? img : img?.url;
                if (url) list.push(url);
            }
        }

        const mainUrl = product?.image?.url;
        if (mainUrl) list.unshift(mainUrl);

        const unique = [...new Set(list)];

        return unique.length > 0
            ? unique
            : ["https://placehold.co/800x800/F5E1E6/422B3A?text=Handmade"];
    }, [product]);

    useEffect(() => {
        setActiveIndex(0);
        setQuantity(1);
    }, [product?._id]);

    // Load mini strip from localStorage (ProductDetails is already writing to it)
    useEffect(() => {
        setRecentlyViewed(readRecentlyViewed());
    }, [product?._id]);

    const recentlyViewedForStrip = useMemo(() => {
        return (recentlyViewed || [])
            .filter((p) => p?._id && p._id !== product._id)
            .slice(0, 4);
    }, [recentlyViewed, product._id]);

    const mainImage = images[activeIndex];

    const handleQuantity = (amount) => {
        setQuantity((prev) => {
            const next = prev + amount;
            if (next < 1) return 1;
            if (next > product.stock) return product.stock;
            return next;
        });
    };

    const handleAddToCart = () => {
        if (product.stock <= 0) {
            toast.error("This creation is out of stock.");
            return;
        }

        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }

        toast.success(`${quantity} x ${product.name} added to cart!`);
    };

    const handleWishlist = async () => {
        if (!user) {
            toast.error("Please log in to manage your wishlist.");
            return;
        }
        await toggleWishlist(product._id);
    };

    const copyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(productUrl);
            toast.success("Link copied.");
        } catch (err) {
            console.error(err);
            toast.error("Couldn't copy the link. Please try again.");
        }
    }, [productUrl]);

    const handleShare = useCallback(async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: product.name,
                    text: "Take a look at this handcrafted creation.",
                    url: productUrl,
                });
                return;
            }

            await copyLink();
        } catch (err) {
            if (err?.name !== "AbortError") {
                console.error(err);
                toast.error("Couldn't share right now.");
            }
        }
    }, [product.name, productUrl, copyLink]);

    const openLightbox = (index = activeIndex) => {
        setActiveIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = useCallback(() => setLightboxOpen(false), []);

    const goPrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const goNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    useEffect(() => {
        if (!lightboxOpen) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") closeLightbox();
            if (images.length > 1 && e.key === "ArrowLeft") goPrev();
            if (images.length > 1 && e.key === "ArrowRight") goNext();
        };

        document.addEventListener("keydown", onKeyDown);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [lightboxOpen, closeLightbox, goPrev, goNext, images.length]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 18 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
    };

    const priceText = useMemo(() => {
        const n = Number(product?.price);
        return Number.isFinite(n) ? n.toLocaleString() : product?.price;
    }, [product?.price]);

    const estimatedDelivery = useMemo(() => {
        return "Estimated delivery: 3–6 business days";
    }, []);

    return (
        <>
            <motion.div
                className="grid lg:grid-cols-2 gap-12 items-start"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* =========================
                    Gallery
                ========================= */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <div className="bg-surface rounded-[28px] shadow-soft p-4 border border-border">
                        <button
                            type="button"
                            onClick={() => openLightbox(activeIndex)}
                            className="group relative block w-full overflow-hidden rounded-2xl"
                            aria-label="Open image preview"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <img
                                src={mainImage}
                                alt={product.name}
                                className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] cursor-zoom-in"
                            />
                        </button>
                    </div>

                    {images.length > 1 && (
                        <div className="grid grid-cols-5 gap-3">
                            {images.slice(0, 5).map((url, idx) => {
                                const isActive = idx === activeIndex;

                                return (
                                    <button
                                        key={url}
                                        type="button"
                                        onClick={() => setActiveIndex(idx)}
                                        className={[
                                            "overflow-hidden rounded-xl border transition-all",
                                            isActive
                                                ? "border-primary shadow-glow"
                                                : "border-border hover:border-primary/60",
                                        ].join(" ")}
                                        aria-label={`Select image ${idx + 1}`}
                                    >
                                        <img
                                            src={url}
                                            alt={`${product.name} thumbnail ${idx + 1}`}
                                            className="aspect-square w-full object-cover"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </motion.div>

                {/* =========================
                    Details + Sticky Buy Box
                ========================= */}
                <motion.div variants={itemVariants} className="space-y-8">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-text-secondary capitalize mb-1">
                                {product.category}
                            </p>

                            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-text-primary leading-tight">
                                {product.name}
                            </h1>
                        </div>

                        {/* Action cluster: Share / Copy / Wishlist */}
                        <div className="flex items-center gap-2">
                            <motion.button
                                type="button"
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleShare}
                                className="bg-surface rounded-full p-3 shadow-soft border border-border hover:bg-secondary transition"
                                aria-label="Share product"
                                title="Share"
                            >
                                <FaShareAlt size={18} className="text-text-secondary" />
                            </motion.button>

                            <motion.button
                                type="button"
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={copyLink}
                                className="bg-surface rounded-full p-3 shadow-soft border border-border hover:bg-secondary transition"
                                aria-label="Copy product link"
                                title="Copy link"
                            >
                                <FaLink size={18} className="text-text-secondary" />
                            </motion.button>

                            <motion.button
                                type="button"
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleWishlist}
                                className="bg-surface rounded-full p-3 shadow-soft border border-border hover:bg-secondary transition"
                                aria-label="Toggle wishlist"
                                title={wishlisted ? "Wishlisted" : "Add to wishlist"}
                            >
                                {wishlisted ? (
                                    <FaHeart size={20} className="text-rose-500" />
                                ) : (
                                    <FaRegHeart size={20} className="text-text-secondary" />
                                )}
                            </motion.button>
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <Rating
                            value={product.rating}
                            text={`${product.numReviews} review${product.numReviews !== 1 ? "s" : ""}`}
                        />
                    </div>

                    {/* Description */}
                    <p className="text-text-secondary text-lg leading-relaxed">
                        {product.description}
                    </p>

                    {/* Sticky Buy Box */}
                    <div className="lg:sticky lg:top-28">
                        <div className="rounded-[28px] border border-border bg-surface shadow-soft p-6 sm:p-8">
                            <div className="flex items-end justify-between gap-6">
                                <div>
                                    <p className="text-sm text-text-secondary">Price</p>
                                    <p className="mt-2 text-4xl font-sans font-bold text-primary">
                                        Rs. {priceText}
                                    </p>

                                    <p
                                        className={[
                                            "mt-3 text-sm font-semibold",
                                            product.stock > 0 ? "text-green-700" : "text-red-600",
                                        ].join(" ")}
                                    >
                                        {product.stock > 0
                                            ? `${product.stock} available`
                                            : "Out of Stock"}
                                    </p>
                                </div>

                                <div className="hidden sm:flex flex-col items-end gap-2">
                                    <div className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">
                                        Handmade • Premium
                                    </div>
                                    <div className="text-xs text-text-secondary">
                                        {estimatedDelivery}
                                    </div>
                                </div>
                            </div>

                            {product.stock > 0 && (
                                <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-4">
                                    <div className="flex items-center justify-between border border-border rounded-xl p-2 bg-white">
                                        <button
                                            type="button"
                                            onClick={() => handleQuantity(-1)}
                                            className="p-2 rounded-lg hover:bg-primary/10 text-text-secondary"
                                            aria-label="Decrease quantity"
                                        >
                                            <FaMinus />
                                        </button>

                                        <span className="px-6 text-lg font-semibold text-text-primary">
                                            {quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => handleQuantity(1)}
                                            className="p-2 rounded-lg hover:bg-primary/10 text-text-secondary"
                                            aria-label="Increase quantity"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        className="flex-grow flex items-center justify-center gap-3 bg-primary text-white font-semibold py-4 px-8 rounded-xl shadow-soft hover:bg-primary-hover transition-all duration-300 transform hover:-translate-y-0.5"
                                    >
                                        <FaShoppingCart /> Add to Cart
                                    </button>
                                </div>
                            )}

                            <div className="mt-8 grid gap-3 sm:grid-cols-3 text-sm text-text-secondary">
                                <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3">
                                    <FaShieldAlt className="text-primary" />
                                    <span>Secure checkout</span>
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3">
                                    <FaTruck className="text-primary" />
                                    <span>Careful delivery</span>
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                                        H
                                    </span>
                                    <span>Handcrafted with love</span>
                                </div>
                            </div>

                            <div className="mt-6 sm:hidden text-xs text-text-secondary">
                                {estimatedDelivery}
                            </div>

                            {/* =========================
                                Recently Viewed (mini strip)
                            ========================= */}
                            {recentlyViewedForStrip.length > 0 && (
                                <div className="mt-10">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="text-sm font-semibold tracking-wide text-[#B76E79]">
                                            Recently viewed
                                        </p>

                                        <span className="text-xs text-text-secondary">
                                            A few pieces you explored
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        {recentlyViewedForStrip.map((p) => (
                                            <motion.div
                                                key={p._id}
                                                whileHover={{ y: -2 }}
                                                transition={{
                                                    duration: 0.25,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                            >
                                                <Link
                                                    to={`/product/${p._id}`}
                                                    className="group flex items-center gap-3 rounded-2xl border border-border bg-white p-3 transition-colors hover:bg-secondary/40"
                                                >
                                                    <div className="h-14 w-14 overflow-hidden rounded-xl border border-border bg-[#F3ECE6]">
                                                        <img
                                                            src={
                                                                p.image?.url ||
                                                                "https://placehold.co/200x200/F5E1E6/422B3A?text=Handmade"
                                                            }
                                                            alt={p.name}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-semibold text-sm text-text-primary">
                                                            {p.name}
                                                        </p>
                                                        <p className="mt-1 text-xs text-text-secondary">
                                                            Rs.{" "}
                                                            {Number(p.price).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* =========================
                Lightbox
            ========================= */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onMouseDown={(e) => {
                            if (e.target === e.currentTarget) closeLightbox();
                        }}
                        role="dialog"
                        aria-modal="true"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 18, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 18, scale: 0.98 }}
                            transition={{
                                duration: 0.35,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="relative w-full max-w-5xl"
                        >
                            <button
                                type="button"
                                onClick={closeLightbox}
                                className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2D2A26] shadow-lg"
                                aria-label="Close preview"
                            >
                                <FaTimes />
                            </button>

                            <div className="overflow-hidden rounded-[28px] bg-white shadow-2xl">
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="max-h-[80vh] w-full object-contain bg-white"
                                />
                            </div>

                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={goPrev}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-lg"
                                        aria-label="Previous image"
                                    >
                                        <FaChevronLeft />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={goNext}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-lg"
                                        aria-label="Next image"
                                    >
                                        <FaChevronRight />
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProductInfo;