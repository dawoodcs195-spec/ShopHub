import { motion } from "framer-motion";

const TopProducts = ({ products }) => {
    return (
        <div className="bg-secondary dark:bg-dark-secondary border border-black/5 dark:border-white/10 rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-card-foreground dark:text-dark-card-foreground mb-4">
                Top Selling Products
            </h3>

            {products.length === 0 ? (
                <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                    No sales data for this period.
                </p>
            ) : (
                <div className="space-y-4">
                    {products.map((product, index) => (
                        <motion.div
                            key={product._id || index}
                            className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3 last:border-b-0 last:pb-0"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                                    {index + 1}
                                </div>

                                <div className="min-w-0">
                                    <p className="font-semibold text-card-foreground dark:text-dark-card-foreground truncate">
                                        {product.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                                        ID: {product._id.slice(-6)}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <p className="font-bold text-green-600 dark:text-green-400">
                                    {product.totalSold}
                                </p>
                                <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                                    units sold
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopProducts;