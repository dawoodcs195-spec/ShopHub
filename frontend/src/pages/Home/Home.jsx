import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

import Hero from "../../components/common/Hero";
import Categories from "../../components/common/Categories";
import Features from "../../components/common/Features";
import MeetArtist from "../../components/common/MeetArtist";
import CustomOrders from "../../components/common/CustomOrders";
import InstagramGallery from "../../components/common/InstagramGallery";
import SectionHeading from "../../components/common/SectionHeading";
import Reveal from "../../components/common/Reveal";

import ProductCard from "../../components/products/ProductCard";
import SkeletonProductCard from "../../components/products/SkeletonProductCard";
import ProductFilters from "../../components/products/ProductFilters";

import Button from "../../components/common/Button";

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
                    minPrice,
                    maxPrice,
                    rating,
                    sort,
                    page,
                    limit: 8,
                });

                setProducts(data.products);

                setPagination({
                    currentPage:
                        data.currentPage || 1,
                    totalPages:
                        data.totalPages || 1,
                    totalProducts:
                        data.totalProducts || 0,
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
        minPrice,
        maxPrice,
        rating,
        sort,
        page,
    ]);

    const gridContainerVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
            },
        },
    };

    const renderSkeletons = () => {
        return Array.from({
            length: 8,
        }).map((_, index) => (
            <SkeletonProductCard
                key={index}
            />
        ));
    };

    const homePage =
        !keyword && !category;

    return (
        <div className="min-h-screen bg-[#FCFAF7]">
            {homePage && <Hero />}

            {homePage && <Categories />}

            <section className="relative py-24">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-0 top-32 h-80 w-80 rounded-full bg-rose-100/30 blur-3xl" />

                    <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-100/30 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    {homePage ? (
                        <SectionHeading
                            badge="Featured Collection"
                            title="Our Featured Creations"
                            subtitle="Each handcrafted piece is thoughtfully created with love, patience, and attention to every tiny detail. Discover beautiful creations designed to make everyday moments feel extraordinary."
                        />
                    ) : (
                        <div className="mb-12 text-center">
                            <h2 className="font-serif text-4xl font-bold text-[#2D2A26]">
                                {keyword
                                    ? `Search Results for "${keyword}"`
                                    : `${category} Creations`}
                            </h2>

                            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#B76E79]" />
                        </div>
                    )}

                    <ProductFilters />

                    {!loading &&
                        products.length > 0 && (
                            <div className="mb-10 mt-10 flex flex-wrap items-center justify-between gap-3 text-sm text-[#7A7067]">
                                <span>
                                    Showing{" "}
                                    {products.length} of{" "}
                                    {
                                        pagination.totalProducts
                                    }{" "}
                                    handcrafted
                                    creations
                                </span>

                                <span>
                                    Page{" "}
                                    {
                                        pagination.currentPage
                                    }{" "}
                                    of{" "}
                                    {
                                        pagination.totalPages
                                    }
                                </span>
                            </div>
                        )}

                    {loading ? (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {renderSkeletons()}
                        </div>
                    ) : products.length ===
                      0 ? (
                        <div className="rounded-[32px] border border-[#EFE6DC] bg-white py-24 text-center shadow-sm">
                            <h3 className="font-serif text-4xl font-bold text-[#2D2A26]">
                                No Creations
                                Found
                            </h3>

                            <p className="mt-4 text-[#6B655F]">
                                Try adjusting
                                your search or
                                filters.
                            </p>
                        </div>
                    ) : (
                        <>
                            <motion.div
                                className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
                                variants={
                                    gridContainerVariants
                                }
                                initial="hidden"
                                animate="visible"
                            >
                                {products.map(
                                    (
                                        product
                                    ) => (
                                        <ProductCard
                                            key={
                                                product._id
                                            }
                                            product={
                                                product
                                            }
                                        />
                                    )
                                )}
                            </motion.div>

                            {homePage && (
                                <div className="mt-16 flex justify-center">
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            window.scrollTo(
                                                {
                                                    top:
                                                        document.body.scrollHeight,
                                                    behavior:
                                                        "smooth",
                                                }
                                            )
                                        }
                                    >
                                        Explore More
                                        Creations
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {homePage && (
                <Reveal>
                    <MeetArtist />
                </Reveal>
            )}

            {homePage && (
                <Reveal>
                    <CustomOrders />
                </Reveal>
            )}

            {homePage && (
                <Reveal>
                    <Features />
                </Reveal>
            )}

            {homePage && (
                <Reveal>
                    <InstagramGallery />
                </Reveal>
            )}
        </div>
    );
};

export default Home;