import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },
    section: { type: String, required: true },
    academicYear: { type: String, required: true },
    entries: {
      type: Map,
      of: [String],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Timetable', timetableSchema);
