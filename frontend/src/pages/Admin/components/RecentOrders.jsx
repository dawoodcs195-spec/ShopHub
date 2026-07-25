import { motion } from "framer-motion";

const RecentOrders = ({ orders }) => {
    return (
        <div className="bg-secondary dark:bg-dark-secondary border border-black/5 dark:border-white/10 rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-card-foreground dark:text-dark-card-foreground mb-4">
                Recent Orders
            </h3>

            {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                    No recent orders in this period.
                </p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order._id}
                            className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3 last:border-b-0 last:pb-0"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="min-w-0">
                                <p className="font-semibold text-card-foreground dark:text-dark-card-foreground truncate">
                                    {order.user?.name || "Guest"}
                                </p>
                                <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                                    #{order._id.slice(-6)}
                                </p>
                            </div>

                            <div className="text-right shrink-0">
                                <p className="font-bold text-primary">
                                    Rs. {order.totalPrice.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentOrders;