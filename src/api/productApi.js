import API from "../utils/fetchWrapper";

export const getProducts = async () => {
  const { data } = await API.get("/products");
  return data;
};

export const createProduct = async (productData) => {
  const formData = new FormData();
  for (const key in productData) {
    formData.append(key, productData[key]);
  }
  const { data } = await API.post("/products", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const updateProduct = async (id, productData) => {
  const formData = new FormData();
  for (const key in productData) {
    formData.append(key, productData[key]);
  }
  const { data } = await API.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteProduct = async (id) => {
  return API.delete(`/products/${id}`);
};
