import express from "express";
import {
  createClassFee,
  createStudentFee,
  getFeesForStudent
} from "../controllers/feeManagementController.js";
import StudentFee from "../models/StudentFee.js";
import ClassFee from "../models/ClassFee.js";

const router = express.Router();

/* CREATE ROUTES */
router.post("/class", createClassFee);
router.post("/student", createStudentFee);

/* STUDENT APP ROUTE */
router.get("/my-fees", getFeesForStudent);

/* PRINCIPAL PANEL ROUTES */
router.get("/student", async (req, res) => {
  try {
    const data = await StudentFee.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student fees" });
  }
});

router.get("/class", async (req, res) => {
  try {
    const data = await ClassFee.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch class fees" });
  }
});

router.put("/student/:id", async (req, res) => {
  try {
    const updated = await StudentFee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update student fee" });
  }
});

router.delete("/student/:id", async (req, res) => {
  try {
    await StudentFee.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete student fee" });
  }
});


// DELETE CLASS FEE
router.delete("/class/:id", async (req, res) => {
  try {
    await ClassFee.findByIdAndDelete(req.params.id);
    res.json({ message: "Class fee deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete class fee" });
  }
});


export default router;
