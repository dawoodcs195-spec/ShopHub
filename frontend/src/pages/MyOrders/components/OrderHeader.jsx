const OrderHeader = ({ order }) => {
    const getStatusClass = () => {
        switch (order.orderStatus) {
            case "Delivered":
                return "bg-green-600";

            case "Processing":
                return "bg-yellow-500";

            case "Shipped":
                return "bg-blue-600";

            case "Cancelled":
                return "bg-red-600";

            default:
                return "bg-gray-600";
        }
    };

    const getPaymentStatusClass = () => {
        switch (order.paymentStatus) {
            case "Paid":
                return "text-green-600";

            case "Failed":
                return "text-red-600";

            default:
                return "text-orange-600";
        }
    };

    return (
        <div className="flex flex-col lg:flex-row lg:justify-between gap-6 mb-5">
            <div>
                <p className="font-semibold">
                    Order ID
                </p>

                <p className="text-gray-500 break-all">
                    {order._id}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                    {new Date(
                        order.createdAt
                    ).toLocaleString()}
                </p>
            </div>

            <div>
                <p className="font-semibold">
                    Status
                </p>

                <span
                    className={`px-3 py-1 rounded-full text-white ${getStatusClass()}`}
                >
                    {order.orderStatus}
                </span>

                <p className="mt-3 text-sm">
                    Payment:{" "}
                    <span className="font-semibold">
                        {order.paymentMethod}
                    </span>
                </p>

                <p
                    className={`text-sm font-semibold ${getPaymentStatusClass()}`}
                >
                    {order.paymentStatus}
                </p>
            </div>

            <div>
                <p className="font-semibold">
                    Total
                </p>

                <p className="text-blue-600 font-bold text-xl">
                    Rs.{" "}
                    {Number(
                        order.totalPrice
                    ).toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default OrderHeader;