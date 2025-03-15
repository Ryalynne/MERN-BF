import React, { useState } from "react";
import { motion } from "framer-motion";

const Resume = () => {
  const [selectedImage, setSelectedImage] = useState(null); // State for full-screen image

  // Animation variants for consistent effects
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Handle image click to show full screen
  const handleImageClick = (imgSrc) => {
    setSelectedImage(imgSrc);
  };

  // Close full-screen modal
  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div
      className="is-flex is-justify-content-center is-align-items-center"
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/loginBanner.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "4rem 2rem",
        overflow: "hidden",
        position: "relative",
        marginTop: "50px",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="box"
        style={{
          maxWidth: "1100px",
          width: "100%",
          padding: "3rem",
          borderRadius: "24px",
          boxShadow: "0 15px 60px rgba(0,0,0,0.1)",
          background: "rgb(255, 255, 255)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Profile Header */}
        <motion.div variants={itemVariants} className="has-text-centered mb-6">
          <motion.img
            whileHover={{ scale: 1.05, rotate: 2 }}
            src="/profile.jpg"
            alt="Ryan Santiago"
            style={{
              borderRadius: "50%",
              width: "160px",
              height: "160px",
              objectFit: "cover",
              border: "4px solid #4facfe",
              boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
            }}
          />
          <motion.h1
            className="title is-3 mt-4"
            variants={itemVariants}
            style={{
              background: "linear-gradient(45deg, #4facfe, #00f2fe)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Ryan C. Santiago
          </motion.h1>
          <motion.p
            className="subtitle is-5"
            variants={itemVariants}
            style={{ color: "#666" }}
          >
            Full-Stack Developer & IT Specialist
          </motion.p>
        </motion.div>

        <hr
          style={{
            background: "rgba(0,0,0,0.1)",
            height: "2px",
            border: "none",
            margin: "2rem 0",
          }}
        />

        {/* Profile Section */}
        <motion.section variants={itemVariants}>
          <h3 className="title is-4" style={{ color: "#4facfe" }}>
            Profile
          </h3>
          <p style={{ color: "#555" }}>
            GitHub:{" "}
            <motion.a
              href="https://github.com/Ryalynne"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#4facfe" }}
              whileHover={{ scale: 1.05, color: "#00f2fe" }}
            >
              github.com/Ryalynne
            </motion.a>
          </p>
        </motion.section>

        {/* Projects Section */}
        <motion.section variants={itemVariants} className="mt-6">
          <h3 className="title is-4" style={{ color: "#4facfe" }}>
            Featured Projects
          </h3>
          <div className="columns is-multiline">
            {[
              {
                name: "Library System with Inventory & QR Code [Solo Project]",
                img: "/BMALibrary.png",
              },
              { name: "BMA Portal", img: null },
              { name: "MilkTea Inventory & POS [Solo Project FreeLance]", img: "/milktea.png" },
              { name: "BMA Attendance QR-Code", img: null },
              { name: "Mini-Grocery [School Project]", img: "/POSANDINVENTORY.jpg" },
              { name: "Clearance System [School Project]", img: "/cleranceSystem.png" },
              { name: "BMA Landing Page [Solo Frontend Design]", img: "/BMALanding.png" },
            ].map((project, index) => (
              <motion.div
                key={index}
                className="column is-6"
                whileHover={{ y: -10 }}
                variants={itemVariants}
              >
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    transition: "all 0.3s",
                  }}
                >
                  <motion.p
                    whileHover={{ scale: 1.02 }}
                    style={{ color: "#333" }}
                  >
                    {project.name}
                  </motion.p>
                  {project.img ? (
                    <motion.img
                      src={project.img}
                      alt={project.name}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleImageClick(project.img)}
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        marginTop: "1rem",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <p style={{ color: "#999" }}>No Image Available</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section variants={itemVariants} className="mt-6">
          <h3 className="title is-4" style={{ color: "#4facfe" }}>
            Contact
          </h3>
          <div style={{ color: "#555" }}>
            <p>
              <strong>Location:</strong> Taal, Pulilan, Bulacan
            </p>
            <p>
              <strong>Phone:</strong> 0926-695-5822
            </p>
            <p>
              <strong>Email:</strong> santiagoryan788@gmail.com
            </p>
          </div>
        </motion.section>
      </motion.div>

      {/* Full-Screen Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <motion.img
            src={selectedImage}
            alt="Full Screen"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCloseModal}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "#ff6b6b",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              color: "#fff",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ×
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default Resume;