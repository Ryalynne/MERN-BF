import React, { useState } from "react";
import { motion } from "framer-motion";

const Resume = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className="is-flex is-justify-content-center is-align-items-center"
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/loginBanner.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "3rem",
        marginTop: "50px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`box ${darkMode ? "has-background-black has-text-light" : "has-background-white has-text-dark"}`}
        style={{
          maxWidth: "1000px",
          width: "100%",
          padding: "2.5rem",
          borderRadius: "16px",
          boxShadow: darkMode ? "0 10px 40px rgba(255,255,255,0.15)" : "0 10px 40px rgba(0,0,0,0.15)",
          backgroundColor: darkMode ? "rgba(0, 0, 0, 0.85)" : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          transition: "background 0.5s, color 0.5s",
        }}
      >
        {/* Toggle Dark Mode */}
        <div className="has-text-right">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`button ${darkMode ? "is-light" : "is-dark"}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </motion.button>
        </div>

        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="has-text-centered mb-4"
        >
          <img
            src="/profile.jpg"
            alt="Ryan Santiago"
            style={{
              borderRadius: "50%",
              width: "140px",
              height: "140px",
              objectFit: "cover",
              border: darkMode ? "3px solid #fff" : "3px solid #ccc",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          />
        </motion.div>

        {/* Name & Title */}
        <motion.h2
          className="title is-4 has-text-centered"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Ryan C. Santiago
        </motion.h2>
        <motion.p
          className="subtitle is-6 has-text-centered"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Full-Stack Developer & IT Staff
        </motion.p>

        <hr className={darkMode ? "has-background-grey-light" : "has-background-grey-dark"} />

        {/* Profile Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="title is-5">Profile</h3>
          <p>
            GitHub:{" "}
            <a
              href="https://github.com/Ryalynne"
              target="_blank"
              rel="noopener noreferrer"
              className={darkMode ? "has-text-info-light" : "has-text-info-dark"}
            >
              github.com/Ryalynne
            </a>
          </p>
        </motion.div>

        {/* Projects Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h3 className="title is-5">Example Projects</h3>
          <ul style={{ paddingLeft: "1rem" }}>
            <motion.li whileHover={{ scale: 1.05 }}>Library System with Inventory & QR Code</motion.li>
            <img src="/BMALibrary.png" alt="Library System" style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }} />

            <motion.li whileHover={{ scale: 1.05 }}>BMA Portal</motion.li>
            <p>No Image Available</p>

            <motion.li whileHover={{ scale: 1.05 }}>MilkTea Inventory & POS (Free lance)</motion.li>
            <img src="/milktea.png" alt="MilkTea Inventory" style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }} />

            <motion.li whileHover={{ scale: 1.05 }}>BMA Attendance QR-Code</motion.li>
            <p>No Image Available</p>

            <motion.li whileHover={{ scale: 1.05 }}>Mini-Grocery (School Project)</motion.li>
            <img src="/POSANDINVENTORY.jpg" alt="Mini-Grocery" style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }} />

            <motion.li whileHover={{ scale: 1.05 }}>Clearance System (School Project)</motion.li>
            <img src="/cleranceSystem.png" alt="Clearance System" style={{ width: "100%", borderRadius: "8px" }} />

            
            <motion.li whileHover={{ scale: 1.05 }}>BMALanding Page</motion.li>
            <img src="/BMALanding.png" alt="BMALanding" style={{ width: "100%", borderRadius: "8px" }} />
          </ul>
        </motion.div>

        {/* Contact Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="title is-5">Contact</h3>
          <p><strong>Location:</strong> Taal, Pulilan, Bulacan</p>
          <p><strong>Phone:</strong> 0926-695-5822</p>
          <p><strong>Email:</strong> santiagoryan788@gmail.com</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Resume;
