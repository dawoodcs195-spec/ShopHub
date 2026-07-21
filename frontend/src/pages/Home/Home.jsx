import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../../services/api";

import Hero from "../../components/common/Hero";
import Categories from "../../components/common/Categories";
import Features from "../../components/common/Features";
import ProductCard from "../../components/products/ProductCard";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();

    const keyword = searchParams.get("keyword") || "";

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);

            try {
                const response = await api.get("/products", {
                    params: {
                        keyword,
                    },
                });

                setProducts(response.data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword]);

    return (
        <div className="bg-gray-100 min-h-screen">

            {!keyword && <Hero />}

            {!keyword && (
                <div className="max-w-7xl mx-auto px-5">
                    <Categories />
                </div>
            )}

            <section className="max-w-7xl mx-auto px-5 py-12">

                <h2 className="text-4xl font-bold text-center mb-10">
                    {keyword
                        ? `Search Results for "${keyword}"`
                        : "Latest Products"}
                </h2>

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
                            Try searching with another keyword.
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

            {!keyword && (
                <div className="max-w-7xl mx-auto px-5">
                    <Features />
                </div>
            )}

        </div>
    );
};

export default Home;