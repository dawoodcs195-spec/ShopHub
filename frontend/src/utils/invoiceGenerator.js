import jsPDF from "jspdf";

const formatCurrency = (value) => {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
};

const formatDate = (date) => {
    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleString();
};

const drawRow = (
    doc,
    label,
    value,
    y,
    bold = false,
    color = [0, 0, 0]
) => {
    doc.setFont(
        "helvetica",
        bold ? "bold" : "normal"
    );

    doc.setTextColor(...color);

    doc.text(label, 125, y);

    doc.text(
        formatCurrency(value),
        190,
        y,
        {
            align: "right",
        }
    );

    return y + 8;
};

export const generateInvoice = (order) => {
    const doc = new jsPDF();

    const pageWidth =
        doc.internal.pageSize.getWidth();

    let y = 18;

    // ===============================
    // Header
    // ===============================

    doc.setFillColor(37, 99, 235);
    doc.rect(
        0,
        0,
        pageWidth,
        35,
        "F"
    );

    doc.setFont(
        "helvetica",
        "bold"
    );
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);

    doc.text("ShopHub", 15, 18);

    doc.setFontSize(11);

    doc.text(
        "Professional E-Commerce Invoice",
        15,
        26
    );

    doc.setFontSize(22);

    doc.text(
        "INVOICE",
        pageWidth - 15,
        20,
        {
            align: "right",
        }
    );

    y = 48;

    // ===============================
    // Invoice Details
    // ===============================

    doc.setFont(
        "helvetica",
        "bold"
    );
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);

    doc.text(
        "Invoice Details",
        15,
        y
    );

    y += 8;

    doc.setFont(
        "helvetica",
        "normal"
    );
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    const invoiceNumber = `INV-${new Date(
        order.createdAt
    )
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-${order._id
        .slice(-6)
        .toUpperCase()}`;

    doc.text(
        `Invoice #: ${invoiceNumber}`,
        15,
        y
    );

    doc.text(
        `Order ID: ${order._id}`,
        15,
        y + 7
    );

    doc.text(
        `Order Date: ${formatDate(
            order.createdAt
        )}`,
        15,
        y + 14
    );

    doc.text(
        `Payment: ${order.paymentMethod}`,
        120,
        y
    );

    doc.text(
        `Payment Status: ${
            order.paymentStatus ||
            "Pending"
        }`,
        120,
        y + 7
    );

    doc.text(
        `Order Status: ${
            order.orderStatus
        }`,
        120,
        y + 14
    );

    if (order.transactionId) {
        doc.text(
            `Transaction: ${order.transactionId}`,
            120,
            y + 21
        );
    }

    y += 35;

    // ===============================
    // Shipping Address
    // ===============================

    doc.setFillColor(245, 247, 250);

    doc.roundedRect(
        15,
        y,
        pageWidth - 30,
        38,
        3,
        3,
        "F"
    );

    doc.setFont(
        "helvetica",
        "bold"
    );
    doc.setFontSize(13);
    doc.setTextColor(37, 99, 235);

    doc.text(
        "Shipping Address",
        20,
        y + 8
    );

    doc.setFont(
        "helvetica",
        "normal"
    );
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    doc.text(
        order.shippingAddress
            ?.fullName || "",
        20,
        y + 16
    );

    doc.text(
        order.shippingAddress
            ?.phone || "",
        20,
        y + 22
    );

    doc.text(
        order.shippingAddress
            ?.address || "",
        20,
        y + 28
    );

    doc.text(
        `${order.shippingAddress?.city || ""}, ${
            order.shippingAddress
                ?.postalCode || ""
        }`,
        20,
        y + 34
    );

    y += 50;

    // ===============================
    // Products
    // ===============================

    doc.setFont(
        "helvetica",
        "bold"
    );
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);

    doc.text("Products", 15, y);

    y += 8;

    doc.setFillColor(37, 99, 235);

    doc.rect(
        15,
        y,
        pageWidth - 30,
        9,
        "F"
    );

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);

    doc.text(
        "Product",
        18,
        y + 6
    );

    doc.text(
        "Qty",
        118,
        y + 6
    );

    doc.text(
        "Price",
        145,
        y + 6
    );

    doc.text(
        "Total",
        188,
        y + 6,
        {
            align: "right",
        }
    );

    y += 15;

    doc.setTextColor(0, 0, 0);

    order.orderItems.forEach(
        (item, index) => {
            if (index % 2 === 0) {
                doc.setFillColor(
                    248,
                    250,
                    252
                );

                doc.rect(
                    15,
                    y - 5,
                    pageWidth - 30,
                    10,
                    "F"
                );
            }

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.text(
                item.name,
                18,
                y + 1
            );

            doc.text(
                String(item.quantity),
                118,
                y + 1
            );

            doc.text(
                formatCurrency(
                    item.price
                ),
                145,
                y + 1
            );

            doc.text(
                formatCurrency(
                    item.price *
                        item.quantity
                ),
                188,
                y + 1,
                {
                    align: "right",
                }
            );

            y += 10;
        }
    );

    y += 8;

    // ===============================
    // Totals
    // ===============================

    doc.setDrawColor(
        220,
        220,
        220
    );

    doc.roundedRect(
        118,
        y,
        77,
        45,
        2,
        2
    );

    y += 8;

    y = drawRow(
        doc,
        "Subtotal",
        order.itemsPrice,
        y
    );

    y = drawRow(
        doc,
        "Shipping",
        order.shippingPrice,
        y
    );

    y = drawRow(
        doc,
        "Tax",
        order.taxPrice,
        y
    );

    if (
        order.discount &&
        order.discount > 0
    ) {
        y = drawRow(
            doc,
            order.coupon
                ? `Discount (${order.coupon})`
                : "Discount",
            -order.discount,
            y,
            false,
            [22, 163, 74]
        );
    }

    y += 2;

    doc.setDrawColor(
        200,
        200,
        200
    );

    doc.line(
        122,
        y,
        192,
        y
    );

    y += 7;

    drawRow(
        doc,
        "Grand Total",
        order.totalPrice,
        y,
        true,
        [37, 99, 235]
    );

    // ===============================
    // Footer
    // ===============================

    const footerY = 275;

    doc.setDrawColor(
        230,
        230,
        230
    );

    doc.line(
        15,
        footerY - 8,
        pageWidth - 15,
        footerY - 8
    );

    doc.setFont(
        "helvetica",
        "bold"
    );
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);

    doc.text(
        "Thank you for shopping with ShopHub!",
        pageWidth / 2,
        footerY,
        {
            align: "center",
        }
    );

    doc.setFont(
        "helvetica",
        "normal"
    );
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);

    doc.text(
        "This invoice was generated automatically by ShopHub.",
        pageWidth / 2,
        footerY + 6,
        {
            align: "center",
        }
    );

    doc.save(
        `${invoiceNumber}.pdf`
    );
};