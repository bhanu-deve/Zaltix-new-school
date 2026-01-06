import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  busId: { type: String, required: true },
  active: { type: Boolean, default: true },
});

export default mongoose.model("Driver", driverSchema);
