import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext"; // Import useAuth to manage auth state

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isActive, setIsActive] = useState(false); // For mobile menu toggle
  const { logout } = useAuth(); // Access logout function from context
  const navigate = useNavigate(); // Use navigate for redirection

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle("dark-mode", !isDarkMode); // Optional: Apply dark mode to body
  };

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear auth token from local storage
    logout(); // Update auth context (logged out state)
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav
      className={`navbar ${isDarkMode ? "is-dark" : "is-light"}`}
      role="navigation"
      aria-label="main navigation"
      style={{
        position: "fixed", // Makes navbar sticky at the top
        top: 0,
        width: "100%",
        zIndex: 1000, // Ensures it stays above other content
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        padding: "0.5rem 1rem", // Consistent padding
      }}
    >
      <div className="container">
        <div className="navbar-brand">
          <Link to="/home" className="navbar-item">
            <h1
              className={`title is-4 ${
                isDarkMode ? "has-text-white" : "has-text-black"
              }`}
              style={{
                fontWeight: "bold",
                letterSpacing: "1px",
                marginBottom: 0, // Remove default margin
              }}
            >
              MERN
            </h1>
          </Link>

          {/* Mobile menu toggle button */}
          <button
            className={`navbar-burger ${isActive ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded={isActive ? "true" : "false"}
            onClick={toggleMenu}
            style={{
              background: "transparent",
              border: "none",
              color: isDarkMode ? "#fff" : "#363636",
              transition: "transform 0.3s ease",
            }}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>

        {/* Navbar menu */}
        <div
          className={`navbar-menu ${isActive ? "is-active" : ""}`}
          style={{
            backgroundColor: isDarkMode ? "#363636" : "#fff", // Match theme
          }}
        >
          <div className="navbar-start">
            <NavLink
              to="/home/JobTitleList"
              className={({ isActive }) =>
                `navbar-item ${isActive ? "is-active" : ""}`
              }
              style={({ isActive }) => ({
                color: isDarkMode ? "#fff" : "#363636",
                fontWeight: isActive ? "bold" : "normal",
                padding: "0.75rem 1.25rem",
                borderRadius: "4px",
                transition: "background-color 0.3s, color 0.3s",
                backgroundColor: isActive
                  ? isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.05)"
                  : "transparent",
              })}
            >
              JOB TITLE
            </NavLink>
            <NavLink
              to="/home/SalaryList"
              className={({ isActive }) =>
                `navbar-item ${isActive ? "is-active" : ""}`
              }
              style={({ isActive }) => ({
                color: isDarkMode ? "#fff" : "#363636",
                fontWeight: isActive ? "bold" : "normal",
                padding: "0.75rem 1.25rem",
                borderRadius: "4px",
                transition: "background-color 0.3s, color 0.3s",
                backgroundColor: isActive
                  ? isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.05)"
                  : "transparent",
              })}
            >
              JOB POSITION
            </NavLink>
            <NavLink
              to="/home/EmployeeList"
              className={({ isActive }) =>
                `navbar-item ${isActive ? "is-active" : ""}`
              }
              style={({ isActive }) => ({
                color: isDarkMode ? "#fff" : "#363636",
                fontWeight: isActive ? "bold" : "normal",
                padding: "0.75rem 1.25rem",
                borderRadius: "4px",
                transition: "background-color 0.3s, color 0.3s",
                backgroundColor: isActive
                  ? isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.05)"
                  : "transparent",
              })}
            >
              EMPLOYEE
            </NavLink>
          </div>

          <div className="navbar-end">
            <div
              className="navbar-item buttons"
              style={{ gap: "10px" }} // Space between buttons
            >
              {/* Dark Mode Toggle */}
              <button
                className="button is-small"
                style={{
                  backgroundColor: isDarkMode ? "#4a4a4a" : "#f5f5f5",
                  color: isDarkMode ? "#fff" : "#363636",
                  border: "none",
                  borderRadius: "20px",
                  padding: "0.5rem 1.5rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "background-color 0.3s, transform 0.2s",
                }}
                onClick={toggleTheme}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = isDarkMode
                    ? "#6b6b6b"
                    : "#e0e0e0")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = isDarkMode
                    ? "#4a4a4a"
                    : "#f5f5f5")
                }
                onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
                onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>

              {/* Logout Button */}
              <button
                className="button is-small is-danger"
                style={{
                  borderRadius: "20px",
                  padding: "0.5rem 1.5rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "background-color 0.3s, transform 0.2s",
                }}
                onClick={handleLogout}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#ff6b6b")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#ff3860")
                }
                onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
                onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
