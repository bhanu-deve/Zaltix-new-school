import Student from "../models/AddGrade.js";

/* =========================
   GET ALL REPORTS
========================= */
export const getAllReports = async (req, res) => {
  try {
    const reports = await Student.find().exec();
    res.json(reports);
  } catch {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

/* =========================
   GET STUDENT BY NAME
========================= */
export const getStudentByName = async (req, res) => {
  try {
    const student = await Student.findOne({
      name: { $regex: new RegExp("^" + req.params.name + "$", "i") },
    }).exec();

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch {
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

/* =========================
   GET STUDENT BY ROLL NO
========================= */
export const getStudentByRollNo = async (req, res) => {
  try {
    const { rollNo } = req.params;
    const { examType } = req.query; // 👈 IMPORTANT

    const query = { rollNo };
    if (examType) query.examType = examType;

    const student = await Student.findOne(query).exec();

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch {
    res.status(500).json({ error: "Failed to fetch student" });
  }
};


/* =========================
   GET STUDENTS BY CLASS + EXAM
========================= */
export const getStudentsByClass = async (req, res) => {
  try {
    const { className, examType } = req.params;

    const students = await Student.find({
      class: className,
      examType,
    }).exec();

    res.json(students);
  } catch {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

/* =========================
   ADD STUDENT REPORT
========================= */
export const addStudentReport = async (req, res) => {
  try {
    const {
      name,
      rollNo,
      class: className,
      examType,
      marks = {},
    } = req.body;

    const values = Object.values(marks).map(Number);
    const totalMarks = values.reduce((a, b) => a + b, 0);
    const average = values.length ? Math.round(totalMarks / values.length) : 0;

    let grade = "F";
    if (average >= 90) grade = "A+";
    else if (average >= 80) grade = "A";
    else if (average >= 70) grade = "B+";
    else if (average >= 60) grade = "B";
    else if (average >= 50) grade = "C";
    else if (average >= 40) grade = "D";

    const student = await Student.create({
      name,
      rollNo,
      class: className,
      examType,
      marks,
      totalMarks,
      average,
      grade,
    });

    res.status(201).json(student);
  } catch {
    res.status(500).json({ error: "Failed to add student report" });
  }
};

/* =========================
   UPDATE STUDENT REPORT
========================= */
export const updateStudentReport = async (req, res) => {
  try {
    const { marks, totalMarks, average, grade } = req.body;

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { marks, totalMarks, average, grade },
      { new: true }
    ).exec();

    res.json(updated);
  } catch {
    res.status(400).json({ error: "Failed to update student" });
  }
};

/* =========================
   DELETE STUDENT REPORT
========================= */
export const deleteStudentReport = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id).exec();
    res.json({ message: "Student deleted" });
  } catch {
    res.status(400).json({ error: "Failed to delete student" });
  }
};
