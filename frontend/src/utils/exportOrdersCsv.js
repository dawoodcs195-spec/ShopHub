const BRAND_NAME = "Diya Expressions";

const escapeCsv = (value) => {
    if (value === null || value === undefined) {
        return "";
    }

    const stringValue = String(value).replace(
        /"/g,
        '""'
    );

    return `"${stringValue}"`;
};

export const exportOrdersCsv = (
    orders
) => {
    if (!orders.length) {
        return;
    }

    const headers = [
        "Order ID",
        "Customer",
        "Email",
        "Items",
        "Subtotal",
        "Shipping",
        "Discount",
        "Total",
        "Payment Method",
        "Payment Status",
        "Order Status",
        "Coupon",
        "Transaction ID",
        "Created At",
    ];

    const rows = orders.map((order) => [
        order._id,
        order.user?.name || "",
        order.user?.email || "",
        order.orderItems.length,
        order.itemsPrice,
        order.shippingPrice,
        order.discount || 0,
        order.totalPrice,
        order.paymentMethod,
        order.paymentStatus,
        order.orderStatus,
        order.coupon || "",
        order.transactionId || "",
        new Date(
            order.createdAt
        ).toLocaleString(),
    ]);

    const csv = [
        headers.map(escapeCsv).join(","),
        ...rows.map((row) =>
            row.map(escapeCsv).join(",")
        ),
    ].join("\n");

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
    });

    const url =
        window.URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    const date = new Date()
        .toISOString()
        .slice(0, 10);

    link.href = url;
    link.download = `Diya-Expressions-Orders-${date}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
};