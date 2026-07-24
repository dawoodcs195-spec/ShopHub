import { memo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

import { useAuth } from "../../../context/AuthContext";
import { deleteCoupon, updateCoupon } from "../../../services/couponService";

const CouponRow = ({ coupon, onEdit, onRefresh }) => {
    const { token } = useAuth();

    const expiryDate = new Date(coupon.expiryDate);
    const isExpired = expiryDate < new Date();

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete the coupon "${coupon.code}"?`)) {
            try {
                await deleteCoupon(coupon._id, token);
                toast.success("Coupon deleted successfully.");
                onRefresh();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete coupon.");
            }
        }
    };

    const handleToggleStatus = async () => {
        try {
            await updateCoupon(coupon._id, { isActive: !coupon.isActive }, token);
            toast.success(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'}.`);
            onRefresh();
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };
    
    return (
        <tr className="border-b border-border hover:bg-background/50 transition-colors">
            <td className="px-4 py-3 font-mono text-sm text-primary font-semibold">{coupon.code}</td>
            <td className="px-4 py-3 text-sm text-text-secondary capitalize">{coupon.type}</td>
            <td className="px-4 py-3 text-sm text-text-primary font-semibold">
                {coupon.type === "percentage" ? `${coupon.value}%` : `Rs. ${coupon.value}`}
            </td>
            <td className="px-4 py-3 text-sm text-text-secondary">{coupon.usedCount} / {coupon.usageLimit}</td>
            <td className="px-4 py-3 text-sm text-text-secondary">{expiryDate.toLocaleDateString()}</td>
            <td className="px-4 py-3">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                    !coupon.isActive ? 'bg-red-100 text-red-700' : isExpired ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                    {!coupon.isActive ? 'Inactive' : isExpired ? 'Expired' : 'Active'}
                </span>
            </td>
            <td className="px-4 py-3">
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={coupon.isActive} onChange={handleToggleStatus} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-4">
                    <button onClick={() => onEdit(coupon)} className="text-text-secondary hover:text-primary transition-colors" title="Edit Coupon">
                        <FiEdit2 size={16} />
                    </button>
                    <button onClick={handleDelete} className="text-text-secondary hover:text-accent transition-colors" title="Delete Coupon">
                        <FiTrash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default memo(CouponRow);