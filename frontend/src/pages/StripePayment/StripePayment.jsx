import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaArrowLeft, FaLock } from "react-icons/fa";

import { createPaymentIntent } from "../../services/paymentService";
import { createOrder } from "../../services/orderService";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    const el = document.documentElement;

    const observer = new MutationObserver(() => {
      setIsDark(el.classList.contains("dark"));
    });

    observer.observe(el, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return isDark;
};

const PaymentForm = ({ totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const { cartItems, shippingAddress, clearCart, appliedCoupon, discount } =
    useCart();

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

    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          // If Stripe ever needs a redirect (3DS), it will return here.
          // Our OrderSuccess page can show a fallback message even without state.
          return_url: `${window.location.origin}/order-success`,
        },
      });

      if (error) {
        toast.error(error.message || "Payment failed.");
        return;
      }

      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        toast.error("Payment was not completed.");
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

      const created = await createOrder(orderData, token);

      clearCart();

      toast.success("Payment successful. Order placed.");

      navigate("/order-success", {
        state: {
          order: created?.order || created?.data?.order || created,
          paymentMethod: "Card Payment (Stripe)",
          totalPrice: orderData.totalPrice,
          shippingAddress: orderData.shippingAddress,
          message:
            "Payment received — thank you. We’ll begin preparing your handmade creation and pack it with care.",
        },
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to place order.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-border dark:border-dark-border bg-card dark:bg-dark-card p-4">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={processing || !stripe || !elements}
        className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-primary py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <FaLock />
        {processing
          ? "Processing..."
          : `Pay Rs. ${Number(totalPrice).toLocaleString()}`}
      </button>

      <div className="text-center">
        <Link
          to="/checkout"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#B76E79] hover:underline"
        >
          <FaArrowLeft />
          Back to Checkout
        </Link>
      </div>
    </form>
  );
};

const StripePayment = () => {
  const { cartItems, discount } = useCart();
  const { token } = useAuth();

  const isDark = useIsDarkMode();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPrice = useMemo(
    () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const shippingPrice = itemsPrice > 0 ? 250 : 0;
  const taxPrice = 0;

  const totalPrice = Math.max(itemsPrice + shippingPrice + taxPrice - discount, 0);

  useEffect(() => {
    const getClientSecret = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await createPaymentIntent(totalPrice, token);
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Unable to initialize payment.");
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

  const stripeElementsOptions = useMemo(() => {
    if (!clientSecret) return null;

    return {
      clientSecret,
      appearance: {
        theme: isDark ? "night" : "stripe",
        variables: {
          colorPrimary: "#B76E79",
          colorText: isDark ? "#F5F1EC" : "#2D2A26",
          colorDanger: "#E25555",
          fontFamily: "Inter, system-ui, sans-serif",
          borderRadius: "12px",
        },
      },
    };
  }, [clientSecret, isDark]);

  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-background">
        <div className="max-w-2xl mx-auto py-16 px-4">
          <div className="rounded-[28px] border border-border dark:border-dark-border bg-card dark:bg-dark-card p-10 shadow-soft">
            <h1 className="text-3xl font-serif font-bold text-text-primary dark:text-dark-card-foreground">
              Stripe key missing
            </h1>
            <p className="mt-4 text-text-secondary dark:text-dark-muted-foreground leading-8">
              Please add{" "}
              <code className="font-semibold">
                VITE_STRIPE_PUBLISHABLE_KEY
              </code>{" "}
              to your frontend <code className="font-semibold">.env</code>.
            </p>
            <div className="mt-8">
              <Link
                to="/checkout"
                className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <FaArrowLeft />
                Back to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-card dark:bg-dark-card rounded-[28px] border border-border dark:border-dark-border shadow-soft p-8 sm:p-10"
        >
          <div className="flex items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary dark:text-dark-card-foreground">
                Secure Checkout
              </h1>
              <p className="mt-2 text-text-secondary dark:text-dark-muted-foreground">
                Complete your order safely via Stripe.
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-text-secondary dark:text-dark-muted-foreground">
                Total
              </p>
              <p className="mt-1 text-2xl font-bold text-primary">
                Rs. {Number(totalPrice).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-border dark:border-dark-border bg-surface dark:bg-dark-background p-5 text-sm text-text-secondary dark:text-dark-muted-foreground">
            <div className="flex justify-between">
              <span>Items</span>
              <span className="font-semibold text-text-primary dark:text-dark-card-foreground">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Shipping</span>
              <span className="font-semibold text-text-primary dark:text-dark-card-foreground">
                Rs. {shippingPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {loading && (
            <p className="mt-8 text-text-secondary dark:text-dark-muted-foreground">
              Initializing secure payment...
            </p>
          )}

          {!loading && error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          )}

          {!loading && clientSecret && stripeElementsOptions && (
            <div className="mt-10">
              <Elements
                key={`${clientSecret}-${isDark ? "dark" : "light"}`}
                stripe={stripePromise}
                options={stripeElementsOptions}
              >
                <PaymentForm totalPrice={totalPrice} />
              </Elements>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StripePayment;