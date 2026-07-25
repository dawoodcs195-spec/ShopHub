const AdminOrdersToolbar = ({ totalOrders }) => {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-serif font-bold text-text-primary dark:text-dark-card-foreground">
        Manage Orders
      </h1>

      <p className="text-text-secondary dark:text-dark-muted-foreground mt-1">
        {totalOrders > 0
          ? `A total of ${totalOrders} orders found.`
          : "No orders found for the current filters."}
      </p>
    </header>
  );
};

export default AdminOrdersToolbar;