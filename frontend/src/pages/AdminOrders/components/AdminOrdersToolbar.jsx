const AdminOrdersToolbar = ({ totalOrders }) => {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-primary dark:text-dark-card-foreground sm:text-4xl">
            Manage Orders
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-secondary dark:text-dark-muted-foreground sm:text-base">
            {totalOrders > 0
              ? `A total of ${totalOrders} orders found.`
              : "No orders found for the current filters."}
          </p>
        </div>

        {totalOrders > 0 && (
          <div className="mt-2 self-start rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary shadow-sm dark:border-dark-border dark:bg-dark-card dark:text-dark-card-foreground sm:mt-0 sm:self-auto">
            {totalOrders} {totalOrders === 1 ? "order" : "orders"}
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminOrdersToolbar;