import express from "express";
import { addStudent } from "../controllers/AddStudentController.js";
import StudentRegistration from "../models/StudentRegistration.js";


const router = express.Router();

router.post("/", addStudent);


// GET all students (Principal view)
router.get("/all", async (req, res) => {
  try {
    const { grade, section } = req.query;

    let query = {};
    if (grade && grade.trim() !== "") query.grade = grade;
    if (section && section.trim() !== "") query.section = section;

    const students = await StudentRegistration.find(query)
      .sort({ grade: 1, section: 1, rollNumber: 1 });

    res.json({
      total: students.length,
      students
    });
  } catch (err) {
    console.error("Student fetch error:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});



export default router;
