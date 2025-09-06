import API from "../utils/fetchWrapper";

export const getMyMessages = async () => {
  const { data } = await API.get("/messages");
  return data;
};

export const sendMessage = async (messageData) => {
  const { data } = await API.post("/messages", messageData);
  return data;
};