import { createContext, useContext, useState } from "react";
import { loginApi, registerApi } from "../api/authApi";

const AuthContext = createContext();

const getInitialUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser());

  const login = async (email, password) => {
    try {
      // loginApi returns the full server response: { success, data: { token, user } }
      const serverResponse = await loginApi({ email, password });
      
      // **This correctly accesses the token and user from the nested 'data' object**
      const { token, user } = serverResponse.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return user;
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerApi(userData);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);