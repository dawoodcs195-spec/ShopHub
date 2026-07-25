import { memo } from "react";
import AdminOrderRow from "./AdminOrderRow";

const AdminOrdersTable = ({ orders, onStatusChange }) => {
  if (orders.length === 0) {
    return (
      <div className="bg-surface dark:bg-dark-card rounded-lg shadow-soft p-12 text-center border border-border dark:border-dark-border">
        <h3 className="text-xl font-serif font-semibold text-text-primary dark:text-dark-card-foreground">
          No Orders Found
        </h3>
        <p className="text-text-secondary dark:text-dark-muted-foreground mt-2">
          Try adjusting or clearing your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-surface dark:bg-dark-card rounded-lg shadow-soft border border-border dark:border-dark-border">
      <table className="min-w-full divide-y divide-border dark:divide-dark-border">
        <thead className="bg-background dark:bg-dark-background">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary dark:text-dark-muted-foreground uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary dark:text-dark-muted-foreground uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary dark:text-dark-muted-foreground uppercase tracking-wider">
              Customer
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary dark:text-dark-muted-foreground uppercase tracking-wider">
              Total
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary dark:text-dark-muted-foreground uppercase tracking-wider">
              Payment
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary dark:text-dark-muted-foreground uppercase tracking-wider">
              Method
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary dark:text-dark-muted-foreground uppercase tracking-wider">
              Order Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border dark:divide-dark-border">
          {orders.map((order) => (
            <AdminOrderRow
              key={order._id}
              order={order}
              onStatusChange={onStatusChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(AdminOrdersTable);