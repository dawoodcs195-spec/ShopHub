const PaymentMethod = ({
    selectedPayment,
    setSelectedPayment,
}) => {
    return (
        <>
            <h2 className="text-2xl font-bold mt-6 mb-4">
                Payment Method
            </h2>

            <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        value="Stripe"
                        checked={
                            selectedPayment ===
                            "Stripe"
                        }
                        onChange={() =>
                            setSelectedPayment(
                                "Stripe"
                            )
                        }
                    />

                    <span>
                        Stripe (Card Payment)
                    </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        value="Cash on Delivery"
                        checked={
                            selectedPayment ===
                            "Cash on Delivery"
                        }
                        onChange={() =>
                            setSelectedPayment(
                                "Cash on Delivery"
                            )
                        }
                    />

                    <span>
                        Cash on Delivery
                    </span>
                </label>
            </div>
        </>
    );
};

export default PaymentMethod;