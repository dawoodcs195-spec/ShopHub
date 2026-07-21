import api from "./api";

export const createReview = async (
    productId,
    reviewData,
    token
) => {
    const response = await api.post(
        `/products/${productId}/reviews`,
        reviewData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};