import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { getMyOrders } from "../../services/orderService";

const MyOrders = () => {
    const { token } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getMyOrders(token);
                setOrders(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    if (loading) {
        return (
            <div className="text-center py-20 text-2xl">
                Loading Orders...
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-5xl mx-auto py-20 text-center">

                <h1 className="text-4xl font-bold mb-4">
                    My Orders
                </h1>

                <p className="text-gray-500 mb-8">
                    You haven't placed any orders yet.
                </p>

                <Link
                    to="/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                    Start Shopping
                </Link>

            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-5">

            <h1 className="text-4xl font-bold mb-8">
                My Orders
            </h1>

            <div className="space-y-6">

                {orders.map((order) => (

                    <div
                        key={order._id}
                        className="bg-white rounded-xl shadow-md p-6"
                    >

                        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-5">

                            <div>
                                <p className="font-semibold">
                                    Order ID
                                </p>

                                <p className="text-gray-500 break-all">
                                    {order._id}
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold">
                                    Status
                                </p>

                                <span
                                    className={`px-3 py-1 rounded-full text-white ${
                                        order.orderStatus === "Delivered"
                                            ? "bg-green-600"
                                            : order.orderStatus === "Processing"
                                            ? "bg-yellow-500"
                                            : order.orderStatus === "Shipped"
                                            ? "bg-blue-600"
                                            : "bg-gray-600"
                                    }`}
                                >
                                    {order.orderStatus}
                                </span>
                            </div>

                            <div>
                                <p className="font-semibold">
                                    Total
                                </p>

                                <p className="text-blue-600 font-bold">
                                    Rs. {order.totalPrice}
                                </p>
                            </div>

                        </div>

                        <hr className="mb-5" />

                        <div className="space-y-4">

                            {order.orderItems.map((item) => (

                                <div
                                    key={item.product}
                                    className="flex items-center gap-4"
                                >

                                    <img
                                        src={
                                            item.image?.url ||
                                            "https://placehold.co/80x80?text=No+Image"
                                        }
                                        alt={item.name}
                                        className="w-20 h-20 rounded-lg object-cover border"
                                    />

                                    <div className="flex-1">

                                        <h2 className="font-semibold">
                                            {item.name}
                                        </h2>

                                        <p className="text-gray-500">
                                            Qty: {item.quantity}
                                        </p>

                                    </div>

                                    <div className="font-bold text-blue-600">
                                        Rs. {item.price}
                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default MyOrders;