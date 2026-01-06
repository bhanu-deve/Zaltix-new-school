import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: String,
    rollNo: String,
    class: String,
    examType: String,

    marks: {
      type: Map,
      of: Number,
      default: {},
    },

    totalMarks: Number,
    average: Number,
    grade: String,
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
