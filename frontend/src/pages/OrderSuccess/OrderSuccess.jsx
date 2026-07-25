import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaArrowRight, FaReceipt, FaHome } from "react-icons/fa";

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state || {};
    const order = state.order || null;

    const fallback = !state || Object.keys(state).length === 0;

    const message =
        state.message ||
        "Thank you for supporting a handmade studio. Your order means more than a purchase — it helps keep creativity alive. We’ll prepare your creation with patience, care, and love.";

    const paymentMethod =
        state.paymentMethod || order?.paymentMethod || "—";

    const totalPrice =
        state.totalPrice ??
        order?.totalPrice ??
        order?.total ??
        null;

    const shippingName =
        state.shippingAddress?.fullName || order?.shippingAddress?.fullName || "";

    const shippingCity =
        state.shippingAddress?.city || order?.shippingAddress?.city || "";

    return (
        <div className="min-h-screen bg-[#FCFAF7]">
            <div className="max-w-3xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-[36px] border border-[#EFE6DC] bg-white p-10 sm:p-12 shadow-soft"
                >
                    {/* soft glow */}
                    <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-rose-100/40 blur-3xl" />
                    <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-amber-100/35 blur-3xl" />

                    <div className="relative">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FDF1F3] to-[#FFF7ED] text-[#2D2A26] shadow-sm">
                            <FaCheckCircle className="text-4xl text-[#2E7D32]" />
                        </div>

                        <h1 className="text-center text-4xl sm:text-5xl font-serif font-bold text-[#2D2A26]">
                            Order Placed
                        </h1>

                        <p className="mt-4 text-center text-lg leading-9 text-[#5F5751]">
                            {message}
                        </p>

                        {/* Summary */}
                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-3xl border border-[#EFE6DC] bg-[#FFFDFB] p-6">
                                <p className="text-sm font-semibold tracking-wide text-[#B76E79]">
                                    Payment Method
                                </p>
                                <p className="mt-2 text-lg font-semibold text-[#2D2A26]">
                                    {paymentMethod}
                                </p>
                            </div>

                            <div className="rounded-3xl border border-[#EFE6DC] bg-[#FFFDFB] p-6">
                                <p className="text-sm font-semibold tracking-wide text-[#B76E79]">
                                    Total
                                </p>
                                <p className="mt-2 text-lg font-semibold text-[#2D2A26]">
                                    {totalPrice !== null
                                        ? `Rs. ${Number(totalPrice).toLocaleString()}`
                                        : "—"}
                                </p>
                            </div>

                            {(shippingName || shippingCity) && (
                                <div className="sm:col-span-2 rounded-3xl border border-[#EFE6DC] bg-white p-6">
                                    <p className="text-sm font-semibold tracking-wide text-[#B76E79]">
                                        Delivery To
                                    </p>
                                    <p className="mt-2 text-[#2D2A26] font-semibold">
                                        {shippingName || "—"}
                                    </p>
                                    <p className="mt-1 text-[#6B655F]">
                                        {shippingCity ? `${shippingCity}` : ""}
                                    </p>
                                </div>
                            )}
                        </div>

                        {fallback && (
                            <div className="mt-8 rounded-3xl border border-[#EFE6DC] bg-amber-50/40 p-6">
                                <p className="text-sm text-[#5F5751]">
                                    This page looks best right after placing an order. If you refreshed,
                                    you can still view your order history.
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/my-orders"
                                className="flex-1 inline-flex items-center justify-center gap-3 rounded-full bg-[#B76E79] px-7 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                <FaReceipt />
                                View My Orders
                                <FaArrowRight />
                            </Link>

                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-3 rounded-full border border-[#EFE6DC] bg-white px-7 py-4 font-semibold text-[#2D2A26] shadow-sm transition-colors hover:bg-[#FCFAF7]"
                            >
                                <FaHome />
                                Continue Shopping
                            </Link>
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                type="button"
                                onClick={() => navigate("/my-orders")}
                                className="text-sm font-semibold text-[#B76E79] hover:underline"
                            >
                                Track delivery updates in My Orders
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderSuccess;