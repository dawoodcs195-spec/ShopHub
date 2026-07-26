const filterOptions = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "This Month", value: "this_month" },
  { label: "This Year", value: "this_year" },
  { label: "All Time", value: "all" },
];

const DashboardFilters = ({ onFilterChange, activeFilter }) => {
  return (
    <div className="mb-8 bg-secondary dark:bg-dark-secondary border border-black/5 dark:border-white/10 p-3 sm:p-4 rounded-xl shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-muted-foreground dark:text-dark-muted-foreground mr-2">
          Filter by period:
        </span>

        {filterOptions.map((option) => {
          const isActive = activeFilter === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={[
                // slightly smaller on very small screens to fit cleaner
                "px-3 py-1.5 sm:px-4 sm:py-2 text-[13px] sm:text-sm font-semibold rounded-full",
                "transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-black/5 text-card-foreground hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 dark:text-dark-card-foreground",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardFilters;