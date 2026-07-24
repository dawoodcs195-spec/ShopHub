import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeartBroken, FaArrowRight } from "react-icons/fa";

import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/products/ProductCard";
import SkeletonProductCard from "../../components/products/SkeletonProductCard";
import Reveal from "../../components/common/Reveal";

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
        return Array.from({ length: 4 }).map((_, index) => (
            <SkeletonProductCard key={index} />
        ));
    };

    return (
        <div className="min-h-screen bg-[#FCFAF7]">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <Reveal y={18} duration={0.85}>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-serif font-bold text-text-primary">
                            My Wishlist
                        </h1>
                        <p className="mt-2 text-lg text-text-secondary">
                            A quiet little collection of creations you loved.
                        </p>
                    </div>
                </Reveal>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {renderSkeletons()}
                    </div>
                ) : wishlist.length === 0 ? (
                    <Reveal y={14} duration={0.8}>
                        <div className="relative overflow-hidden text-center rounded-[36px] border border-[#EFE6DC] bg-white shadow-soft max-w-2xl mx-auto p-12 sm:p-14">
                            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-rose-100/40 blur-3xl" />
                            <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-amber-100/35 blur-3xl" />

                            <div className="relative">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FDF1F3] to-[#FFF7ED] text-[#B76E79] shadow-sm">
                                    <FaHeartBroken className="text-3xl" />
                                </div>

                                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary">
                                    Your Wishlist is Empty
                                </h3>

                                <p className="mt-4 text-text-secondary leading-8">
                                    Explore our collections and save the pieces
                                    that speak to you. Your favorites will stay
                                    right here, waiting.
                                </p>

                                <div className="mt-10 flex justify-center">
                                    <Link
                                        to="/"
                                        className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                                    >
                                        Find Your Favorites
                                        <FaArrowRight />
                                    </Link>
                                </div>

                                <p className="mt-6 text-sm text-text-secondary">
                                    Tip: Tap the heart on any creation to save it.
                                </p>
                            </div>
                        </div>
                    </Reveal>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={gridContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {wishlist.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                mode="wishlist"
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;