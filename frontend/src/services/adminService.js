import api from "./api";

export const getDashboardStats = async (token, period = "all") => {
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

// ===============================
// Newsletter Subscribers (Admin)
// ===============================
export const getNewsletterSubscribers = async (
  token,
  { keyword = "", status = "", page = 1, limit = 12 } = {}
) => {
  const response = await api.get("/newsletter/subscribers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { keyword, status, page, limit },
  });

  return response.data;
};

export const unsubscribeNewsletterSubscriber = async (id, token) => {
  const response = await api.patch(
    `/newsletter/subscribers/${id}/unsubscribe`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};