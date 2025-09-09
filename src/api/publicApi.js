import axios from 'axios';

// This uses a new, simple Axios instance because it doesn't need an auth token
const publicApi = axios.create({
    baseURL: 'http://localhost:5000/api/public',
});

export const getPublicProducts = async () => {
    const { data } = await publicApi.get('/products');
    return data;
};