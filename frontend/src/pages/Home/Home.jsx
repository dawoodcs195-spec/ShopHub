import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaArrowRight } from "react-icons/fa";

import Hero from "../../components/common/Hero";
import Categories from "../../components/common/Categories";
import Features from "../../components/common/Features";
import MeetArtist from "../../components/common/MeetArtist";
import CustomOrders from "../../components/common/CustomOrders";
import InstagramGallery from "../../components/common/InstagramGallery";
import Testimonials from "../../components/common/Testimonials";
import Newsletter from "../../components/common/Newsletter";
import SectionHeading from "../../components/common/SectionHeading";

import ProductCard from "../../components/products/ProductCard";
import SkeletonProductCard from "../../components/products/SkeletonProductCard";
import ProductFilters from "../../components/products/ProductFilters";

import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";

import { getProducts } from "../../services/productService";

const normalizeCategory = (input) => {
  if (!input) return "";

  // Keep original too (because some DB values include spaces/case)
  const raw = String(input);

  const v = raw.trim().toLowerCase();

  // legacy slug support
  if (v === "candles" || v === "candle" || v === "signature-candles") return "candles";
  if (v === "resin" || v === "resin-art" || v === "resin art" || v === "resinart") return "Resin art";
  if (v === "floral" || v === "floral-collection" || v === "floral collection") return "Floral collection";
  if (v === "gifts" || v === "personalized-gifts" || v === "personalized gifts") return "Personalized Gifts";

  // Your DB example has trailing space, so we return exact match:
  if (v === "accessories" || v === "handmade-accessories" || v === "handmade accessories")
    return "handmade accessories ";

  // special view
  if (v === "best-sellers" || v === "best sellers" || v === "bestsellers") return "best-sellers";

  // if user already has the real DB value in URL, keep it
  return raw;
};

