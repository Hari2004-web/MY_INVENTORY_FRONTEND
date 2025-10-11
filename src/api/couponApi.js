// src/api/couponApi.js

import API from "../utils/fetchWrapper";

export const createCoupon = async (couponData) => {
  const { data } = await API.post("/coupons", couponData);
  return data;
};

export const getCoupons = async () => {
  const { data } = await API.get("/coupons");
  return data;
};

export const validateCoupon = async (code) => {
    const { data } = await API.post("/coupons/validate", { code });
    return data;
};

export const deleteCoupon = async (id) => {
    return API.delete(`/coupons/${id}`);
};

// New function to get customer-specific coupons
export const getMyCoupons = async () => {
    const { data } = await API.get("/coupons/my-coupons");
    return data;
};