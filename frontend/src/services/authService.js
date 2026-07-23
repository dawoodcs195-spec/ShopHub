import api from "./api";

// ===============================
// Login
// ===============================
export const loginUser = async (
    email,
    password
) => {
    const response = await api.post(
        "/users/login",
        {
            email,
            password,
        }
    );

    return response.data;
};

// ===============================
// Register
// ===============================
export const registerUser = async (
    name,
    email,
    password
) => {
    const response = await api.post(
        "/users/register",
        {
            name,
            email,
            password,
        }
    );

    return response.data;
};

// ===============================
// Forgot Password
// ===============================
export const forgotPassword = async (
    email
) => {
    const response = await api.post(
        "/users/forgot-password",
        {
            email,
        }
    );

    return response.data;
};

// ===============================
// Reset Password
// ===============================
export const resetPassword = async (
    token,
    password
) => {
    const response = await api.put(
        `/users/reset-password/${token}`,
        {
            password,
        }
    );

    return response.data;
};

// ===============================
// Get Profile
// ===============================
export const getUserProfile = async (
    token
) => {
    const response = await api.get(
        "/users/profile",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data.user;
};

// ===============================
// Update Profile
// ===============================
export const updateUserProfile = async (
    userData,
    token
) => {
    const response = await api.put(
        "/users/profile",
        userData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// ===============================
// Change Password
// ===============================
export const changePassword = async (
    passwordData,
    token
) => {
    const response = await api.put(
        "/users/change-password",
        passwordData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};