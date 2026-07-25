import { memo, useMemo } from "react";

const AdminOrdersPagination = ({ page, totalPages, count, limit, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, count);

  const pages = useMemo(() => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }, [totalPages]);

  const baseBtn =
    "px-4 py-2 rounded-lg border transition-colors font-semibold";

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
      <div className="text-sm text-text-secondary dark:text-dark-muted-foreground">
        Showing <span className="font-semibold">{startItem}</span> to{" "}
        <span className="font-semibold">{endItem}</span> of{" "}
        <span className="font-semibold">{count}</span> orders
      </div>

      <div className="flex items-center gap-2 flex-wrap">
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

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={[
              "w-10 h-10 rounded-lg border transition-colors font-semibold",
              pageNumber === page
                ? "bg-primary text-white border-primary"
                : "bg-card text-text-primary border-border hover:bg-secondary/40 dark:bg-dark-card dark:text-dark-card-foreground dark:border-dark-border dark:hover:bg-dark-secondary/30",
            ].join(" ")}
          >
            {pageNumber}
          </button>
        ))}

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
  );
};

export default memo(AdminOrdersPagination);