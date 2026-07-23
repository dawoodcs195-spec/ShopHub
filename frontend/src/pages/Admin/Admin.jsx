import { useEffect, useState } from "react";
import {
    FaBoxOpen,
    FaShoppingCart,
    FaUsers,
    FaDollarSign,
    FaCheckCircle,
    FaClock,
    FaTruck,
    FaTimesCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { getDashboardStats } from "../../services/adminService";

import DashboardStats from "./components/DashboardStats";
import QuickActions from "./components/QuickActions";
import DashboardCharts from "./components/DashboardCharts";
import DashboardLists from "./components/DashboardLists";

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

    const statCards = [
        {
            title: "Products",
            value: dashboard.totalProducts,
            icon: FaBoxOpen,
            iconColor: "text-blue-600",
        },
        {
            title: "Orders",
            value: dashboard.totalOrders,
            icon: FaShoppingCart,
            iconColor: "text-green-600",
        },
        {
            title: "Users",
            value: dashboard.totalUsers,
            icon: FaUsers,
            iconColor: "text-indigo-600",
        },
        {
            title: "Revenue",
            value: `Rs. ${dashboard.totalRevenue}`,
            icon: FaDollarSign,
            iconColor: "text-yellow-500",
        },
        {
            title: "Paid Orders",
            value: dashboard.paidOrders,
            icon: FaCheckCircle,
            iconColor: "text-green-600",
        },
        {
            title: "Pending Orders",
            value: dashboard.pendingOrders,
            icon: FaClock,
            iconColor: "text-orange-500",
        },
        {
            title: "Shipped Orders",
            value: dashboard.shippedOrders,
            icon: FaTruck,
            iconColor: "text-cyan-600",
        },
        {
            title: "Delivered Orders",
            value: dashboard.deliveredOrders,
            icon: FaCheckCircle,
            iconColor: "text-emerald-600",
        },
        {
            title: "Cancelled Orders",
            value: dashboard.cancelledOrders,
            icon: FaTimesCircle,
            iconColor: "text-red-600",
        },
        {
            title: "Low Stock Products",
            value: dashboard.lowStockProducts,
            icon: FaBoxOpen,
            iconColor: "text-red-500",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto p-8">
                <h1 className="text-4xl font-bold mb-8">
                    Admin Dashboard
                </h1>

                <DashboardStats statCards={statCards} />

                <QuickActions />

                <DashboardCharts
                    monthlyRevenue={dashboard.monthlyRevenue}
                    monthlyOrders={dashboard.monthlyOrders}
                    paymentMethods={dashboard.paymentMethods}
                    topProducts={dashboard.topProducts}
                />

                <DashboardLists
                    recentOrders={dashboard.recentOrders}
                    latestProducts={dashboard.latestProducts}
                />
            </div>
        </div>
    );
};

export default Admin;