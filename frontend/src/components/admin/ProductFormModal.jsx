import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { uploadImage } from "../../services/uploadService";

const DEFAULT_BRAND = "SHOPHUB";

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const { token } = useAuth();

  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: DEFAULT_BRAND, // keep for backend compatibility, hidden from UI
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
        brand: initialData.brand || DEFAULT_BRAND,
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
        brand: DEFAULT_BRAND,
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
    const file = e.target.files?.[0];
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

    // Ensure brand is always present (even though UI is removed)
    const payload = { ...formData, brand: formData.brand || DEFAULT_BRAND };
    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-card dark:bg-dark-card text-text-primary dark:text-dark-card-foreground rounded-2xl shadow-lift w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto border border-border dark:border-dark-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-destructive dark:text-dark-muted-foreground dark:hover:text-dark-destructive transition-colors"
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-6">
          {initialData ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg px-4 py-3 text-text-primary dark:text-dark-card-foreground placeholder:text-text-muted dark:placeholder:text-dark-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-dark-ring"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg px-4 py-3 text-text-primary dark:text-dark-card-foreground placeholder:text-text-muted dark:placeholder:text-dark-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-dark-ring resize-none"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg px-4 py-3 text-text-primary dark:text-dark-card-foreground placeholder:text-text-muted dark:placeholder:text-dark-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-dark-ring"
              required
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg px-4 py-3 text-text-primary dark:text-dark-card-foreground placeholder:text-text-muted dark:placeholder:text-dark-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-dark-ring"
              required
            />
          </div>

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg px-4 py-3 text-text-primary dark:text-dark-card-foreground placeholder:text-text-muted dark:placeholder:text-dark-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-dark-ring"
            required
          />

          {/* Brand removed from UI intentionally */}

          <div>
            <label className="block mb-2 font-medium text-text-secondary dark:text-dark-muted-foreground">
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg px-4 py-3 text-text-primary dark:text-dark-card-foreground file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-secondary-foreground file:font-medium hover:file:bg-secondary/70"
            />

            {uploadingImage && (
              <p className="text-text-secondary dark:text-dark-muted-foreground mt-2">
                Uploading image...
              </p>
            )}

            {formData.image.url && (
              <div className="mt-4">
                <img
                  src={formData.image.url}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border border-border dark:border-dark-border"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary-hover transition-colors shadow-soft disabled:opacity-60 disabled:cursor-not-allowed"
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