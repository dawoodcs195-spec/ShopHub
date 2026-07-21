import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import Rating from "../common/Rating";

import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductInfo = ({ product, addToCart }) => {
    const { user } = useAuth();

    const {
        toggleWishlist,
        isInWishlist,
    } = useWishlist();

    const wishlisted = isInWishlist(product._id);

    const handleAddToCart = () => {
        if (product.stock <= 0) {
            toast.error("Product is out of stock.");
            return;
        }

        addToCart(product);
        toast.success("Added to cart.");
    };

    const handleWishlist = async () => {
        await toggleWishlist(product._id);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}

            <div className="bg-white rounded-xl shadow-lg p-6">
                <img
                    src={
                        product.image?.url ||
                        "https://placehold.co/800x800?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-[500px] object-cover rounded-xl"
                />
            </div>

            {/* Product Details */}

            <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                    <h1 className="text-5xl font-bold">
                        {product.name}
                    </h1>

                    {user && (
                        <button
                            onClick={handleWishlist}
                            className="bg-white rounded-full p-3 shadow-md hover:scale-110 transition"
                            aria-label="Toggle Wishlist"
                        >
                            {wishlisted ? (
                                <FaHeart
                                    size={26}
                                    className="text-red-500"
                                />
                            ) : (
                                <FaRegHeart
                                    size={26}
                                    className="text-gray-600"
                                />
                            )}
                        </button>
                    )}
                </div>

                <Rating
                    value={product.rating}
                    text={`${product.numReviews} Review${
                        product.numReviews !== 1 ? "s" : ""
                    }`}
                />

                <p className="text-gray-600 text-lg my-6">
                    {product.description}
                </p>

                <h2 className="text-4xl font-bold text-blue-600 mb-8">
                    Rs. {product.price}
                </h2>

                <div className="space-y-3 mb-8">
                    <p>
                        <strong>Category:</strong>{" "}
                        {product.category}
                    </p>

                    <p>
                        <strong>Brand:</strong>{" "}
                        {product.brand}
                    </p>

                    <p>
                        <strong>Available Stock:</strong>{" "}
                        {product.stock}
                    </p>

                    {product.stock === 0 && (
                        <p className="font-semibold text-red-600">
                            Out of Stock
                        </p>
                    )}

                    {product.stock > 0 &&
                        product.stock <= 5 && (
                            <p className="font-semibold text-orange-500">
                                Only {product.stock} left in stock
                            </p>
                        )}
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`px-10 py-4 rounded-xl text-white transition ${
                        product.stock === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {product.stock === 0
                        ? "Out of Stock"
                        : "Add To Cart"}
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;