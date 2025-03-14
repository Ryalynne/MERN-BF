import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        login();
        navigate("/home");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Invalid credentials");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="is-flex is-justify-content-center is-align-items-center"
      style={{
        height: "100vh",
        background: `url('/loginBanner.jpg') center/cover no-repeat`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="box"
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.85)", // Semi-transparent white
        }}
      >
        {/* Sign In Title */}
        <motion.h2
          className="title is-5 has-text-centered has-text-weight-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Sign In
        </motion.h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {/* Email Field */}
            <div className="field">
              <label className="label has-text-weight-medium">Email:</label>
              <div className="control">
                <input
                  type="email"
                  className="input is-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  style={{ borderRadius: "8px" }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="field">
              <label className="label has-text-weight-medium">Password:</label>
              <div className="control">
                <input
                  type="password"
                  className="input is-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  style={{ borderRadius: "8px" }}
                />
              </div>
            </div>

            {/* Sign In Button */}
            <div className="field">
              <div className="control">
                <motion.button
                  type="submit"
                  className={`button is-primary is-fullwidth is-medium ${loading ? "is-loading" : ""}`}
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#4c7dff",
                    borderColor: "#4c7dff",
                    transition: "background-color 0.3s",
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  Sign In
                </motion.button>
              </div>
            </div>
          </motion.div>
        </form>

        {/* Forgot Password & Sign Up Links */}
        <motion.div
          className="has-text-centered"
          style={{ marginTop: "1rem" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>
            <Link to="/forgot-password" className="has-text-link">
              Forgot Password?
            </Link>
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            Don't have an account?{" "}
            <Link to="/register" className="has-text-link">
              Sign Up here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
