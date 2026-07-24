import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaFilter, FaUndo } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Input from "../../components/forms/Input";
import Select from "../../components/forms/Select";

const ProductFilters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  // Hidden by default
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCategory(searchParams.get("category") || "");
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

    updateParam("category", category);
    updateParam("minPrice", minPrice);
    updateParam("maxPrice", maxPrice);
    updateParam("rating", rating);
    updateParam("sort", sort);

    // Ensure brand is removed from URL if present from old links
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
      <label className="block text-sm font-medium text-text-secondary mb-1">
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="mb-10">
      {/* Toggle Bar */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls="product-filters-panel"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-text-primary shadow-soft transition-colors hover:bg-secondary"
        >
          <FaFilter />
          <span className="font-medium">{isOpen ? "Hide Filters" : "Filters"}</span>

          {activeFiltersCount > 0 && (
            <span className="ml-1 inline-flex min-w-6 items-center justify-center rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-secondary-foreground transition-colors hover:bg-secondary/70"
          >
            <FaUndo />
            <span className="font-medium">Reset</span>
          </button>
        )}
      </div>

      {/* Panel */}
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
            <div className="bg-card rounded-lg shadow-soft p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-end">
                <FilterInput label="Category">
                  <Input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Candles"
                  />
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

              <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={applyFilters}
                  className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors shadow-soft"
                >
                  <FaFilter />
                  <span>Apply Filters</span>
                </button>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border border-border px-6 py-2 rounded-lg hover:bg-secondary/70 transition-colors"
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