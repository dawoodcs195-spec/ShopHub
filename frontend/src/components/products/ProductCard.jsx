import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaHeart,
    FaRegHeart,
    FaShoppingCart,
} from "react-icons/fa";
import toast from "react-hot-toast";

import Rating from "../common/Rating";
import Badge from "../common/Badge";
import Button from "../common/Button";

import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
    const { user } = useAuth();

    const { toggleWishlist, isInWishlist } =
        useWishlist();

    const { addToCart } = useCart();

    const wishlisted = isInWishlist(product._id);

    const handleWishlistClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error(
                "Please log in to manage your wishlist."
            );
            return;
        }

        await toggleWishlist(product._id);
    };

    const handleAddToCartClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart(product, 1);

        toast.success(
            `${product.name} added to cart!`
        );
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 40,
        },

        visible: {
            opacity: 1,
            y: 0,

            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    return (
        <motion.div
            variants={cardVariants}
            className="h-full"
        >
            <Link
                to={`/product/${product._id}`}
                className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-[#EFE6DC] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
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

                    <div className="absolute left-4 top-4 z-20">
                        <Badge variant="rose">
                            Handmade
                        </Badge>
                    </div>

                    {user && (
                        <motion.button
                            whileHover={{
                                scale: 1.08,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            onClick={
                                handleWishlistClick
                            }
                            aria-label="Toggle Wishlist"
                            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-md transition-colors"
                        >
                            {wishlisted ? (
                                <FaHeart
                                    size={18}
                                    className="text-rose-500"
                                />
                            ) : (
                                <FaRegHeart
                                    size={18}
                                    className="text-slate-700 transition-colors group-hover:text-rose-500"
                                />
                            )}
                        </motion.button>
                    )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#B76E79]">
                        {product.category}
                    </p>

                    <h3
                        title={product.name}
                        className="mt-3 line-clamp-2 font-serif text-2xl font-semibold leading-snug text-[#2D2A26]"
                    >
                        {product.name}
                    </h3>

                    <div className="mt-5">
                        <Rating
                            value={product.rating}
                            text={`(${product.numReviews})`}
                        />
                    </div>

                    <div className="mt-6 flex items-end justify-between">
                        <div>
                            <p className="text-sm text-[#8B8178]">
                                Starting from
                            </p>

                            <h4 className="mt-1 text-3xl font-bold text-[#2D2A26]">
                                Rs.{" "}
                                {product.price.toLocaleString()}
                            </h4>
                        </div>

                        {product.stock > 0 ? (
                            <Badge variant="sage">
                                In Stock
                            </Badge>
                        ) : (
                            <Badge variant="gold">
                                Sold Out
                            </Badge>
                        )}
                    </div>

                    <div className="mt-8">
                        <Button
                            onClick={
                                handleAddToCartClick
                            }
                            disabled={
                                product.stock === 0
                            }
                            className="w-full"
                        >
                            {product.stock > 0 ? (
                                <>
                                    <FaShoppingCart />

                                    <span>
                                        Add to Cart
                                    </span>
                                </>
                            ) : (
                                "Out of Stock"
                            )}
                        </Button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;