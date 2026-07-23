import { useCart } from "../../../context/CartContext";

const OrderSummary = ({
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
}) => {
    const { discount, appliedCoupon } = useCart();

    const finalTotal = Math.max(
        itemsPrice +
            shippingPrice +
            taxPrice -
            discount,
        0
    );

    return (
        <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-2xl font-bold mb-6">
                Order Summary
            </h2>

            <div className="space-y-3 mb-5">
                {cartItems.map((item) => (
                    <div
                        key={item._id}
                        className="flex justify-between text-sm"
                    >
                        <span>
                            {item.name} × {item.quantity}
                        </span>

                        <span>
                            Rs.{" "}
                            {item.price * item.quantity}
                        </span>
                    </div>
                ))}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between mb-2">
                <span>Subtotal</span>

                <span>Rs. {itemsPrice}</span>
            </div>

            <div className="flex justify-between mb-2">
                <span>Shipping</span>

                <span>Rs. {shippingPrice}</span>
            </div>

            <div className="flex justify-between mb-2">
                <span>Tax</span>

                <span>Rs. {taxPrice}</span>
            </div>

            {appliedCoupon && (
                <div className="flex justify-between mb-2 text-green-600 font-semibold">
                    <span>
                        Coupon ({appliedCoupon.code})
                    </span>

                    <span>- Rs. {discount}</span>
                </div>
            )}

            <hr className="my-4" />

            <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>

                <span className="text-blue-600">
                    Rs. {finalTotal}
                </span>
            </div>
        </div>
    );
};

export default OrderSummary;