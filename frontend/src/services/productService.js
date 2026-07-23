import api from "./api";

export const getProducts = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.keyword) {
        params.append("keyword", filters.keyword);
    }

    if (filters.category) {
        params.append("category", filters.category);
    }

    if (filters.brand) {
        params.append("brand", filters.brand);
    }

    if (
        filters.minPrice !== undefined &&
        filters.minPrice !== ""
    ) {
        params.append("minPrice", filters.minPrice);
    }

    if (
        filters.maxPrice !== undefined &&
        filters.maxPrice !== ""
    ) {
        params.append("maxPrice", filters.maxPrice);
    }

    if (filters.rating) {
        params.append("rating", filters.rating);
    }

    if (filters.sort) {
        params.append("sort", filters.sort);
    }

    if (filters.page) {
        params.append("page", filters.page);
    }

    if (filters.limit) {
        params.append("limit", filters.limit);
    }

    const query = params.toString();

    const response = await api.get(
        `/products${query ? `?${query}` : ""}`
    );

    return response.data;
};

export const createProduct = async (
    productData,
    token
) => {
    const response = await api.post(
        "/products",
        productData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const updateProduct = async (
    id,
    productData,
    token
) => {
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

export const deleteProduct = async (
    id,
    token
) => {
    const response = await api.delete(
        `/products/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};