import { createContext, useContext, useState } from "react";
import { loginApi } from "../api/authApi"; // registerApi is not used here, can be removed

const AuthContext = createContext();

const getInitialUser = () => {
  try {
    const item = localStorage.getItem("user");
    return item ? JSON.parse(item) : null;
  } catch (error) {
    // If parsing fails, remove the corrupted item
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser());

  const login = async (email, password) => {
    try {
      const serverResponse = await loginApi({ email, password });
      const { token, user: userData } = serverResponse.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // --- FIX: ADD THIS NEW FUNCTION ---
  // This function is the key. It updates the user state in the context
  // AND updates the user data in localStorage to keep them in sync.
  const updateUserInContext = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };


  const value = {
    user,
    setUser, // Keep for direct manipulation if needed
    login,
    logout,
    updateUserInContext, // Provide the new function to the rest of the app
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);