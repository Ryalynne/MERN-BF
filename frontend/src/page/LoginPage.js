import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", server: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email) => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) return "Email is required";
    if (!emailRegex.test(trimmedEmail)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    // Relaxed validation for debugging; adjust as needed
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) return "Password is required";
    if (!passwordRegex.test(password))
      return "Password must be 8+ characters with uppercase, lowercase, and a number";
    return "";
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: "", server: "" }));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    console.log("Password input:", newPassword);
    setPassword(newPassword);
    setErrors((prev) => ({ ...prev, password: "", server: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting with password:", password);

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError, server: "" });
      return;
    }

    setLoading(true);

    try {
      console.log("Sending to server:", { email: email.trim().toLowerCase(), password });
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful, token:", data.token);
        localStorage.setItem("authToken", data.token);
        login();
        navigate("/home");
      } else {
        const errorData = await response.json();
        console.log("Server rejected password:", errorData);
        setErrors((prev) => ({
          ...prev,
          server: errorData.message || "Invalid credentials",
        }));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setErrors((prev) => ({
        ...prev,
        server: "An error occurred. Please try again.",
      }));
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
          backgroundColor: "rgba(255, 255, 255, 0.85)",
        }}
      >
        <motion.h2
          className="title is-5 has-text-centered has-text-weight-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Sign In
        </motion.h2>

        <form onSubmit={handleSubmit} noValidate>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {errors.server && (
              <p className="help is-danger has-text-centered" id="server-error">
                {errors.server}
              </p>
            )}

            <div className="field">
              <label className="label has-text-weight-medium">Email:</label>
              <div className="control">
                <input
                  type="email"
                  className={`input is-medium ${errors.email ? "is-danger" : ""}`}
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setErrors((prev) => ({ ...prev, email: validateEmail(email) }))}
                  placeholder="Enter your email"
                  style={{ borderRadius: "8px" }}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                />
              </div>
              {errors.email && (
                <p className="help is-danger" id="email-error">{errors.email}</p>
              )}
            </div>

            <div className="field">
              <label className="label has-text-weight-medium">Password:</label>
              <div className="control">
                <input
                  type="password"
                  className={`input is-medium ${errors.password ? "is-danger" : ""}`}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => {
                    console.log("Password blurred:", password);
                    setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
                  }}
                  placeholder="Enter your password"
                  style={{ borderRadius: "8px" }}
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                />
              </div>
              {errors.password && (
                <p className="help is-danger" id="password-error">{errors.password}</p>
              )}
            </div>

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
            Don’t have an account?{" "}
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
