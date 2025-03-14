import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext"; // Wrap the app with AuthProvider
import LoginPage from "./page/LoginPage";
import HomePage from "./page/HomePage";
import Register from "./page/RegisterPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home/*" // Updated path here
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          {/* Redirect to login if not authenticated */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log("Authenticated:", isAuthenticated); // Debugging line
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;
