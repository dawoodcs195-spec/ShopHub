import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

import { useAuth } from "../../../context/AuthContext";
import { createCoupon, updateCoupon } from "../../../services/couponService";
import Input from "../../../components/forms/Input";
import Select from "../../../components/forms/Select";

const initialFormData = {
    code: "",
    type: "percentage",
    value: "",
    minimumAmount: "",
    expiryDate: "",
    usageLimit: "",
    description: "",
};

const CouponFormModal = ({ isOpen, onClose, editingCoupon, onCouponSaved }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingCoupon) {
            setFormData({
                code: editingCoupon.code || "",
                type: editingCoupon.type || "percentage",
                value: editingCoupon.value || "",
                minimumAmount: editingCoupon.minimumAmount || "",
                expiryDate: editingCoupon.expiryDate?.split("T")[0] || "",
                usageLimit: editingCoupon.usageLimit || "",
                description: editingCoupon.description || "",
            });
        } else {
            setFormData(initialFormData);
        }
    }, [editingCoupon, isOpen]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                value: Number(formData.value),
                minimumAmount: Number(formData.minimumAmount || 0),
                usageLimit: Number(formData.usageLimit || 1),
            };
            if (editingCoupon) {
                await updateCoupon(editingCoupon._id, payload, token);
                toast.success("Coupon updated successfully.");
            } else {
                await createCoupon(payload, token);
                toast.success("Coupon created successfully.");
            }
            onCouponSaved();
            onClose();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    `Failed to ${editingCoupon ? "update" : "create"} coupon.`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: -20 }}
                        className="bg-secondary dark:bg-dark-secondary border border-black/5 dark:border-white/10 rounded-xl shadow-soft-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-black/5 dark:border-white/10 flex justify-between items-center">
                            <h2 className="text-2xl font-serif font-bold text-card-foreground dark:text-dark-card-foreground">
                                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-muted-foreground dark:text-dark-muted-foreground hover:text-card-foreground dark:hover:text-dark-card-foreground transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormGroup label="Coupon Code">
                                    <Input
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        placeholder="e.g. SUMMER10"
                                        required
                                    />
                                </FormGroup>

                                <FormGroup label="Discount Type">
                                    <Select name="type" value={formData.type} onChange={handleChange}>
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </Select>
                                </FormGroup>

                                <FormGroup label="Discount Value">
                                    <Input
                                        type="number"
                                        name="value"
                                        value={formData.value}
                                        onChange={handleChange}
                                        placeholder="e.g. 10 or 500"
                                        required
                                    />
                                </FormGroup>

                                <FormGroup label="Minimum Purchase (Rs.)">
                                    <Input
                                        type="number"
                                        name="minimumAmount"
                                        value={formData.minimumAmount}
                                        onChange={handleChange}
                                        placeholder="e.g. 1000"
                                    />
                                </FormGroup>

                                <FormGroup label="Usage Limit">
                                    <Input
                                        type="number"
                                        name="usageLimit"
                                        value={formData.usageLimit}
                                        onChange={handleChange}
                                        placeholder="e.g. 100"
                                    />
                                </FormGroup>

                                <FormGroup label="Expiry Date">
                                    <Input
                                        type="date"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>

                                <div className="md:col-span-2">
                                    <FormGroup label="Description (Optional)">
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-lg p-3 text-card-foreground dark:text-dark-card-foreground placeholder:text-muted-foreground/70 dark:placeholder:text-dark-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                            placeholder="Internal note about the coupon..."
                                        />
                                    </FormGroup>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 border-t border-black/5 dark:border-white/10 pt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2 rounded-xl font-semibold bg-black/5 hover:bg-black/10 text-card-foreground transition-colors dark:bg-white/10 dark:hover:bg-white/15 dark:text-dark-card-foreground"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 rounded-xl font-semibold text-white shadow-sm hover:shadow-md transition-all disabled:opacity-60 bg-gradient-to-r from-primary to-primary hover:brightness-110"
                                >
                                    {loading
                                        ? "Saving..."
                                        : editingCoupon
                                        ? "Update Coupon"
                                        : "Create Coupon"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const FormGroup = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-muted-foreground dark:text-dark-muted-foreground mb-1">
            {label}
        </label>
        {children}
    </div>
);

export default CouponFormModal;