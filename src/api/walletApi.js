// src/api/walletApi.js

import API from "../utils/fetchWrapper";

export const getWalletDetails = async () => {
  const { data } = await API.get("/wallet");
  return data;
};

export const requestWithdrawalApi = async (amount) => {
  const { data } = await API.post("/wallet/withdraw", { amount });
  return data;
};