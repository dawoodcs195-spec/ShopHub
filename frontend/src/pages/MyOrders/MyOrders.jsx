import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaShoppingBag, FaArrowRight } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { getMyOrders } from "../../services/orderService";
import { generateInvoice } from "../../utils/invoiceGenerator";
import OrderCard from "./components/OrderCard";
import EmptyState from "../../components/common/EmptyState";

// Skeleton Loader (theme-aware)
const OrderSkeleton = () => (
  <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl shadow-soft p-6 animate-pulse">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="col-span-2 md:col-span-1 space-y-2">
        <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-1/3" />
        <div className="h-5 bg-black/15 dark:bg-white/15 rounded w-2/3" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-1/4" />
        <div className="h-5 bg-black/15 dark:bg-white/15 rounded w-1/2" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-1/4" />
        <div className="h-6 bg-black/15 dark:bg-white/15 rounded w-1/3" />
      </div>
      <div className="flex justify-end items-center">
        <div className="h-8 bg-black/15 dark:bg-white/15 rounded-full w-24" />
      </div>
    </div>
  </div>
);

const MyOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const data = await getMyOrders(token);
        setOrders(data);
      } catch (error) {
        toast.error("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  if (loading) {
    return (
      <div className="bg-background dark:bg-dark-background min-h-screen">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <h1 className="text-4xl font-serif font-bold text-text-primary dark:text-dark-card-foreground mb-8">
            My Orders
          </h1>
          <div className="space-y-4">
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-dark-background min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-serif font-bold text-text-primary dark:text-dark-card-foreground mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <EmptyState
            icon={FaShoppingBag}
            title="No orders yet"
            description="When you place your first order, it will appear here with its status, details, and invoice."
            primaryAction={{ label: "Start Shopping", to: "/", icon: FaArrowRight }}
            tip="Every creation is packed with care—thank you for supporting handmade."
          />
        ) : (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {orders.map((order) => (
              <motion.div
                key={order._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <OrderCard
                  order={order}
                  onDownloadInvoice={() => generateInvoice(order)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;