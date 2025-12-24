import bcrypt from "bcryptjs";
import Student from "../models/StudentRegistration.js";

export const addStudent = async (req, res) => {
  try {
    // console.log("REQ BODY:", req.body); // 🔴 MUST PRINT

    const {
      firstName,
      lastName,
      email,
      rollNumber,
      grade,
      section,
      dateOfBirth,
      password,
      parentName,
      parentPhone,
      parentEmail,
      address
    } = req.body;

    if (!firstName || !lastName || !rollNumber || !grade || !dateOfBirth || !password || !parentName || !parentPhone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await Student.findOne({ rollNumber });
    if (exists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      firstName,
      lastName,
      email,
      rollNumber,
      grade,
      section,
      dateOfBirth: new Date(dateOfBirth),
      password: hashedPassword,
      parentName,
      parentPhone,
      parentEmail,
      address
    });

    await student.save();

    return res.status(201).json({
      message: "Student added successfully"
    });

  } catch (err) {
    console.error("❌ ADD STUDENT ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};
