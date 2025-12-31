import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: String,
    class: String,        // e.g. "10"
    section: String,      // e.g. "A"
    subject: String,
    dueDate: String,
    description: String,
    submissions: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 30 },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
