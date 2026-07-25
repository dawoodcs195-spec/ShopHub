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
    <div className="bg-surface dark:bg-dark-card rounded-lg shadow-soft p-6 mb-6 border border-border dark:border-dark-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
        <div className="xl:col-span-2">
          <label className="block text-sm font-medium text-text-secondary dark:text-dark-muted-foreground mb-1">
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

        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-dark-muted-foreground mb-1">
            Order Status
          </label>
          <Select name="orderStatus" value={filters.orderStatus} onChange={handleChange}>
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-dark-muted-foreground mb-1">
            Payment Status
          </label>
          <Select name="paymentStatus" value={filters.paymentStatus} onChange={handleChange}>
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-dark-muted-foreground mb-1">
            Payment Method
          </label>
          <Select name="paymentMethod" value={filters.paymentMethod} onChange={handleChange}>
            <option value="">All</option>
            <option value="Stripe">Stripe</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </Select>
        </div>

        <div className="flex gap-2">
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-muted-foreground mb-1">
              Start Date
            </label>
            <Input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-muted-foreground mb-1">
              End Date
            </label>
            <Input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-border dark:border-dark-border">
        <button
          onClick={onClearFilters}
          className="flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
          type="button"
        >
          <FaUndo /> Reset Filters
        </button>

        <div className="sm:ml-auto flex gap-3">
          <button
            onClick={() => exportOrdersCsv(ordersToExport)}
            className="flex items-center gap-2 text-sm bg-green-600/10 dark:bg-emerald-500/15 text-green-700 dark:text-emerald-300 font-semibold px-4 py-2 rounded-lg hover:bg-green-600/20 dark:hover:bg-emerald-500/25 transition-colors"
            type="button"
          >
            <FaFileCsv /> Export CSV
          </button>

          <button
            onClick={() => exportOrdersPdf(ordersToExport)}
            className="flex items-center gap-2 text-sm bg-red-600/10 dark:bg-red-500/15 text-red-700 dark:text-red-200 font-semibold px-4 py-2 rounded-lg hover:bg-red-600/20 dark:hover:bg-red-500/25 transition-colors"
            type="button"
          >
            <FaFilePdf /> Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersFilters;