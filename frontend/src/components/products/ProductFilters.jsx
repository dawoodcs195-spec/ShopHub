import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ProductFilters = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const [category, setCategory] = useState(
        searchParams.get("category") || ""
    );

    const [brand, setBrand] = useState(
        searchParams.get("brand") || ""
    );

    const [minPrice, setMinPrice] = useState(
        searchParams.get("minPrice") || ""
    );

    const [maxPrice, setMaxPrice] = useState(
        searchParams.get("maxPrice") || ""
    );

    const [rating, setRating] = useState(
        searchParams.get("rating") || ""
    );

    const [sort, setSort] = useState(
        searchParams.get("sort") || "newest"
    );

    const applyFilters = () => {
        const params = new URLSearchParams();

        if (category) {
            params.set("category", category);
        }

        if (brand) {
            params.set("brand", brand);
        }

        if (minPrice) {
            params.set("minPrice", minPrice);
        }

        if (maxPrice) {
            params.set("maxPrice", maxPrice);
        }

        if (rating) {
            params.set("rating", rating);
        }

        if (sort) {
            params.set("sort", sort);
        }

        navigate(`/?${params.toString()}`);
    };

    const clearFilters = () => {
        setCategory("");
        setBrand("");
        setMinPrice("");
        setMaxPrice("");
        setRating("");
        setSort("newest");

        navigate("/");
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <h2 className="text-2xl font-bold mb-6">
                Filters
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Category
                    </label>

                    <input
                        type="text"
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                        placeholder="Electronics"
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Brand
                    </label>

                    <input
                        type="text"
                        value={brand}
                        onChange={(e) =>
                            setBrand(e.target.value)
                        }
                        placeholder="Apple"
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Rating
                    </label>

                    <select
                        value={rating}
                        onChange={(e) =>
                            setRating(e.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    >
                        <option value="">
                            Any Rating
                        </option>
                        <option value="5">5 Stars</option>
                        <option value="4">
                            4 Stars & Above
                        </option>
                        <option value="3">
                            3 Stars & Above
                        </option>
                        <option value="2">
                            2 Stars & Above
                        </option>
                        <option value="1">
                            1 Star & Above
                        </option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Min Price
                    </label>

                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) =>
                            setMinPrice(e.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Max Price
                    </label>

                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) =>
                            setMaxPrice(e.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Sort By
                    </label>

                    <select
                        value={sort}
                        onChange={(e) =>
                            setSort(e.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    >
                        <option value="newest">
                            Newest
                        </option>
                        <option value="oldest">
                            Oldest
                        </option>
                        <option value="priceAsc">
                            Price: Low to High
                        </option>
                        <option value="priceDesc">
                            Price: High to Low
                        </option>
                        <option value="rating">
                            Highest Rated
                        </option>
                    </select>
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                <button
                    onClick={applyFilters}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Apply Filters
                </button>

                <button
                    onClick={clearFilters}
                    className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default ProductFilters;