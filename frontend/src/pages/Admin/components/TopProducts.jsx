import { motion } from 'framer-motion';

const TopProducts = ({ products }) => {
    return (
        <div className="bg-surface rounded-lg shadow-soft p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Top Selling Products</h3>
            {products.length === 0 ? (
                <p className="text-text-secondary text-sm">No sales data for this period.</p>
            ) : (
                <div className="space-y-4">
                    {products.map((product, index) => (
                         <motion.div
                            key={product._id || index}
                            className="flex items-center justify-between border-b border-border pb-3 last:border-b-0 last:pb-0"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-semibold text-text-primary">{product.name}</p>
                                    <p className="text-sm text-text-secondary">ID: {product._id.slice(-6)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-green-600">{product.totalSold}</p>
                                <p className="text-sm text-text-secondary">units sold</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopProducts;