import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request Interceptor ---
// This part adds the token to every outgoing request. (No changes here)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// --- FIX: Add a Response Interceptor ---
// This new part will watch for responses coming back from the API.
API.interceptors.response.use(
  // If the response is successful (e.g., status 200), just return it.
  (response) => {
    return response;
  },
  // If the response has an error...
  (error) => {
    // Check if the error is specifically a 401 (Unauthorized) or 403 (Forbidden).
    // These statuses indicate a problem with the JWT token.
    if (error.response && [401, 403].includes(error.response.status)) {
      
      // Remove the invalid token and user data from storage.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Redirect the user to the login page.
      // The page will reload, effectively logging them out.
      window.location.href = '/login';
    }
    
    // For all other errors, just pass them along.
    return Promise.reject(error);
  }
);


export default API;