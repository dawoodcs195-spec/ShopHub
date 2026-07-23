import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/orderService";

import ShippingForm from "./components/ShippingForm";
import PaymentMethod from "./components/PaymentMethod";
import CouponBox from "./components/CouponBox";
import OrderSummary from "./components/OrderSummary";

const Checkout = () => {
    const navigate = useNavigate();

    const {
        cartItems,
        shippingAddress,
        saveShippingAddress,
        paymentMethod,
        savePaymentMethod,
        clearCart,
        appliedCoupon,
        discount,
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

    const totalPrice = Math.max(
        itemsPrice +
            shippingPrice +
            taxPrice -
            discount,
        0
    );

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
                coupon: appliedCoupon?.code || null,
                discount,
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
                    <form
                        onSubmit={handleShippingSubmit}
                        className="bg-white rounded-xl shadow-md p-6 space-y-4"
                    >
                        <ShippingForm
                            fullName={fullName}
                            setFullName={setFullName}
                            phone={phone}
                            setPhone={setPhone}
                            address={address}
                            setAddress={setAddress}
                            city={city}
                            setCity={setCity}
                            postalCode={postalCode}
                            setPostalCode={setPostalCode}
                            country={country}
                            setCountry={setCountry}
                        />

                        <PaymentMethod
                            selectedPayment={
                                selectedPayment
                            }
                            setSelectedPayment={
                                setSelectedPayment
                            }
                        />

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60 mt-4"
                        >
                            {processing
                                ? "Processing..."
                                : selectedPayment ===
                                  "Stripe"
                                ? "Continue to Payment"
                                : "Place Order"}
                        </button>
                    </form>

                    <CouponBox
                        totalAmount={
                            itemsPrice +
                            shippingPrice +
                            taxPrice
                        }
                    />
                </div>

                <OrderSummary
                    cartItems={cartItems}
                    itemsPrice={itemsPrice}
                    shippingPrice={shippingPrice}
                    taxPrice={taxPrice}
                />
            </div>
        </div>
    );
};

export default Checkout;