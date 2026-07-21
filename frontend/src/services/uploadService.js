import api from "./api";

export const uploadImage = async (file, token) => {
    const formData = new FormData();

    formData.append("image", file);

    const response = await api.post("/upload", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.image;
};