import { useEffect, useState } from "react";

import api from "../../services/api";

import Hero from "../../components/common/Hero";
import Categories from "../../components/common/Categories";
import Features from "../../components/common/Features";
import ProductCard from "../../components/products/ProductCard";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                setProducts(response.data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen">

            {/* Hero Section */}
            <Hero />

            {/* Categories */}
            <div className="max-w-7xl mx-auto px-5">
                <Categories />
            </div>

            {/* Latest Products */}
            <section className="max-w-7xl mx-auto px-5 py-12">

                <h2 className="text-4xl font-bold text-center mb-10">
                    Latest Products
                </h2>

                {loading ? (
                    <div className="text-center text-2xl py-20">
                        Loading Products...
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

            {/* Why Choose Us */}
            <div className="max-w-7xl mx-auto px-5">
                <Features />
            </div>

        </div>
    );
};

export default Home;