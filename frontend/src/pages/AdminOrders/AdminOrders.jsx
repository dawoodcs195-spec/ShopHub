import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import {
    getAllOrders,
    updateOrderStatus,
} from "../../services/orderService";

const AdminOrders = () => {
    const { token } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders(token);
            setOrders(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateOrderStatus(id, status, token);

            setOrders((prev) =>
                prev.map((order) =>
                    order._id === id
                        ? {
                              ...order,
                              orderStatus: status,
                              isDelivered: status === "Delivered",
                          }
                        : order
                )
            );

            toast.success("Order updated successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update order.");
        }
    };

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

    if (loading) {
        return (
            <div className="text-center py-20 text-2xl">
                Loading Orders...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">
                Manage Orders
            </h1>

            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-4 text-left">
                                Customer
                            </th>

                            <th className="p-4 text-left">
                                Items
                            </th>

                            <th className="p-4 text-left">
                                Total
                            </th>

                            <th className="p-4 text-left">
                                Payment Method
                            </th>

                            <th className="p-4 text-left">
                                Payment Status
                            </th>

                            <th className="p-4 text-left">
                                Transaction
                            </th>

                            <th className="p-4 text-left">
                                Paid At
                            </th>

                            <th className="p-4 text-left">
                                Order Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order._id}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="p-4">
                                    <div className="font-semibold">
                                        {order.user?.name}
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        {order.user?.email}
                                    </div>
                                </td>

                                <td className="p-4">
                                    {order.orderItems.length}
                                </td>

                                <td className="p-4 font-semibold text-blue-600">
                                    Rs. {order.totalPrice}
                                </td>

                                <td className="p-4">
                                    {order.paymentMethod}
                                </td>

                                <td className="p-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentBadge(
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
                                            title={
                                                order.transactionId
                                            }
                                        >
                                            {order.transactionId}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">
                                            —
                                        </span>
                                    )}
                                </td>

                                <td className="p-4">
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
                                            handleStatusChange(
                                                order._id,
                                                e.target.value
                                            )
                                        }
                                        className="border rounded-lg px-3 py-2"
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;