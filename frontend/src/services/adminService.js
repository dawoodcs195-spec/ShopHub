import api from "./api";

export const getDashboardStats = async (token, period = 'all') => {
    const response = await api.get("/admin/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            period,
        },
    });

    return response.data.dashboard;
};