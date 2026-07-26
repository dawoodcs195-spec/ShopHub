// frontend/src/pages/AdminProducts/AdminProducts.jsx

import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";

import {
    getProducts,
    deleteProduct,
    createProduct,
    updateProduct,
} from "../../services/productService";

import { useAuth } from "../../context/AuthContext";
import ProductFormModal from "../../components/admin/ProductFormModal";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const { token } = useAuth();

    const loadProducts = async () => {
        try {
            const data = await getProducts({ limit: 100 });
            setProducts(data.products || []);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await deleteProduct(id, token);
            setProducts((prev) => prev.filter((product) => product._id !== id));
            toast.success("Product deleted successfully.");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete product.");
        }
    };

    const handleOpenAdd = () => {
        setSelectedProduct(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        if (formLoading) return;
        setSelectedProduct(null);
        setModalOpen(false);
    };

    const handleSubmit = async (formData) => {
        setFormLoading(true);
        try {
            if (selectedProduct) {
                const updated = await updateProduct(selectedProduct._id, formData, token);
                setProducts((prev) =>
                    prev.map((p) => (p._id === selectedProduct._id ? updated.product : p))
                );
                toast.success("Product updated successfully.");
            } else {
                const created = await createProduct(formData, token);
                setProducts((prev) => [created.product, ...prev]);
                toast.success("Product added successfully.");
            }
            handleCloseModal();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-xl text-muted-foreground dark:text-dark-muted-foreground">
                Loading Products...
            </div>
        );
    }

    const MobileProductCard = ({ product }) => {
        return (
            <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl shadow-soft p-5">
                <div className="flex items-start gap-4">
                    <img
                        src={product.image?.url || "https://placehold.co/80x80?text=No+Image"}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover border border-border dark:border-dark-border shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-card-foreground dark:text-dark-card-foreground truncate">
                            {product.name}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                            {product.category}
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-xl border border-border dark:border-dark-border bg-secondary/30 dark:bg-dark-secondary/20 p-3">
                                <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
                                    Price
                                </p>
                                <p className="mt-1 font-semibold text-card-foreground dark:text-dark-card-foreground">
                                    Rs. {product.price.toLocaleString()}
                                </p>
                            </div>

                            <div className="rounded-xl border border-border dark:border-dark-border bg-secondary/30 dark:bg-dark-secondary/20 p-3">
                                <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
                                    Stock
                                </p>
                                <p className="mt-1 font-semibold text-card-foreground dark:text-dark-card-foreground">
                                    {product.stock}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3">
                    <button
                        onClick={() => handleOpenEdit(product)}
                        className="inline-flex items-center gap-2 rounded-xl border border-border dark:border-dark-border bg-secondary/30 dark:bg-dark-secondary/20 px-4 py-2 text-sm font-semibold text-primary dark:text-dark-primary hover:opacity-90 transition-opacity"
                        type="button"
                        aria-label="Edit product"
                    >
                        <FaEdit size={14} />
                        Edit
                    </button>

                    <button
                        onClick={() => handleDelete(product._id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-border dark:border-dark-border bg-secondary/30 dark:bg-dark-secondary/20 px-4 py-2 text-sm font-semibold text-destructive dark:text-dark-destructive hover:opacity-90 transition-opacity"
                        type="button"
                        aria-label="Delete product"
                    >
                        <FaTrash size={14} />
                        Delete
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="text-card-foreground dark:text-dark-card-foreground">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Products</h1>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 dark:hover:bg-dark-primary/90 transition-colors"
                    type="button"
                >
                    <FaPlus />
                    Add Product
                </button>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden">
                {products.length === 0 ? (
                    <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border border-border dark:border-dark-border p-10 text-center text-muted-foreground dark:text-dark-muted-foreground">
                        No products found. Click "Add Product" to get started.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {products.map((product) => (
                            <MobileProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto bg-card dark:bg-dark-card rounded-xl shadow-md border border-border dark:border-dark-border">
                <table className="w-full text-sm">
                    <thead className="bg-secondary dark:bg-dark-secondary">
                        <tr>
                            <th className="p-4 text-left font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                Image
                            </th>
                            <th className="p-4 text-left font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                Product
                            </th>
                            <th className="p-4 text-left font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                Price
                            </th>
                            <th className="p-4 text-left font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                Category
                            </th>
                            <th className="p-4 text-left font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                Stock
                            </th>
                            <th className="p-4 text-center font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-12 text-muted-foreground dark:text-dark-muted-foreground"
                                >
                                    No products found. Click "Add Product" to get started.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-b border-border dark:border-dark-border last:border-b-0 hover:bg-secondary/50 dark:hover:bg-dark-secondary/50 transition-colors"
                                >
                                    <td className="p-4">
                                        <img
                                            src={
                                                product.image?.url ||
                                                "https://placehold.co/80x80?text=No+Image"
                                            }
                                            alt={product.name}
                                            className="w-16 h-16 rounded-lg object-cover border border-border dark:border-dark-border"
                                        />
                                    </td>
                                    <td className="p-4 font-medium">{product.name}</td>
                                    <td className="p-4 text-muted-foreground dark:text-dark-muted-foreground">
                                        Rs. {product.price.toLocaleString()}
                                    </td>
                                    <td className="p-4 text-muted-foreground dark:text-dark-muted-foreground">
                                        {product.category}
                                    </td>
                                    <td className="p-4 text-muted-foreground dark:text-dark-muted-foreground">
                                        {product.stock}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-6">
                                            <button
                                                onClick={() => handleOpenEdit(product)}
                                                className="text-primary dark:text-dark-primary hover:opacity-80 transition-opacity"
                                                type="button"
                                                aria-label="Edit product"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="text-destructive dark:text-dark-destructive hover:opacity-80 transition-opacity"
                                                type="button"
                                                aria-label="Delete product"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ProductFormModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                initialData={selectedProduct}
                loading={formLoading}
            />
        </div>
    );
};

export default AdminProducts;