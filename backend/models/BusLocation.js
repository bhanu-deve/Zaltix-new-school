import mongoose from "mongoose";

const busLocationSchema = new mongoose.Schema({
  busId: { type: String, required: true, unique: true },
  latitude: Number,
  longitude: Number,
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("BusLocation", busLocationSchema);
