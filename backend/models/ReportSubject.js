import mongoose from "mongoose";

const reportSubjectSchema = new mongoose.Schema({
  className: String,     // 10A
  examType: String,      // FA1
  subjects: [String],    // ["unit_test", "practical"]
}, { timestamps: true });

export default mongoose.model("ReportSubject", reportSubjectSchema);
