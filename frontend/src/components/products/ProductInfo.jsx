import { useEffect, useMemo, useState, useCallback } from "react";
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
} from "react-icons/fa";

import Rating from "../common/Rating";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const ProductInfo = ({ product }) => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [quantity, setQuantity] = useState(1);

    // Lightbox
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const wishlisted = isInWishlist(product._id);

    const images = useMemo(() => {
        // Supports: product.images (array) in future, or current product.image
        const list = [];

        if (Array.isArray(product?.images) && product.images.length > 0) {
            for (const img of product.images) {
                const url = typeof img === "string" ? img : img?.url;
                if (url) list.push(url);
            }
        }

        const mainUrl = product?.image?.url;
        if (mainUrl) list.unshift(mainUrl);

        // De-dup (in case main image is also in images)
        const unique = [...new Set(list)];

        return unique.length > 0
            ? unique
            : ["https://placehold.co/800x800/F5E1E6/422B3A?text=Handmade"];
    }, [product]);

    useEffect(() => {
        setActiveIndex(0);
        setQuantity(1);
    }, [product?._id]);

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

        // Your CartContext currently adds 1 at a time.
        // Loop to respect chosen quantity without changing global cart logic.
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
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    };

    const priceText = useMemo(() => {
        const n = Number(product?.price);
        return Number.isFinite(n) ? n.toLocaleString() : product?.price;
    }, [product?.price]);

    const estimatedDelivery = useMemo(() => {
        // UI-only, boutique friendly phrasing
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

                    {/* Thumbnails (only if multiple) */}
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

                        <button
                            onClick={handleWishlist}
                            className="bg-surface rounded-full p-3 shadow-soft border border-border hover:scale-105 transition"
                            aria-label="Toggle Wishlist"
                        >
                            {wishlisted ? (
                                <FaHeart size={22} className="text-rose-500" />
                            ) : (
                                <FaRegHeart size={22} className="text-text-secondary" />
                            )}
                        </button>
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
                                    <p className="text-sm text-text-secondary">
                                        Price
                                    </p>
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

                                {/* Trust mini badge */}
                                <div className="hidden sm:flex flex-col items-end gap-2">
                                    <div className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">
                                        Handmade • Premium
                                    </div>
                                    <div className="text-xs text-text-secondary">
                                        {estimatedDelivery}
                                    </div>
                                </div>
                            </div>

                            {/* Quantity + Add to cart */}
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

                            {/* Trust badges */}
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

                            {/* Mobile delivery line */}
                            <div className="mt-6 sm:hidden text-xs text-text-secondary">
                                {estimatedDelivery}
                            </div>
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
                            // close only if clicking backdrop
                            if (e.target === e.currentTarget) closeLightbox();
                        }}
                        role="dialog"
                        aria-modal="true"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 18, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 18, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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