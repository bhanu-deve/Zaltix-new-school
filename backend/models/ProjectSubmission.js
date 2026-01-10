import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  studentName: String,
  class: String,
  section: String,
  note: String,
  attachments: [String],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ProjectSubmission", submissionSchema);
