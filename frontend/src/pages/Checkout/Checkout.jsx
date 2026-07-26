import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaShippingFast,
  FaCreditCard,
  FaLock,
  FaShoppingBag,
  FaCheckCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/orderService";
import { validateCoupon } from "../../services/couponService";
import Input from "../../components/forms/Input";
import LoadingOverlay from "../../components/common/LoadingOverlay";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    shippingAddress: initialShippingAddress,
    paymentMethod: initialPaymentMethod,
    clearCart,
    appliedCoupon,
    discount,
    applyCoupon,
    clearCoupon,
    saveShippingAddress,
    savePaymentMethod,
  } = useCart();

  const { token } = useAuth();

  const [step, setStep] = useState(1);
  const [shippingComplete, setShippingComplete] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: initialShippingAddress?.fullName || "",
    phone: initialShippingAddress?.phone || "",
    address: initialShippingAddress?.address || "",
    city: initialShippingAddress?.city || "",
    postalCode: initialShippingAddress?.postalCode || "",
    country: initialShippingAddress?.country || "Pakistan",
  });

  const [paymentMethod, setPaymentMethod] = useState(
    initialPaymentMethod || "Stripe"
  );

  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState(appliedCoupon?.code || "");

  const itemsPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 0 ? 250 : 0;
  const taxPrice = 0;
  const totalPrice = Math.max(itemsPrice + shippingPrice + taxPrice - discount, 0);

  const totalItemsCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const overlayLabel =
    paymentMethod === "Stripe"
      ? "Redirecting to secure payment..."
      : "Placing your handmade order...";

  const steps = useMemo(
    () => [
      {
        number: 1,
        title: "Shipping",
        icon: FaShippingFast,
        isDone: shippingComplete,
        isEnabled: true,
      },
      {
        number: 2,
        title: "Payment",
        icon: FaCreditCard,
        isDone: paymentComplete,
        isEnabled: shippingComplete,
      },
      {
        number: 3,
        title: "Review",
        icon: FaCheckCircle,
        isDone: false,
        isEnabled: shippingComplete && paymentComplete,
      },
    ],
    [shippingComplete, paymentComplete]
  );

  const currentStepProgress = useMemo(() => {
    if (step <= 1) return 0;
    if (step === 2) return 50;
    return 100;
  }, [step]);

  const goToStep = (n) => {
    const target = steps.find((s) => s.number === n);
    if (!target) return;
    if (!target.isEnabled && n > step) return;
    setStep(n);
  };

  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleShippingContinue = () => {
    for (const key in shippingAddress) {
      if (!shippingAddress[key]) {
        toast.error("Please fill all shipping fields.");
        return;
      }
    }
    saveShippingAddress(shippingAddress);
    setShippingComplete(true);
    setStep(2);
  };

  const handlePaymentContinue = () => {
    if (!shippingComplete) {
      toast.error("Please complete shipping first.");
      return;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }
    savePaymentMethod(paymentMethod);
    setPaymentComplete(true);
    setStep(3);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const data = await validateCoupon(couponCode, itemsPrice);
      applyCoupon(data.coupon, data.discount);
      toast.success("Coupon applied successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired coupon.");
    }
  };

  const placeOrder = async () => {
    if (!shippingComplete) {
      toast.error("Please complete shipping information.");
      setStep(1);
      return;
    }

    if (!paymentComplete) {
      toast.error("Please confirm your payment method.");
      setStep(2);
      return;
    }

    savePaymentMethod(paymentMethod);
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
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        coupon: appliedCoupon?.code || null,
        discount,
      };

      if (paymentMethod === "Stripe") {
        navigate("/stripe-payment", { state: { orderData } });
        return;
      }

      const created = await createOrder(orderData, token);
      clearCart();

      navigate("/order-success", {
        state: {
          order: created?.order || created?.data?.order || created,
          paymentMethod: "Cash on Delivery",
          totalPrice: orderData.totalPrice,
          shippingAddress: orderData.shippingAddress,
          message:
            "Thank you for choosing handmade. We’ll carefully prepare your order and pack it beautifully before it reaches you.",
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order.");
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0 && !processing) {
    return (
      <div className="bg-background dark:bg-dark-background min-h-screen flex items-center justify-center px-4">
        <LoadingOverlay isOpen={processing} label={overlayLabel} />

        <div className="text-center py-20 bg-surface dark:bg-dark-card rounded-[28px] border border-border dark:border-dark-border shadow-soft max-w-2xl mx-auto w-full">
          <FaShoppingBag className="mx-auto text-5xl text-text-secondary dark:text-dark-muted-foreground mb-6" />
          <h1 className="text-3xl font-serif font-bold text-text-primary dark:text-dark-card-foreground mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-text-secondary dark:text-dark-muted-foreground mb-8">
            You need to add items to your cart before you can checkout.
          </p>
          <Link
            to="/"
            className="inline-flex bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-hover shadow-soft transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const PaymentOption = ({ value, label, description, icon: Icon }) => {
    const selected = paymentMethod === value;

    return (
      <label
        className={[
          "flex items-start gap-4 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all border",
          selected
            ? "border-primary bg-primary/10 shadow-soft"
            : "border-border dark:border-dark-border bg-card dark:bg-dark-card hover:bg-secondary/40 dark:hover:bg-dark-secondary/30",
        ].join(" ")}
      >
        <input
          type="radio"
          name="paymentMethod"
          value={value}
          checked={selected}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="mt-1 w-5 h-5 accent-[#B76E79]"
        />

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-secondary dark:bg-dark-secondary/40 text-primary shadow-sm">
              <Icon />
            </span>

            <span className="text-base sm:text-lg font-semibold text-text-primary dark:text-dark-card-foreground">
              {label}
            </span>
          </div>

          <p className="mt-2 text-sm text-text-secondary dark:text-dark-muted-foreground">
            {description}
          </p>
        </div>
      </label>
    );
  };

  const OrderSummary = () => (
    <div className="bg-surface dark:bg-dark-card rounded-2xl border border-border dark:border-dark-border shadow-soft p-6 sticky top-24 space-y-5">
      <h2 className="text-2xl font-serif font-bold text-text-primary dark:text-dark-card-foreground">
        Order Summary
      </h2>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center gap-4 text-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={item.image?.url}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover border border-border dark:border-dark-border"
              />
              <div className="min-w-0">
                <p className="text-text-primary dark:text-dark-card-foreground font-semibold truncate">
                  {item.name}
                </p>
                <p className="text-text-secondary dark:text-dark-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>

            <p className="text-text-primary dark:text-dark-card-foreground font-semibold whitespace-nowrap">
              Rs. {(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-border dark:border-dark-border pt-4 space-y-2 text-text-secondary dark:text-dark-muted-foreground">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-text-primary dark:text-dark-card-foreground">
            Rs. {itemsPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-text-primary dark:text-dark-card-foreground">
            Rs. {shippingPrice.toLocaleString()}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-700 dark:text-emerald-400 font-semibold">
            <span>Discount ({appliedCoupon?.code})</span>
            <span>- Rs. {discount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-text-primary dark:text-dark-card-foreground text-lg pt-3 border-t border-border dark:border-dark-border mt-2">
          <span>Total</span>
          <span className="text-primary">Rs. {totalPrice.toLocaleString()}</span>
        </div>
      </div>

      <p className="text-xs text-text-secondary dark:text-dark-muted-foreground text-center">
        Secure checkout • Carefully packed • Handmade with love
      </p>
    </div>
  );

  const MobileOrderSummary = () => (
    <div className="lg:hidden mb-8">
      <details className="group rounded-[28px] border border-border dark:border-dark-border bg-surface dark:bg-dark-card shadow-soft overflow-hidden">
        <summary className="list-none cursor-pointer select-none p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-text-secondary dark:text-dark-muted-foreground">
                Order Summary
              </p>
              <p className="mt-1 text-lg font-bold text-text-primary dark:text-dark-card-foreground">
                Rs. {totalPrice.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-text-secondary dark:text-dark-muted-foreground">
                {totalItemsCount} item{totalItemsCount !== 1 ? "s" : ""} • Shipping Rs.{" "}
                {shippingPrice.toLocaleString()}
              </p>
            </div>

            <div className="text-sm font-semibold text-primary">
              <span className="group-open:hidden">View</span>
              <span className="hidden group-open:inline">Hide</span>
            </div>
          </div>
        </summary>

        <div className="border-t border-border dark:border-dark-border p-5 sm:p-6">
          <OrderSummaryMobileBody />
        </div>
      </details>
    </div>
  );

  const OrderSummaryMobileBody = () => (
    <div className="space-y-5">
      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={item.image?.url}
                alt={item.name}
                className="w-11 h-11 rounded-lg object-cover border border-border dark:border-dark-border"
              />
              <div className="min-w-0">
                <p className="font-semibold text-text-primary dark:text-dark-card-foreground truncate">
                  {item.name}
                </p>
                <p className="text-xs text-text-secondary dark:text-dark-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>

            <p className="font-semibold text-text-primary dark:text-dark-card-foreground whitespace-nowrap">
              Rs. {(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-border dark:border-dark-border pt-4 space-y-2 text-sm text-text-secondary dark:text-dark-muted-foreground">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-text-primary dark:text-dark-card-foreground">
            Rs. {itemsPrice.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-text-primary dark:text-dark-card-foreground">
            Rs. {shippingPrice.toLocaleString()}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-700 dark:text-emerald-400 font-semibold">
            <span>Discount ({appliedCoupon?.code})</span>
            <span>- Rs. {discount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-text-primary dark:text-dark-card-foreground text-base pt-3 border-t border-border dark:border-dark-border mt-2">
          <span>Total</span>
          <span className="text-primary">Rs. {totalPrice.toLocaleString()}</span>
        </div>
      </div>

      <p className="text-xs text-text-secondary dark:text-dark-muted-foreground text-center">
        Secure checkout • Carefully packed • Handmade with love
      </p>
    </div>
  );

  const panelMotion = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <div className="bg-background dark:bg-dark-background min-h-screen">
      <LoadingOverlay isOpen={processing} label={overlayLabel} />

      <div className="max-w-7xl mx-auto py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-text-primary dark:text-dark-card-foreground">
            Checkout
          </h1>
          <p className="mt-3 text-text-secondary dark:text-dark-muted-foreground">
            A calm, secure finish to your handmade order.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8 sm:mb-10">
          <div className="rounded-[28px] border border-border dark:border-dark-border bg-surface dark:bg-dark-card shadow-soft p-5 sm:p-6">
            {/* Desktop progress line */}
            <div className="relative px-3 sm:px-6 hidden sm:block">
              <div className="absolute left-6 right-6 top-6 h-[2px] rounded-full bg-border/70 dark:bg-dark-border/70" />
              <motion.div
                className="absolute left-6 right-6 top-6 h-[2px] rounded-full bg-primary"
                initial={false}
                animate={{ scaleX: currentStepProgress / 100 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "left" }}
              />
            </div>

            {/* Mobile progress bar */}
            <div className="sm:hidden">
              <p className="text-xs font-semibold tracking-wide text-text-secondary dark:text-dark-muted-foreground mb-2">
                Step {step} of 3
              </p>
              <div className="h-2 rounded-full bg-border/70 dark:bg-dark-border/70 overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={false}
                  animate={{ width: `${currentStepProgress}%` }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <div className="mt-4 sm:mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {steps.map((s) => {
                const Icon = s.icon;
                const isActive = step === s.number;
                const clickable = s.number <= step || s.isEnabled;

                return (
                  <button
                    key={s.number}
                    type="button"
                    onClick={() => clickable && goToStep(s.number)}
                    className={[
                      "text-left rounded-2xl px-4 py-3 transition-colors",
                      clickable
                        ? "hover:bg-secondary/40 dark:hover:bg-dark-secondary/30"
                        : "cursor-not-allowed opacity-60",
                      isActive ? "bg-secondary/40 dark:bg-dark-secondary/30" : "",
                    ].join(" ")}
                    disabled={!clickable}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "inline-flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm",
                          s.isDone
                            ? "bg-primary border-primary text-white"
                            : isActive
                            ? "bg-accent border-border text-accent-foreground dark:bg-dark-accent/35 dark:border-dark-border dark:text-dark-card-foreground"
                            : "bg-card dark:bg-dark-background border-border dark:border-dark-border text-text-primary dark:text-dark-card-foreground",
                        ].join(" ")}
                      >
                        {s.isDone ? <FaCheckCircle /> : <Icon />}
                      </span>

                      <div>
                        <p className="text-xs font-semibold tracking-wide text-text-secondary dark:text-dark-muted-foreground">
                          Step {s.number}
                        </p>
                        <p className="text-base font-semibold text-text-primary dark:text-dark-card-foreground">
                          {s.title}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            {/* Mobile summary appears before panels */}
            <MobileOrderSummary />

            <AnimatePresence mode="wait" initial={false}>
              {step === 1 && (
                <motion.div
                  key="step-1"
                  {...panelMotion}
                  className="bg-surface dark:bg-dark-card rounded-[28px] border border-border dark:border-dark-border shadow-soft p-6 sm:p-8"
                >
                  <h2 className="text-2xl font-serif font-bold text-text-primary dark:text-dark-card-foreground">
                    Shipping Information
                  </h2>
                  <p className="mt-2 text-text-secondary dark:text-dark-muted-foreground">
                    Where should we deliver your creation?
                  </p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      name="fullName"
                      placeholder="Full Name"
                      value={shippingAddress.fullName}
                      onChange={handleShippingChange}
                    />
                    <Input
                      name="phone"
                      placeholder="Phone Number"
                      value={shippingAddress.phone}
                      onChange={handleShippingChange}
                    />
                    <div className="sm:col-span-2">
                      <Input
                        name="address"
                        placeholder="Street Address"
                        value={shippingAddress.address}
                        onChange={handleShippingChange}
                      />
                    </div>
                    <Input
                      name="city"
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={handleShippingChange}
                    />
                    <Input
                      name="postalCode"
                      placeholder="Postal Code"
                      value={shippingAddress.postalCode}
                      onChange={handleShippingChange}
                    />
                    <Input
                      name="country"
                      placeholder="Country"
                      value={shippingAddress.country}
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/cart"
                      className="inline-flex justify-center rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-background px-6 py-3 font-semibold text-text-primary dark:text-dark-card-foreground hover:bg-secondary/40 dark:hover:bg-dark-secondary/30 transition-colors"
                    >
                      Back to Cart
                    </Link>

                    <button
                      type="button"
                      onClick={handleShippingContinue}
                      className="flex-1 bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary-hover shadow-soft transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  {...panelMotion}
                  className="bg-surface dark:bg-dark-card rounded-[28px] border border-border dark:border-dark-border shadow-soft p-6 sm:p-8"
                >
                  <h2 className="text-2xl font-serif font-bold text-text-primary dark:text-dark-card-foreground">
                    Payment Method
                  </h2>
                  <p className="mt-2 text-text-secondary dark:text-dark-muted-foreground">
                    Choose the payment option you prefer.
                  </p>

                  <div className="mt-6 space-y-4">
                    <PaymentOption
                      value="Stripe"
                      label="Pay with Card (Stripe)"
                      description="Fast and secure card payment."
                      icon={FaCreditCard}
                    />
                    <PaymentOption
                      value="Cash on Delivery"
                      label="Cash on Delivery"
                      description="Pay in cash when your creation arrives."
                      icon={FaMoneyBillWave}
                    />
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="inline-flex justify-center rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-background px-6 py-3 font-semibold text-text-primary dark:text-dark-card-foreground hover:bg-secondary/40 dark:hover:bg-dark-secondary/30 transition-colors"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={handlePaymentContinue}
                      className="flex-1 bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary-hover shadow-soft transition-colors"
                    >
                      Continue to Review
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  {...panelMotion}
                  className="bg-surface dark:bg-dark-card rounded-[28px] border border-border dark:border-dark-border shadow-soft p-6 sm:p-8"
                >
                  <h2 className="text-2xl font-serif font-bold text-text-primary dark:text-dark-card-foreground">
                    Review & Place Order
                  </h2>
                  <p className="mt-2 text-text-secondary dark:text-dark-muted-foreground">
                    Confirm your details before placing your order.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border dark:border-dark-border bg-card dark:bg-dark-background p-5">
                      <p className="text-sm font-semibold text-text-primary dark:text-dark-card-foreground">
                        Shipping
                      </p>
                      <p className="mt-2 text-sm text-text-secondary dark:text-dark-muted-foreground leading-7">
                        {shippingAddress.fullName}
                        <br />
                        {shippingAddress.phone}
                        <br />
                        {shippingAddress.address}, {shippingAddress.city}
                        <br />
                        {shippingAddress.postalCode}, {shippingAddress.country}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border dark:border-dark-border bg-card dark:bg-dark-background p-5">
                      <p className="text-sm font-semibold text-text-primary dark:text-dark-card-foreground">
                        Payment
                      </p>
                      <p className="mt-2 text-sm text-text-secondary dark:text-dark-muted-foreground leading-7">
                        {paymentMethod === "Stripe"
                          ? "Card Payment (Stripe)"
                          : "Cash on Delivery"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 bg-card dark:bg-dark-background rounded-2xl border border-border dark:border-dark-border p-6">
                    <h3 className="text-lg font-semibold text-text-primary dark:text-dark-card-foreground mb-3">
                      Discount Code
                    </h3>

                    {appliedCoupon ? (
                      <div className="text-center">
                        <p className="text-green-700 dark:text-emerald-400 font-semibold">
                          Coupon '{appliedCoupon.code}' applied!
                        </p>
                        <button
                          onClick={clearCoupon}
                          className="mt-2 text-xs font-semibold text-destructive hover:underline"
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          value={couponCode}
                          onChange={(e) =>
                            setCouponCode(e.target.value.toUpperCase())
                          }
                          placeholder="Enter code"
                          className="text-sm"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-primary text-white font-semibold px-5 py-3 sm:py-0 rounded-xl text-sm hover:bg-primary-hover transition-colors"
                          type="button"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="inline-flex justify-center rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-background px-6 py-3 font-semibold text-text-primary dark:text-dark-card-foreground hover:bg-secondary/40 dark:hover:bg-dark-secondary/30 transition-colors"
                    >
                      Back
                    </button>

                    <button
                      onClick={placeOrder}
                      disabled={processing}
                      className={[
                        "flex-1 flex items-center justify-center gap-3 font-semibold py-4 rounded-xl shadow-soft transition-all",
                        processing
                          ? "bg-secondary text-text-secondary border border-border cursor-not-allowed dark:bg-dark-secondary/30 dark:text-dark-muted-foreground dark:border-dark-border"
                          : "bg-primary text-white hover:bg-primary-hover",
                      ].join(" ")}
                      type="button"
                    >
                      <FaLock />
                      {processing
                        ? "Processing..."
                        : paymentMethod === "Stripe"
                        ? "Continue to Payment"
                        : "Place Order"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop summary only */}
          <div className="hidden lg:block lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;