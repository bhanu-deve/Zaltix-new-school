import express from "express";
import {
  saveReportSubjects,
  getReportSubjects
} from "../controllers/reportSubjectController.js";

const router = express.Router();

router.get("/:className/:examType", getReportSubjects);
router.post("/:className/:examType", saveReportSubjects);

export default router;
