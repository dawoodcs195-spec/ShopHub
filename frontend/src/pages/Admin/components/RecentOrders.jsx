import { motion } from 'framer-motion';

const RecentOrders = ({ orders }) => {
    return (
        <div className="bg-surface rounded-lg shadow-soft p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Recent Orders</h3>
            {orders.length === 0 ? (
                <p className="text-text-secondary text-sm">No recent orders in this period.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order._id}
                            className="flex items-center justify-between border-b border-border pb-3 last:border-b-0 last:pb-0"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div>
                                <p className="font-semibold text-text-primary">{order.user?.name || 'Guest'}</p>
                                <p className="text-sm text-text-secondary">#{order._id.slice(-6)}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-primary">Rs. {order.totalPrice.toLocaleString()}</p>
                                <p className="text-xs text-text-secondary">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentOrders;