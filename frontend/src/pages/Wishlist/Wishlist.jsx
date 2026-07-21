import { Link } from "react-router-dom";

import { useWishlist } from "../../context/WishlistContext";

const Wishlist = () => {
    const { wishlist, loading } = useWishlist();

    if (loading) {
        return (
            <div className="text-center py-20 text-2xl">
                Loading Wishlist...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-5">
            <h1 className="text-4xl font-bold mb-8">
                My Wishlist
            </h1>

            {wishlist.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-10 text-center">
                    <h2 className="text-2xl font-semibold mb-4">
                        Your wishlist is empty.
                    </h2>

                    <p className="text-gray-600 mb-6">
                        Save products you love and
                        they'll appear here.
                    </p>

                    <Link
                        to="/"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((product) => (
                        <Link
                            key={product._id}
                            to={`/product/${product._id}`}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
                        >
                            <img
                                src={
                                    product.image?.url ||
                                    "https://placehold.co/600x600?text=No+Image"
                                }
                                alt={product.name}
                                className="w-full h-56 object-cover"
                            />

                            <div className="p-5">
                                <h2 className="text-lg font-bold mb-2">
                                    {product.name}
                                </h2>

                                <p className="text-blue-600 text-2xl font-bold">
                                    Rs. {product.price}
                                </p>

                                <p
                                    className={`mt-3 font-semibold ${
                                        product.stock > 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {product.stock > 0
                                        ? "In Stock"
                                        : "Out of Stock"}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;