import { FaFileCsv, FaFilePdf } from "react-icons/fa";

import { exportOrdersCsv } from "../../../utils/exportOrdersCsv";
import { exportOrdersPdf } from "../../../utils/exportOrdersPdf";

const AdminOrdersToolbar = ({
    orders,
}) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
                <h2 className="text-2xl font-bold">
                    Orders
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                    Total Orders:{" "}
                    {orders.length}
                </p>
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() =>
                        exportOrdersCsv(
                            orders
                        )
                    }
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                    <FaFileCsv />

                    <span>
                        Export CSV
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() =>
                        exportOrdersPdf(
                            orders
                        )
                    }
                    className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                    <FaFilePdf />

                    <span>
                        Export PDF
                    </span>
                </button>
            </div>
        </div>
    );
};

export default AdminOrdersToolbar;