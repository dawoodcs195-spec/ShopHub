import React from 'react';
import { FaShoppingCart, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

import DashboardStats from './DashboardStats';
import OrdersChart from './OrdersChart';
import TopProducts from './TopProducts';

const SalesReport = ({ dashboard }) => {
    if (!dashboard) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center text-gray-500">
                <p>No data available to generate the report.</p>
            </div>
        );
    }

    const salesStatCards = [
        {
            title: "Total Orders",
            value: dashboard.totalOrders.toLocaleString(),
            icon: FaShoppingCart,
            iconColor: "text-blue-500",
        },
        {
            title: "Shipped Orders",
            value: dashboard.shippedOrders.toLocaleString(),
            icon: FaTruck,
            iconColor: "text-cyan-500",
        },
        {
            title: "Delivered Orders",
            value: dashboard.deliveredOrders.toLocaleString(),
            icon: FaCheckCircle,
            iconColor: "text-green-500",
        },
        {
            title: "Cancelled Orders",
            value: dashboard.cancelledOrders.toLocaleString(),
            icon: FaTimesCircle,
            iconColor: "text-red-500",
        },
    ];

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-8">
            <header>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Sales Report
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    An overview of your store's sales volume and product performance.
                </p>
            </header>

            {/* Key Metrics */}
            <section>
                <DashboardStats statCards={salesStatCards} />
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 px-2">Orders Over Time</h3>
                    <OrdersChart data={dashboard.monthlyOrders} />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 px-2">Top Selling Products</h3>
                    <TopProducts products={dashboard.topProducts} />
                </div>
            </section>
        </div>
    );
};

export default SalesReport;