const RecentOrders = ({ orders }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">
                Recent Orders
            </h2>

            {orders.length === 0 ? (
                <p className="text-gray-500">
                    No orders yet.
                </p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4"
                        >
                            <div>
                                <p className="font-semibold">
                                    {order.user?.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {order.user?.email}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="text-right mt-3 md:mt-0">
                                <p className="font-bold text-blue-600">
                                    Rs. {order.totalPrice}
                                </p>

                                <span
                                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                        order.paymentStatus === "Paid"
                                            ? "bg-green-100 text-green-700"
                                            : order.paymentStatus === "Failed"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {order.paymentStatus}
                                </span>

                                <p className="text-sm text-gray-600 mt-2">
                                    {order.orderStatus}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentOrders;