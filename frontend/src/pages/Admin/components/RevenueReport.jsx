import React from 'react';
import { FaDollarSign, FaShoppingCart, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';

import DashboardStats from './DashboardStats';
import RevenueChart from './RevenueChart';
import PaymentChart from './PaymentChart';
import RecentOrders from './RecentOrders';

const RevenueReport = ({ dashboard }) => {
    if (!dashboard) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center text-gray-500">
                <p>No data available to generate the report.</p>
            </div>
        );
    }

    // Calculate Average Order Value (AOV)
    const averageOrderValue = dashboard.totalOrders > 0 
        ? (dashboard.totalRevenue / dashboard.totalOrders) 
        : 0;

    const revenueStatCards = [
        {
            title: "Total Revenue",
            value: `Rs. ${dashboard.totalRevenue.toLocaleString()}`,
            icon: FaDollarSign,
            iconColor: "text-green-500",
        },
        {
            title: "Total Orders",
            value: dashboard.totalOrders.toLocaleString(),
            icon: FaShoppingCart,
            iconColor: "text-blue-500",
        },
        {
            title: "Paid Orders",
            value: dashboard.paidOrders.toLocaleString(),
            icon: FaCheckCircle,
            iconColor: "text-emerald-500",
        },
        {
            title: "Avg. Order Value",
            value: `Rs. ${averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: FaMoneyBillWave,
            iconColor: "text-purple-500",
        },
    ];

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-8">
            <header>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Revenue Report
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    A detailed overview of your store's financial performance.
                </p>
            </header>

            {/* Key Metrics */}
            <section>
                <DashboardStats statCards={revenueStatCards} />
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 px-2">Revenue Over Time</h3>
                    <RevenueChart data={dashboard.monthlyRevenue} />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 px-2">Revenue by Payment Method</h3>
                    <PaymentChart data={dashboard.paymentMethods} />
                </div>
            </section>

            {/* Recent Transactions contributing to revenue */}
            <section>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                    Recent Transactions
                </h3>
                <RecentOrders orders={dashboard.recentOrders} />
            </section>
        </div>
    );
};

export default RevenueReport;