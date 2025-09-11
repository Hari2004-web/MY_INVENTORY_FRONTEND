import API from "../utils/fetchWrapper";

export const getProducts = async () => {
  const { data } = await API.get("/products");
  return data;
};

// FIX: The function now directly accepts the 'formData' object created in the component.
// It no longer tries to create its own FormData, which was the source of the error.
export const createProduct = async (formData) => {
  const { data } = await API.post("/products", formData, {
    // The browser will automatically set the correct Content-Type with the boundary
    // when you pass a FormData object, so explicitly setting it is not always necessary,
    // but we'll keep it for clarity.
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

// FIX: Same correction as above. This function now correctly forwards the
// formData object it receives.
export const updateProduct = async (id, formData) => {
  const { data } = await API.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteProduct = async (id) => {
  return API.delete(`/products/${id}`);
};


// ADD THIS NEW FUNCTION
export const getProductById = async (id) => {
  const { data } = await API.get(`/products/${id}`);
  return data;
};