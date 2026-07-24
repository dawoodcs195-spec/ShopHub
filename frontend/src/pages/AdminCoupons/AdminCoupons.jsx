import { useState, useEffect, useCallback } from "react";
import { FaPlus, FaTag } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { getCoupons } from "../../services/couponService";
import CouponFormModal from "./components/CouponForm";
import CouponTable from "./components/CouponTable";

const AdminCoupons = () => {
    const { token } = useAuth();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchCoupons = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await getCoupons(token);
            setCoupons(data);
        } catch (error) {
            toast.error("Failed to load coupons.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons, refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleOpenCreateModal = () => {
        setEditingCoupon(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (coupon) => {
        setEditingCoupon(coupon);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCoupon(null);
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-text-primary">Coupon Management</h1>
                        <p className="text-text-secondary mt-1">Create and manage discount codes for your store.</p>
                    </div>
                    <button
                        onClick={handleOpenCreateModal}
                        className="flex items-center justify-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-hover shadow-soft transition-all"
                    >
                        <FaPlus size={14} />
                        <span>Create Coupon</span>
                    </button>
                </header>

                <CouponTable
                    coupons={coupons}
                    loading={loading}
                    onEdit={handleOpenEditModal}
                    onRefresh={handleRefresh}
                />

                <CouponFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    editingCoupon={editingCoupon}
                    onCouponSaved={handleRefresh}
                />
            </div>
        </div>
    );
};

export default AdminCoupons;