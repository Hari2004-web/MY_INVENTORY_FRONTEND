// src/api/userApi.js

import API from "../utils/fetchWrapper";

// --- Admin/Manager User Management ---
export const getUsers = async () => {
  const { data } = await API.get("/users");
  return data;
};

export const createUser = async (userData) => {
  const { data } = await API.post("/users", userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await API.put(`/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  return API.delete(`/users/${id}`);
};

// --- General Authenticated User Actions ---
export const changePassword = async (passwordData) => {
  const { data } = await API.post("/users/change-password", passwordData);
  return data;
};

// --- Portal (Admin/Manager) Profile Actions ---
export const uploadAvatar = async (formData) => {
  const { data } = await API.post("/users/profile/avatar", formData);
  return data;
};

export const updateProfile = async (userData) => {
  const { data } = await API.put("/users/profile", userData);
  return data;
};

// --- Customer-Specific Actions ---
export const getMyOrders = async (page = 1, limit = 10) => {
  const { data } = await API.get(`/users/my-orders?page=${page}&limit=${limit}`);
  return data;
};

export const getCustomerProfile = async () => {
  const { data } = await API.get('/users/customer-profile');
  return data;
};

export const updateCustomerProfile = async (profileData) => {
  const { data } = await API.put('/users/customer-profile', profileData);
  return data;
};

export const uploadCustomerAvatar = async (formData) => {
  const { data } = await API.post('/users/customer-profile/avatar', formData);
  return data;
};

// --- Admin/Manager Customer Management ---
export const getCustomerHistory = async (id) => {
  const { data } = await API.get(`/users/customers/${id}/history`);
  return data;
};

export const getCustomers = async () => {
  const { data } = await API.get("/users/customers");
  return data;
};

export const sendMessage = async (messageData) => {
  const { data } = await API.post("/users/send-message", messageData);
  return data;
};