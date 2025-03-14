import express from "express";
import {
  getPositions,
  getSalary,
  createSalary,
  getSalaryList,
  updateSalary,
} from "../controllers/SalaryController.js"; //  Added .js extension

const router = express.Router();
//salary
router.get("/", getSalaryList);
router.post("/", createSalary);
router.get("/getPosition/:id", getPositions);
router.get("/getSalary/:id", getSalary);
router.patch("/:id", updateSalary);
export default router; //  ES Module export
