import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import StripePayment from "./pages/StripePayment/StripePayment";
import MyOrders from "./pages/MyOrders/MyOrders";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Profile from "./pages/Profile/Profile";
import Wishlist from "./pages/Wishlist/Wishlist";

import Admin from "./pages/Admin/Admin";
import AdminProducts from "./pages/AdminProducts/AdminProducts";
import AdminOrders from "./pages/AdminOrders/AdminOrders";
import AdminCoupons from "./pages/AdminCoupons/AdminCoupons";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";

function App() {
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-100">
                <Routes>
                    {/* ================= Public Routes ================= */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/forgot-password"
                        element={
                            <ForgotPassword />
                        }
                    />

                    <Route
                        path="/reset-password/:token"
                        element={
                            <ResetPassword />
                        }
                    />

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                    <Route
                        path="/product/:id"
                        element={
                            <ProductDetails />
                        }
                    />

                    {/* ================= Protected User Routes ================= */}

                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <Checkout />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/stripe-payment"
                        element={
                            <ProtectedRoute>
                                <StripePayment />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/my-orders"
                        element={
                            <ProtectedRoute>
                                <MyOrders />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/wishlist"
                        element={
                            <ProtectedRoute>
                                <Wishlist />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    {/* ================= Admin Routes ================= */}

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <Admin />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/products"
                        element={
                            <AdminRoute>
                                <AdminProducts />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/orders"
                        element={
                            <AdminRoute>
                                <AdminOrders />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/coupons"
                        element={
                            <AdminRoute>
                                <AdminCoupons />
                            </AdminRoute>
                        }
                    />
                </Routes>
            </main>

            <Footer />
        </>
    );
}

export default App;