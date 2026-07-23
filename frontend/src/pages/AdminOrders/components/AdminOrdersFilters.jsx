const AdminOrdersFilters = ({
    filters,
    onFilterChange,
    onClearFilters,
}) => {
    const handleChange = (field) => (e) => {
        onFilterChange(field, e.target.value);
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <input
                    type="text"
                    placeholder="Search by name, email or order ID"
                    value={filters.search}
                    onChange={handleChange("search")}
                    className="border rounded-lg px-3 py-2 lg:col-span-2"
                />

                <select
                    value={filters.orderStatus}
                    onChange={handleChange("orderStatus")}
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="">
                        All Order Status
                    </option>

                    <option value="Pending">
                        Pending
                    </option>

                    <option value="Processing">
                        Processing
                    </option>

                    <option value="Shipped">
                        Shipped
                    </option>

                    <option value="Delivered">
                        Delivered
                    </option>

                    <option value="Cancelled">
                        Cancelled
                    </option>
                </select>

                <select
                    value={filters.paymentStatus}
                    onChange={handleChange("paymentStatus")}
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="">
                        All Payment Status
                    </option>

                    <option value="Pending">
                        Pending
                    </option>

                    <option value="Paid">
                        Paid
                    </option>

                    <option value="Failed">
                        Failed
                    </option>
                </select>

                <select
                    value={filters.paymentMethod}
                    onChange={handleChange("paymentMethod")}
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="">
                        All Payment Methods
                    </option>

                    <option value="Stripe">
                        Stripe
                    </option>

                    <option value="Cash on Delivery">
                        Cash On Delivery
                    </option>
                </select>

                <div className="flex gap-2">
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={handleChange("startDate")}
                        className="border rounded-lg px-3 py-2 w-full"
                    />

                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={handleChange("endDate")}
                        className="border rounded-lg px-3 py-2 w-full"
                    />
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
};

export default AdminOrdersFilters;