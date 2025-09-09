import API from "../utils/fetchWrapper";

export const getMyMessages = async () => {
  const { data } = await API.get("/messages");
  return data;
};

export const sendMessage = async (messageData) => {
  const { data } = await API.post("/messages", messageData);
  return data;
};
export const markMessageAsRead = async (messageId) => {
  const { data } = await API.put(`/messages/${messageId}/read`);
  return data;
};