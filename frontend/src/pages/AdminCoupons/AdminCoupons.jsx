import { useState } from "react";

import CouponForm from "./components/CouponForm";
import CouponTable from "./components/CouponTable";

const AdminCoupons = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [editingCoupon, setEditingCoupon] =
        useState(null);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
    };

    const handleCancelEdit = () => {
        setEditingCoupon(null);
    };

    const handleCouponSaved = () => {
        handleRefresh();
        setEditingCoupon(null);
    };

    return (
        <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">
                Coupon Management
            </h1>

            <CouponForm
                editingCoupon={editingCoupon}
                onCouponCreated={
                    handleCouponSaved
                }
                onCancelEdit={
                    handleCancelEdit
                }
            />

            <CouponTable
                refreshKey={refreshKey}
                onEdit={handleEdit}
            />
        </div>
    );
};

export default AdminCoupons;