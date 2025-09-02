import API from "../utils/fetchWrapper";

export const getProducts = async () => {
  const { data } = await API.get("/products");
  return data;
};

export const createProduct = async (product) => {
  const { data } = await API.post("/products", product);
  return data;
};

export const updateProduct = async (id, product) => {
  const { data } = await API.put(`/products/${id}`, product);
  return data;
};

export const deleteProduct = async (id) => {
  return API.delete(`/products/${id}`);
};
