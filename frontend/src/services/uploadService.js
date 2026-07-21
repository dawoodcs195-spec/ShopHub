import api from "./api";

// ===============================
// Product Upload
// ===============================
export const uploadImage = async (
    file,
    token
) => {
    const formData = new FormData();

    formData.append("image", file);

    const response = await api.post(
        "/upload",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

    return response.data.image;
};

// ===============================
// Avatar Upload
// ===============================
export const uploadAvatar = async (
    file,
    token
) => {
    const formData = new FormData();

    formData.append("image", file);

    const response = await api.post(
        "/upload/avatar",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

    return response.data.avatar;
};