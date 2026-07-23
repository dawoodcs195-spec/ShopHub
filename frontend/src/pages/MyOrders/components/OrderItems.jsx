const OrderItems = ({ orderItems }) => {
    return (
        <div className="space-y-4">
            {orderItems.map((item) => (
                <div
                    key={item.product}
                    className="flex items-center gap-4"
                >
                    <img
                        src={
                            item.image?.url ||
                            "https://placehold.co/80x80?text=No+Image"
                        }
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover border"
                    />

                    <div className="flex-1">
                        <h2 className="font-semibold">
                            {item.name}
                        </h2>

                        <p className="text-gray-500">
                            Qty: {item.quantity}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="font-bold text-blue-600">
                            Rs.{" "}
                            {Number(
                                item.price
                            ).toLocaleString()}
                        </p>

                        <p className="text-sm text-gray-500">
                            Total: Rs.{" "}
                            {Number(
                                item.price *
                                    item.quantity
                            ).toLocaleString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderItems;