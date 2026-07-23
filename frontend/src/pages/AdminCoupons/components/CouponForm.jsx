import {
    useEffect,
    useState,
} from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../../context/AuthContext";
import {
    createCoupon,
    updateCoupon,
} from "../../../services/couponService";

const initialFormData = {
    code: "",
    type: "percentage",
    value: "",
    minimumAmount: "",
    expiryDate: "",
    usageLimit: "",
    description: "",
};

const CouponForm = ({
    editingCoupon,
    onCouponCreated,
    onCancelEdit,
}) => {
    const { token } = useAuth();

    const [formData, setFormData] =
        useState(initialFormData);

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {
        if (editingCoupon) {
            setFormData({
                code:
                    editingCoupon.code || "",
                type:
                    editingCoupon.type ||
                    "percentage",
                value:
                    editingCoupon.value || "",
                minimumAmount:
                    editingCoupon.minimumAmount ||
                    "",
                expiryDate:
                    editingCoupon.expiryDate
                        ?.split("T")[0] || "",
                usageLimit:
                    editingCoupon.usageLimit ||
                    "",
                description:
                    editingCoupon.description ||
                    "",
            });
        } else {
            setFormData(initialFormData);
        }
    }, [editingCoupon]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]:
                e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const payload = {
                ...formData,
                value: Number(
                    formData.value
                ),
                minimumAmount: Number(
                    formData.minimumAmount ||
                        0
                ),
                usageLimit: Number(
                    formData.usageLimit || 1
                ),
            };

            if (editingCoupon) {
                await updateCoupon(
                    editingCoupon._id,
                    payload,
                    token
                );

                toast.success(
                    "Coupon updated successfully."
                );
            } else {
                await createCoupon(
                    payload,
                    token
                );

                toast.success(
                    "Coupon created successfully."
                );
            }

            setFormData(initialFormData);

            if (onCouponCreated) {
                onCouponCreated();
            }
        } catch (error) {
            toast.error(
                error.response?.data
                    ?.message ||
                    `Failed to ${
                        editingCoupon
                            ? "update"
                            : "create"
                    } coupon.`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
                {editingCoupon
                    ? "Edit Coupon"
                    : "Create Coupon"}
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-6"
            >
                <div>
                    <label className="block mb-2 font-medium">
                        Coupon Code
                    </label>

                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={
                            handleChange
                        }
                        placeholder="WELCOME10"
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Discount Type
                    </label>

                    <select
                        name="type"
                        value={formData.type}
                        onChange={
                            handleChange
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    >
                        <option value="percentage">
                            Percentage (%)
                        </option>

                        <option value="fixed">
                            Fixed Amount
                        </option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Discount Value
                    </label>

                    <input
                        type="number"
                        name="value"
                        value={formData.value}
                        onChange={
                            handleChange
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Minimum Purchase
                    </label>

                    <input
                        type="number"
                        name="minimumAmount"
                        value={
                            formData.minimumAmount
                        }
                        onChange={
                            handleChange
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Usage Limit
                    </label>

                    <input
                        type="number"
                        name="usageLimit"
                        value={
                            formData.usageLimit
                        }
                        onChange={
                            handleChange
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Expiry Date
                    </label>

                    <input
                        type="date"
                        name="expiryDate"
                        value={
                            formData.expiryDate
                        }
                        onChange={
                            handleChange
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 font-medium">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={
                            formData.description
                        }
                        onChange={
                            handleChange
                        }
                        rows="3"
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="Coupon description..."
                    />
                </div>

                <div className="md:col-span-2 flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading
                            ? editingCoupon
                                ? "Updating..."
                                : "Creating..."
                            : editingCoupon
                            ? "Update Coupon"
                            : "Create Coupon"}
                    </button>

                    {editingCoupon && (
                        <button
                            type="button"
                            onClick={() => {
                                setFormData(
                                    initialFormData
                                );

                                onCancelEdit?.();
                            }}
                            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CouponForm;