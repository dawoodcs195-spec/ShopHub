const LatestProducts = ({ products }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">
                Latest Products
            </h2>

            {products.length === 0 ? (
                <p className="text-gray-500">
                    No products available.
                </p>
            ) : (
                <div className="space-y-4">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="flex items-center justify-between border-b pb-4 last:border-b-0"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={
                                        product.image?.url ||
                                        "https://placehold.co/60x60?text=No+Image"
                                    }
                                    alt={product.name}
                                    className="w-14 h-14 rounded-lg object-cover border"
                                />

                                <div>
                                    <h3 className="font-semibold">
                                        {product.name}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {product.category}
                                    </p>

                                    <p className="text-sm font-medium text-blue-600 mt-1">
                                        Rs. {product.price}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        product.stock <= 5
                                            ? "bg-red-100 text-red-600"
                                            : "bg-green-100 text-green-600"
                                    }`}
                                >
                                    {product.stock} in stock
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LatestProducts;