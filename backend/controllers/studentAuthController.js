import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../models/StudentRegistration.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

/* ================= LOGIN ================= */
export const studentLogin = async (req, res) => {
  try {
    let { rollNumber, password } = req.body;

    rollNumber = String(rollNumber).trim();
    password = String(password).trim();

    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(401).json({ error: "Invalid roll number or password" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid roll number or password" });
    }

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      student: {
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        rollNumber: student.rollNumber,
        grade: student.grade,
        section: student.section,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

/* ================= CHANGE PASSWORD (LOGGED IN) ================= */
export const changeStudentPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) return res.status(404).json({ error: "Student not found" });

    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isMatch)
      return res.status(401).json({ error: "Old password incorrect" });

    student.password = await bcrypt.hash(newPassword, 10);
    await student.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch {
    res.status(500).json({ error: "Password update failed" });
  }
};

/* ================= SEND OTP ================= */
export const sendOtp = async (req, res) => {
  try {
    const { rollNumber } = req.body;

    const student = await Student.findOne({ rollNumber });
    if (!student || !student.parentEmail) {
      return res.status(404).json({ error: "Student not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    student.resetOtp = otp;
    student.resetOtpExpiry = Date.now() + 20 * 60 * 1000; // 4 minutes

    await student.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: student.parentEmail,
      subject: "Password Reset OTP",
      text: `OTP: ${otp}`,
    });

    res.json({ success: true, message: "OTP sent to parent email" });
  } catch (err) {
      console.error("🔥 OTP ERROR:", err);   // 👈 THIS IS THE KEY
      res.status(500).json({
        error: "OTP sending failed",
        details: err.message || err,
      });
    }
};

/* ================= OTP LOGIN ================= */
export const verifyOtpLogin = async (req, res) => {
  try {
    const { rollNumber, otp } = req.body;

    const student = await Student.findOne({ rollNumber });
    if (
      !student ||
      student.resetOtp !== otp ||
      student.resetOtpExpiry < Date.now()
    ) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    student.resetOtp = null;
    student.resetOtpExpiry = null;
    await student.save();

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      token,
      student: {
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        rollNumber: student.rollNumber,
        grade: student.grade,
        section: student.section,
      },
    });
  } catch {
    res.status(500).json({ error: "OTP login failed" });
  }
};

/* ================= RESET PASSWORD WITH OTP ================= */
export const changePasswordWithOtp = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    const student = await Student.findOne({ resetOtp: otp });
    if (!student || student.resetOtpExpiry < Date.now()) {
      return res.status(400).json({ error: "OTP expired or invalid" });
    }

    student.password = await bcrypt.hash(newPassword, 10);
    student.resetOtp = null;
    student.resetOtpExpiry = null;
    await student.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch {
    res.status(500).json({ error: "Password reset failed" });
  }
};
