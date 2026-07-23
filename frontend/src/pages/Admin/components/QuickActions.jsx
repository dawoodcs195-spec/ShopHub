import { Link } from "react-router-dom";

const QuickActions = () => {
    return (
        <div className="flex flex-wrap gap-4 mb-10">
            <Link
                to="/admin/products"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
                Manage Products
            </Link>

            <Link
                to="/admin/orders"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
                Manage Orders
            </Link>

            <Link
                to="/admin/coupons"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
                Manage Coupons
            </Link>
        </div>
    );
};

export default QuickActions;