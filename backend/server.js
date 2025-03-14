import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sql from "mssql";
import authRoutes from "./routes/authRoutes.js";
import Job_Title from "./routes/JobTitleRouter.js";
import Salary from "./routes/SalaryRouter.js";
import Employee from "./routes/EmployeeRouter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authenticateUser from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON requests

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    instancename: "SQLEXPRESS",
  },
};

// Connection pooling
const poolPromise = sql
  .connect(config)
  .then(() => {
    console.log("✅ Connected to MSSQL");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit the process if the connection fails
  });

// Use routes
app.use("/auth", authRoutes); // Auth routes for login
app.use("/salary", Salary);
app.use("/users", Employee);
app.use("/job", Job_Title);

// Base route
app.get("/", (req, res) => {
  return res.json({ message: "Backend Working" });
});

// Protected route example
app.get("/protected-route", authenticateUser, (req, res) => {
  res.json({ message: "You have accessed a protected route", user: req.user });
});

// Connect to MSSQL
poolPromise
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error starting the server:", err);
  });

// Centralized error handler
app.use(errorHandler);
