import { useState } from "react";
import toast from "react-hot-toast";

import { validateCoupon } from "../../../services/couponService";
import { useCart } from "../../../context/CartContext";

const CouponBox = ({ totalAmount }) => {
    const {
        appliedCoupon,
        discount,
        applyCoupon,
        clearCoupon,
    } = useCart();

    const [code, setCode] = useState(
        appliedCoupon?.code || ""
    );

    const [loading, setLoading] = useState(false);

    const handleApplyCoupon = async () => {
        if (!code.trim()) {
            toast.error("Please enter a coupon code.");
            return;
        }

        try {
            setLoading(true);

            const data = await validateCoupon(
                code,
                totalAmount
            );

            applyCoupon(
                data.coupon,
                data.discount
            );

            toast.success("Coupon applied.");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Invalid coupon."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        clearCoupon();
        setCode("");

        toast.success("Coupon removed.");
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">
                Coupon
            </h2>

            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={code}
                    onChange={(e) =>
                        setCode(
                            e.target.value.toUpperCase()
                        )
                    }
                    className="flex-1 border rounded-lg px-4 py-3"
                />

                <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading
                        ? "Applying..."
                        : "Apply"}
                </button>
            </div>

            {appliedCoupon && (
                <div className="mt-5 rounded-lg bg-green-50 border border-green-200 p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-green-700">
                                {appliedCoupon.code}
                            </p>

                            <p className="text-sm text-gray-600">
                                Discount:
                                {" "}
                                Rs. {discount}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={
                                handleRemoveCoupon
                            }
                            className="text-red-600 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponBox;