import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

import { createPaymentIntent } from "../../services/paymentService";
import { createOrder } from "../../services/orderService";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const PaymentForm = ({ totalPrice }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const {
        cartItems,
        shippingAddress,
        clearCart,
        appliedCoupon,
        discount,
    } = useCart();

    const { token } = useAuth();

    const [processing, setProcessing] = useState(false);

    const itemsPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const shippingPrice = itemsPrice > 0 ? 250 : 0;
    const taxPrice = 0;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        try {
            const { error, paymentIntent } =
                await stripe.confirmPayment({
                    elements,
                    redirect: "if_required",
                });

            if (error) {
                toast.error(error.message);
                setProcessing(false);
                return;
            }

            if (paymentIntent.status !== "succeeded") {
                toast.error("Payment was not completed.");
                setProcessing(false);
                return;
            }

            const orderData = {
                orderItems: cartItems.map((item) => ({
                    product: item._id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity,
                })),
                shippingAddress,
                paymentMethod: "Stripe",
                paymentIntentId: paymentIntent.id,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
                coupon: appliedCoupon?.code || null,
                discount,
            };

            await createOrder(orderData, token);

            clearCart();

            toast.success("Payment successful. Order placed.");

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

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <PaymentElement />

            <button
                type="submit"
                disabled={
                    processing ||
                    !stripe ||
                    !elements
                }
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
                {processing
                    ? "Processing..."
                    : `Pay Rs. ${totalPrice}`}
            </button>
        </form>
    );
};

const StripePayment = () => {
    const { cartItems, discount } = useCart();
    const { token } = useAuth();

    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const itemsPrice = useMemo(
        () =>
            cartItems.reduce(
                (total, item) =>
                    total + item.price * item.quantity,
                0
            ),
        [cartItems]
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

    useEffect(() => {
        const getClientSecret = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await createPaymentIntent(
                        totalPrice,
                        token
                    );

                setClientSecret(data.clientSecret);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        "Unable to initialize payment."
                );
            } finally {
                setLoading(false);
            }
        };

        if (token && totalPrice > 0) {
            getClientSecret();
        } else {
            setLoading(false);
        }
    }, [token, totalPrice]);

    return (
        <div className="max-w-3xl mx-auto py-10 px-5">
            <div className="bg-white rounded-xl shadow-md p-8">
                <h1 className="text-3xl font-bold mb-6">
                    Secure Checkout
                </h1>

                <div className="mb-6 rounded-lg bg-gray-50 p-4">
                    <div className="flex justify-between">
                        <span>Items</span>

                        <span>
                            {cartItems.reduce(
                                (sum, item) =>
                                    sum + item.quantity,
                                0
                            )}
                        </span>
                    </div>

                    <div className="flex justify-between mt-2">
                        <span>Total</span>

                        <span className="font-bold">
                            Rs. {totalPrice}
                        </span>
                    </div>
                </div>

                {loading && (
                    <p className="text-gray-600">
                        Initializing secure payment...
                    </p>
                )}

                {!loading && error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
                        {error}
                    </div>
                )}

                {!loading && clientSecret && (
                    <Elements
                        stripe={stripePromise}
                        options={{
                            clientSecret,
                            appearance: {
                                theme: "stripe",
                            },
                        }}
                    >
                        <PaymentForm
                            totalPrice={totalPrice}
                        />
                    </Elements>
                )}
            </div>
        </div>
    );
};

export default StripePayment;