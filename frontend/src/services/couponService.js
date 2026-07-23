import api from "./api";

// ===============================
// Create Coupon
// ===============================
export const createCoupon = async (
    couponData,
    token
) => {
    const response = await api.post(
        "/coupons",
        couponData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ===============================
// Get All Coupons
// ===============================
export const getCoupons = async (token) => {
    const response = await api.get(
        "/coupons",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data.coupons;
};

// ===============================
// Get Single Coupon
// ===============================
export const getCoupon = async (
    id,
    token
) => {
    const response = await api.get(
        `/coupons/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data.coupon;
};

// ===============================
// Update Coupon
// ===============================
export const updateCoupon = async (
    id,
    couponData,
    token
) => {
    const response = await api.put(
        `/coupons/${id}`,
        couponData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ===============================
// Delete Coupon
// ===============================
export const deleteCoupon = async (
    id,
    token
) => {
    const response = await api.delete(
        `/coupons/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ===============================
// Validate Coupon
// ===============================
export const validateCoupon = async (
    code,
    total
) => {
    const response = await api.post(
        "/coupons/validate",
        {
            code,
            total,
        }
    );

    return response.data;
};