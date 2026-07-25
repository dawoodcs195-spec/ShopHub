// frontend/src/pages/Admin/components/QuickActions.jsx

import { Link } from "react-router-dom";
import { FaBoxOpen, FaShoppingCart, FaTags } from "react-icons/fa";

const ActionButton = ({ to, icon: Icon, children, colorClass }) => (
    <Link
        to={to}
        className={[
            // layout
            "inline-flex items-center justify-center gap-2",
            "px-4 py-2.5 rounded-xl",
            // typography
            "text-sm font-semibold text-white",
            // visuals
            "shadow-sm hover:shadow-md",
            "border border-white/10",
            "transition-all duration-200 ease-in-out",
            "transform hover:-translate-y-0.5 active:translate-y-0",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
            // subtle shine overlay
            "relative overflow-hidden",
            "before:content-[''] before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
            // color variant (gradient)
            colorClass,
        ].join(" ")}
    >
        <Icon className="h-4 w-4 opacity-95" />
        <span>{children}</span>
    </Link>
);

const QuickActions = () => {
    return (
        <div className="flex flex-wrap gap-4 mb-8">
            <ActionButton
                to="/admin/products"
                icon={FaBoxOpen}
                colorClass="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-600"
            >
                Manage Products
            </ActionButton>

            <ActionButton
                to="/admin/orders"
                icon={FaShoppingCart}
                colorClass="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-600"
            >
                Manage Orders
            </ActionButton>

            <ActionButton
                to="/admin/coupons"
                icon={FaTags}
                colorClass="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-600"
            >
                Manage Coupons
            </ActionButton>
        </div>
    );
};

export default QuickActions;