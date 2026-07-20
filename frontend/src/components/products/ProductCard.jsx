import { Link } from "react-router-dom";

import laptop from "../../assets/images/laptop.jpg";
import phone from "../../assets/images/phone.jpg";
import tv from "../../assets/images/tv.jpg";

const ProductCard = ({ product }) => {

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
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden">

            <div className="h-56 overflow-hidden">

                <img
                    src={productImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />

            </div>

            <div className="p-5">

                <h2 className="text-xl font-bold mb-2">
                    {product.name}
                </h2>

                <p className="text-gray-500 h-12 overflow-hidden">
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