import { createContext, useContext, useState } from "react";
import { loginApi } from "../api/authApi";
import { customerLoginApi } from "../api/customerAuthApi";

const AuthContext = createContext();

const getInitialUser = () => {
  try {
    const item = localStorage.getItem("user");
    return item ? JSON.parse(item) : null;
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser());

  const login = async (email, password, type = 'portal') => {
    try {
      const apiToCall = type === 'customer' ? customerLoginApi : loginApi;
      const serverResponse = await apiToCall({ email, password });
      
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

  const updateUserInContext = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    updateUserInContext,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);