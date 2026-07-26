import { memo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

import { useAuth } from "../../../context/AuthContext";
import { deleteCoupon, updateCoupon } from "../../../services/couponService";

const getStatusPill = ({ isActive, isExpired }) => {
  if (!isActive) {
    return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200";
  }
  if (isExpired) {
    return "bg-yellow-100 text-yellow-700 dark:bg-amber-500/15 dark:text-amber-200";
  }
  return "bg-green-100 text-green-700 dark:bg-emerald-500/15 dark:text-emerald-200";
};

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
      toast.success(`Coupon ${!coupon.isActive ? "activated" : "deactivated"}.`);
      onRefresh();
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  return (
    <tr className="border-b border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
      <td className="px-4 py-3 font-mono text-sm text-primary font-semibold">
        {coupon.code}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground dark:text-dark-muted-foreground capitalize">
        {coupon.type}
      </td>
      <td className="px-4 py-3 text-sm text-card-foreground dark:text-dark-card-foreground font-semibold">
        {coupon.type === "percentage" ? `${coupon.value}%` : `Rs. ${coupon.value}`}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground dark:text-dark-muted-foreground">
        {coupon.usedCount} / {coupon.usageLimit}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground dark:text-dark-muted-foreground">
        {expiryDate.toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <span
          className={[
            "inline-flex px-2.5 py-1 rounded-full text-xs font-semibold",
            getStatusPill({ isActive: coupon.isActive, isExpired }),
          ].join(" ")}
        >
          {!coupon.isActive ? "Inactive" : isExpired ? "Expired" : "Active"}
        </span>
      </td>
      <td className="px-4 py-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={coupon.isActive}
            onChange={handleToggleStatus}
            className="sr-only peer"
          />
          <div
            className={[
              "w-11 h-6 rounded-full",
              "bg-black/10 dark:bg-white/15",
              "peer-focus:ring-2 peer-focus:ring-primary/40",
              "peer-checked:bg-primary",
              "after:content-[''] after:absolute after:top-0.5 after:left-[2px]",
              "after:h-5 after:w-5 after:rounded-full after:transition-all",
              "after:bg-white after:shadow-sm",
              "peer-checked:after:translate-x-full",
            ].join(" ")}
          />
        </label>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onEdit(coupon)}
            className="text-muted-foreground dark:text-dark-muted-foreground hover:text-primary transition-colors"
            title="Edit Coupon"
            type="button"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="text-muted-foreground dark:text-dark-muted-foreground hover:text-destructive transition-colors"
            title="Delete Coupon"
            type="button"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const CouponCardComponent = ({ coupon, onEdit, onRefresh }) => {
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
      toast.success(`Coupon ${!coupon.isActive ? "activated" : "deactivated"}.`);
      onRefresh();
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="bg-secondary dark:bg-dark-secondary border border-black/5 dark:border-white/10 rounded-2xl shadow-soft p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground dark:text-dark-muted-foreground">
            Coupon Code
          </p>
          <p className="mt-1 font-mono text-base font-bold text-primary truncate">
            {coupon.code}
          </p>
          <p className="mt-1 text-xs text-muted-foreground dark:text-dark-muted-foreground capitalize">
            {coupon.type} • {coupon.type === "percentage" ? `${coupon.value}%` : `Rs. ${coupon.value}`}
          </p>
        </div>

        <span
          className={[
            "inline-flex px-2.5 py-1 rounded-full text-xs font-semibold shrink-0",
            getStatusPill({ isActive: coupon.isActive, isExpired }),
          ].join(" ")}
        >
          {!coupon.isActive ? "Inactive" : isExpired ? "Expired" : "Active"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-black/5 dark:border-white/10 bg-card/60 dark:bg-dark-card/40 p-3">
          <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
            Usage
          </p>
          <p className="mt-1 font-semibold text-card-foreground dark:text-dark-card-foreground">
            {coupon.usedCount} / {coupon.usageLimit}
          </p>
        </div>

        <div className="rounded-xl border border-black/5 dark:border-white/10 bg-card/60 dark:bg-dark-card/40 p-3">
          <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
            Expiry
          </p>
          <p className="mt-1 font-semibold text-card-foreground dark:text-dark-card-foreground">
            {expiryDate.toLocaleDateString()}
          </p>
        </div>

        <div className="col-span-2 rounded-xl border border-black/5 dark:border-white/10 bg-card/60 dark:bg-dark-card/40 p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
              Enabled
            </p>
            <p className="mt-0.5 text-sm font-semibold text-card-foreground dark:text-dark-card-foreground">
              {coupon.isActive ? "On" : "Off"}
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={coupon.isActive}
              onChange={handleToggleStatus}
              className="sr-only peer"
            />
            <div
              className={[
                "w-11 h-6 rounded-full",
                "bg-black/10 dark:bg-white/15",
                "peer-focus:ring-2 peer-focus:ring-primary/40",
                "peer-checked:bg-primary",
                "after:content-[''] after:absolute after:top-0.5 after:left-[2px]",
                "after:h-5 after:w-5 after:rounded-full after:transition-all",
                "after:bg-white after:shadow-sm",
                "peer-checked:after:translate-x-full",
              ].join(" ")}
            />
          </label>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          onClick={() => onEdit(coupon)}
          className="inline-flex items-center gap-2 rounded-xl border border-black/5 dark:border-white/10 bg-card/60 dark:bg-dark-card/40 px-4 py-2 text-sm font-semibold text-card-foreground dark:text-dark-card-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          type="button"
        >
          <FiEdit2 />
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="inline-flex items-center gap-2 rounded-xl border border-black/5 dark:border-white/10 bg-card/60 dark:bg-dark-card/40 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          type="button"
        >
          <FiTrash2 />
          Delete
        </button>
      </div>
    </div>
  );
};

export const CouponCard = memo(CouponCardComponent);
export default memo(CouponRow);