const getCategoryLabel = (normalizedCategory) => {
  const map = {
    candles: "Candles",
    "Resin art": "Resin Art",
    "Floral collection": "Floral Collection",
    "Personalized Gifts": "Personalized Gifts",
    "handmade accessories ": "Handmade Accessories",
    "best-sellers": "Best Sellers",
  };

  return map[normalizedCategory] || normalizedCategory;
};

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";

  const rawCategory = searchParams.get("category") || "";
  const normalizedCategory = normalizeCategory(rawCategory);

  const sort = searchParams.get("sort") || "";
  const rating = searchParams.get("rating") || "";
  const page = Number(searchParams.get("page")) || 1;
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const exploreMode = searchParams.get("explore") === "1";
  const storyMode = searchParams.get("story") === "1";

  const isBestSellersView = normalizedCategory === "best-sellers";

  // what we actually send to backend
  const effectiveCategory = isBestSellersView ? "" : normalizedCategory;
  const effectiveSort = isBestSellersView ? "rating" : sort;

  const productsSectionRef = useRef(null);

  const scrollToProductsTop = (behavior = "auto") => {
    const el = productsSectionRef.current;
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, y), behavior });
  };

  const scrollToStory = () => {
    const el = document.getElementById("story");
    if (!el) return false;

    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    return true;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const data = await getProducts({
          keyword,
          category: effectiveCategory,
          minPrice,
          maxPrice,
          rating,
          sort: effectiveSort,
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
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, effectiveCategory, minPrice, maxPrice, rating, effectiveSort, page]);

  // ✅ story: scroll and then remove query WITHOUT navigation
  useEffect(() => {
    if (!storyMode) return;

    let tries = 0;
    const tick = () => {
      tries += 1;
      const ok = scrollToStory();

      if (ok) {
        const params = new URLSearchParams(searchParams);
        params.delete("story");
        const qs = params.toString();
        const url = qs ? `/?${qs}` : "/";
        window.history.replaceState({}, "", url);
        return;
      }

      if (tries < 20) requestAnimationFrame(tick);
    };

    setTimeout(() => requestAnimationFrame(tick), 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyMode]);

  // ✅ keep pagination/filter/search/explore opening at products top
  useEffect(() => {
    if (loading) return;
    if (storyMode) return;

    const shouldScrollToProducts =
      exploreMode || Boolean(keyword) || Boolean(rawCategory) || page > 1;

    if (!shouldScrollToProducts) return;

    setTimeout(() => scrollToProductsTop("auto"), 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, exploreMode, keyword, rawCategory, page, storyMode]);

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const renderSkeletons = () =>
    Array.from({ length: 8 }).map((_, index) => <SkeletonProductCard key={index} />);

  const homePage = !keyword && !rawCategory && !exploreMode;

  const pages = useMemo(() => {
    const total = pagination.totalPages || 1;
    const current = pagination.currentPage || 1;
    if (total <= 1) return [];

    const set = new Set([1, total, current, current - 1, current + 1]);
    const valid = Array.from(set)
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= total)
      .sort((a, b) => a - b);

    const out = [];
    for (let i = 0; i < valid.length; i++) {
      out.push(valid[i]);
      if (i < valid.length - 1 && valid[i + 1] - valid[i] > 1) out.push("...");
    }
    return out;
  }, [pagination.totalPages, pagination.currentPage]);

  const handlePageChange = (nextPage) => {
    const total = pagination.totalPages || 1;
    const safe = Math.max(1, Math.min(total, nextPage));

    const params = new URLSearchParams(searchParams);
    params.set("page", String(safe));
    params.delete("story");

    navigate(`/?${params.toString()}`);
  };

  const resultsTitle = useMemo(() => {
    if (exploreMode) return "Explore Our Creations";
    if (keyword) return `Search Results for "${keyword}"`;
    if (normalizedCategory) return `${getCategoryLabel(normalizedCategory)} Creations`;
    return "Our Creations";
  }, [exploreMode, keyword, normalizedCategory]);

  // ✅ 2-up even on 320px, with slightly tighter gap on very small screens
  const productsGridClass =
    "grid grid-cols-2 lg:grid-cols-4 gap-3 min-[360px]:gap-4 sm:gap-8";

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background">
      {homePage && <Hero />}
      {homePage && <Categories />}

      <section ref={productsSectionRef} className="relative py-12 sm:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-32 h-80 w-80 rounded-full bg-rose-100/30 blur-3xl dark:bg-dark-accent/35" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-100/30 blur-3xl dark:bg-dark-secondary/35" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {homePage ? (
            <SectionHeading
              badge="Featured Collection"
              title="Our Featured Creations"
              subtitle="Each handcrafted piece is thoughtfully created with love, patience, and attention to every tiny detail. Discover beautiful creations designed to make everyday moments feel extraordinary."
            />
          ) : (
            <div className="mb-10 text-center">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-card-foreground">
                {resultsTitle}
              </h2>
              <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#B76E79]" />
            </div>
          )}

          <ProductFilters />

          {!loading && products.length > 0 && (
            <div className="mb-8 mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-text-secondary dark:text-dark-muted-foreground">
              <span>
                Showing {products.length} of {pagination.totalProducts} handcrafted creations
              </span>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>
          )}

          {loading ? (
            <div className={productsGridClass}>{renderSkeletons()}</div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={FaSearch}
              title="No Creations Found"
              description="Try adjusting your search or filters. Sometimes the perfect piece is just one small change away."
              primaryAction={{ label: "Browse All Creations", to: "/", icon: FaArrowRight }}
              tip="Tip: Try a simpler keyword or remove one filter at a time."
            />
          ) : (
            <>
              <motion.div
                className={productsGridClass}
                variants={gridContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </motion.div>

              {pagination.totalPages > 1 && (
                <div className="mt-10 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button
                      type="button"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className={[
                        "px-4 py-2 rounded-xl border font-semibold text-sm transition-colors",
                        pagination.currentPage === 1
                          ? "bg-secondary/50 text-text-secondary cursor-not-allowed border-border dark:bg-dark-secondary/30 dark:text-dark-muted-foreground dark:border-dark-border"
                          : "bg-card text-text-primary border-border hover:bg-secondary/40 dark:bg-dark-card dark:text-dark-card-foreground dark:border-dark-border dark:hover:bg-dark-secondary/30",
                      ].join(" ")}
                    >
                      Previous
                    </button>

                    {pages.map((p, idx) =>
                      p === "..." ? (
                        <span key={`dots-${idx}`} className="px-2 text-text-secondary dark:text-dark-muted-foreground">
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePageChange(p)}
                          className={[
                            "w-10 h-10 rounded-xl border font-semibold text-sm transition-colors",
                            p === pagination.currentPage
                              ? "bg-primary text-white border-primary"
                              : "bg-card text-text-primary border-border hover:bg-secondary/40 dark:bg-dark-card dark:text-dark-card-foreground dark:border-dark-border dark:hover:bg-dark-secondary/30",
                          ].join(" ")}
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className={[
                        "px-4 py-2 rounded-xl border font-semibold text-sm transition-colors",
                        pagination.currentPage === pagination.totalPages
                          ? "bg-secondary/50 text-text-secondary cursor-not-allowed border-border dark:bg-dark-secondary/30 dark:text-dark-muted-foreground dark:border-dark-border"
                          : "bg-card text-text-primary border-border hover:bg-secondary/40 dark:bg-dark-card dark:text-dark-card-foreground dark:border-dark-border dark:hover:bg-dark-secondary/30",
                      ].join(" ")}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {homePage && (
                <div className="mt-10 sm:mt-16 flex justify-center">
                  <Button
                    variant="secondary"
                    onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
                  >
                    Explore More Creations
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {homePage && <MeetArtist />}
      {homePage && <CustomOrders />}
      {homePage && <Features />}
      {homePage && <InstagramGallery />}
      {homePage && <Testimonials />}
      {homePage && <Newsletter />}
    </div>
  );
};

export default Home;