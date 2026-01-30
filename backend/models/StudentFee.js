import mongoose from "mongoose";

const studentFeeSchema = new mongoose.Schema({
  studentId: { type: String, required: true },   // roll number
  studentName: { type: String, required: true },
  className: { type: String, required: true },
  feeType: { type: String, required: true },
  amount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueDate: { type: String, required: true },
  status: {
    type: String,
    enum: ["Paid", "Pending", "Partial"],
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.model("StudentFee", studentFeeSchema);
