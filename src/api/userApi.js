import API from "../utils/fetchWrapper";

export const getUsers = async () => {
  const { data } = await API.get("/users");
  return data;
};

export const createUser = async (userData) => {
  const { data } = await API.post("/users", userData);
  return data;
};

// ADD THESE NEW FUNCTIONS
export const updateUser = async (id, userData) => {
  const { data } = await API.put(`/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  return API.delete(`/users/${id}`);
};