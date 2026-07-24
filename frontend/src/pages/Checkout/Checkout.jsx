import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FaShippingFast, FaCreditCard, FaLock, FaChevronDown, FaShoppingBag, FaCheckCircle } from "react-icons/fa";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/orderService";
import { validateCoupon } from "../../services/couponService";
import Input from "../../components/forms/Input";

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, shippingAddress: initialShippingAddress, paymentMethod: initialPaymentMethod, clearCart, appliedCoupon, discount, applyCoupon, clearCoupon, saveShippingAddress, savePaymentMethod } = useCart();
    const { token } = useAuth();

    const [activeStep, setActiveStep] = useState(1);
    const [shippingAddress, setShippingAddress] = useState({
        fullName: initialShippingAddress?.fullName || "",
        phone: initialShippingAddress?.phone || "",
        address: initialShippingAddress?.address || "",
        city: initialShippingAddress?.city || "",
        postalCode: initialShippingAddress?.postalCode || "",
        country: initialShippingAddress?.country || "Pakistan",
    });
    const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod || "Stripe");
    const [processing, setProcessing] = useState(false);
    const [couponCode, setCouponCode] = useState(appliedCoupon?.code || "");

    const itemsPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 0 ? 250 : 0;
    const taxPrice = 0;
    const totalPrice = Math.max(itemsPrice + shippingPrice + taxPrice - discount, 0);

    const handleShippingChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleShippingSubmit = () => {
        for (const key in shippingAddress) {
            if (!shippingAddress[key]) {
                toast.error("Please fill all shipping fields.");
                return;
            }
        }
        saveShippingAddress(shippingAddress);
        setActiveStep(2);
    };

    const placeOrder = async () => {
        if (activeStep < 2) {
            toast.error("Please complete the shipping information first.");
            return;
        }
        savePaymentMethod(paymentMethod);
        setProcessing(true);
        try {
            const orderData = {
                orderItems: cartItems.map(item => ({ product: item._id, name: item.name, image: item.image, price: item.price, quantity: item.quantity })),
                shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice,
                coupon: appliedCoupon?.code || null,
                discount,
            };

            if (paymentMethod === "Stripe") {
                navigate("/stripe-payment", { state: { orderData } });
            } else { // Cash on Delivery
                await createOrder(orderData, token);
                clearCart();
                toast.success("Your order has been placed successfully!");
                navigate("/my-orders");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to place order.");
        } finally {
            setProcessing(false);
        }
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

    if (cartItems.length === 0 && !processing) {
        return (
             <div className="bg-background min-h-screen flex items-center justify-center">
                <div className="text-center py-20 bg-surface rounded-lg shadow-soft max-w-2xl mx-auto w-full">
                    <FaShoppingBag className="mx-auto text-5xl text-text-muted mb-6" />
                    <h1 className="text-3xl font-serif font-bold text-text-primary mb-4">Your Cart is Empty</h1>
                    <p className="text-text-secondary mb-8">You need to add items to your cart before you can checkout.</p>
                    <Link to="/" className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-hover shadow-soft">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const AccordionStep = ({ stepNumber, title, icon: Icon, children, isCompleted, isOpen, onToggle }) => (
        <div className="border border-border rounded-lg overflow-hidden bg-surface shadow-soft">
            <button onClick={onToggle} className="w-full flex justify-between items-center p-4" disabled={!isCompleted && stepNumber > activeStep}>
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-primary text-white' : 'bg-border text-text-primary'}`}>
                        {isCompleted ? <FaCheckCircle /> : stepNumber}
                    </div>
                    <h3 className="font-semibold text-lg text-text-primary">{title}</h3>
                </div>
                <FaChevronDown className={`text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 border-t border-border">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    const OrderSummary = () => (
        <div className="bg-surface rounded-lg shadow-soft p-6 sticky top-24 space-y-4">
            <h2 className="text-2xl font-serif font-bold text-text-primary">Order Summary</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {cartItems.map(item => (
                    <div key={item._id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                            <img src={item.image?.url} alt={item.name} className="w-12 h-12 rounded object-cover"/>
                            <div>
                                <p className="text-text-primary font-semibold">{item.name}</p>
                                <p className="text-text-secondary">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <p className="text-text-primary font-semibold">Rs. {item.price * item.quantity}</p>
                    </div>
                ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2 text-text-secondary">
                <div className="flex justify-between"><span>Subtotal</span><span>Rs. {itemsPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>Rs. {shippingPrice.toLocaleString()}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600 font-semibold"><span>Discount ({appliedCoupon?.code})</span><span>- Rs. {discount.toLocaleString()}</span></div>}
                <div className="flex justify-between font-bold text-text-primary text-lg pt-2 border-t border-border mt-2"><span>Total</span><span className="text-primary">Rs. {totalPrice.toLocaleString()}</span></div>
            </div>
        </div>
    );
    
    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-text-primary">Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-3 lg:gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        <AccordionStep
                            stepNumber={1} title="Shipping Information" icon={FaShippingFast}
                            isOpen={activeStep === 1} onToggle={() => setActiveStep(1)} isCompleted={activeStep > 1}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input name="fullName" placeholder="Full Name" value={shippingAddress.fullName} onChange={handleShippingChange} />
                                <Input name="phone" placeholder="Phone Number" value={shippingAddress.phone} onChange={handleShippingChange} />
                                <div className="sm:col-span-2"><Input name="address" placeholder="Street Address" value={shippingAddress.address} onChange={handleShippingChange} /></div>
                                <Input name="city" placeholder="City" value={shippingAddress.city} onChange={handleShippingChange} />
                                <Input name="postalCode" placeholder="Postal Code" value={shippingAddress.postalCode} onChange={handleShippingChange} />
                                <Input name="country" placeholder="Country" value={shippingAddress.country} onChange={handleShippingChange} />
                            </div>
                            <button onClick={handleShippingSubmit} className="mt-6 w-full sm:w-auto bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-hover shadow-soft">Continue to Payment</button>
                        </AccordionStep>

                        <AccordionStep
                            stepNumber={2} title="Payment Method" icon={FaCreditCard}
                            isOpen={activeStep === 2} onToggle={() => activeStep > 1 && setActiveStep(2)} isCompleted={false}
                        >
                             <div className="space-y-4">
                                <label className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                                    <input type="radio" name="paymentMethod" value="Stripe" checked={paymentMethod === 'Stripe'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-primary"/>
                                    <span>Pay with Card (Stripe)</span>
                                </label>
                                 <label className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                                    <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-primary"/>
                                    <span>Cash on Delivery</span>
                                </label>
                            </div>
                        </AccordionStep>
                    </div>

                    <div className="lg:col-span-1 mt-8 lg:mt-0">
                        <div className="space-y-6">
                            <OrderSummary />
                            
                            <div className="bg-surface rounded-lg shadow-soft p-6">
                                <h3 className="text-lg font-semibold text-text-primary mb-3">Discount Code</h3>
                                {appliedCoupon ? (
                                     <div className="text-center">
                                        <p className="text-green-600 font-semibold">Coupon '{appliedCoupon.code}' applied!</p>
                                        <button onClick={clearCoupon} className="text-xs text-red-500 hover:underline">Remove</button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter code" className="text-sm" />
                                        <button onClick={handleApplyCoupon} className="bg-primary text-white font-semibold px-4 rounded-lg text-sm hover:bg-primary-hover">Apply</button>
                                    </div>
                                )}
                            </div>

                            <button onClick={placeOrder} disabled={processing || activeStep < 2} className="w-full mt-4 flex items-center justify-center gap-3 bg-primary text-white font-semibold py-3 rounded-lg shadow-soft hover:bg-primary-hover transition-all disabled:bg-text-muted disabled:cursor-not-allowed">
                                <FaLock/>
                                {processing ? 'Processing...' : (paymentMethod === 'Stripe' ? 'Continue to Payment' : 'Place Order')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;