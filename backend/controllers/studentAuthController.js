import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import Student from "../models/StudentRegistration.js";

import { sendOTPEmail } from "../utils/mailer.js";

const generateNumericOTP = (length = 6) => {
  return Math.floor(
    Math.pow(10, length - 1) +
    Math.random() * 9 * Math.pow(10, length - 1)
  ).toString();
};


export const studentLogin = async (req, res) => {
  try {
    let { rollNumber, password } = req.body;

    // ✅ FORCE STRING + TRIM (CRITICAL)
    rollNumber = String(rollNumber).trim();
    password = String(password).trim();
    
    console.log("=== STUDENT LOGIN API HIT ===");
    console.log("REQ BODY:", req.body);


    console.log("LOGIN ATTEMPT:", rollNumber, password);

    const student = await Student.findOne({ rollNumber });

    if (!student) {
      console.log("❌ Student not found");
      return res.status(401).json({ error: "Invalid roll number or password" });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ error: "Invalid roll number or password" });
    }

    // ✅ JWT
    // const token = jwt.sign(
    //   {
    //     id: student._id,
    //     rollNumber: student.rollNumber,
    //     role: "student",
    //   },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "7d" }
    // );

    // return res.json({
    //   token,
    //   student: {
    //     id: student._id,
    //     name: `${student.firstName} ${student.lastName}`,
    //     rollNumber: student.rollNumber,
    //     grade: student.grade,
    //     section: student.section,
    //   },
    // });
    const payload = {
      id: student._id,
      rollNumber: student.rollNumber,
      role: "student",
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );

    return res.json({
      accessToken,
      refreshToken,
      student: {
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        rollNumber: student.rollNumber,
        grade: student.grade,
        section: student.section,
      },
    });



  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

//student change the password
export const changeStudentPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isMatch)
      return res.status(401).json({ error: "Old password incorrect" });

    student.password = await bcrypt.hash(newPassword, 10);
    await student.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Password update failed" });
  }
};

// export const refreshStudentToken = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;
//     if (!refreshToken) {
//       return res.status(401).json({ error: "Refresh token required" });
//     }

//     const decoded = jwt.verify(
//       refreshToken,
//       process.env.JWT_REFRESH_SECRET
//     );

//     const accessToken = jwt.sign(
//       {
//         id: decoded.id,
//         role: decoded.role,
//       },
//       process.env.JWT_ACCESS_SECRET,   // ✅ CORRECT SECRET
//       { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
//     );


//     res.json({ accessToken });
//   } catch (err) {
//     res.status(403).json({ error: "Invalid refresh token" });
//   }
// };
export const refreshStudentToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const accessToken = jwt.sign(
      {
        id: decoded.id,
        role: decoded.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );

    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ error: "Invalid refresh token" });
  }
};


/* SEND OTP */
export const forgotPassword = async (req, res) => {
  const { rollNumber } = req.body;

  const student = await Student.findOne({ rollNumber });
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  if (!student.parentEmail) {
    return res.status(400).json({ error: "Parent email not registered" });
  }



  const otp = generateNumericOTP(6);


  student.otp = otp;
  student.otpExpiry = Date.now() + 5 * 60 * 1000;

  await student.save();
  await sendOTPEmail(student.parentEmail, otp);

  res.json({ message: "OTP sent to registered email" });
};

/* VERIFY OTP */
export const verifyOTP = async (req, res) => {
  const { rollNumber, otp } = req.body;

  const student = await Student.findOne({ rollNumber });
  if (!student || student.otp !== otp || Date.now() > student.otpExpiry)
    return res.status(400).json({ error: "Invalid or expired OTP" });

  res.json({ message: "OTP verified" });
};

/* RESET PASSWORD */
export const resetPassword = async (req, res) => {
  const { rollNumber, otp, newPassword } = req.body;

  const student = await Student.findOne({ rollNumber });
  if (!student || student.otp !== otp || Date.now() > student.otpExpiry)
    return res.status(400).json({ error: "Invalid or expired OTP" });

  student.password = await bcrypt.hash(newPassword, 10);
  student.otp = null;
  student.otpExpiry = null;

  await student.save();
  res.json({ message: "Password reset successful" });
};

/* RESEND OTP */
export const resendOTP = async (req, res) => {
  const { rollNumber } = req.body;

  const student = await Student.findOne({ rollNumber });
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  if (!student.parentEmail) {
    return res.status(400).json({ error: "Parent email not registered" });
  }


  const otp = generateNumericOTP(6);

  student.otp = otp;
  student.otpExpiry = Date.now() + 5 * 60 * 1000;

  await student.save();
  await sendOTPEmail(student.parentEmail, otp);

  res.json({ message: "OTP resent successfully" });
};

