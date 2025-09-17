import API from "../utils/fetchWrapper";

export const initiateCheckout = async (checkoutData) => {
  const { data } = await API.post("/checkout/initiate", checkoutData);
  return data;
};

export const confirmPayment = async (billId, productData) => {
  const { data } = await API.post(`/checkout/confirm/${billId}`, productData);
  return data;
};