import { useEffect, useMemo, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaSearch, FaBan } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import {
  getNewsletterSubscribers,
  unsubscribeNewsletterSubscriber,
} from "../../services/adminService";

const Badge = ({ status }) => {
  const isSub = status === "subscribed";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border font-semibold",
        "px-2.5 py-0.5 text-[11px] sm:px-3 sm:py-1 sm:text-xs",
        isSub
          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300"
          : "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-300",
      ].join(" ")}
    >
      {isSub ? "Subscribed" : "Unsubscribed"}
    </span>
  );
};

const AdminSubscribers = () => {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  // ✅ Responsive limit: 15 on 320px-ish screens, otherwise 12
  const [limit, setLimit] = useState(12);

  const [meta, setMeta] = useState({
    totalSubscribers: 0,
    currentPage: 1,
    totalPages: 1,
  });

  // Detect small screens and bump limit
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 360px)");

    const apply = () => {
      setLimit(mq.matches ? 15 : 12);
    };

    apply();

    // Safari fallback support
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else mq.removeListener(apply);
    };
  }, []);

  const load = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const data = await getNewsletterSubscribers(token, {
        keyword,
        status,
        page,
        limit, // ✅ use responsive limit
      });

      setSubscribers(Array.isArray(data?.subscribers) ? data.subscribers : []);
      setMeta({
        totalSubscribers: data.totalSubscribers || 0,
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subscribers.");
    } finally {
      setLoading(false);
    }
  }, [token, keyword, status, page, limit]);

  // If limit changes due to screen size, reset to page 1 (prevents empty pages)
  useEffect(() => {
    setPage(1);
  }, [limit]);

  useEffect(() => {
    load();
  }, [load]);

  const pages = useMemo(() => {
    const total = meta.totalPages || 1;
    const current = meta.currentPage || 1;
    if (total <= 1) return [];

    const set = new Set([1, total, current, current - 1, current + 1]);
    return Array.from(set)
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= total)
      .sort((a, b) => a - b);
  }, [meta.totalPages, meta.currentPage]);

  const handleUnsubscribe = async (id) => {
    try {
      const res = await unsubscribeNewsletterSubscriber(id, token);
      toast.success(res?.message || "Unsubscribed.");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to unsubscribe.");
    }
  };

  return (
    <div>
      <header className="mb-5 sm:mb-6">
        <h1 className="text-3xl font-serif font-bold text-card-foreground dark:text-dark-card-foreground">
          Newsletter Subscribers
        </h1>
        <p className="text-muted-foreground dark:text-dark-muted-foreground mt-1">
          View and manage your studio newsletter list.
        </p>
      </header>

      {/* Filters (slightly tighter on small screens so more rows are visible) */}
      <div className="mb-4 sm:mb-6 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <input
              value={keyword}
              onChange={(e) => {
                setPage(1);
                setKeyword(e.target.value);
              }}
              placeholder="Search by email..."
              className="w-full rounded-2xl border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-2.5 sm:py-3 pl-11 text-text-primary dark:text-dark-card-foreground shadow-soft focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div>
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="w-full rounded-2xl border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-2.5 sm:py-3 text-text-primary dark:text-dark-card-foreground shadow-soft focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
            <option value="">All statuses</option>
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl border border-border dark:border-dark-border bg-card dark:bg-dark-card shadow-soft overflow-hidden">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border dark:border-dark-border flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-text-secondary dark:text-dark-muted-foreground">
            Total: <span className="font-semibold">{meta.totalSubscribers}</span>
          </p>
          <p className="text-sm text-text-secondary dark:text-dark-muted-foreground">
            Page <span className="font-semibold">{meta.currentPage}</span> of{" "}
            <span className="font-semibold">{meta.totalPages}</span>
            <span className="ml-2 opacity-70">(showing {limit}/page)</span>
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-text-secondary dark:text-dark-muted-foreground">
            Loading subscribers...
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-lg font-semibold text-text-primary dark:text-dark-card-foreground">
              No subscribers found
            </p>
            <p className="mt-2 text-sm text-text-secondary dark:text-dark-muted-foreground">
              Try a different search or filter.
            </p>
          </div>
        ) : (
          // ✅ Vertical scroll for many rows; sticky header; no cramped horizontal scroll on mobile
          <div className="max-h-[62vh] overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-secondary/60 dark:bg-dark-secondary/35 text-text-secondary dark:text-dark-muted-foreground backdrop-blur">
                <tr>
                  <th className="text-left font-semibold px-4 sm:px-6 py-3 sm:py-4">
                    Email
                  </th>
                  <th className="text-left font-semibold px-4 sm:px-6 py-3 sm:py-4">
                    Status
                  </th>

                  {/* ✅ Hide date columns on small screens */}
                  <th className="hidden sm:table-cell text-left font-semibold px-6 py-4">
                    Subscribed
                  </th>
                  <th className="hidden sm:table-cell text-left font-semibold px-6 py-4">
                    Unsubscribed
                  </th>

                  <th className="text-right font-semibold px-4 sm:px-6 py-3 sm:py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {subscribers.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t border-border dark:border-dark-border"
                  >
                    <td className="px-4 sm:px-6 py-2.5 sm:py-4 text-text-primary dark:text-dark-card-foreground font-medium text-[13px] sm:text-sm break-all">
                      {s.email}
                    </td>

                    <td className="px-4 sm:px-6 py-2.5 sm:py-4">
                      <Badge status={s.status} />
                    </td>

                    {/* ✅ Hidden on mobile */}
                    <td className="hidden sm:table-cell px-6 py-4 text-text-secondary dark:text-dark-muted-foreground">
                      {s.subscribedAt
                        ? new Date(s.subscribedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 text-text-secondary dark:text-dark-muted-foreground">
                      {s.unsubscribedAt
                        ? new Date(s.unsubscribedAt).toLocaleString()
                        : "-"}
                    </td>

                    <td className="px-4 sm:px-6 py-2.5 sm:py-4 text-right">
                      <button
                        type="button"
                        disabled={s.status === "unsubscribed"}
                        onClick={() => handleUnsubscribe(s._id)}
                        className={[
                          "inline-flex items-center gap-2 rounded-xl font-semibold border transition-colors",
                          "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm",
                          s.status === "unsubscribed"
                            ? "opacity-50 cursor-not-allowed border-border text-text-secondary dark:text-dark-muted-foreground"
                            : "border-rose-500/30 bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 dark:text-rose-300",
                        ].join(" ")}
                      >
                        <FaBan />
                        Unsubscribe
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-border dark:border-dark-border flex flex-wrap gap-2 justify-center">
            {pages.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={[
                  "h-9 w-9 sm:h-10 sm:w-10 rounded-xl border font-semibold transition-colors text-sm",
                  p === meta.currentPage
                    ? "bg-primary text-white border-primary"
                    : "bg-card dark:bg-dark-card border-border dark:border-dark-border text-text-primary dark:text-dark-card-foreground hover:bg-secondary/40 dark:hover:bg-dark-secondary/30",
                ].join(" ")}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscribers;