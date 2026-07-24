import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaTrash, FaShoppingBag } from "react-icons/fa";

import { useCart } from "../../context/CartContext";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const itemsPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 0 ? 250 : 0; // Example shipping price
    const totalPrice = itemsPrice + shippingPrice;

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
                    <FaShoppingBag className="mx-auto text-5xl text-text-muted mb-6" />
                    <h1 className="text-3xl font-serif font-bold text-text-primary mb-4">
                        Your Cart is Empty
                    </h1>
                    <p className="text-text-secondary mb-8">
                        Add some beautiful creations to your cart to get started.
                    </p>
                    <Link
                        to="/"
                        className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-hover shadow-soft"
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
                    <h1 className="text-4xl font-serif font-bold text-text-primary">Shopping Cart</h1>
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
                            {cartItems.map((item) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    variants={itemVariants}
                                    exit="exit"
                                    className="bg-surface rounded-lg shadow-soft p-4 flex gap-4 items-center"
                                >
                                    <img
                                        src={item.image?.url || "https://placehold.co/150x150/F5E1E6/422B3A?text=?"}
                                        alt={item.name}
                                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-md object-cover"
                                    />
                                    <div className="flex-grow">
                                        <h2 className="text-lg font-semibold text-text-primary">{item.name}</h2>
                                        <p className="text-primary font-bold mt-1">Rs. {item.price.toLocaleString()}</p>
                                        <div className="flex items-center gap-4 mt-4">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full bg-background hover:bg-border flex items-center justify-center transition-colors"
                                            >
                                                <FaMinus size={12} />
                                            </button>
                                            <span className="text-lg font-semibold text-text-primary w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-background hover:bg-border flex items-center justify-center transition-colors"
                                            >
                                                <FaPlus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-text-muted hover:text-accent transition-colors p-2"
                                        aria-label="Remove item"
                                    >
                                        <FaTrash size={18} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 mt-8 lg:mt-0">
                        <div className="bg-surface rounded-lg shadow-soft p-6 sticky top-24">
                            <h2 className="text-2xl font-serif font-bold text-text-primary mb-6">Order Summary</h2>
                            <div className="space-y-3 text-text-secondary">
                                <div className="flex justify-between"><span>Subtotal</span><span>Rs. {itemsPrice.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span>Rs. {shippingPrice.toLocaleString()}</span></div>
                                <div className="border-t border-border my-3"></div>
                                <div className="flex justify-between text-xl font-bold text-text-primary">
                                    <span>Total</span>
                                    <span className="text-primary">Rs. {totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                            <Link
                                to="/checkout"
                                className="block w-full text-center mt-6 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-hover shadow-soft transition-all"
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;