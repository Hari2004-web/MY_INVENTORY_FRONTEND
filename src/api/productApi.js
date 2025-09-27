// src/api/productApi.js

import API from "../utils/fetchWrapper";

export const getProducts = async (category = '') => {
  // Append category as a query parameter if it exists
  const url = category ? `/products?category=${category}` : "/products";
  const { data } = await API.get(url);
  return data;
};

export const createProduct = async (formData) => {
  const { data } = await API.post("/products", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const updateProduct = async (id, formData) => {
  const { data } = await API.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteProduct = async (id) => {
  return API.delete(`/products/${id}`);
};

export const getProductById = async (id) => {
  const { data } = await API.get(`/products/${id}`);
  return data;
};