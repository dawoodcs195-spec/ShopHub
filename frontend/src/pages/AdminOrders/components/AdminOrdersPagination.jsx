import { memo, useMemo } from "react";

const AdminOrdersPagination = ({ page, totalPages, count, limit, onPageChange }) => {
  if (totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, count);

  const pages = useMemo(() => {
    // Compact pagination: 1 … (page-1) page (page+1) … last
    const set = new Set();

    const clamp = (n) => Math.max(1, Math.min(totalPages, n));

    set.add(1);
    set.add(totalPages);

    // current window
    [page - 1, page, page + 1].forEach((n) => set.add(clamp(n)));

    // slightly wider window for small totals
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) set.add(i);
    }

    const arr = Array.from(set).sort((a, b) => a - b);

    // insert ellipsis markers
    const out = [];
    for (let i = 0; i < arr.length; i++) {
      out.push(arr[i]);
      if (i < arr.length - 1 && arr[i + 1] - arr[i] > 1) {
        out.push("ellipsis");
      }
    }
    return out;
  }, [page, totalPages]);

  const baseBtn =
    "px-4 py-2 rounded-xl border transition-colors font-semibold text-sm";

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-6">
      <div className="text-sm text-text-secondary dark:text-dark-muted-foreground">
        Showing <span className="font-semibold">{startItem}</span> to{" "}
        <span className="font-semibold">{endItem}</span> of{" "}
        <span className="font-semibold">{count}</span> orders
      </div>

      <div className="w-full md:w-auto overflow-x-auto">
        <div className="flex items-center gap-2 flex-nowrap min-w-max pb-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className={[
              baseBtn,
              page === 1
                ? "bg-secondary/50 text-text-secondary cursor-not-allowed border-border dark:bg-dark-secondary/30 dark:text-dark-muted-foreground dark:border-dark-border"
                : "bg-card text-text-primary border-border hover:bg-secondary/40 dark:bg-dark-card dark:text-dark-card-foreground dark:border-dark-border dark:hover:bg-dark-secondary/30",
            ].join(" ")}
          >
            Previous
          </button>

          {pages.map((p, idx) =>
            p === "ellipsis" ? (
              <span
                key={`e-${idx}`}
                className="px-2 text-text-secondary dark:text-dark-muted-foreground"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={[
                  "w-10 h-10 rounded-xl border transition-colors font-semibold text-sm",
                  p === page
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
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className={[
              baseBtn,
              page === totalPages
                ? "bg-secondary/50 text-text-secondary cursor-not-allowed border-border dark:bg-dark-secondary/30 dark:text-dark-muted-foreground dark:border-dark-border"
                : "bg-card text-text-primary border-border hover:bg-secondary/40 dark:bg-dark-card dark:text-dark-card-foreground dark:border-dark-border dark:hover:bg-dark-secondary/30",
            ].join(" ")}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(AdminOrdersPagination);