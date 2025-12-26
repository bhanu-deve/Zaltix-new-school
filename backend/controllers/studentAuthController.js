import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import Student from "../models/StudentRegistration.js";

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
    const token = jwt.sign(
      {
        id: student._id,
        rollNumber: student.rollNumber,
        role: "student",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
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

