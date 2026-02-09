import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["national", "regional", "school", "religious"],
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Holiday = mongoose.model("Holiday", holidaySchema);

export default Holiday;
