const orderSteps = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
];

const OrderTimeline = ({ order }) => {
    const currentStep = orderSteps.indexOf(
        order.orderStatus
    );

    return (
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-bold mb-5">
                Order Tracking
            </h3>

            <div className="flex items-start justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300 rounded-full">
                    <div
                        className="h-1 bg-green-500 rounded-full transition-all duration-500"
                        style={{
                            width:
                                currentStep <= 0
                                    ? "0%"
                                    : `${(currentStep / (orderSteps.length - 1)) * 100}%`,
                        }}
                    />
                </div>

                {orderSteps.map(
                    (step, index) => {
                        const completed =
                            index <= currentStep;

                        const active =
                            index === currentStep;

                        return (
                            <div
                                key={step}
                                className="relative z-10 flex flex-col items-center flex-1"
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-4 ${
                                        completed
                                            ? "bg-green-600 border-green-600 text-white"
                                            : "bg-white border-gray-300 text-gray-500"
                                    }`}
                                >
                                    {index + 1}
                                </div>

                                <p
                                    className={`mt-3 text-sm font-semibold text-center ${
                                        active
                                            ? "text-green-600"
                                            : completed
                                            ? "text-gray-800"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {step}
                                </p>
                            </div>
                        );
                    }
                )}
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4 border">
                    <p className="font-semibold mb-2">
                        Order Placed
                    </p>

                    <p className="text-gray-600">
                        {new Date(
                            order.createdAt
                        ).toLocaleString()}
                    </p>
                </div>

                {order.isDelivered &&
                    order.deliveredAt && (
                        <div className="bg-white rounded-lg p-4 border">
                            <p className="font-semibold mb-2">
                                Delivered
                            </p>

                            <p className="text-green-600 font-medium">
                                {new Date(
                                    order.deliveredAt
                                ).toLocaleString()}
                            </p>
                        </div>
                    )}

                {order.paymentStatus ===
                    "Paid" && (
                    <div className="bg-white rounded-lg p-4 border">
                        <p className="font-semibold mb-2">
                            Payment
                        </p>

                        <p className="text-green-600 font-medium">
                            Paid Successfully
                        </p>
                    </div>
                )}

                {order.paymentMethod && (
                    <div className="bg-white rounded-lg p-4 border">
                        <p className="font-semibold mb-2">
                            Payment Method
                        </p>

                        <p className="text-gray-700">
                            {order.paymentMethod}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTimeline;