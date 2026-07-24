import { memo } from 'react';
import CouponRow from "./CouponRow";

const TableSkeleton = () => (
    <div className="overflow-x-auto bg-surface rounded-lg shadow-soft animate-pulse">
        <table className="min-w-full">
            <thead className="bg-background">
                <tr>{Array.from({ length: 8 }).map((_, i) => <th key={i} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div></th>)}</tr>
            </thead>
            <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border">
                        {Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-4 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


const CouponTable = ({ coupons, loading, onEdit, onRefresh }) => {
    if (loading) {
        return <TableSkeleton />;
    }

    if (coupons.length === 0) {
        return (
            <div className="bg-surface rounded-lg shadow-soft p-12 text-center">
                <h3 className="text-xl font-serif font-semibold text-text-primary">No Coupons Found</h3>
                <p className="text-text-secondary mt-2">Create a new coupon to get started.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-surface rounded-lg shadow-soft">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-background">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Value</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Usage</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Expiry</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Enabled</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {coupons.map((coupon) => (
                        <CouponRow key={coupon._id} coupon={coupon} onEdit={onEdit} onRefresh={onRefresh} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default memo(CouponTable);