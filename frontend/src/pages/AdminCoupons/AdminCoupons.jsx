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
        setRefreshKey((prev) => prev + 1);
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
        // IMPORTANT: don't force a light background here; let the global theme/background handle it
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-card-foreground dark:text-dark-card-foreground">
                            Coupon Management
                        </h1>
                        <p className="text-muted-foreground dark:text-dark-muted-foreground mt-1">
                            Create and manage discount codes for your store.
                        </p>
                    </div>

                    <button
                        onClick={handleOpenCreateModal}
                        className={[
                            "inline-flex items-center justify-center gap-2",
                            "px-5 py-2.5 rounded-xl",
                            "text-sm font-semibold text-white",
                            "shadow-sm hover:shadow-md",
                            "border border-white/10",
                            "transition-all duration-200 ease-in-out",
                            "transform hover:-translate-y-0.5 active:translate-y-0",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                            "relative overflow-hidden",
                            "before:content-[''] before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
                            "bg-gradient-to-r from-primary to-primary hover:brightness-110",
                        ].join(" ")}
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