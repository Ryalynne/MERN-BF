import express from "express";
import {
  createDept,
  getTitle,
  getTitleByID,
  updateJobTitle,
} from "../controllers/JobTitleController.js"; //  Added .js extension

const router = express.Router();

//dept
router.get("/", getTitle);
router.get("/getJobTitle/:id", getTitleByID);
router.post("/", createDept);
router.patch("/:id", updateJobTitle);


export default router; //  ES Module export
