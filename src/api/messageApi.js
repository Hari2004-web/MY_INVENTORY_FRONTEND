// src/api/messageApi.js

import API from "../utils/fetchWrapper";

export const getMyMessages = async () => {
  const { data } = await API.get("/messages");
  return data;
};

export const sendMessage = async (messageData) => {
  // FIX: Changed the endpoint from "/users/send-message" to the correct "/messages"
  const { data } = await API.post("/messages", messageData);
  return data;
};

export const markMessageAsRead = async (messageId) => {
  const { data } = await API.put(`/messages/${messageId}/read`);
  return data;
};