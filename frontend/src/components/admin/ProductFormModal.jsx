import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { uploadImage } from "../../services/uploadService";

const ProductFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    loading,
}) => {
    const { token } = useAuth();

    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
        image: {
            url: "",
            public_id: "",
        },
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
                image: initialData.image || {
                    url: "",
                    public_id: "",
                },
            });
        } else {
            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                brand: "",
                stock: "",
                image: {
                    url: "",
                    public_id: "",
                },
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image.");
            return;
        }

        try {
            setUploadingImage(true);

            const image = await uploadImage(file, token);

            setFormData((prev) => ({
                ...prev,
                image,
            }));

            toast.success("Image uploaded successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Image upload failed.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.image.url) {
            toast.error("Please upload a product image.");
            return;
        }

        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">

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
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            required
                        />

                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            required
                        />

                    </div>

                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <input
                        type="text"
                        name="brand"
                        placeholder="Brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    />

                    <div>

                        <label className="block mb-2 font-medium">
                            Product Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border rounded-lg p-3"
                        />

                        {uploadingImage && (
                            <p className="text-blue-600 mt-2">
                                Uploading image...
                            </p>
                        )}

                        {formData.image.url && (
                            <div className="mt-4">

                                <img
                                    src={formData.image.url}
                                    alt="Preview"
                                    className="w-40 h-40 object-cover rounded-lg border"
                                />

                            </div>
                        )}

                    </div>

                    <button
                        type="submit"
                        disabled={loading || uploadingImage}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading || uploadingImage
                            ? "Please wait..."
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