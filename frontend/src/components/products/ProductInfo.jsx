import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";

import Rating from "../common/Rating";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from '../../context/CartContext';

const ProductInfo = ({ product }) => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(product.image?.url); // Assuming product has an image

    const wishlisted = isInWishlist(product._id);

    const handleQuantity = (amount) => {
        setQuantity(prev => {
            const newQuantity = prev + amount;
            if (newQuantity < 1) return 1;
            if (newQuantity > product.stock) return product.stock;
            return newQuantity;
        });
    };

    const handleAddToCart = () => {
        if (product.stock <= 0) {
            toast.error("This creation is out of stock.");
            return;
        }
        addToCart(product, quantity);
        toast.success(`${quantity} x ${product.name} added to cart!`);
    };

    const handleWishlist = async () => {
        if (!user) {
            toast.error("Please log in to manage your wishlist.");
            return;
        }
        await toggleWishlist(product._id);
    };

    // Placeholder for multiple images. For now, we'll just show the main one.
    const images = [product.image, /* ...other images if they exist */];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <motion.div 
            className="grid lg:grid-cols-2 gap-12 items-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Image Gallery */}
            <motion.div variants={itemVariants}>
                <div className="bg-surface rounded-lg shadow-soft p-4">
                    <div className="aspect-square rounded-md overflow-hidden">
                        <img
                            src={mainImage || "https://placehold.co/800x800/F5E1E6/422B3A?text=Handmade"}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                </div>
                {/* Thumbnails would go here if product.images array existed */}
            </motion.div>

            {/* Product Details */}
            <motion.div variants={itemVariants}>
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                        <p className="text-sm text-text-secondary capitalize mb-1">{product.category}</p>
                        <h1 className="text-4xl lg:text-5xl font-serif font-bold text-text-primary">{product.name}</h1>
                    </div>
                    <button
                        onClick={handleWishlist}
                        className="bg-surface rounded-full p-3 shadow-soft hover:scale-110 transition"
                        aria-label="Toggle Wishlist"
                    >
                        {wishlisted ? <FaHeart size={24} className="text-accent" /> : <FaRegHeart size={24} className="text-text-secondary" />}
                    </button>
                </div>

                <div className="mb-6">
                    <Rating value={product.rating} text={`${product.numReviews} review${product.numReviews !== 1 ? "s" : ""}`} />
                </div>
                
                <p className="text-text-secondary text-lg leading-relaxed my-6">{product.description}</p>

                <div className="my-8">
                    <p className="text-4xl font-sans font-bold text-primary">Rs. {product.price}</p>
                    <p className={`mt-2 font-semibold text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                    </p>
                </div>
                
                {/* Add to Cart Controls */}
                {product.stock > 0 && (
                    <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-8">
                        <div className="flex items-center justify-between border border-border rounded-lg p-2">
                            <button onClick={() => handleQuantity(-1)} className="p-2 rounded hover:bg-primary/10 text-text-secondary"><FaMinus /></button>
                            <span className="px-6 text-lg font-semibold text-text-primary">{quantity}</span>
                            <button onClick={() => handleQuantity(1)} className="p-2 rounded hover:bg-primary/10 text-text-secondary"><FaPlus /></button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="flex-grow flex items-center justify-center gap-3 bg-primary text-white font-semibold py-4 px-8 rounded-lg shadow-soft hover:bg-primary-hover transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <FaShoppingCart/> Add to Cart
                        </button>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ProductInfo;