// import User from "../models/User.js";
// import bcrypt from "bcrypt";


// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     res.status(200).json({ user });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// import User from "../models/User.js";
// import { AddStaff } from "../models/AddStaff.js";
// import bcrypt from "bcrypt";

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     let staff = null;

//     // ✅ IF TEACHER → FETCH STAFF DETAILS
//     if (user.role === "teacher" && user.staffId) {
//       staff = await AddStaff.findById(user.staffId).select("name subjects classes");
//     }

//     res.status(200).json({
//       user: {
//         _id: user._id,
//         email: user.email,
//         role: user.role,
//         name: staff?.name || null,   // ✅ THIS FIXES EVERYTHING
//         staffId: user.staffId || null
//       }
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// export const principalLogin = async (req, res) => {
//   const { email, password } = req.body;

//   // FIRST LOGIN (ENV)
//   if (
//     email === process.env.PRINCIPAL_EMAIL &&
//     password === process.env.PRINCIPAL_PASSWORD
//   ) {
//     return res.json({ role: "principal", firstLogin: true });
//   }

//   // NORMAL LOGIN
//   const user = await User.findOne({ email, role: "principal" });
//   if (!user) return res.status(400).json({ error: "Invalid credentials" });

//   const match = await bcrypt.compare(password, user.password);
//   if (!match) return res.status(400).json({ error: "Invalid credentials" });

//   res.json({ role: "principal" });
// };

import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sendOTPEmail } from "../utils/mailer.js";

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // 🔹 CHECK IF PRINCIPAL EXISTS IN DB
  const principal = await User.findOne({ role: "principal" });

  // 🔹 FIRST PRINCIPAL LOGIN (HARDCODED)
  if (!principal) {
    if (
      email === process.env.PRINCIPAL_EMAIL &&
      password === process.env.PRINCIPAL_PASSWORD
    ) {
      return res.json({
        user: { role: "principal", firstLogin: true }
      });
    }
  }

  // 🔹 NORMAL LOGIN (TEACHER / PRINCIPAL)
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
      staffId: user.staffId || null
    }
  });
};


/* ================= CHANGE EMAIL + PASSWORD ================= */
export const updatePrincipal = async (req, res) => {
  const { newEmail, newPassword } = req.body;

  const hashed = await bcrypt.hash(newPassword, 10);

  await User.findOneAndUpdate(
    { role: "principal" },
    { email: newEmail, password: hashed },
    { upsert: true }
  );

  res.json({ message: "Principal updated" });
};

/* ================= FORGOT PASSWORD ================= */
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const principalForgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email, role: "principal" });
  if (!user) return res.status(404).json({ error: "Email not found" });

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;

  await user.save();
  await sendOTPEmail(email, otp);

  res.json({ message: "OTP sent" });
};

/* ================= LOGIN WITH OTP ================= */
export const principalLoginWithOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email, role: "principal" });
  if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ user });
};

/* ================= TEACHER FORGOT PASSWORD ================= */

export const teacherForgotPassword = async (req, res) => {
  const { email } = req.body;

  // check teacher login
  const user = await User.findOne({ email, role: "teacher" });
  if (!user) {
    return res.status(404).json({ error: "Teacher email not found" });
  }

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;

  await user.save();
  await sendOTPEmail(email, otp);

  res.json({ message: "OTP sent to teacher email" });
};

/* ================= TEACHER VERIFY OTP + RESET PASSWORD ================= */

export const teacherResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email, role: "teacher" });
  if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  res.json({ message: "Teacher password reset successful" });
};


/* ================= TEACHER CHANGE PASSWORD ================= */

export const teacherChangePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  const user = await User.findOne({ _id: userId, role: "teacher" });
  if (!user) {
    return res.status(404).json({ error: "Teacher not found" });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Old password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password changed successfully" });
};
