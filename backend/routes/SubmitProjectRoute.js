import express from "express";
import multer from "multer";
import ProjectSubmission from "../models/ProjectSubmission.js";
import Project from "../models/AddProject.js";


const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/submissions",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.array("attachments"), async (req, res) => {
  try {
    const files = req.files.map(f => `/uploads/submissions/${f.filename}`);

    const submission = new ProjectSubmission({
      projectId: req.body.projectId,
      studentId: req.body.studentId,
      studentName: req.body.studentName,
      class: req.body.class,
      section: req.body.section,
      note: req.body.note,
      attachments: files,
    });

    await submission.save();

    const updatedProject = await Project.findByIdAndUpdate(
    req.body.projectId,
    { $inc: { submissions: 1 } },
    { new: true }   
    );

    console.log("UPDATED PROJECT:", updatedProject);

    res.status(201).json({ message: "Project submitted & saved" });
    } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
