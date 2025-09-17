// src/api/wishlistApi.js

import API from "../utils/fetchWrapper";

export const getWishlist = async () => {
  const { data } = await API.get("/wishlist");
  return data;
};

export const addToWishlist = async (productId) => {
  return API.post("/wishlist", { productId });
};

export const removeFromWishlist = async (productId) => {
  return API.delete(`/wishlist/${productId}`);
};