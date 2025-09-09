import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  headers: { "Content-Type": "application/json" },
});

export const registerApi = async (userData) => {
  try {
    const res = await API.post("/register", userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Registration failed" };
  }
};

export const loginApi = async (credentials) => {
  try {
    const res = await API.post("/login", credentials);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

// ADD THE TWO MISSING FUNCTIONS BELOW

export const forgotPasswordApi = async (email) => {
  try {
    const res = await API.post("/forgot-password", { email });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Request failed" };
  }
};

export const resetPasswordApi = async (token, password) => {
  try {
    const res = await API.post(`/reset-password/${token}`, { password });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Request failed" };
  }
};