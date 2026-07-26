import { memo, useMemo } from "react";
import AdminOrderRow, { OrderStatusDropdown, getPaymentStatusPill } from "./AdminOrderRow";

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

  const MobileOrderCard = ({ order }) => {
    const shortId = order?._id ? order._id.slice(-6).toUpperCase() : "";
    const createdAtDate = order?.createdAt
      ? new Date(order.createdAt).toLocaleDateString()
      : "";

    return (
      <div className="bg-surface dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl shadow-soft p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-text-secondary dark:text-dark-muted-foreground">
              Order #{shortId}
            </p>
            <p className="mt-1 text-sm font-semibold text-text-primary dark:text-dark-card-foreground truncate">
              {order?.user?.name || "Customer"}
            </p>
            <p className="mt-0.5 text-xs text-text-secondary dark:text-dark-muted-foreground truncate">
              {order?.user?.email || ""}
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs text-text-secondary dark:text-dark-muted-foreground">
              Total
            </p>
            <p className="text-lg font-bold text-primary">
              Rs. {Number(order?.totalPrice || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-background p-3">
            <p className="text-xs text-text-secondary dark:text-dark-muted-foreground">
              Date
            </p>
            <p className="mt-1 font-semibold text-text-primary dark:text-dark-card-foreground">
              {createdAtDate}
            </p>
          </div>

          <div className="rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-background p-3">
            <p className="text-xs text-text-secondary dark:text-dark-muted-foreground">
              Payment
            </p>
            <div className="mt-1">
              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStatusPill(
                  order?.paymentStatus
                )}`}
              >
                {order?.paymentStatus}
              </span>
            </div>
          </div>

          <div className="col-span-2 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-background p-3">
            <p className="text-xs text-text-secondary dark:text-dark-muted-foreground">
              Method
            </p>
            <p className="mt-1 font-semibold text-text-primary dark:text-dark-card-foreground">
              {order?.paymentMethod}
            </p>
          </div>

          <div className="col-span-2">
            <p className="text-xs text-text-secondary dark:text-dark-muted-foreground mb-2">
              Order Status
            </p>
            <OrderStatusDropdown
              value={order.orderStatus}
              onChange={(next) => onStatusChange(order._id, next)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <MobileOrderCard key={order._id} order={order} />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto bg-surface dark:bg-dark-card rounded-lg shadow-soft border border-border dark:border-dark-border">
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
    </>
  );
};

export default memo(AdminOrdersTable);