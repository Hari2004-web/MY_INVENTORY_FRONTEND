import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  headers: { "Content-Type": "application/json" },
});

export const registerApi = async (userData) => {
  try {
    const res = await API.post("/register", userData);
    return res.data; // On success, returns { success: true, message: '...' }
  } catch (err) {
    // On failure, ensure a clear error message is available
    const errorMessage = err.response?.data?.error || err.response?.data?.message || "An unexpected registration error occurred.";
    throw new Error(errorMessage);
  }
};

export const loginApi = async (credentials) => {
  try {
    const res = await API.post("/login", credentials);
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || "An unexpected login error occurred.";
    throw new Error(errorMessage);
  }
};