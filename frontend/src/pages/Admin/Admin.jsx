import { Link } from "react-router-dom";
import {
    FaBoxOpen,
    FaShoppingCart,
    FaUsers,
} from "react-icons/fa";

const Admin = () => {
    return (
        <div className="min-h-screen bg-gray-100">

            <div className="max-w-7xl mx-auto p-8">

                <h1 className="text-4xl font-bold mb-8">
                    Admin Dashboard
                </h1>

                {/* Dashboard Cards */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaBoxOpen
                            size={40}
                            className="text-blue-600 mb-4"
                        />

                        <h2 className="text-2xl font-bold">
                            Products
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Manage Products
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaShoppingCart
                            size={40}
                            className="text-green-600 mb-4"
                        />

                        <h2 className="text-2xl font-bold">
                            Orders
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Manage Orders
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaUsers
                            size={40}
                            className="text-purple-600 mb-4"
                        />

                        <h2 className="text-2xl font-bold">
                            Users
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Manage Users
                        </p>
                    </div>

                </div>

                {/* Actions */}

                <div className="mt-10">

                    <Link
                        to="/admin/products"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Manage Products
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default Admin;