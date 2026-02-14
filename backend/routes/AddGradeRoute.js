import express from "express";
import {
  getAllReports,
  getStudentByName,
  getStudentByRollNo,
  getStudentsByClass,
  addStudentReport,
  updateStudentReport,
  deleteStudentReport,
} from "../controllers/gradeController.js";

const router = express.Router();

router.get("/", getAllReports);
router.get("/student/:name", getStudentByName);
router.get("/roll/:rollNo", getStudentByRollNo);
router.get("/:className/:examType", getStudentsByClass);

router.post("/", addStudentReport);
router.put("/:id", updateStudentReport);
router.delete("/:id", deleteStudentReport);

export default router;
