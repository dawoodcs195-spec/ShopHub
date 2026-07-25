import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import Rating from "../common/Rating";

const PAGE_SIZE = 4;

const formatDate = (dateStr) => {
    try {
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleDateString();
    } catch {
        return "";
    }
};

const ProductReviews = ({ reviews = [] }) => {
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);

    const totalReviews = reviews.length;

    const ratingCounts = useMemo(() => {
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        for (const r of reviews) {
            const v = Number(r?.rating) || 0;
            if (v >= 1 && v <= 5) counts[v] += 1;
        }

        return counts;
    }, [reviews]);

    const averageRating = useMemo(() => {
        if (totalReviews === 0) return 0;
        let sum = 0;
        for (const r of reviews) sum += Number(r?.rating) || 0;
        return sum / totalReviews;
    }, [reviews, totalReviews]);

    const sortedReviews = useMemo(() => {
        const list = [...reviews];

        switch (sort) {
            case "oldest":
                return list.sort(
                    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
            case "highest":
                return list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
            case "lowest":
                return list.sort((a, b) => (Number(a.rating) || 0) - (Number(b.rating) || 0));
            case "newest":
            default:
                return list.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
        }
    }, [reviews, sort]);

    const totalPages = Math.max(Math.ceil(sortedReviews.length / PAGE_SIZE), 1);

    const pagedReviews = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return sortedReviews.slice(start, start + PAGE_SIZE);
    }, [sortedReviews, page]);

    // Reset to page 1 when sorting changes or reviews length changes
    useMemo(() => {
        if (page > totalPages) setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, totalReviews, totalPages]);

    const barBg = "bg-secondary/70";
    const barFill = "bg-primary";

    return (
        <div className="bg-card dark:bg-dark-card rounded-[28px] shadow-soft border border-border dark:border-dark-border p-6 sm:p-8 mt-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-text-primary dark:text-dark-card-foreground">
                        Reviews
                    </h2>
                    <p className="mt-2 text-text-secondary dark:text-dark-muted-foreground">
                        Honest thoughts from customers who brought these creations home.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-text-secondary dark:text-dark-muted-foreground">
                        Sort
                    </label>
                    <select
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-xl border border-border dark:border-dark-border bg-white dark:bg-dark-secondary px-4 py-2 text-sm text-text-primary dark:text-dark-card-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-dark-ring"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="highest">Highest rating</option>
                        <option value="lowest">Lowest rating</option>
                    </select>
                </div>
            </div>

            {/* Rating distribution */}
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
                <div className="rounded-2xl border border-border dark:border-dark-border bg-white dark:bg-dark-secondary p-6">
                    <div className="flex items-center justify-between gap-6">
                        <div>
                            <p className="text-sm font-semibold text-text-secondary dark:text-dark-muted-foreground">
                                Average
                            </p>
                            <div className="mt-2 flex items-end gap-3">
                                <p className="font-serif text-5xl font-bold text-text-primary dark:text-dark-card-foreground">
                                    {averageRating.toFixed(1)}
                                </p>
                                <p className="pb-2 text-sm text-text-secondary dark:text-dark-muted-foreground">
                                    / 5
                                </p>
                            </div>
                            <div className="mt-3">
                                <Rating value={averageRating} text={`${totalReviews} review${totalReviews !== 1 ? "s" : ""}`} />
                            </div>
                        </div>

                        <div className="hidden sm:block text-right text-sm text-text-secondary dark:text-dark-muted-foreground">
                            <p className="font-semibold text-text-primary dark:text-dark-card-foreground">
                                {totalReviews}
                            </p>
                            <p>total reviews</p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = ratingCounts[star] || 0;
                            const pct = totalReviews === 0 ? 0 : Math.round((count / totalReviews) * 100);

                            return (
                                <div key={star} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-14">
                                        <span className="text-sm font-semibold text-text-primary dark:text-dark-card-foreground">
                                            {star}
                                        </span>
                                        <FaStar className="text-[#C7A35B]" />
                                    </div>

                                    <div className={`h-2 flex-1 rounded-full ${barBg} overflow-hidden`} aria-label={`${star} star reviews`}>
                                        <div
                                            className={`h-full rounded-full ${barFill}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>

                                    <span className="w-10 text-right text-sm text-text-secondary dark:text-dark-muted-foreground">
                                        {pct}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Review list */}
                <div className="rounded-2xl border border-border dark:border-dark-border bg-white dark:bg-dark-secondary p-6">
                    {totalReviews === 0 ? (
                        <p className="text-text-secondary dark:text-dark-muted-foreground">
                            No reviews yet. Be the first to share your thoughts!
                        </p>
                    ) : (
                        <>
                            <div className="flex items-center justify-between text-sm text-text-secondary dark:text-dark-muted-foreground">
                                <span>
                                    Showing{" "}
                                    <span className="font-semibold text-text-primary dark:text-dark-card-foreground">
                                        {(page - 1) * PAGE_SIZE + 1}
                                    </span>
                                    –
                                    <span className="font-semibold text-text-primary dark:text-dark-card-foreground">
                                        {Math.min(page * PAGE_SIZE, totalReviews)}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-text-primary dark:text-dark-card-foreground">
                                        {totalReviews}
                                    </span>
                                </span>

                                <span>
                                    Page{" "}
                                    <span className="font-semibold text-text-primary dark:text-dark-card-foreground">
                                        {page}
                                    </span>{" "}
                                    /{" "}
                                    <span className="font-semibold text-text-primary dark:text-dark-card-foreground">
                                        {totalPages}
                                    </span>
                                </span>
                            </div>

                            <div className="mt-5 space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {pagedReviews.map((review) => (
                                        <motion.div
                                            key={review._id}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 12 }}
                                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                            className="rounded-2xl border border-border dark:border-dark-border bg-card dark:bg-dark-card p-5"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="text-base font-semibold text-text-primary dark:text-dark-card-foreground">
                                                        {review.name}
                                                    </h3>
                                                    <p className="mt-1 text-xs text-text-secondary dark:text-dark-muted-foreground">
                                                        {formatDate(review.createdAt)}
                                                    </p>
                                                </div>

                                                <Rating value={review.rating} />
                                            </div>

                                            <p className="mt-4 text-text-secondary dark:text-dark-muted-foreground leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-6 flex items-center justify-between gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                        disabled={page === 1}
                                        className={[
                                            "rounded-full px-5 py-2 text-sm font-semibold border transition-colors",
                                            page === 1
                                                ? "border-border text-text-secondary cursor-not-allowed"
                                                : "border-border text-text-primary hover:bg-secondary/50",
                                        ].join(" ")}
                                    >
                                        Prev
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                        disabled={page === totalPages}
                                        className={[
                                            "rounded-full px-5 py-2 text-sm font-semibold border transition-colors",
                                            page === totalPages
                                                ? "border-border text-text-secondary cursor-not-allowed"
                                                : "border-border text-text-primary hover:bg-secondary/50",
                                        ].join(" ")}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;