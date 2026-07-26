import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";

import Rating from "../common/Rating";
import Badge from "../common/Badge";
import Button from "../common/Button";

import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product, mode = "default" }) => {
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wishlisted = isInWishlist(product._id);
  const isWishlistMode = mode === "wishlist";

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to manage your wishlist.");
      return;
    }
    await toggleWishlist(product._id);
  };

  const handleAddToCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      toast.error("This creation is out of stock.");
      return;
    }

    addToCart(product);

    if (isWishlistMode && user && wishlisted) {
      await toggleWishlist(product._id);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div variants={cardVariants} className="h-full">
      <Link
        to={`/product/${product._id}`}
        className={[
          "group flex h-full flex-col overflow-hidden rounded-[22px] sm:rounded-[30px]",
          "border border-border dark:border-dark-border",
          "bg-card dark:bg-dark-secondary",
          "shadow-sm transition-all duration-500",
          "hover:-translate-y-2 hover:shadow-2xl",
        ].join(" ")}
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent z-10" />

          <img
            src={
              product.image?.url ||
              "https://placehold.co/600x600/F5E1E6/422B3A?text=Handmade"
            }
            alt={product.name}
            className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute left-2.5 sm:left-4 top-2.5 sm:top-4 z-20">
            <Badge variant="rose">Handmade</Badge>
          </div>

          {user && (
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleWishlistClick}
              aria-label="Toggle Wishlist"
              className={[
                "absolute right-2.5 sm:right-4 top-2.5 sm:top-4 z-20 flex items-center justify-center rounded-full",
                "h-9 w-9 sm:h-11 sm:w-11",
                "bg-card/90 dark:bg-dark-secondary/80",
                "border border-border/70 dark:border-dark-border/70",
                "shadow-lg backdrop-blur-md transition-colors",
              ].join(" ")}
              title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {wishlisted ? (
                <FaHeart size={16} className="text-rose-500" />
              ) : (
                <FaRegHeart
                  size={16}
                  className="text-text-primary dark:text-dark-card-foreground transition-colors group-hover:text-rose-500"
                />
              )}
            </motion.button>
          )}
        </div>

        <div className="flex flex-1 flex-col p-3.5 sm:p-6">
          <p className="text-[10px] sm:text-sm font-medium uppercase tracking-[0.18em] text-primary">
            {product.category}
          </p>

          <h3
            title={product.name}
            className="mt-2 line-clamp-2 font-serif text-[16px] sm:text-2xl font-semibold leading-snug text-text-primary dark:text-dark-card-foreground"
          >
            {product.name}
          </h3>

          <div className="mt-3.5 sm:mt-5">
            <Rating value={product.rating} text={`(${product.numReviews})`} />
          </div>

          <div className="mt-4 sm:mt-6 flex items-end justify-between gap-3">
            <div>
              {/* hide this line on mobile to reduce height */}
              <p className="hidden sm:block text-sm text-text-secondary dark:text-dark-muted-foreground">
                Starting from
              </p>

              <h4 className="mt-1 text-xl sm:text-3xl font-bold text-text-primary dark:text-dark-card-foreground">
                Rs. {product.price.toLocaleString()}
              </h4>
            </div>

            {product.stock > 0 ? (
              <Badge variant="sage">In Stock</Badge>
            ) : (
              <Badge variant="gold">Sold Out</Badge>
            )}
          </div>

          <div className="mt-5 sm:mt-8">
            <Button onClick={handleAddToCartClick} disabled={product.stock === 0} className="w-full">
              {product.stock > 0 ? (
                <>
                  <FaShoppingCart />
                  <span className="sm:hidden">{isWishlistMode ? "Move" : "Add"}</span>
                  <span className="hidden sm:inline">{isWishlistMode ? "Move to Cart" : "Add to Cart"}</span>
                </>
              ) : (
                "Out of Stock"
              )}
            </Button>
          </div>

          {isWishlistMode && (
            <p className="mt-2.5 text-[11px] sm:text-xs text-text-secondary dark:text-dark-muted-foreground">
              Moves the item to your cart and removes it from your wishlist.
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;