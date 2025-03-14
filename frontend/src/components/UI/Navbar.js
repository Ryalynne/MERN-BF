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
    >
      <div className="container">
        <div className="navbar-brand">
          <Link to="/home" className="navbar-item">
            <h1
              className={`title is-4 ${
                isDarkMode ? "has-text-white" : "has-text-black"
              }`}
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
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>

        {/* Navbar menu */}
        <div className={`navbar-menu ${isActive ? "is-active" : ""}`}>
          <div className="navbar-start">
            <NavLink
              to="/home/JobTitleList"
              className={({ isActive }) =>
                isActive ? "navbar-item is-active" : "navbar-item"
              }
            >
              JOB TITLE
            </NavLink>
            <NavLink
              to="/home/SalaryList"
              className={({ isActive }) =>
                isActive ? "navbar-item is-active" : "navbar-item"
              }
            >
              JOB POSITION
            </NavLink>
            <NavLink
              to="/home/EmployeeList"
              className={({ isActive }) =>
                isActive ? "navbar-item is-active" : "navbar-item"
              }
            >
              EMPLOYEE
            </NavLink>
          </div>

          <div className="navbar-end">
            <div className="navbar-item buttons">
              {/* Dark Mode Toggle */}
              <button
                className="button is-small is-light"
                style={{
                  borderRadius: "8px",
                  transition: "background-color 0.3s, transform 0.2s",
                }}
                onClick={toggleTheme}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#e0e0e0")
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>

              {/* Logout Button */}
              <button
                className="button is-small is-danger is-light"
                style={{
                  borderRadius: "8px",
                  transition: "background-color 0.3s, transform 0.2s",
                }}
                onClick={handleLogout}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#ff6b6b")
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
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
