import { FaFilePdf } from "react-icons/fa";

const OrderSummaryCard = ({
    order,
    onDownloadInvoice,
}) => {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>

                    <span>
                        Rs.{" "}
                        {Number(
                            order.itemsPrice
                        ).toLocaleString()}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>Shipping</span>

                    <span>
                        Rs.{" "}
                        {Number(
                            order.shippingPrice
                        ).toLocaleString()}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>Tax</span>

                    <span>
                        Rs.{" "}
                        {Number(
                            order.taxPrice
                        ).toLocaleString()}
                    </span>
                </div>

                {order.discount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                        <span>
                            Discount
                            {order.coupon
                                ? ` (${order.coupon})`
                                : ""}
                        </span>

                        <span>
                            - Rs.{" "}
                            {Number(
                                order.discount
                            ).toLocaleString()}
                        </span>
                    </div>
                )}

                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                    <span>Grand Total</span>

                    <span className="text-blue-600">
                        Rs.{" "}
                        {Number(
                            order.totalPrice
                        ).toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="flex flex-col justify-end items-start md:items-end gap-4">
                <button
                    type="button"
                    onClick={
                        onDownloadInvoice
                    }
                    className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                    <FaFilePdf />

                    <span>
                        Download Invoice
                    </span>
                </button>

                {order.coupon && (
                    <div className="text-sm text-green-600 font-medium">
                        Coupon Applied:{" "}
                        {order.coupon}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderSummaryCard;