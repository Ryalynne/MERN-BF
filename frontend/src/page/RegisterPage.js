import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Registration failed");
      }
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
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
          maxWidth: "420px",
          width: "100%",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.85)", // Semi-transparent white
        }}
      >
        {/* Register Title */}
        <motion.h2
          className="title is-5 has-text-centered has-text-weight-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Create an Account
        </motion.h2>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
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

            {/* Confirm Password Field */}
            <div className="field">
              <label className="label has-text-weight-medium">
                Confirm Password:
              </label>
              <div className="control">
                <input
                  type="password"
                  className="input is-medium"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                  style={{ borderRadius: "8px" }}
                />
              </div>
            </div>

            {/* Error Message Animation */}
            {errorMessage && (
              <motion.p
                className="has-text-danger has-text-centered"
                style={{ marginBottom: "1rem" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {errorMessage}
              </motion.p>
            )}

            {/* Register Button with Animation */}
            <div className="field">
              <div className="control">
                <motion.button
                  type="submit"
                  className="button is-primary is-fullwidth is-medium"
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#4c7dff",
                    borderColor: "#4c7dff",
                    transition: "background-color 0.3s",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Register
                </motion.button>
              </div>
            </div>
          </motion.div>
        </form>

        {/* Login Link Animation */}
        <motion.div
          className="has-text-centered"
          style={{ marginTop: "1rem" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p>
            Already have an account?{" "}
            <Link to="/login" className="has-text-link">
              Login here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
