import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../services/api";
import { useCart } from "../../context/CartContext";

import laptop from "../../assets/images/laptop.jpg";
import phone from "../../assets/images/phone.jpg";
import tv from "../../assets/images/tv.jpg";

const ProductDetails = () => {
    const { id } = useParams();

    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data.product);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

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

    let productImage = laptop;

    if (product.category === "Mobiles") {
        productImage = phone;
    }

    if (
        product.name.toLowerCase().includes("tv") ||
        product.category === "TV"
    ) {
        productImage = tv;
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-5">

            <div className="grid lg:grid-cols-2 gap-12 items-center">

                <div className="bg-white rounded-xl shadow-lg p-6">

                    <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-[500px] object-cover rounded-xl"
                    />

                </div>

                <div>

                    <h1 className="text-5xl font-bold mb-6">
                        {product.name}
                    </h1>

                    <p className="text-gray-600 text-lg mb-6">
                        {product.description}
                    </p>

                    <h2 className="text-4xl font-bold text-blue-600 mb-8">
                        Rs. {product.price}
                    </h2>

                    <div className="space-y-3 mb-8">

                        <p>
                            <strong>Category:</strong> {product.category}
                        </p>

                        <p>
                            <strong>Brand:</strong> {product.brand}
                        </p>

                        <p>
                            <strong>Available Stock:</strong> {product.stock}
                        </p>

                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl text-lg"
                    >
                        Add To Cart
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ProductDetails;