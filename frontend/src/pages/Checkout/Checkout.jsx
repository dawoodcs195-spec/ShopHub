import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/orderService";

const Checkout = () => {
    const navigate = useNavigate();

    const {
        cartItems,
        shippingAddress,
        saveShippingAddress,
        paymentMethod,
        savePaymentMethod,
        clearCart,
    } = useCart();

    const { token } = useAuth();

    const [fullName, setFullName] = useState(
        shippingAddress?.fullName || ""
    );
    const [phone, setPhone] = useState(
        shippingAddress?.phone || ""
    );
    const [address, setAddress] = useState(
        shippingAddress?.address || ""
    );
    const [city, setCity] = useState(
        shippingAddress?.city || ""
    );
    const [postalCode, setPostalCode] = useState(
        shippingAddress?.postalCode || ""
    );
    const [country, setCountry] = useState(
        shippingAddress?.country || ""
    );

    const [selectedPayment, setSelectedPayment] = useState(
        paymentMethod || "Stripe"
    );

    const [processing, setProcessing] = useState(false);

    const itemsPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const shippingPrice = itemsPrice > 0 ? 250 : 0;
    const taxPrice = 0;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const handleShippingSubmit = (e) => {
        e.preventDefault();

        if (
            !fullName ||
            !phone ||
            !address ||
            !city ||
            !postalCode ||
            !country
        ) {
            toast.error("Please fill all shipping fields.");
            return;
        }

        saveShippingAddress({
            fullName,
            phone,
            address,
            city,
            postalCode,
            country,
        });

        savePaymentMethod(selectedPayment);

        if (selectedPayment === "Stripe") {
            navigate("/stripe-payment");
        } else {
            placeOrder();
        }
    };

    const placeOrder = async () => {
        setProcessing(true);

        try {
            const orderData = {
                orderItems: cartItems.map((item) => ({
                    product: item._id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity,
                })),
                shippingAddress: {
                    fullName,
                    phone,
                    address,
                    city,
                    postalCode,
                    country,
                },
                paymentMethod: selectedPayment,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            };

            await createOrder(orderData, token);

            clearCart();

            toast.success("Order placed successfully.");

            navigate("/my-orders");
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                    "Failed to place order."
            );
        } finally {
            setProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-6xl mx-auto py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">
                    Your Cart is Empty
                </h1>

                <p className="text-gray-500 mb-8">
                    Add some products before checkout.
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
                Checkout
            </h1>

            <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* ================= Shipping Form ================= */}
                    <form
                        onSubmit={handleShippingSubmit}
                        className="bg-white rounded-xl shadow-md p-6 space-y-4"
                    >
                        <h2 className="text-2xl font-bold mb-4">
                            Shipping Address
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) =>
                                    setFullName(e.target.value)
                                }
                                className="border rounded-lg px-4 py-2 w-full"
                            />

                            <input
                                type="text"
                                placeholder="Phone"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                                className="border rounded-lg px-4 py-2 w-full"
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) =>
                                setAddress(e.target.value)
                            }
                            className="border rounded-lg px-4 py-2 w-full"
                        />

                        <div className="grid md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) =>
                                    setCity(e.target.value)
                                }
                                className="border rounded-lg px-4 py-2 w-full"
                            />

                            <input
                                type="text"
                                placeholder="Postal Code"
                                value={postalCode}
                                onChange={(e) =>
                                    setPostalCode(e.target.value)
                                }
                                className="border rounded-lg px-4 py-2 w-full"
                            />

                            <input
                                type="text"
                                placeholder="Country"
                                value={country}
                                onChange={(e) =>
                                    setCountry(e.target.value)
                                }
                                className="border rounded-lg px-4 py-2 w-full"
                            />
                        </div>

                        {/* ================= Payment Method ================= */}
                        <h2 className="text-2xl font-bold mt-6 mb-4">
                            Payment Method
                        </h2>

                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Stripe"
                                    checked={
                                        selectedPayment === "Stripe"
                                    }
                                    onChange={() =>
                                        setSelectedPayment("Stripe")
                                    }
                                />
                                <span>Stripe (Card Payment)</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Cash on Delivery"
                                    checked={
                                        selectedPayment ===
                                        "Cash on Delivery"
                                    }
                                    onChange={() =>
                                        setSelectedPayment(
                                            "Cash on Delivery"
                                        )
                                    }
                                />
                                <span>Cash on Delivery</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60 mt-4"
                        >
                            {processing
                                ? "Processing..."
                                : selectedPayment === "Stripe"
                                ? "Continue to Payment"
                                : "Place Order"}
                        </button>
                    </form>
                </div>

                {/* ================= Order Summary ================= */}
                <div className="bg-white rounded-xl shadow-md p-6 h-fit">
                    <h2 className="text-2xl font-bold mb-6">
                        Order Summary
                    </h2>

                    <div className="space-y-3 mb-4">
                        {cartItems.map((item) => (
                            <div
                                key={item._id}
                                className="flex justify-between text-sm"
                            >
                                <span>
                                    {item.name} x {item.quantity}
                                </span>
                                <span>
                                    Rs. {item.price * item.quantity}
                                </span>
                            </div>
                        ))}
                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>Rs. {itemsPrice}</span>
                    </div>

                    <div className="flex justify-between mb-2">
                        <span>Shipping</span>
                        <span>Rs. {shippingPrice}</span>
                    </div>

                    <hr className="my-4" />

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