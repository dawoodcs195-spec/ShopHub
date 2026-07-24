import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilePdf, FaChevronDown, FaBox, FaCreditCard, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const getStatusInfo = (status) => {
    switch (status) {
        case "Processing": return { icon: FaBox, color: "text-yellow-500", bg: "bg-yellow-500/10" };
        case "Shipped": return { icon: FaTruck, color: "text-blue-500", bg: "bg-blue-500/10" };
        case "Delivered": return { icon: FaCheckCircle, color: "text-green-500", bg: "bg-green-500/10" };
        case "Cancelled": return { icon: FaTimesCircle, color: "text-red-500", bg: "bg-red-500/10" };
        default: return { icon: FaCreditCard, color: "text-text-secondary", bg: "bg-gray-500/10" };
    }
};

const OrderCard = ({ order, onDownloadInvoice }) => {
    const [isOpen, setIsOpen] = useState(false);
    const StatusIcon = getStatusInfo(order.orderStatus).icon;
    const statusColor = getStatusInfo(order.orderStatus).color;
    const statusBg = getStatusInfo(order.orderStatus).bg;

    const detailsVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeInOut' } },
    };

    return (
        <div className="bg-surface rounded-lg shadow-soft overflow-hidden">
            {/* Collapsed Summary View */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 sm:p-6 focus:outline-none"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <div className="col-span-2 md:col-span-1">
                        <p className="text-sm text-text-secondary">Order ID</p>
                        <p className="font-semibold text-text-primary truncate">#{order._id.slice(-8)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Date</p>
                        <p className="font-semibold text-text-primary">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Total</p>
                        <p className="font-bold text-lg text-primary">Rs. {order.totalPrice.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusBg} ${statusColor}`}>
                            <StatusIcon />
                            <span>{order.orderStatus}</span>
                        </div>
                        <FaChevronDown className={`text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </button>

            {/* Expanded Details View */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={detailsVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="overflow-hidden"
                    >
                        <div className="border-t border-border p-4 sm:p-6 space-y-6">
                            {/* Order Items */}
                            <div>
                                <h4 className="font-semibold text-text-primary mb-3">Items Ordered</h4>
                                <div className="space-y-3">
                                    {order.orderItems.map(item => (
                                        <div key={item._id} className="flex items-center gap-4">
                                            <img src={item.image?.url || "https://placehold.co/80x80/F5E1E6/422B3A?text=?"} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-text-primary">{item.name}</p>
                                                <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-text-primary">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping & Summary */}
                            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
                                <div>
                                    <h4 className="font-semibold text-text-primary mb-3">Shipping Address</h4>
                                    <div className="text-sm text-text-secondary leading-relaxed">
                                        <p>{order.shippingAddress.fullName}</p>
                                        <p>{order.shippingAddress.address}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                        <p>{order.shippingAddress.country}</p>
                                        <p>Phone: {order.shippingAddress.phone}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-text-secondary">
                                    <div className="flex justify-between"><span>Subtotal</span><span>Rs. {order.itemsPrice.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>Shipping</span><span>Rs. {order.shippingPrice.toLocaleString()}</span></div>
                                    {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({order.coupon})</span><span>- Rs. {order.discount.toLocaleString()}</span></div>}
                                    <div className="flex justify-between font-bold text-text-primary text-base pt-2 border-t border-border"><span>Grand Total</span><span className="text-primary">Rs. {order.totalPrice.toLocaleString()}</span></div>
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={onDownloadInvoice}
                                    className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg shadow-soft hover:bg-primary-hover transition-all duration-300"
                                >
                                    <FaFilePdf/> Download Invoice
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderCard;