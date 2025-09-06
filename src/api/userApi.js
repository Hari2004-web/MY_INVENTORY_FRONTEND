import API from "../utils/fetchWrapper";

// Renamed from getManagers to getUsers for consistency
export const getUsers = async () => {
  const { data } = await API.get("/users");
  return data;
};

export const createUser = async (userData) => {
  const { data } = await API.post("/users", userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await API.put(`/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  return API.delete(`/users/${id}`);
};

export const changePassword = async (passwordData) => {
  const { data } = await API.post("/users/change-password", passwordData);
  return data;
};
export const sendMessage = async (messageData) => {
  // The token is automatically added by the fetchWrapper
  const { data } = await API.post("/users/send-message", messageData);
  return data;
};