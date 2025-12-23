import mongoose from 'mongoose';

const SubjectAttendanceSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  present: { type: Boolean, required: true },
});

const AttendanceDaySchema = new mongoose.Schema({
  date: { type: String, required: true }, // "YYYY-MM-DD"
  subjects: [SubjectAttendanceSchema],
});

const StudentInfoSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  class: { type: String, required: true },
});

const AttendanceSchema = new mongoose.Schema({
  student: StudentInfoSchema,
  attendance: [AttendanceDaySchema],
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);
export default Attendance;
