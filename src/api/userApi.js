import API from "../utils/fetchWrapper";

export const getUsers = async () => {
  const { data } = await API.get("/users");
  return data;
};

// --- MODIFIED FUNCTION ---
// The password is no longer sent from the frontend when creating a user.
export const createUser = async (userData) => {
  const payload = {
    username: userData.username,
    email: userData.email,
    role: userData.role,
  };


 // const { data } = await API.post("/users", payload);
 
//   await this.sendpasswordlink(userData.email);

 // return data;
// 
//};


// sendpasswordlink (){

// 
}


// ... (the rest of the file remains the same)
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

export const updateProfile = async (userData) => {
  const { data } = await API.put("/users/profile", userData);
  return data;
};

export const getCustomerHistory = async (id) => {
  const { data } = await API.get(`/users/customers/${id}/history`);
  return data;
};

export const getCustomers = async () => {
  const { data } = await API.get("/users/customers");
  return data;
};