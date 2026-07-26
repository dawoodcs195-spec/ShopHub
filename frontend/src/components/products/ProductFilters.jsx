import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaFilter, FaUndo } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Input from "../../components/forms/Input";
import Select from "../../components/forms/Select";

const normalizeCategory = (input) => {
  if (!input) return "";

  const raw = String(input);
  const v = raw.trim().toLowerCase();

  if (v === "candles" || v === "candle" || v === "signature-candles") return "candles";
  if (v === "resin" || v === "resin-art" || v === "resin art" || v === "resinart") return "Resin art";
  if (v === "floral" || v === "floral-collection" || v === "floral collection") return "Floral collection";
  if (v === "gifts" || v === "personalized-gifts" || v === "personalized gifts") return "Personalized Gifts";
  if (v === "accessories" || v === "handmade-accessories" || v === "handmade accessories")
    return "handmade accessories ";
  if (v === "best-sellers" || v === "best sellers" || v === "bestsellers") return "best-sellers";

  return raw;
};

const CATEGORY_OPTIONS = [
  { label: "All", value: "" },
  { label: "Signature Candles", value: "candles" },
  { label: "Resin Art", value: "Resin art" },
  { label: "Floral Collection", value: "Floral collection" },
  // adjust this value if your DB uses a different exact string
  { label: "Personalized Gifts", value: "Personalized Gifts" },
  // matches your DB example EXACTLY (includes trailing space)
  { label: "Handmade Accessories", value: "handmade accessories " },
  // special view handled in Home.jsx (sort by rating)
  { label: "Best Sellers", value: "best-sellers" },
];

const ProductFilters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [category, setCategory] = useState(normalizeCategory(searchParams.get("category") || ""));
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCategory(normalizeCategory(searchParams.get("category") || ""));
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setRating(searchParams.get("rating") || "");
    setSort(searchParams.get("sort") || "newest");
  }, [searchParams]);

  const activeFiltersCount = useMemo(() => {
    const base = [category, minPrice, maxPrice, rating].filter(Boolean).length;
    const sortCount = sort && sort !== "newest" ? 1 : 0;
    return base + sortCount;
  }, [category, minPrice, maxPrice, rating, sort]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    const updateParam = (key, value) => (value ? params.set(key, value) : params.delete(key));

    const normalized = normalizeCategory(category);

    updateParam("category", normalized);
    updateParam("minPrice", minPrice);
    updateParam("maxPrice", maxPrice);
    updateParam("rating", rating);

    // if Best Sellers is selected, enforce rating sort
    if (normalized === "best-sellers") {
      updateParam("sort", "rating");
    } else {
      updateParam("sort", sort);
    }

    params.delete("brand");
    params.delete("page");

    navigate(`/?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setSort("newest");

    navigate("/");
    setIsOpen(false);
  };

  const FilterInput = ({ label, children }) => (
    <div>
      <label className="block text-sm font-medium text-text-secondary dark:text-dark-muted-foreground mb-1">
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="mb-10">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls="product-filters-panel"
          className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-2.5 text-text-primary dark:text-dark-card-foreground shadow-soft transition-colors hover:bg-secondary dark:hover:bg-dark-secondary/30"
        >
          <FaFilter />
          <span className="font-medium">{isOpen ? "Hide Filters" : "Filters"}</span>

          {activeFiltersCount > 0 && (
            <span className="ml-1 inline-flex min-w-6 items-center justify-center rounded-full bg-accent dark:bg-dark-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground dark:text-dark-card-foreground">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border dark:border-dark-border bg-secondary dark:bg-dark-secondary/30 px-4 py-2.5 text-secondary-foreground dark:text-dark-card-foreground transition-colors hover:bg-secondary/70 dark:hover:bg-dark-secondary/40"
          >
            <FaUndo />
            <span className="font-medium">Reset</span>
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="product-filters-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft p-5 sm:p-6 border border-border/60 dark:border-dark-border/70">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 items-end">
                <FilterInput label="Category">
                  <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.label} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </FilterInput>

                <FilterInput label="Min Price">
                  <Input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                  />
                </FilterInput>

                <FilterInput label="Max Price">
                  <Input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="5000"
                  />
                </FilterInput>

                <FilterInput label="Rating">
                  <Select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="">Any</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Star</option>
                  </Select>
                </FilterInput>

                <FilterInput label="Sort By">
                  <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="newest">Newest</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </Select>
                </FilterInput>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 pt-6 border-t border-border dark:border-dark-border">
                <button
                  type="button"
                  onClick={applyFilters}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors shadow-soft"
                >
                  <FaFilter />
                  <span>Apply Filters</span>
                </button>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary dark:bg-dark-secondary/30 text-secondary-foreground dark:text-dark-card-foreground border border-border dark:border-dark-border px-6 py-3 rounded-xl hover:bg-secondary/70 dark:hover:bg-dark-secondary/40 transition-colors"
                >
                  <FaUndo />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilters;