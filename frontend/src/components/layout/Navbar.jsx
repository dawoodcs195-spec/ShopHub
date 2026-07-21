import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    FaShoppingCart,
    FaUserCircle,
    FaSearch,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { user, logout } = useAuth();
    const { cartItems } = useCart();

    const [keyword, setKeyword] = useState("");

    const totalCartItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleSearch = () => {
        const search = keyword.trim();

        if (search) {
            navigate(`/?keyword=${encodeURIComponent(search)}`);
        } else {
            navigate("/");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-3xl font-bold text-blue-600"
                    onClick={() => setKeyword("")}
                >
                    ShopHub
                </Link>

                {/* Search */}
                <div className="hidden md:flex items-center w-2/5">

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        className="w-full border border-gray-300 px-4 py-2 rounded-l-lg focus:outline-none"
                    />

                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-5 py-2 rounded-r-lg hover:bg-blue-700"
                    >
                        <FaSearch />
                    </button>

                </div>

                {/* Right Side */}
                <div className="flex items-center gap-6">

                    <Link
                        to="/"
                        className={`hover:text-blue-600 ${
                            location.pathname === "/"
                                ? "text-blue-600 font-semibold"
                                : ""
                        }`}
                    >
                        Home
                    </Link>

                    <Link
                        to="/cart"
                        className="relative flex items-center gap-2 hover:text-blue-600"
                    >
                        <FaShoppingCart size={22} />

                        <span>Cart</span>

                        {totalCartItems > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {totalCartItems}
                            </span>
                        )}
                    </Link>

                    {user && (
                        <Link
                            to="/my-orders"
                            className="hover:text-blue-600"
                        >
                            My Orders
                        </Link>
                    )}

                    {user?.role === "admin" && (
                        <Link
                            to="/admin"
                            className="hover:text-blue-600 font-semibold"
                        >
                            Admin
                        </Link>
                    )}

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
                                onClick={handleLogout}
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