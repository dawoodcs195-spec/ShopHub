import AdminOrderRow from "./AdminOrderRow";

const AdminOrdersTable = ({
    orders,
    onStatusChange,
}) => {
    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-700">
                    No orders found
                </h3>

                <p className="text-gray-500 mt-2">
                    Try changing your search or filters.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="p-4 text-left">
                            Order ID
                        </th>

                        <th className="p-4 text-left">
                            Date
                        </th>

                        <th className="p-4 text-left">
                            Customer
                        </th>

                        <th className="p-4 text-left">
                            Items
                        </th>

                        <th className="p-4 text-left">
                            Total
                        </th>

                        <th className="p-4 text-left">
                            Payment Method
                        </th>

                        <th className="p-4 text-left">
                            Payment Status
                        </th>

                        <th className="p-4 text-left">
                            Transaction
                        </th>

                        <th className="p-4 text-left">
                            Paid At
                        </th>

                        <th className="p-4 text-left">
                            Order Status
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => (
                        <AdminOrderRow
                            key={order._id}
                            order={{
                                ...order,
                                shortId:
                                    order._id.slice(
                                        -8
                                    ),
                            }}
                            onStatusChange={
                                onStatusChange
                            }
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrdersTable;