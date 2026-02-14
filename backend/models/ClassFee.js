import mongoose from "mongoose";

const classFeeSchema = new mongoose.Schema({
  className: { type: String, required: true },  
  feeType: { type: String, required: true },     
  amount: { type: Number, required: true },
  paymentType: { type: String, required: true }, 
  dueDate: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("ClassFee", classFeeSchema);
