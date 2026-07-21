import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import Rating from "../../components/common/Rating";

const ProductDetails = () => {
    const { id } = useParams();

    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);

            const response = await api.get(`/products/${id}`);

            setProduct(response.data.product);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load product.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product.stock <= 0) {
            toast.error("Product is out of stock.");
            return;
        }

        addToCart(product);
        toast.success("Added to cart.");
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-2xl">
                Loading Product...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-20 text-2xl">
                Product Not Found
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-5">

            <div className="grid lg:grid-cols-2 gap-12">

                {/* Image */}

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

                {/* Details */}

                <div>

                    <h1 className="text-5xl font-bold mb-3">
                        {product.name}
                    </h1>

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
                                    Only {product.stock} left in
                                    stock
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

            {/* Reviews Section */}

            <div className="mt-16 bg-white rounded-xl shadow-lg p-8">

                <h2 className="text-3xl font-bold mb-6">
                    Customer Reviews
                </h2>

                {product.reviews && product.reviews.length > 0 ? (

                    <div className="space-y-6">

                        {product.reviews.map((review) => (

                            <div
                                key={review._id}
                                className="border-b pb-5"
                            >

                                <h3 className="font-bold text-lg">
                                    {review.name}
                                </h3>

                                <Rating
                                    value={review.rating}
                                />

                                <p className="text-gray-600 mt-3">
                                    {review.comment}
                                </p>

                            </div>

                        ))}

                    </div>

                ) : (

                    <p className="text-gray-500">
                        No reviews yet.
                    </p>

                )}

            </div>

        </div>
    );
};

export default ProductDetails;