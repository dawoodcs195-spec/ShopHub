import { memo } from "react";
import CouponRow, { CouponCard } from "./CouponRow";

const TableSkeleton = () => (
  <>
    {/* Mobile skeleton */}
    <div className="md:hidden space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-secondary dark:bg-dark-secondary border border-black/5 dark:border-white/10 rounded-2xl shadow-soft p-5 animate-pulse"
        >
          <div className="h-4 w-32 bg-black/10 dark:bg-white/10 rounded" />
          <div className="mt-3 h-5 w-44 bg-black/10 dark:bg-white/10 rounded" />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="h-14 bg-black/10 dark:bg-white/10 rounded-xl" />
            <div className="h-14 bg-black/10 dark:bg-white/10 rounded-xl" />
            <div className="col-span-2 h-14 bg-black/10 dark:bg-white/10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>

    {/* Desktop table skeleton */}
    <div className="hidden md:block overflow-x-auto bg-secondary dark:bg-dark-secondary border border-black/5 dark:border-white/10 rounded-xl shadow-soft animate-pulse">
      <table className="min-w-full">
        <thead className="bg-black/5 dark:bg-white/5">
          <tr>
            {Array.from({ length: 8 }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-3/4" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-black/5 dark:border-white/10">
              {Array.from({ length: 8 }).map((_, j) => (
                <td key={j} className="px-4 py-4">
                  <div className="h-5 bg-black/10 dark:bg-white/10 rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const CouponTable = ({ coupons, loading, onEdit, onRefresh }) => {
  if (loading) return <TableSkeleton />;

  if (coupons.length === 0) {
    return (
      <div className="bg-secondary dark:bg-dark-secondary border border-black/5 dark:border-white/10 rounded-xl shadow-soft p-12 text-center">
        <h3 className="text-xl font-serif font-semibold text-card-foreground dark:text-dark-card-foreground">
          No Coupons Found
        </h3>
        <p className="text-muted-foreground dark:text-dark-muted-foreground mt-2">
          Create a new coupon to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon._id}
            coupon={coupon}
            onEdit={onEdit}
            onRefresh={onRefresh}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto bg-secondary dark:bg-dark-secondary border border-black/5 dark:border-white/10 rounded-xl shadow-soft">
        <table className="min-w-full divide-y divide-black/5 dark:divide-white/10">
          <thead className="bg-black/5 dark:bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">
                Value
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">
                Usage
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">
                Expiry
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">
                Enabled
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 dark:divide-white/10">
            {coupons.map((coupon) => (
              <CouponRow
                key={coupon._id}
                coupon={coupon}
                onEdit={onEdit}
                onRefresh={onRefresh}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default memo(CouponTable);