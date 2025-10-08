// src/api/checkoutAPi.js

import API from "../utils/fetchWrapper";

// This function now returns the full server response
export const initiateCheckout = async (checkoutData) => {
  return API.post("/checkout/initiate", checkoutData);
};

// The confirmPayment function is no longer needed with Stripe webhooks
// You can safely delete it if you wish.
export const confirmPayment = async (billId, productData) => {
  const { data } = await API.post(`/checkout/confirm/${billId}`, productData);
  return data;
};