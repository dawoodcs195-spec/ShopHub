import api from "./api";

export const getDashboardStats = async (token) => {
    const response = await api.get("/admin/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data.dashboard;
};