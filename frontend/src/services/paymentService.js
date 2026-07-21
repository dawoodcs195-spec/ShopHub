import api from "./api";

export const createPaymentIntent = async (amount, token) => {
    const response = await api.post(
        "/payments/create-payment-intent",
        { amount },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};