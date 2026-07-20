import { Link } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaSearch } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-3xl font-bold text-blue-600"
                >
                    ShopHub
                </Link>

                {/* Search */}
                <div className="hidden md:flex items-center w-2/5">

                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full border border-gray-300 px-4 py-2 rounded-l-lg focus:outline-none"
                    />

                    <button className="bg-blue-600 text-white px-5 py-2 rounded-r-lg hover:bg-blue-700">
                        <FaSearch />
                    </button>

                </div>

                {/* Right Side */}
                <div className="flex items-center gap-6">

                    <Link
                        to="/"
                        className="hover:text-blue-600"
                    >
                        Home
                    </Link>

                    <Link
                        to="/cart"
                        className="relative flex items-center gap-2 hover:text-blue-600"
                    >
                        <FaShoppingCart size={22} />

                        <span>Cart</span>

                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-3">

                            <FaUserCircle
                                size={28}
                                className="text-blue-600"
                            />

                            <span className="font-semibold">
                                {user.name}
                            </span>

                            <button
                                onClick={logout}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                                Logout
                            </button>

                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Login
                        </Link>
                    )}

                </div>

            </div>

        </nav>
    );
};

export default Navbar;