// frontend/src/pages/Admin/components/QuickActions.jsx

import { Link } from "react-router-dom";
import { FaBoxOpen, FaShoppingCart, FaTags } from "react-icons/fa";

const ActionButton = ({ to, icon: Icon, children, colorClass }) => (
    <Link
        to={to}
        className={`flex items-center justify-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105 ${colorClass}`}
    >
        <Icon className="h-4 w-4" />
        <span>{children}</span>
    </Link>
);

const QuickActions = () => {
    return (
        <div className="flex flex-wrap gap-4 mb-8">
            <ActionButton 
                to="/admin/products" 
                icon={FaBoxOpen}
                colorClass="bg-indigo-500 hover:bg-indigo-600"
            >
                Manage Products
            </ActionButton>

            <ActionButton 
                to="/admin/orders" 
                icon={FaShoppingCart}
                colorClass="bg-emerald-500 hover:bg-emerald-600"
            >
                Manage Orders
            </ActionButton>

            <ActionButton 
                to="/admin/coupons" 
                icon={FaTags}
                colorClass="bg-purple-500 hover:bg-purple-600"
            >
                Manage Coupons
            </ActionButton>
        </div>
    );
};

export default QuickActions;