import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeartBroken } from "react-icons/fa";

import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/products/ProductCard";
import SkeletonProductCard from "../../components/products/SkeletonProductCard";

const Wishlist = () => {
    const { wishlist, loading } = useWishlist();

    const gridContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const renderSkeletons = () => {
        return Array.from({ length: 4 }).map((_, index) => <SkeletonProductCard key={index} />);
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-text-primary">My Wishlist</h1>
                    <p className="mt-2 text-lg text-text-secondary">Your collection of favorite creations.</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {renderSkeletons()}
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="text-center py-20 bg-surface rounded-lg shadow-soft max-w-2xl mx-auto">
                        <FaHeartBroken className="mx-auto text-5xl text-text-muted mb-6" />
                        <h3 className="text-2xl font-serif font-bold text-text-primary mb-4">
                            Your Wishlist is Empty
                        </h3>
                        <p className="text-text-secondary mb-8">
                            Explore our collections and save the pieces that speak to you.
                        </p>
                        <Link
                            to="/"
                            className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-hover shadow-soft"
                        >
                            Find Your Favorites
                        </Link>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {wishlist.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;