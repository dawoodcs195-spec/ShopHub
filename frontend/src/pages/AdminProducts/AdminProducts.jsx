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

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {
            await deleteProduct(id, token);

            setProducts((prev) =>
                prev.filter((product) => product._id !== id)
            );

            toast.success("Product deleted successfully.");
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to delete product."
            );
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
        setSelectedProduct(null);
        setModalOpen(false);
    };

    const handleSubmit = async (formData) => {
        setFormLoading(true);

        try {
            if (selectedProduct) {
                const updated = await updateProduct(
                    selectedProduct._id,
                    formData,
                    token
                );

                setProducts((prev) =>
                    prev.map((product) =>
                        product._id === selectedProduct._id
                            ? updated.product
                            : product
                    )
                );

                toast.success("Product updated successfully.");
            } else {
                const created = await createProduct(
                    formData,
                    token
                );

                setProducts((prev) => [
                    ...prev,
                    created.product,
                ]);

                toast.success("Product added successfully.");
            }

            handleCloseModal();
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-10 text-xl">
                Loading Products...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-8">

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-4xl font-bold">
                    Manage Products
                </h1>

                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
                >
                    <FaPlus />
                    Add Product
                </button>

            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow">

                <table className="w-full">

                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-4 text-left">Image</th>
                            <th className="p-4 text-left">Product</th>
                            <th className="p-4 text-left">Price</th>
                            <th className="p-4 text-left">Category</th>
                            <th className="p-4 text-left">Stock</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {products.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-8 text-gray-500"
                                >
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="p-4">
                                        <img
                                            src={
                                                product.image?.url ||
                                                "https://placehold.co/80x80?text=No+Image"
                                            }
                                            alt={product.name}
                                            className="w-16 h-16 rounded-lg object-cover border"
                                        />
                                    </td>

                                    <td className="p-4 font-semibold">
                                        {product.name}
                                    </td>

                                    <td className="p-4">
                                        Rs. {product.price}
                                    </td>

                                    <td className="p-4">
                                        {product.category}
                                    </td>

                                    <td className="p-4">
                                        {product.stock}
                                    </td>

                                    <td className="p-4">

                                        <div className="flex justify-center gap-5">

                                            <button
                                                onClick={() =>
                                                    handleOpenEdit(product)
                                                }
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FaEdit size={18} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(product._id)
                                                }
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash size={18} />
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