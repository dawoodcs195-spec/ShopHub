import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

import { useAuth } from "../../../context/AuthContext";
import {
    updateCoupon,
    deleteCoupon,
} from "../../../services/couponService";

const CouponRow = ({
    coupon,
    onRefresh,
    onEdit,
}) => {
    const { token } = useAuth();

    const [loading, setLoading] =
        useState(false);

    const expiryDate = new Date(
        coupon.expiryDate
    );

    const today = new Date();

    const daysRemaining = Math.ceil(
        (expiryDate - today) /
            (1000 * 60 * 60 * 24)
    );

    let expiryBadge = {
        text: "Active",
        className:
            "bg-green-100 text-green-700",
    };

    if (daysRemaining < 0) {
        expiryBadge = {
            text: "Expired",
            className:
                "bg-red-100 text-red-700",
        };
    } else if (daysRemaining <= 7) {
        expiryBadge = {
            text: "Expiring Soon",
            className:
                "bg-yellow-100 text-yellow-700",
        };
    }

    const handleToggleStatus =
        async () => {
            try {
                setLoading(true);

                await updateCoupon(
                    coupon._id,
                    {
                        isActive:
                            !coupon.isActive,
                    },
                    token
                );

                toast.success(
                    `Coupon ${
                        coupon.isActive
                            ? "disabled"
                            : "enabled"
                    }.`
                );

                onRefresh();
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Failed to update coupon."
                );
            } finally {
                setLoading(false);
            }
        };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Delete this coupon?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);

            await deleteCoupon(
                coupon._id,
                token
            );

            toast.success(
                "Coupon deleted."
            );

            onRefresh();
        } catch (error) {
            toast.error(
                error.response?.data
                    ?.message ||
                    "Failed to delete coupon."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="py-4 font-semibold">
                {coupon.code}
            </td>

            <td className="py-4 capitalize">
                {coupon.type}
            </td>

            <td className="py-4">
                {coupon.type ===
                "percentage"
                    ? `${coupon.value}%`
                    : `Rs. ${coupon.value}`}
            </td>

            <td className="py-4">
                Rs.{" "}
                {coupon.minimumAmount}
            </td>

            <td className="py-4">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                    {coupon.usedCount} /{" "}
                    {coupon.usageLimit}
                </span>
            </td>

            <td className="py-4">
                {coupon.usageLimit}
            </td>

            <td className="py-4">
                <div className="space-y-2">
                    <p>
                        {expiryDate.toLocaleDateString()}
                    </p>

                    <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${expiryBadge.className}`}
                    >
                        {expiryBadge.text}
                    </span>
                </div>
            </td>

            <td className="py-4">
                <button
                    type="button"
                    disabled={loading}
                    onClick={
                        handleToggleStatus
                    }
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        coupon.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {coupon.isActive
                        ? "Active"
                        : "Inactive"}
                </button>
            </td>

            <td className="py-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            onEdit?.(coupon)
                        }
                        className="text-blue-600 hover:text-blue-700"
                        title="Edit Coupon"
                    >
                        <FiEdit2
                            size={18}
                        />
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={
                            handleDelete
                        }
                        className="text-red-600 hover:text-red-700"
                        title="Delete Coupon"
                    >
                        <FiTrash2
                            size={18}
                        />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CouponRow;