import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const ProductFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    loading,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
        image: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                price: initialData.price || "",
                category: initialData.category || "",
                brand: initialData.brand || "",
                stock: initialData.stock || "",
                image: initialData.image || "",
            });
        } else {
            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                brand: "",
                stock: "",
                image: "",
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-6">
                    {initialData ? "Edit Product" : "Add Product"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Product Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        rows={3}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />

                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />

                    </div>

                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="brand"
                        placeholder="Brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    />

                    <input
                        type="text"
                        name="image"
                        placeholder="Image URL"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                    >
                        {loading
                            ? "Saving..."
                            : initialData
                            ? "Update Product"
                            : "Add Product"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default ProductFormModal;