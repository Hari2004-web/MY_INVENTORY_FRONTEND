import API from "../utils/fetchWrapper";

export const createBill = async (billData) => {
  const { data } = await API.post("/bills", billData);
  return data;
};

export const getBills = async () => {
  const { data } = await API.get("/bills");
  return data;
};

// ADD THIS NEW FUNCTION
export const getBillById = async (id) => {
  const { data } = await API.get(`/bills/${id}`);
  return data;
};
// ADD THIS NEW FUNCTION
export const getBillingStats = async () => {
  const { data } = await API.get('/bills/stats');
  return data;
};