import mongoose from 'mongoose';

const StudentFeedbackSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },

   
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    teacherRole: {
      type: String, 
    },

    feedback: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('StudentFeedback', StudentFeedbackSchema);
