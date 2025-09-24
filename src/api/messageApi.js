import API from "../utils/fetchWrapper";

export const getMyMessages = async () => {
  const { data } = await API.get("/messages");
  return data;
};

export const sendMessage = async (messageData) => {
  // FIX: Changed the endpoint from "/messages" to the correct "/users/send-message"
  const { data } = await API.post("/users/send-message", messageData);
  return data;
};

export const markMessageAsRead = async (messageId) => {
  const { data } = await API.put(`/messages/${messageId}/read`);
  return data;
};