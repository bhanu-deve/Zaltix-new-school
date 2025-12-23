import Report from '../models/AddGrade.js';

// GET all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().exec();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

// GET student by name
export const getStudentByName = async (req, res) => {
  try {
    const student = await Report.findOne({
      name: { $regex: new RegExp('^' + req.params.name + '$', 'i') }
    }).exec();

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

// GET students by class
export const getStudentsByClass = async (req, res) => {
  try {
    const students = await Report.find({ class: req.params.className }).exec();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// ADD student report
export const addStudentReport = async (req, res) => {
  try {
    const {
      name,
      rollNo,
      class: className,
      math = 0,
      english = 0,
      science = 0,
      socialStudies = 0,
      computer = 0,
      hindi = 0,
    } = req.body;

    const marks = [math, english, science, socialStudies, computer, hindi].map(Number);
    const totalMarks = marks.reduce((a, b) => a + b, 0);
    const average = Math.round(totalMarks / marks.length);

    let grade = 'F';
    if (average >= 90) grade = 'A+';
    else if (average >= 80) grade = 'A';
    else if (average >= 70) grade = 'B+';
    else if (average >= 60) grade = 'B';
    else if (average >= 50) grade = 'C';
    else if (average >= 40) grade = 'D';

    const newStudent = await Report.create({
      name,
      rollNo,
      class: className,
      math,
      english,
      science,
      socialStudies,
      computer,
      hindi,
      totalMarks,
      average,
      grade,
    });

    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add student' });
  }
};

// UPDATE student report
export const updateStudentReport = async (req, res) => {
  try {
    const {
      math = 0,
      english = 0,
      science = 0,
      socialStudies = 0,
      computer = 0,
      hindi = 0,
    } = req.body;

    const marks = [math, english, science, socialStudies, computer, hindi].map(Number);
    const totalMarks = marks.reduce((a, b) => a + b, 0);
    const average = Math.round(totalMarks / marks.length);

    let grade = 'F';
    if (average >= 90) grade = 'A+';
    else if (average >= 80) grade = 'A';
    else if (average >= 70) grade = 'B+';
    else if (average >= 60) grade = 'B';
    else if (average >= 50) grade = 'C';
    else if (average >= 40) grade = 'D';

    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      {
        math,
        english,
        science,
        socialStudies,
        computer,
        hindi,
        totalMarks,
        average,
        grade,
      },
      { new: true }
    ).exec();

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update student' });
  }
};

// DELETE student
export const deleteStudentReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id).exec();
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete student' });
  }
};
