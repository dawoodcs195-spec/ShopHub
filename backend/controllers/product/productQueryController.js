// backend/controllers/product/productQueryController.js

const Product = require("../../models/Product");

// Escape user input for safe regex usage
const escapeRegex = (str = "") => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Normalize category query so slugs still work (frontend may send resin/accessories etc.)
const normalizeCategoryParam = (input) => {
  if (!input) return "";

  const raw = String(input);
  const v = raw.trim().toLowerCase();

  // slugs / variations -> canonical (match your DB naming, case-insensitive)
  if (v === "candles" || v === "candle" || v === "signature-candles") return "candles";
  if (v === "resin" || v === "resin-art" || v === "resin art" || v === "resinart") return "Resin art";
  if (v === "floral" || v === "floral-collection" || v === "floral collection") return "Floral collection";
  if (v === "gifts" || v === "personalized-gifts" || v === "personalized gifts") return "Personalized Gifts";
  if (v === "accessories" || v === "handmade-accessories" || v === "handmade accessories")
    return "handmade accessories";

  // special view
  if (v === "best-sellers" || v === "best sellers" || v === "bestsellers") return "best-sellers";

  // already a real DB value (or something custom)
  return raw.trim();
};

// ===============================
// Get All Products
// ===============================
const getAllProducts = async (req, res) => {
  try {
    const query = {};

    // ===============================
    // Search
    // ===============================
    if (req.query.keyword) {
      query.name = {
        $regex: req.query.keyword,
        $options: "i",
      };
    }

    // ===============================
    // Category Filter (trim-safe + case-insensitive + slug support)
    // ===============================
    let bestSellersMode = false;

    if (req.query.category) {
      const normalized = normalizeCategoryParam(req.query.category);

      if (normalized === "best-sellers") {
        bestSellersMode = true;
      } else if (normalized) {
        // Match even if DB has extra spaces (e.g., "handmade accessories ")
        query.category = {
          $regex: `^\\s*${escapeRegex(normalized)}\\s*$`,
          $options: "i",
        };
      }
    }

    // ===============================
    // Brand Filter
    // ===============================
    if (req.query.brand) {
      // also trim-safe + case-insensitive for robustness
      const brand = String(req.query.brand).trim();
      if (brand) {
        query.brand = {
          $regex: `^\\s*${escapeRegex(brand)}\\s*$`,
          $options: "i",
        };
      }
    }

    // ===============================
    // Price Filter
    // ===============================
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};

      if (req.query.minPrice !== undefined && req.query.minPrice !== "") {
        query.price.$gte = Number(req.query.minPrice);
      }

      if (req.query.maxPrice !== undefined && req.query.maxPrice !== "") {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // ===============================
    // Rating Filter
    // ===============================
    if (req.query.rating) {
      query.rating = {
        $gte: Number(req.query.rating),
      };
    }

    // ===============================
    // Sorting
    // ===============================
    let sort = { createdAt: -1 };

    // If user is viewing best sellers and did not choose a sort,
    // default to rating desc.
    const requestedSort = req.query.sort;
    if (bestSellersMode && !requestedSort) {
      sort = { rating: -1 };
    } else {
      switch (requestedSort) {
        case "priceAsc":
          sort = { price: 1 };
          break;

        case "priceDesc":
          sort = { price: -1 };
          break;

        case "rating":
          sort = { rating: -1 };
          break;

        case "oldest":
          sort = { createdAt: 1 };
          break;

        case "newest":
        default:
          sort = { createdAt: -1 };
      }
    }

    // ===============================
    // Pagination
    // ===============================
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments(query);

    // ===============================
    // Database Query
    // ===============================
    const products = await Product.find(query).sort(sort).skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
};