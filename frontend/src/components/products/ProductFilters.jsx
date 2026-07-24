import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaFilter, FaUndo } from 'react-icons/fa';
import Input from '../../components/forms/Input'; // Import new component
import Select from '../../components/forms/Select'; // Import new component

const ProductFilters = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [brand, setBrand] = useState(searchParams.get("brand") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [rating, setRating] = useState(searchParams.get("rating") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "newest");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setCategory(searchParams.get("category") || "");
        setBrand(searchParams.get("brand") || "");
        setMinPrice(searchParams.get("minPrice") || "");
        setMaxPrice(searchParams.get("maxPrice") || "");
        setRating(searchParams.get("rating") || "");
        setSort(searchParams.get("sort") || "newest");
    }, [searchParams]);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams);
        const updateParam = (key, value) => value ? params.set(key, value) : params.delete(key);
        updateParam("category", category);
        updateParam("brand", brand);
        updateParam("minPrice", minPrice);
        updateParam("maxPrice", maxPrice);
        updateParam("rating", rating);
        updateParam("sort", sort);
        params.delete("page");
        navigate(`/?${params.toString()}`);
        setIsOpen(false);
    };

    const clearFilters = () => {
        setCategory("");
        setBrand("");
        setMinPrice("");
        setMaxPrice("");
        setRating("");
        setSort("newest");
        navigate("/");
        setIsOpen(false);
    };

    const FilterInput = ({ label, children }) => (
        <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
            {children}
        </div>
    );

    return (
        <div className="mb-10">
            <div className="lg:hidden mb-4">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 w-full justify-center py-2 px-4 bg-surface border border-border rounded-lg shadow-soft text-text-primary"
                >
                    <FaFilter />
                    <span>{isOpen ? 'Close Filters' : 'Show Filters'}</span>
                </button>
            </div>
            
            <div className={`bg-surface rounded-lg shadow-soft p-6 ${isOpen ? 'block' : 'hidden'} lg:block`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-end">
                    <FilterInput label="Category">
                        <Input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. Candles"
                        />
                    </FilterInput>
                    <FilterInput label="Brand / Collection">
                        <Input
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            placeholder="e.g. Signature"
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
                        <Select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        >
                            <option value="">Any</option>
                            <option value="4">4+ Stars</option>
                            <option value="3">3+ Stars</option>
                            <option value="2">2+ Stars</option>
                            <option value="1">1+ Star</option>
                        </Select>
                    </FilterInput>
                    <FilterInput label="Sort By">
                        <Select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="newest">Newest</option>
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="priceDesc">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                        </Select>
                    </FilterInput>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-border">
                    <button onClick={applyFilters} className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors shadow-soft">
                        <FaFilter /><span>Apply Filters</span>
                    </button>
                    <button onClick={clearFilters} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-200 text-text-primary px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        <FaUndo /><span>Reset</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;