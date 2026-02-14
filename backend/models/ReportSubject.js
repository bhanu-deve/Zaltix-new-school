import mongoose from "mongoose";

const reportSubjectSchema = new mongoose.Schema({
  className: String,     
  examType: String,      
  subjects: [String],    
}, { timestamps: true });

export default mongoose.model("ReportSubject", reportSubjectSchema);
