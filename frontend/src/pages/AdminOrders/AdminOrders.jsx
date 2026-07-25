import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import useDebounce from "../../hooks/useDebounce";

import AdminOrdersToolbar from "./components/AdminOrdersToolbar";
import AdminOrdersFilters from "./components/AdminOrdersFilters";
import AdminOrdersTable from "./components/AdminOrdersTable";
import AdminOrdersPagination from "./components/AdminOrdersPagination";

// Skeleton Loader
const TableSkeleton = () => (
  <div className="overflow-x-auto bg-surface dark:bg-dark-card rounded-lg shadow-soft animate-pulse border border-border dark:border-dark-border">
    <table className="min-w-full">
      <thead className="bg-background dark:bg-dark-background">
        <tr>
          {Array.from({ length: 7 }).map((_, i) => (
            <th key={i} className="px-4 py-3">
              <div className="h-4 bg-border/70 dark:bg-dark-border/70 rounded" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }).map((_, i) => (
          <tr key={i} className="border-b border-border dark:border-dark-border">
            {Array.from({ length: 7 }).map((_, j) => (
              <td key={j} className="px-4 py-3">
                <div className="h-5 bg-border/70 dark:bg-dark-border/70 rounded" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);
  const limit = 10;
  const [filters, setFilters] = useState({
    search: "",
    orderStatus: "",
    paymentStatus: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  });
  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = { page, limit, search: debouncedSearch.trim(), ...filters };
      const data = await getAllOrders(token, params);
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
      setCount(data.count || 0);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders.");
      setOrders([]);
      setCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [token, page, limit, debouncedSearch, filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      orderStatus: "",
      paymentStatus: "",
      paymentMethod: "",
      startDate: "",
      endDate: "",
    });
    setPage(1);
  }, []);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage > 0 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages]
  );

  const handleStatusChange = useCallback(
    async (id, status) => {
      try {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, orderStatus: status } : order
          )
        );
        await updateOrderStatus(id, status, token);
        toast.success("Order status updated.");
      } catch (error) {
        toast.error("Failed to update order status.");
        fetchOrders();
      }
    },
    [token, fetchOrders]
  );

  return (
    <div className="bg-background dark:bg-dark-background min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <AdminOrdersToolbar totalOrders={count} />
        <AdminOrdersFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          ordersToExport={orders}
        />
        {loading ? (
          <TableSkeleton />
        ) : (
          <AdminOrdersTable orders={orders} onStatusChange={handleStatusChange} />
        )}
        {!loading && count > 0 && (
          <AdminOrdersPagination
            page={page}
            totalPages={totalPages}
            count={count}
            limit={limit}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrders;