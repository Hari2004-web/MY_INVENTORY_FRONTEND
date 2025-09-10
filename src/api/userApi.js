import API from "../utils/fetchWrapper";

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
  const { data } = await API.post("/users/send-message", messageData);
  return data;
};

// This function correctly uses FormData for the single image file.
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const { data } = await API.post("/users/profile/avatar", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};
// ... (keep all your existing functions)

// ADD THIS NEW FUNCTION
export const updateProfile = async (userData) => {
  // We are sending { username: "newUsername" }
  const { data } = await API.put("/users/profile", userData);
  return data;
};