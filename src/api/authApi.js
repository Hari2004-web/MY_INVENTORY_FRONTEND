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

// --- ADD THIS NEW FUNCTION ---
export const setPasswordApi = async (token, password) => {
  try {
    const res = await API.post(`/set-password/${token}`, { password });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to set password" };
  }
};

export const forgotPasswordApi = async (email) => {
  try {
    const res = await API.post("/forgot-password", { email });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Request failed" };
  }
};

export const resetPasswordApi = async (data) => {
  try {
    const res = await API.post(`/reset-password`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Request failed" };
  }
};  

export const verifyOtpApi = async (data) => {
  try {
    const res = await API.post("/verify-otp", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Request failed" };
  }
};