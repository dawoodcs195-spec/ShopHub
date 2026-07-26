import { motion } from "framer-motion";
import { FaHeartBroken, FaArrowRight } from "react-icons/fa";

import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/products/ProductCard";
import SkeletonProductCard from "../../components/products/SkeletonProductCard";
import Reveal from "../../components/common/Reveal";
import EmptyState from "../../components/common/EmptyState";

const Wishlist = () => {
  const { wishlist, loading } = useWishlist();

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const renderSkeletons = () => {
    return Array.from({ length: 4 }).map((_, index) => (
      <SkeletonProductCard key={index} />
    ));
  };

  // ✅ 2-up even on 320px, with slightly tighter gap on very small screens
  const mobileTwoUpGrid =
    "grid grid-cols-2 lg:grid-cols-4 gap-3 min-[360px]:gap-4 sm:gap-8";

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Reveal y={18} duration={0.85}>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-text-primary dark:text-dark-card-foreground">
              My Wishlist
            </h1>
            <p className="mt-2 text-lg text-text-secondary dark:text-dark-muted-foreground">
              A quiet little collection of creations you loved.
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div className={mobileTwoUpGrid}>{renderSkeletons()}</div>
        ) : wishlist.length === 0 ? (
          <Reveal y={14} duration={0.8}>
            <EmptyState
              icon={FaHeartBroken}
              title="Your Wishlist is Empty"
              description="Explore our collections and save the pieces that speak to you. Your favorites will stay right here, waiting."
              primaryAction={{
                label: "Find Your Favorites",
                to: "/",
                icon: FaArrowRight,
              }}
              tip="Tip: Tap the heart on any creation to save it."
            />
          </Reveal>
        ) : (
          <motion.div
            className={mobileTwoUpGrid}
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} mode="wishlist" />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;