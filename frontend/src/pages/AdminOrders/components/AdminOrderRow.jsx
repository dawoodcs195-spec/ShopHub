import { memo, useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const getPaymentStatusPill = (status) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-800 dark:bg-emerald-500/15 dark:text-emerald-200";
    case "Failed":
      return "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200";
    default:
      return "bg-yellow-100 text-yellow-800 dark:bg-amber-500/15 dark:text-amber-200";
  }
};

export const getOrderStatusPill = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800 dark:bg-emerald-500/15 dark:text-emerald-200";
    case "Shipped":
      return "bg-blue-100 text-blue-800 dark:bg-sky-500/15 dark:text-sky-200";
    case "Processing":
      return "bg-yellow-100 text-yellow-800 dark:bg-amber-500/15 dark:text-amber-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white";
  }
};

export const OrderStatusDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleSelect = (next) => {
    if (next !== value) onChange(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          "inline-flex items-center justify-between gap-2",
          "min-w-[160px] rounded-full border px-3 py-2 text-xs font-semibold",
          "transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40",
          "border-border bg-card text-text-primary hover:bg-secondary/40",
          "dark:border-dark-border dark:bg-dark-card dark:text-dark-card-foreground dark:hover:bg-dark-secondary/30",
          getOrderStatusPill(value),
        ].join(" ")}
      >
        <span className="truncate">{value}</span>
        <FaChevronDown className="shrink-0 opacity-80" size={12} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Order status"
          className={[
            "absolute right-0 mt-2 z-50 w-56 overflow-hidden",
            "rounded-2xl border shadow-2xl",
            "border-border bg-card",
            "dark:border-dark-border dark:bg-dark-card",
          ].join(" ")}
        >
          <div className="py-2">
            {ORDER_STATUSES.map((s) => {
              const active = s === value;

              return (
                <button
                  key={s}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handleSelect(s)}
                  className={[
                    "w-full px-4 py-2.5 text-left text-sm transition-colors",
                    "text-text-primary dark:text-dark-card-foreground",
                    active
                      ? "bg-secondary/60 dark:bg-dark-secondary/35"
                      : "hover:bg-secondary/40 dark:hover:bg-dark-secondary/25",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      getOrderStatusPill(s),
                    ].join(" ")}
                  >
                    {s}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminOrderRow = ({ order, onStatusChange }) => {
  const shortId = useMemo(() => order._id.slice(-6).toUpperCase(), [order._id]);
  const createdAtDate = useMemo(
    () => new Date(order.createdAt).toLocaleDateString(),
    [order.createdAt]
  );

  return (
    <tr className="border-b border-border dark:border-dark-border hover:bg-secondary/30 dark:hover:bg-dark-secondary/25 transition-colors">
      <td className="px-4 py-3 whitespace-nowrap font-mono text-sm text-primary font-semibold">
        #{shortId}
      </td>

      <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary dark:text-dark-muted-foreground">
        {createdAtDate}
      </td>

      <td className="px-4 py-3">
        <div className="font-semibold text-text-primary dark:text-dark-card-foreground">
          {order.user?.name}
        </div>
        <div className="text-sm text-text-secondary dark:text-dark-muted-foreground">
          {order.user?.email}
        </div>
      </td>

      <td className="px-4 py-3 whitespace-nowrap text-text-primary dark:text-dark-card-foreground font-semibold">
        Rs. {order.totalPrice.toLocaleString()}
      </td>

      <td className="px-4 py-3">
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStatusPill(
            order.paymentStatus
          )}`}
        >
          {order.paymentStatus}
        </span>
      </td>

      <td className="px-4 py-3 text-sm text-text-secondary dark:text-dark-card-foreground/80">
        {order.paymentMethod}
      </td>

      <td className="px-4 py-3">
        <OrderStatusDropdown
          value={order.orderStatus}
          onChange={(next) => onStatusChange(order._id, next)}
        />
      </td>
    </tr>
  );
};

export default memo(AdminOrderRow);