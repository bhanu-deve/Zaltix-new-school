import mongoose from "mongoose";

const classFeeSchema = new mongoose.Schema({
  className: { type: String, required: true },   // e.g. 10A
  feeType: { type: String, required: true },     // Term 1, Tuition
  amount: { type: Number, required: true },
  paymentType: { type: String, required: true }, // Monthly / Term / One-time
  dueDate: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("ClassFee", classFeeSchema);
