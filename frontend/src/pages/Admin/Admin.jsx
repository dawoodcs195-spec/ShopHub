// frontend/src/pages/Admin/Admin.jsx

import { useEffect, useState, useCallback } from "react";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaTimesCircle,
  FaEnvelopeOpenText,
  FaEye,
  FaMousePointer,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { getDashboardStats } from "../../services/adminService";

import DashboardStats from "./components/DashboardStats";
import QuickActions from "./components/QuickActions";
import DashboardCharts from "./components/DashboardCharts";
import DashboardLists from "./components/DashboardLists";
import DashboardFilters from "./components/DashboardFilters";

// Skeleton Loader with theme-aware colors
const AdminDashboardSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-secondary dark:bg-dark-secondary rounded-lg h-36"
        ></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-secondary dark:bg-dark-secondary rounded-lg h-96"></div>
      <div className="bg-secondary dark:bg-dark-secondary rounded-lg h-96"></div>
    </div>
  </div>
);

const Admin = () => {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");

  const loadDashboard = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getDashboardStats(token, period);
      setDashboard(data);
    } catch (error) {
      toast.error("Failed to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  }, [token, period]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleFilterChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  if (loading || !dashboard) {
    return (
      <>
        <header className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-card-foreground dark:text-dark-card-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground dark:text-dark-muted-foreground mt-1">
            An overview of your store's performance.
          </p>
        </header>
        <QuickActions />
        <DashboardFilters onFilterChange={() => {}} activeFilter={period} />
        <AdminDashboardSkeleton />
      </>
    );
  }

  const statCards = [
    {
      title: "Revenue",
      value: `Rs. ${dashboard.totalRevenue.toLocaleString()}`,
      icon: FaDollarSign,
      iconColor: "text-green-500",
      iconBg: "bg-green-500/10",
    },
    {
      title: "Orders",
      value: dashboard.totalOrders.toLocaleString(),
      icon: FaShoppingCart,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      title: "Users",
      value: dashboard.totalUsers.toLocaleString(),
      icon: FaUsers,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
    },

    // ✅ NEW: Visitor Analytics
    {
      title: "Visitors Today",
      value: (dashboard.todayUniqueVisitors || 0).toLocaleString(),
      icon: FaEye,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
    },
    {
      title: "Visits Today",
      value: (dashboard.todayTotalVisits || 0).toLocaleString(),
      icon: FaMousePointer,
      iconColor: "text-indigo-500",
      iconBg: "bg-indigo-500/10",
    },

    {
      title: "Subscribers",
      value: (dashboard.totalSubscribers || 0).toLocaleString(),
      icon: FaEnvelopeOpenText,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-500/10",
    },
    {
      title: "Products",
      value: dashboard.totalProducts.toLocaleString(),
      icon: FaBoxOpen,
      iconColor: "text-sky-500",
      iconBg: "bg-sky-500/10",
    },
    {
      title: "Low Stock",
      value: dashboard.lowStockProducts.toLocaleString(),
      icon: FaBoxOpen,
      iconColor: "text-red-500",
      iconBg: "bg-red-500/10",
    },
  ];

  const orderStatCards = [
    {
      title: "Delivered",
      value: dashboard.deliveredOrders.toLocaleString(),
      icon: FaCheckCircle,
      iconColor: "text-green-500",
      iconBg: "bg-green-500/10",
    },
    {
      title: "Shipped",
      value: dashboard.shippedOrders.toLocaleString(),
      icon: FaTruck,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      title: "Processing",
      value: dashboard.processingOrders.toLocaleString(),
      icon: FaClock,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-500/10",
    },
    {
      title: "Pending",
      value: dashboard.pendingOrders.toLocaleString(),
      icon: FaClock,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-500/10",
    },
    {
      title: "Cancelled",
      value: dashboard.cancelledOrders.toLocaleString(),
      icon: FaTimesCircle,
      iconColor: "text-red-500",
      iconBg: "bg-red-500/10",
    },
  ];

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-card-foreground dark:text-dark-card-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground dark:text-dark-muted-foreground mt-1">
          An overview of your store's performance.
        </p>
      </header>

      <QuickActions />

      <DashboardFilters
        onFilterChange={handleFilterChange}
        activeFilter={period}
      />

      <DashboardStats statCards={statCards} />

      <div className="mt-8">
        <h2 className="text-2xl font-serif font-bold text-card-foreground dark:text-dark-card-foreground mb-4">
          Order Statuses
        </h2>
        <DashboardStats statCards={orderStatCards} />
      </div>

      <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <DashboardCharts
            monthlyRevenue={dashboard.monthlyRevenue}
            monthlyOrders={dashboard.monthlyOrders}
            paymentMethods={dashboard.paymentMethods}
            topProducts={dashboard.topProducts}
          />
        </div>
        <div className="xl:col-span-1">
          <DashboardLists
            recentOrders={dashboard.recentOrders}
            latestProducts={dashboard.latestProducts}
          />
        </div>
      </div>
    </>
  );
};

export default Admin;