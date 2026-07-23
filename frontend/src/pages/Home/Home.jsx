import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Hero from "../../components/common/Hero";
import Categories from "../../components/common/Categories";
import Features from "../../components/common/Features";
import ProductCard from "../../components/products/ProductCard";
import ProductFilters from "../../components/products/ProductFilters";

import { getProducts } from "../../services/productService";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
    });

    const [searchParams] = useSearchParams();

    const keyword = searchParams.get("keyword") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const sort = searchParams.get("sort") || "";
    const rating = searchParams.get("rating") || "";
    const page = Number(searchParams.get("page")) || 1;

    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);

            try {
                const data = await getProducts({
                    keyword,
                    category,
                    brand,
                    minPrice,
                    maxPrice,
                    rating,
                    sort,
                    page,
                    limit: 8,
                });

                setProducts(data.products);

                setPagination({
                    currentPage: data.currentPage || 1,
                    totalPages: data.totalPages || 1,
                    totalProducts: data.totalProducts || 0,
                });
            } catch (error) {
                console.error(
                    "Error fetching products:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [
        keyword,
        category,
        brand,
        minPrice,
        maxPrice,
        rating,
        sort,
        page,
    ]);

    return (
        <div className="bg-gray-100 min-h-screen">
            {!keyword && !category && <Hero />}

            {!keyword && !category && (
                <div className="max-w-7xl mx-auto px-5">
                    <Categories />
                </div>
            )}

            <section className="max-w-7xl mx-auto px-5 py-12">
                <h2 className="text-4xl font-bold text-center mb-10">
                    {keyword
                        ? `Search Results for "${keyword}"`
                        : category
                        ? `${category} Products`
                        : "Latest Products"}
                </h2>

                <ProductFilters />

                {!loading && products.length > 0 && (
                    <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
                        <span>
                            Showing {products.length} of{" "}
                            {pagination.totalProducts} product(s)
                        </span>

                        <span>
                            Page {pagination.currentPage} of{" "}
                            {pagination.totalPages}
                        </span>
                    </div>
                )}

                {loading ? (
                    <div className="text-center text-2xl py-20">
                        Loading Products...
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-3xl font-bold mb-4">
                            No Products Found
                        </h3>

                        <p className="text-gray-500">
                            Try changing your search or
                            filters.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </section>

            {!keyword && !category && (
                <div className="max-w-7xl mx-auto px-5">
                    <Features />
                </div>
            )}
        </div>
    );
};

export default Home;