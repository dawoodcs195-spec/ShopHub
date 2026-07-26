import { FaFileCsv, FaFilePdf, FaUndo } from "react-icons/fa";

import Input from "../../../components/forms/Input";
import Select from "../../../components/forms/Select";
import { exportOrdersCsv } from "../../../utils/exportOrdersCsv";
import { exportOrdersPdf } from "../../../utils/exportOrdersPdf";

const AdminOrdersFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  ordersToExport,
}) => {
  const handleChange = (e) => {
    onFilterChange(e.target.name, e.target.value);
  };

  return (
    <div className="mb-6 rounded-2xl border border-border bg-surface p-4 shadow-soft dark:border-dark-border dark:bg-dark-card sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {/* Search */}
        <div className="min-w-0 sm:col-span-2 xl:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-text-secondary dark:text-dark-muted-foreground">
            Search
          </label>

          <Input
            type="text"
            name="search"
            placeholder="By customer, email or ID..."
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        {/* Order status */}
        <div className="min-w-0">
          <label className="mb-1.5 block text-sm font-medium text-text-secondary dark:text-dark-muted-foreground">
            Order Status
          </label>

          <Select
            name="orderStatus"
            value={filters.orderStatus}
            onChange={handleChange}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
        </div>

        {/* Payment status */}
        <div className="min-w-0">
          <label className="mb-1.5 block text-sm font-medium text-text-secondary dark:text-dark-muted-foreground">
            Payment Status
          </label>

          <Select
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={handleChange}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
          </Select>
        </div>

        {/* Payment method */}
        <div className="min-w-0">
          <label className="mb-1.5 block text-sm font-medium text-text-secondary dark:text-dark-muted-foreground">
            Payment Method
          </label>

          <Select
            name="paymentMethod"
            value={filters.paymentMethod}
            onChange={handleChange}
          >
            <option value="">All</option>
            <option value="Stripe">Stripe</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </Select>
        </div>

        {/* Start date */}
        <div className="min-w-0">
          <label className="mb-1.5 block text-sm font-medium text-text-secondary dark:text-dark-muted-foreground">
            Start Date
          </label>

          <Input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
          />
        </div>

        {/* End date */}
        <div className="min-w-0">
          <label className="mb-1.5 block text-sm font-medium text-text-secondary dark:text-dark-muted-foreground">
            End Date
          </label>

          <Input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 dark:border-dark-border sm:flex-row sm:flex-wrap sm:items-center">
        <button
          onClick={onClearFilters}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-dark-border dark:bg-dark-background dark:hover:bg-dark-secondary/30 sm:w-auto"
          type="button"
        >
          <FaUndo />
          Reset Filters
        </button>

        <div className="flex w-full flex-col gap-3 sm:ml-auto sm:w-auto sm:flex-row">
          <button
            onClick={() => exportOrdersCsv(ordersToExport)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-600/10 px-4 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25 sm:w-auto"
            type="button"
          >
            <FaFileCsv />
            Export CSV
          </button>

          <button
            onClick={() => exportOrdersPdf(ordersToExport)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600/10 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/30 dark:bg-red-500/15 dark:text-red-200 dark:hover:bg-red-500/25 sm:w-auto"
            type="button"
          >
            <FaFilePdf />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersFilters;