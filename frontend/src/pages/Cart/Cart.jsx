import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaTrash, FaShoppingBag } from "react-icons/fa";

import { useCart } from "../../context/CartContext";
import { getProducts } from "../../services/productService";

import ProductCard from "../../components/products/ProductCard";
import SkeletonProductCard from "../../components/products/SkeletonProductCard";
import Reveal from "../../components/common/Reveal";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const [recommended, setRecommended] = useState([]);
    const [recLoading, setRecLoading] = useState(false);

    const itemsPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
    const shippingPrice = itemsPrice > 0 ? 250 : 0;
    const totalPrice = itemsPrice + shippingPrice;

    const cartIds = useMemo(
        () => new Set(cartItems.map((i) => i._id)),
        [cartItems]
    );

    const primaryCategory = useMemo(() => {
        // Choose the most common category in cart (if available)
        const counts = new Map();
        for (const item of cartItems) {
            if (!item?.category) continue;
            counts.set(item.category, (counts.get(item.category) || 0) + 1);
        }

        let best = "";
        let bestCount = 0;

        for (const [cat, count] of counts.entries()) {
            if (count > bestCount) {
                best = cat;
                bestCount = count;
            }
        }

        return best || "";
    }, [cartItems]);

    useEffect(() => {
        const loadRecommended = async () => {
            if (cartItems.length === 0) return;

            try {
                setRecLoading(true);

                const data = await getProducts({
                    category: primaryCategory || undefined,
                    sort: "rating",
                    limit: 12,
                    page: 1,
                });

                const list = Array.isArray(data?.products) ? data.products : [];

                const filtered = list
                    .filter((p) => p?._id && !cartIds.has(p._id))
                    .slice(0, 4);

                setRecommended(filtered);
            } catch (err) {
                console.error(err);
                setRecommended([]);
            } finally {
                setRecLoading(false);
            }
        };

        loadRecommended();
    }, [cartItems.length, primaryCategory, cartIds]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-background min-h-screen flex items-center justify-center">
                <div className="text-center py-20 bg-surface rounded-lg shadow-soft max-w-2xl mx-auto w-full">
                    <FaShoppingBag className="mx-auto text-5xl text-text-secondary mb-6" />
                    <h1 className="text-3xl font-serif font-bold text-text-primary mb-4">
                        Your Cart is Empty
                    </h1>
                    <p className="text-text-secondary mb-8">
                        Add some beautiful creations to your cart to get started.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-hover shadow-soft transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-text-primary">
                        Shopping Cart
                    </h1>
                    <p className="mt-3 text-text-secondary">
                        Your selected creations, ready whenever you are.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 lg:gap-12">
                    {/* Cart Items */}
                    <motion.div
                        className="lg:col-span-2 space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {cartItems.map((item) => {
                                const canDecrease = item.quantity > 1;
                                const maxStock =
                                    typeof item.stock === "number"
                                        ? item.stock
                                        : null;
                                const canIncrease =
                                    maxStock === null
                                        ? true
                                        : item.quantity < maxStock;

                                return (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        variants={itemVariants}
                                        exit="exit"
                                        className="bg-surface rounded-2xl border border-border shadow-soft p-4 flex gap-4 items-center"
                                    >
                                        {/* Clickable area (Option A): image + name */}
                                        <Link
                                            to={`/product/${item._id}`}
                                            className="flex items-center gap-4 min-w-0"
                                        >
                                            <img
                                                src={
                                                    item.image?.url ||
                                                    "https://placehold.co/150x150/F5E1E6/422B3A?text=?"
                                                }
                                                alt={item.name}
                                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover border border-border"
                                            />

                                            <div className="min-w-0">
                                                <h2 className="text-lg font-semibold text-text-primary truncate">
                                                    {item.name}
                                                </h2>
                                                <p className="text-primary font-bold mt-1">
                                                    Rs. {item.price.toLocaleString()}
                                                </p>
                                            </div>
                                        </Link>

                                        {/* Quantity controls */}
                                        <div className="ml-auto flex items-center gap-4">
                                            <div className="flex items-center gap-3 rounded-full border border-border bg-white px-3 py-2">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item._id, item.quantity - 1)
                                                    }
                                                    disabled={!canDecrease}
                                                    className={[
                                                        "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                                                        canDecrease
                                                            ? "bg-secondary hover:bg-accent/60 text-text-primary"
                                                            : "bg-secondary/50 text-text-secondary cursor-not-allowed",
                                                    ].join(" ")}
                                                    aria-label="Decrease quantity"
                                                    type="button"
                                                >
                                                    <FaMinus size={12} />
                                                </button>

                                                <span className="text-lg font-semibold text-text-primary w-8 text-center">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item._id, item.quantity + 1)
                                                    }
                                                    disabled={!canIncrease}
                                                    className={[
                                                        "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                                                        canIncrease
                                                            ? "bg-secondary hover:bg-accent/60 text-text-primary"
                                                            : "bg-secondary/50 text-text-secondary cursor-not-allowed",
                                                    ].join(" ")}
                                                    aria-label="Increase quantity"
                                                    type="button"
                                                >
                                                    <FaPlus size={12} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-text-secondary hover:text-destructive transition-colors p-2"
                                                aria-label="Remove item"
                                                type="button"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        <div className="pt-2">
                            <Link
                                to="/"
                                className="inline-flex text-sm font-semibold text-[#B76E79] hover:underline"
                            >
                                Continue exploring creations
                            </Link>
                        </div>
                    </motion.div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 mt-8 lg:mt-0">
                        <div className="bg-surface rounded-2xl border border-border shadow-soft p-6 sticky top-24">
                            <h2 className="text-2xl font-serif font-bold text-text-primary mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-3 text-text-secondary">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-text-primary">
                                        Rs. {itemsPrice.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-text-primary">
                                        Rs. {shippingPrice.toLocaleString()}
                                    </span>
                                </div>

                                <div className="border-t border-border my-3" />

                                <div className="flex justify-between text-xl font-bold text-text-primary">
                                    <span>Total</span>
                                    <span className="text-primary">
                                        Rs. {totalPrice.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="block w-full text-center mt-6 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-hover shadow-soft transition-colors"
                            >
                                Proceed to Checkout
                            </Link>

                            <p className="mt-4 text-xs text-text-secondary text-center">
                                Secure checkout • Carefully packed • Handmade with love
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommended Creations */}
                <Reveal>
                    <section className="mt-16">
                        <div className="flex items-end justify-between gap-6 mb-8">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A26]">
                                    Recommended Creations
                                </h2>
                                <p className="mt-3 text-[#6B655F]">
                                    A few pieces you may love—curated to complement your cart.
                                </p>
                            </div>
                        </div>

                        {recLoading ? (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <SkeletonProductCard key={i} />
                                ))}
                            </div>
                        ) : recommended.length === 0 ? (
                            <div className="rounded-[28px] border border-[#EFE6DC] bg-white p-10 text-center shadow-sm">
                                <p className="text-[#6B655F]">
                                    No recommendations available right now.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {recommended.map((p) => (
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

export default Cart;