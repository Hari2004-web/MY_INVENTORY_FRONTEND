import API from "../utils/fetchWrapper";

export const getStocks = async () => {
  const { data } = await API.get("/stocks");
  return data;
};

export const createStock = async (stock) => {
  const { data } = await API.post("/stocks", stock);
  return data;
};

export const updateStock = async (id, stock) => {
  const { data } = await API.put(`/stocks/${id}`, stock);
  return data;
};

export const deleteStock = async (id) => {
  return API.delete(`/stocks/${id}`);
};
