import express from "express";
import ProjectSubmission from "../models/ProjectSubmission.js";

const router = express.Router();

// teacher view submissions by project
router.get("/project/:projectId", async (req, res) => {
  try {
    const submissions = await ProjectSubmission
      .find({ projectId: req.params.projectId })
      .populate("projectId");

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
