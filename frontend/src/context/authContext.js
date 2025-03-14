import React, { createContext, useState, useContext, useEffect } from "react";

// Create a context for authentication
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulating check for token in localStorage or from backend
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("authToken", "your-auth-token"); // Store token
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authToken"); // Remove token
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
