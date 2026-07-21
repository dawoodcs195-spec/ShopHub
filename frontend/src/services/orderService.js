import api from "./api";

export const createOrder = async (orderData, token) => {
    const response = await api.post(
        "/orders",
        orderData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getMyOrders = async (token) => {
    const response = await api.get("/orders/my-orders", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data.orders;
};

export const getAllOrders = async (token) => {
    const response = await api.get("/orders", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data.orders;
};

export const updateOrderStatus = async (
    id,
    orderStatus,
    token
) => {
    const response = await api.put(
        `/orders/${id}`,
        { orderStatus },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};