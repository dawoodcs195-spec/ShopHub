import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import useDebounce from '../../hooks/useDebounce';

import AdminOrdersToolbar from './components/AdminOrdersToolbar';
import AdminOrdersFilters from './components/AdminOrdersFilters';
import AdminOrdersTable from './components/AdminOrdersTable';
import AdminOrdersPagination from './components/AdminOrdersPagination';

const AdminOrders = () => {
    const { token } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [count, setCount] = useState(0);
    const limit = 10;

    // Filter state
    const [filters, setFilters] = useState({
        search: "",
        orderStatus: "",
        paymentStatus: "",
        paymentMethod: "",
        startDate: "",
        endDate: ""
    });

    const debouncedSearch = useDebounce(filters.search, 400);

    const fetchOrders = useCallback(async () => {
        if (!token) return;

        setLoading(true);

        try {
            const params = {
                page,
                limit,
                search: debouncedSearch.trim(),
                orderStatus: filters.orderStatus,
                paymentStatus: filters.paymentStatus,
                paymentMethod: filters.paymentMethod,
                startDate: filters.startDate,
                endDate: filters.endDate,
            };

            const data = await getAllOrders(token, params);
            
            setOrders(data.orders || []);
            setTotalPages(data.totalPages || 1);
            setCount(data.count || 0);
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Failed to fetch orders.';
            toast.error(message);
            setOrders([]);
            setCount(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [token, page, limit, debouncedSearch, filters.orderStatus, filters.paymentStatus, filters.paymentMethod, filters.startDate, filters.endDate]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    const handleFilterChange = (field, value) => {
        setFilters(prevFilters => ({ ...prevFilters, [field]: value }));
        setPage(1); 
    };

    const handleClearFilters = () => {
        setFilters({
            search: "",
            orderStatus: "",
            paymentStatus: "",
            paymentMethod: "",
            startDate: "",
            endDate: ""
        });
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    
    const handleStatusChange = async (id, status) => {
        try {
            // Optimistic update
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

            await updateOrderStatus(id, status, token);
            toast.success("Order status updated successfully.");

        } catch (error) {
            console.error(error);
            toast.error("Failed to update order status.");
            // Revert on failure by refetching
            fetchOrders(); 
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-8">
            <AdminOrdersToolbar orders={orders} />
            
            <AdminOrdersFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
            />

            <div className="mt-6">
                {loading ? (
                    <div className="text-center py-20 text-lg text-gray-500">
                        Loading Orders...
                    </div>
                ) : (
                    <AdminOrdersTable 
                        orders={orders}
                        onStatusChange={handleStatusChange}
                    />
                )}
            </div>

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
    );
};

export default AdminOrders;