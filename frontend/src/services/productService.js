import api from "./api";

export const getProducts = async () => {
    const response = await api.get("/products");
    return response.data.products;
};

export const createProduct = async (productData, token) => {
    const response = await api.post("/products", productData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const updateProduct = async (id, productData, token) => {
    const response = await api.put(
        `/products/${id}`,
        productData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const deleteProduct = async (id, token) => {
    const response = await api.delete(`/products/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};