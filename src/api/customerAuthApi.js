import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/customer-auth",
  headers: { "Content-Type": "application/json" },
});

export const customerRegisterApi = async (userData) => {
  try {
    const res = await API.post("/register", userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Registration failed" };
  }
};

export const customerLoginApi = async (credentials) => {
  try {
    const res = await API.post("/login", credentials);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};