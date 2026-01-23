// import mongoose from 'mongoose';

// const TeacherFeedbackSchema = new mongoose.Schema({
//   teacher: {
//     type: String,
//     required: true,
//     enum: ['ramesh', 'priya', 'kiran', 'sneha'],
//   },
//   feedback: {
//     type: String,
//     required: true,
//   },
//   rating: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 5,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const StudentFeedback = mongoose.model('StudentFeedback', TeacherFeedbackSchema);
// export default StudentFeedback;



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

    // 👇 LINK TO STAFF COLLECTION
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
      type: String, // e.g. "Mathematics Teacher"
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
