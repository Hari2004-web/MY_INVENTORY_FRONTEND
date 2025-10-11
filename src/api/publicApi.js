import axios from 'axios';

// This uses a new, simple Axios instance because it doesn't need an auth token
const publicApi = axios.create({
    baseURL: 'http://localhost:5000/api/public',
});

export const getPublicProducts = async () => {
    const { data } = await publicApi.get('/products');
    return data;
};


// ADD THIS NEW FUNCTION
export const getRecommendedProducts = async () => {
    const { data } = await publicApi.get('/products/recommended');
    return data;
};

// ADD THIS NEW FUNCTION
export const getProductsByCategory = async (category) => {
    const { data } = await publicApi.get(`/products/category/${category}`);
    return data;
};

// ADD THIS NEW FUNCTION
export const getPublicProductById = async (id) => {
    const { data } = await publicApi.get(`/product/${id}`);
    return data;
};

// ---API for getting the offered products---
export const getOfferedProducts = async () => {
    const { data } = await publicApi.get('/products/offers');
    return data;
}   