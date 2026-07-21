import api from "./api";

// ===============================
// Get Wishlist
// ===============================
export const getWishlist = async (token) => {
    const response = await api.get("/users/wishlist", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data.wishlist;
};

// ===============================
// Toggle Wishlist
// ===============================
export const toggleWishlist = async (
    productId,
    token
) => {
    const response = await api.post(
        `/users/wishlist/${productId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};