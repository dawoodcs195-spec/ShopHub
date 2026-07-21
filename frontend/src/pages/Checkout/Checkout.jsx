import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import { createOrder } from "../../services/orderService";

const Checkout = () => {
    const navigate = useNavigate();

    const { user, token } = useAuth();

    const {
        cartItems,
        clearCart,
        shippingAddress,
        saveShippingAddress,
        paymentMethod,
    } = useCart();

    const [formData, setFormData] = useState({
        fullName: shippingAddress.fullName || user?.name || "",
        phone: shippingAddress.phone || "",
        address: shippingAddress.address || "",
        city: shippingAddress.city || "",
        postalCode: shippingAddress.postalCode || "",
        country: shippingAddress.country || "",
    });

    const itemsPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const shippingPrice = itemsPrice > 0 ? 250 : 0;

    const taxPrice = 0;

    const totalPrice =
        itemsPrice + shippingPrice + taxPrice;

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }

        try {
            saveShippingAddress(formData);

            const orderItems = cartItems.map((item) => ({
                product: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
            }));

            await createOrder(
                {
                    orderItems,
                    shippingAddress: formData,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                },
                token
            );

            clearCart();

            toast.success("Order placed successfully.");

            navigate("/my-orders");
        } catch (error) {
            console.error(error);
            toast.error("Failed to place order.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-5">

            <h1 className="text-4xl font-bold mb-10">
                Checkout
            </h1>

            <div className="grid lg:grid-cols-2 gap-10">

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-md p-8 space-y-4"
                >

                    <h2 className="text-2xl font-bold mb-4">
                        Shipping Information
                    </h2>

                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <div className="border rounded-lg p-4 bg-gray-50">
                        <p className="font-semibold">
                            Payment Method
                        </p>

                        <p className="text-gray-600 mt-1">
                            {paymentMethod}
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                    >
                        Place Order
                    </button>

                </form>

                <div className="bg-white rounded-xl shadow-md p-8 h-fit">

                    <h2 className="text-2xl font-bold mb-6">
                        Order Summary
                    </h2>

                    {cartItems.map((item) => (
                        <div
                            key={item._id}
                            className="flex justify-between mb-3"
                        >
                            <span>
                                {item.name} × {item.quantity}
                            </span>

                            <span>
                                Rs. {item.price * item.quantity}
                            </span>
                        </div>
                    ))}

                    <hr className="my-5" />

                    <div className="flex justify-between mb-3">
                        <span>Items</span>
                        <span>Rs. {itemsPrice}</span>
                    </div>

                    <div className="flex justify-between mb-3">
                        <span>Shipping</span>
                        <span>Rs. {shippingPrice}</span>
                    </div>

                    <div className="flex justify-between text-xl font-bold">

                        <span>Total</span>

                        <span className="text-blue-600">
                            Rs. {totalPrice}
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Checkout;