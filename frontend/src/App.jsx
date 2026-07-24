// frontend/src/App.jsx

import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";

// Lazy-loaded page components
const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout"));
const StripePayment = lazy(() => import("./pages/StripePayment/StripePayment"));
const MyOrders = lazy(() => import("./pages/MyOrders/MyOrders"));
const ProductDetails = lazy(() => import("./pages/ProductDetails/ProductDetails"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Wishlist = lazy(() => import("./pages/Wishlist/Wishlist"));

// Lazy-loaded Admin page components
const Admin = lazy(() => import("./pages/Admin/Admin"));
const AdminProducts = lazy(() => import("./pages/AdminProducts/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/AdminOrders/AdminOrders"));
const AdminCoupons = lazy(() => import("./pages/AdminCoupons/AdminCoupons"));
const AdminReports = lazy(() => import("./pages/AdminReports/AdminReports"));

const SuspenseFallback = () => (
    <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-xl text-muted-foreground dark:text-dark-muted-foreground">Loading...</p>
    </div>
);

function App() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background dark:bg-dark-background">
                <Suspense fallback={<SuspenseFallback />}>
                    <Routes>
                        {/* ================= Public Routes ================= */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/product/:id" element={<ProductDetails />} />

                        {/* ================= Protected User Routes ================= */}
                        <Route
                            path="/checkout"
                            element={<ProtectedRoute><Checkout /></ProtectedRoute>}
                        />
                        <Route
                            path="/stripe-payment"
                            element={<ProtectedRoute><StripePayment /></ProtectedRoute>}
                        />
                        <Route
                            path="/my-orders"
                            element={<ProtectedRoute><MyOrders /></ProtectedRoute>}
                        />
                        <Route
                            path="/wishlist"
                            element={<ProtectedRoute><Wishlist /></ProtectedRoute>}
                        />
                        <Route
                            path="/profile"
                            element={<ProtectedRoute><Profile /></ProtectedRoute>}
                        />

                        {/* ================= Admin Routes ================= */}
                        <Route
                            path="/admin"
                            element={<AdminRoute><Admin /></AdminRoute>}
                        />
                        <Route
                            path="/admin/products"
                            element={<AdminRoute><AdminProducts /></AdminRoute>}
                        />
                        <Route
                            path="/admin/orders"
                            element={<AdminRoute><AdminOrders /></AdminRoute>}
                        />
                        <Route
                            path="/admin/coupons"
                            element={<AdminRoute><AdminCoupons /></AdminRoute>}
                        />
                        <Route
                            path="/admin/reports"
                            element={<AdminRoute><AdminReports /></AdminRoute>}
                        />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </>
    );
}

export default App;