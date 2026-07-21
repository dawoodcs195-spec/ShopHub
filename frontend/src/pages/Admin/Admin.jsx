import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    FaBoxOpen,
    FaShoppingCart,
    FaUsers,
    FaDollarSign,
} from "react-icons/fa";

import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { getDashboardStats } from "../../services/adminService";

const Admin = () => {
    const { token } = useAuth();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const data = await getDashboardStats(token);
            setDashboard(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load dashboard.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-2xl">
                Loading Dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="max-w-7xl mx-auto p-8">

                <h1 className="text-4xl font-bold mb-8">
                    Admin Dashboard
                </h1>

                {/* Statistics */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaBoxOpen
                            className="text-blue-600 mb-4"
                            size={40}
                        />

                        <h2 className="text-gray-500">
                            Products
                        </h2>

                        <p className="text-3xl font-bold">
                            {dashboard.totalProducts}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaShoppingCart
                            className="text-green-600 mb-4"
                            size={40}
                        />

                        <h2 className="text-gray-500">
                            Orders
                        </h2>

                        <p className="text-3xl font-bold">
                            {dashboard.totalOrders}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaDollarSign
                            className="text-yellow-500 mb-4"
                            size={40}
                        />

                        <h2 className="text-gray-500">
                            Revenue
                        </h2>

                        <p className="text-3xl font-bold">
                            Rs. {dashboard.totalRevenue}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaUsers
                            className="text-red-500 mb-4"
                            size={40}
                        />

                        <h2 className="text-gray-500">
                            Low Stock
                        </h2>

                        <p className="text-3xl font-bold">
                            {dashboard.lowStockProducts}
                        </p>
                    </div>

                </div>

                {/* Quick Actions */}

                <div className="flex flex-wrap gap-4 mb-10">

                    <Link
                        to="/admin/products"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Manage Products
                    </Link>

                    <Link
                        to="/admin/orders"
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                    >
                        Manage Orders
                    </Link>

                </div>

                {/* Recent Orders */}

                <div className="bg-white rounded-xl shadow-md p-6 mb-10">

                    <h2 className="text-2xl font-bold mb-6">
                        Recent Orders
                    </h2>

                    {dashboard.recentOrders.length === 0 ? (
                        <p className="text-gray-500">
                            No orders yet.
                        </p>
                    ) : (
                        <div className="space-y-4">

                            {dashboard.recentOrders.map((order) => (

                                <div
                                    key={order._id}
                                    className="flex justify-between border-b pb-3"
                                >

                                    <div>

                                        <p className="font-semibold">
                                            {order.user?.name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {order.user?.email}
                                        </p>

                                    </div>

                                    <div className="text-right">

                                        <p className="font-semibold text-blue-600">
                                            Rs. {order.totalPrice}
                                        </p>

                                        <p className="text-sm">
                                            {order.orderStatus}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>
                    )}

                </div>

                {/* Low Stock Products */}

                <div className="bg-white rounded-xl shadow-md p-6">

                    <h2 className="text-2xl font-bold mb-6">
                        Latest Products
                    </h2>

                    {dashboard.latestProducts.length === 0 ? (
                        <p className="text-gray-500">
                            No products available.
                        </p>
                    ) : (
                        <div className="space-y-4">

                            {dashboard.latestProducts.map((product) => (

                                <div
                                    key={product._id}
                                    className="flex justify-between border-b pb-3"
                                >

                                    <div className="flex items-center gap-4">

                                        <img
                                            src={
                                                product.image?.url ||
                                                "https://placehold.co/60x60?text=No+Image"
                                            }
                                            alt={product.name}
                                            className="w-14 h-14 rounded-lg object-cover"
                                        />

                                        <div>

                                            <p className="font-semibold">
                                                {product.name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {product.category}
                                            </p>

                                        </div>

                                    </div>

                                    <div
                                        className={`font-semibold ${
                                            product.stock <= 5
                                                ? "text-red-600"
                                                : "text-green-600"
                                        }`}
                                    >
                                        {product.stock} in stock
                                    </div>

                                </div>

                            ))}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default Admin;