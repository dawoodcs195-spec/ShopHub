import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Cart from "./pages/Cart/Cart";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Admin from "./pages/Admin/Admin";
import AdminProducts from "./pages/AdminProducts/AdminProducts";

function App() {
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-100">
                <Routes>

                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                    <Route
                        path="/product/:id"
                        element={<ProductDetails />}
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={<Admin />}
                    />

                    <Route
                        path="/admin/products"
                        element={<AdminProducts />}
                    />

                </Routes>
            </main>

            <Footer />
        </>
    );
}

export default App;