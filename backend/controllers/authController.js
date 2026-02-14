import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sendOTPEmail } from "../utils/mailer.js";

/* ================= LOGIN ================= */
// import bcrypt from "bcrypt";
// import User from "../models/User.js";
import { AddStaff } from "../models/AddStaff.js";
import jwt from "jsonwebtoken";

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // First principal login
    const principalExists = await User.findOne({ role: "principal" });
    if (!principalExists) {
      if (
        email === process.env.PRINCIPAL_EMAIL &&
        password === process.env.PRINCIPAL_PASSWORD
      ) {
        return res.json({
          user: { role: "principal", firstLogin: true }
        });
      }
    }

    // Normal login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let teacherName = null;

    if (user.role === "teacher" && user.staffId) {
      const staff = await AddStaff.findById(user.staffId).select("name");
      teacherName = staff?.name || null;
    }

    return res.json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        staffId: user.staffId || null,
        name: teacherName
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
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








export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};



export const mobileLogin = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 🔐 Teacher only
    const user = await User.findOne({ email, role: "teacher" });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let teacherName = null;
    if (user.staffId) {
      const staff = await AddStaff.findById(user.staffId).select("name");
      teacherName = staff?.name || null;
    }

    // 🔐 ACCESS TOKEN (short)
    const accessToken = jwt.sign(
      { id: user._id, role: "teacher" },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );

    // 🔐 REFRESH TOKEN (long)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );

    // (optional but recommended)
    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        email: user.email,
        role: "teacher",
        staffId: user.staffId,
        name: teacherName
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
