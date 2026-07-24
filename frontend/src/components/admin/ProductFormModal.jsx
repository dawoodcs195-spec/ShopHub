import { useState, useEffect } from "react";
import { FaTimes, FaTrash, FaCrown } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { uploadImage } from "../../services/uploadService";

const DEFAULT_BRAND = "SHOPHUB";

const normalizeImages = (initialData) => {
  const imgs = [];

  if (Array.isArray(initialData?.images) && initialData.images.length > 0) {
    for (const img of initialData.images) {
      if (img?.url) imgs.push(img);
    }
  } else if (initialData?.image?.url) {
    imgs.push(initialData.image);
  }

  return imgs;
};

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const { token } = useAuth();

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: DEFAULT_BRAND,
    stock: "",
    image: { url: "", public_id: "" },   // cover
    images: [],                          // gallery
  });

  useEffect(() => {
    if (initialData) {
      const images = normalizeImages(initialData);
      const cover = images[0] || initialData.image || { url: "", public_id: "" };

      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        category: initialData.category || "",
        brand: initialData.brand || DEFAULT_BRAND,
        stock: initialData.stock || "",
        image: cover,
        images,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: DEFAULT_BRAND,
        stock: "",
        image: { url: "", public_id: "" },
        images: [],
      });
    }

    setUploadProgress({ done: 0, total: 0 });
    setUploadingImage(false);
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // reset input so selecting same files again triggers change
    e.target.value = "";

    const invalid = files.find((f) => !f.type.startsWith("image/"));
    if (invalid) {
      toast.error("Please select only valid image files.");
      return;
    }

    try {
      setUploadingImage(true);
      setUploadProgress({ done: 0, total: files.length });

      const uploaded = [];

      for (let i = 0; i < files.length; i++) {
        const img = await uploadImage(files[i], token);
        uploaded.push(img);
        setUploadProgress({ done: i + 1, total: files.length });
      }

      setFormData((prev) => {
        const nextImages = [...prev.images, ...uploaded];

        return {
          ...prev,
          images: nextImages,
          image: nextImages[0] || prev.image,
        };
      });

      toast.success(files.length > 1 ? "Images uploaded successfully." : "Image uploaded successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed.");
    } finally {
      setUploadingImage(false);
      setUploadProgress({ done: 0, total: 0 });
    }
  };

  const removeImage = (public_id) => {
    setFormData((prev) => {
      const nextImages = prev.images.filter((img) => img.public_id !== public_id);

      return {
        ...prev,
        images: nextImages,
        image: nextImages[0] || { url: "", public_id: "" },
      };
    });
  };

  const setAsCover = (index) => {
    setFormData((prev) => {
      if (index <= 0 || index >= prev.images.length) return prev;

      const next = [...prev.images];
      const [picked] = next.splice(index, 1);
      next.unshift(picked);

      return {
        ...prev,
        images: next,
        image: next[0],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.images || formData.images.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    const payload = {
      ...formData,
      brand: formData.brand || DEFAULT_BRAND,
      images: formData.images,
      image: formData.images[0], // cover = first
    };

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
          disabled={loading || uploadingImage}
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
              Product Images <span className="text-xs">(first image becomes cover)</span>
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="w-full bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg px-4 py-3 text-text-primary dark:text-dark-card-foreground file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-secondary-foreground file:font-medium hover:file:bg-secondary/70"
            />

            {uploadingImage && uploadProgress.total > 0 && (
              <p className="text-text-secondary dark:text-dark-muted-foreground mt-2">
                Uploading images... {uploadProgress.done}/{uploadProgress.total}
              </p>
            )}

            {formData.images.length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-3">
                  {formData.images.map((img, idx) => (
                    <div
                      key={img.public_id || img.url}
                      className="relative overflow-hidden rounded-xl border border-border dark:border-dark-border bg-white"
                    >
                      <img
                        src={img.url}
                        alt={`Product ${idx + 1}`}
                        className="h-24 w-full object-cover"
                      />

                      {/* Cover badge */}
                      {idx === 0 && (
                        <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-[11px] font-semibold text-accent-foreground shadow-sm">
                          <FaCrown />
                          Cover
                        </div>
                      )}

                      {/* Actions */}
                      <div className="absolute right-2 top-2 flex gap-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => setAsCover(idx)}
                            className="rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-text-primary shadow-sm hover:bg-white"
                            title="Set as cover"
                          >
                            Cover
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => removeImage(img.public_id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-destructive shadow-sm hover:bg-white"
                          title="Remove image"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-xs text-text-secondary dark:text-dark-muted-foreground">
                  Tip: Click “Cover” on any image to make it the main listing image.
                </p>
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