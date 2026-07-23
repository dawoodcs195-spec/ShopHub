const TopProducts = ({ products }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">
                Top Selling Products
            </h2>

            {products.length === 0 ? (
                <p className="text-gray-500">
                    No sales data available.
                </p>
            ) : (
                <div className="space-y-4">
                    {products.map((product, index) => (
                        <div
                            key={product._id || index}
                            className="flex items-center justify-between border-b pb-4 last:border-b-0"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                    #{index + 1}
                                </div>

                                <div>
                                    <p className="font-semibold">
                                        {product.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Product ID: {product._id}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-green-600">
                                    {product.totalSold}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Sold
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopProducts;