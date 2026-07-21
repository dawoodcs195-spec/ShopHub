import { Link } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

import { useCart } from "../../context/CartContext";

const Cart = () => {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
    } = useCart();

    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const itemsPrice = cartItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    const shippingPrice = itemsPrice > 0 ? 250 : 0;

    const totalPrice = itemsPrice + shippingPrice;

    if (cartItems.length === 0) {
        return (
            <div className="max-w-6xl mx-auto py-20 text-center">

                <h1 className="text-4xl font-bold mb-4">
                    Your Cart is Empty
                </h1>

                <p className="text-gray-500 mb-8">
                    Add some products to your cart.
                </p>

                <Link
                    to="/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                    Continue Shopping
                </Link>

            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-5">

            <h1 className="text-4xl font-bold mb-10">
                Shopping Cart
            </h1>

            <div className="grid lg:grid-cols-3 gap-10">

                <div className="lg:col-span-2 space-y-5">

                    {cartItems.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-xl shadow-md p-5 flex gap-5"
                        >

                            <img
                                src={
                                    item.image?.url ||
                                    "https://placehold.co/150x150?text=No+Image"
                                }
                                alt={item.name}
                                className="w-32 h-32 rounded-lg object-cover border"
                            />

                            <div className="flex-1">

                                <h2 className="text-xl font-bold">
                                    {item.name}
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    {item.description}
                                </p>

                                <p className="text-blue-600 font-bold mt-2">
                                    Rs. {item.price}
                                </p>

                                <div className="flex items-center gap-4 mt-4">

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item._id,
                                                item.quantity - 1
                                            )
                                        }
                                        className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                    >
                                        <FaMinus />
                                    </button>

                                    <span className="text-lg font-semibold">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item._id,
                                                item.quantity + 1
                                            )
                                        }
                                        className="w-9 h-9 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                                    >
                                        <FaPlus />
                                    </button>

                                </div>

                            </div>

                            <button
                                onClick={() =>
                                    removeFromCart(item._id)
                                }
                                className="text-red-600 hover:text-red-700"
                            >
                                <FaTrash size={20} />
                            </button>

                        </div>
                    ))}

                </div>

                <div className="bg-white rounded-xl shadow-md p-6 h-fit">

                    <h2 className="text-2xl font-bold mb-6">
                        Order Summary
                    </h2>

                    <div className="flex justify-between mb-3">
                        <span>Items</span>
                        <span>{totalItems}</span>
                    </div>

                    <div className="flex justify-between mb-3">
                        <span>Subtotal</span>
                        <span>Rs. {itemsPrice}</span>
                    </div>

                    <div className="flex justify-between mb-3">
                        <span>Shipping</span>
                        <span>Rs. {shippingPrice}</span>
                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between text-xl font-bold mb-6">

                        <span>Total</span>

                        <span className="text-blue-600">
                            Rs. {totalPrice}
                        </span>

                    </div>

                    <Link
                        to="/checkout"
                        className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                    >
                        Proceed to Checkout
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default Cart;