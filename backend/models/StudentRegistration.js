import mongoose from "mongoose";

const studentRegistrationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: String,
    rollNumber: { type: String, required: true, unique: true },
    grade: { type: String, required: true },
    section: String,
    dateOfBirth: { type: Date, required: true },
    password: { type: String, required: true },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    parentEmail: String,
    parentEmail: { type: String, required: true }, 

    
    otp: String,
    otpExpiry: Date,
    refreshToken: String,


    address: String
  },
  { timestamps: true }
);

export default mongoose.models.StudentRegistration ||
  mongoose.model("StudentRegistration", studentRegistrationSchema);
