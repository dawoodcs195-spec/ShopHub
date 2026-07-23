const AdminOrderRow = ({
    order,
    onStatusChange,
}) => {
    const getPaymentBadge = (status) => {
        switch (status) {
            case "Paid":
                return "bg-green-100 text-green-700";

            case "Failed":
                return "bg-red-100 text-red-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    return (
        <tr className="border-b hover:bg-gray-50 transition-colors">
            <td className="p-4 font-medium text-gray-700 whitespace-nowrap">
                #{order.shortId}
            </td>

            <td className="p-4 whitespace-nowrap">
                {new Date(
                    order.createdAt
                ).toLocaleDateString()}
            </td>

            <td className="p-4">
                <div className="font-semibold">
                    {order.user?.name}
                </div>

                <div className="text-sm text-gray-500">
                    {order.user?.email}
                </div>
            </td>

            <td className="p-4 text-center">
                {order.orderItems.length}
            </td>

            <td className="p-4 font-semibold text-blue-600 whitespace-nowrap">
                Rs. {order.totalPrice}
            </td>

            <td className="p-4 whitespace-nowrap">
                {order.paymentMethod}
            </td>

            <td className="p-4">
                <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getPaymentBadge(
                        order.paymentStatus
                    )}`}
                >
                    {order.paymentStatus}
                </span>
            </td>

            <td className="p-4">
                {order.transactionId ? (
                    <div
                        className="max-w-[180px] truncate"
                        title={order.transactionId}
                    >
                        {order.transactionId}
                    </div>
                ) : (
                    <span className="text-gray-400">
                        —
                    </span>
                )}
            </td>

            <td className="p-4 whitespace-nowrap">
                {order.paidAt ? (
                    new Date(
                        order.paidAt
                    ).toLocaleString()
                ) : (
                    <span className="text-gray-400">
                        Not Paid
                    </span>
                )}
            </td>

            <td className="p-4">
                <select
                    value={order.orderStatus}
                    onChange={(e) =>
                        onStatusChange(
                            order._id,
                            e.target.value
                        )
                    }
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Pending">
                        Pending
                    </option>

                    <option value="Processing">
                        Processing
                    </option>

                    <option value="Shipped">
                        Shipped
                    </option>

                    <option value="Delivered">
                        Delivered
                    </option>

                    <option value="Cancelled">
                        Cancelled
                    </option>
                </select>
            </td>
        </tr>
    );
};

export default AdminOrderRow;