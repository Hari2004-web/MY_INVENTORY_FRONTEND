// src/api/returnApi.js
import API from "../utils/fetchWrapper";

export const requestReturn = async (returnData) => {
  const { data } = await API.post("/returns/request", returnData);
  return data;
};

export const getReturns = async () => {
    const { data } = await API.get("/returns");
    return data;
}

export const updateReturn = async (id, statusData) => {
    const { data } = await API.put(`/returns/${id}`, statusData);
    return data;
}

export const getMyReturns = async () => {
    const { data } = await API.get("/returns/my-returns");
    return data;
};