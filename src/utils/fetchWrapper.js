import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request Interceptor ---
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // FIX: If the data being sent is FormData (a file upload),
  // delete the incorrect global 'Content-Type' header.
  // This allows the browser to automatically set the correct 'multipart/form-data'
  // header along with the necessary boundary.
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});


// --- Response Interceptor ---
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      const currentPath = window.location.pathname;

      if (currentPath.startsWith('/customer') || currentPath.startsWith('/shop') || currentPath === '/') {
        window.location.href = '/customer/login';
      } else {
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;