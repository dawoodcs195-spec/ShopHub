import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { getMyOrders } from "../../services/orderService";
import { generateInvoice } from "../../utils/invoiceGenerator";

import OrderHeader from "./components/OrderHeader";
import OrderTimeline from "./components/OrderTimeline";
import OrderItems from "./components/OrderItems";
import OrderSummaryCard from "./components/OrderSummaryCard";

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
                        <OrderHeader order={order} />

                        <hr className="mb-6" />

                        <OrderTimeline
                            order={order}
                        />

                        <OrderItems
                            orderItems={
                                order.orderItems
                            }
                        />

                        <hr className="my-6" />

                        <OrderSummaryCard
                            order={order}
                            onDownloadInvoice={() =>
                                generateInvoice(
                                    order
                                )
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;