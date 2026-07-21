import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import Rating from "../common/Rating";

import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
    const { user } = useAuth();
    const {
        toggleWishlist,
        isInWishlist,
    } = useWishlist();

    const wishlisted = isInWishlist(product._id);

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) return;

        await toggleWishlist(product._id);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden">
            <div className="relative h-56 overflow-hidden">
                <img
                    src={
                        product.image?.url ||
                        "https://placehold.co/600x600?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                />

                {user && (
                    <button
                        onClick={handleWishlist}
                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
                    >
                        {wishlisted ? (
                            <FaHeart
                                size={22}
                                className="text-red-500"
                            />
                        ) : (
                            <FaRegHeart
                                size={22}
                                className="text-gray-600"
                            />
                        )}
                    </button>
                )}
            </div>

            <div className="p-5">
                <h2 className="text-xl font-bold mb-2">
                    {product.name}
                </h2>

                <Rating
                    value={product.rating}
                    text={`(${product.numReviews} Reviews)`}
                />

                <p className="text-gray-500 h-12 overflow-hidden mt-3">
                    {product.description}
                </p>

                <div className="mt-4 flex justify-between items-center">
                    <span className="text-blue-600 text-2xl font-bold">
                        Rs. {product.price}
                    </span>

                    <span
                        className={`font-semibold ${
                            product.stock > 0
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {product.stock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                    </span>
                </div>

                <Link
                    to={`/product/${product._id}`}
                    className="block mt-5 text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;