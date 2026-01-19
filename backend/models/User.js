// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, required: true },
//   staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }
// }, { timestamps: true });

// export default mongoose.model("User", UserSchema);

// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },

    // ✅ ADD HERE (for forgot password)
    otp: { type: String },
    otpExpiry: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
