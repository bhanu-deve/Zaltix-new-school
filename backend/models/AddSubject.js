import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    teacher: { type: String, required: true, trim: true, unique: true },
    className: { type: String, required: true }, 
    section: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Subject', subjectSchema);
