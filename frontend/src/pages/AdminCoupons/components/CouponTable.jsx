import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../../context/AuthContext";
import { getCoupons } from "../../../services/couponService";
import CouponRow from "./CouponRow";

const CouponTable = ({
    refreshKey = 0,
    onEdit,
}) => {
    const { token } = useAuth();

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, [refreshKey]);

    const fetchCoupons = async () => {
        try {
            setLoading(true);

            const data = await getCoupons(token);

            setCoupons(data);
        } catch (error) {
            console.error(error);

            toast.error("Failed to load coupons.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8">
                <p className="text-center text-lg">
                    Loading coupons...
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">
                Coupons
            </h2>

            {coupons.length === 0 ? (
                <p className="text-gray-500">
                    No coupons available.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3">
                                    Code
                                </th>

                                <th className="text-left py-3">
                                    Type
                                </th>

                                <th className="text-left py-3">
                                    Value
                                </th>

                                <th className="text-left py-3">
                                    Minimum
                                </th>

                                <th className="text-left py-3">
                                    Usage
                                </th>

                                <th className="text-left py-3">
                                    Limit
                                </th>

                                <th className="text-left py-3">
                                    Expiry
                                </th>

                                <th className="text-left py-3">
                                    Status
                                </th>

                                <th className="text-left py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {coupons.map((coupon) => (
                                <CouponRow
                                    key={coupon._id}
                                    coupon={coupon}
                                    onRefresh={
                                        fetchCoupons
                                    }
                                    onEdit={onEdit}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CouponTable;