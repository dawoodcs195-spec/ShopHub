import { useState } from "react";

const ProductForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
    });

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

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl w-full max-w-lg p-6">

                <h2 className="text-2xl font-bold mb-6">
                    Add Product
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        name="name"
                        placeholder="Product Name"
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                        required
                    />

                    <input
                        name="price"
                        type="number"
                        placeholder="Price"
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                        required
                    />

                    <input
                        name="category"
                        placeholder="Category"
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                        required
                    />

                    <input
                        name="brand"
                        placeholder="Brand"
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <input
                        name="stock"
                        type="number"
                        placeholder="Stock"
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                        required
                    />

                    <div className="flex justify-end gap-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded bg-gray-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 rounded bg-blue-600 text-white"
                        >
                            Save Product
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default ProductForm;