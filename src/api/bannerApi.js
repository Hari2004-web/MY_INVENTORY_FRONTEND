// src/api/bannerApi.js

import API from "../utils/fetchWrapper";

export const getBanners = async () => {
  // FIX: Return data.data to extract the actual banner array from the response object.
  const { data } = await API.get("/banners");
  return data;
};

export const createBanner = async (formData) => {
  const { data } = await API.post("/banners", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteBanner = async (id) => {
  return API.delete(`/banners/${id}`);
};