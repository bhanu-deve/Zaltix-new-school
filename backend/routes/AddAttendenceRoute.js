import express from "express";
import {
  subDays,
  subMonths,
  format,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval
} from "date-fns";

import Attendance from "../models/AddAttendence.js";
import StudentRegistration from "../models/StudentRegistration.js";

const router = express.Router();

/* =========================================================
   TEACHER – GET STUDENTS FOR MARKING ATTENDANCE
   ========================================================= */
router.get("/", async (req, res) => {
  try {
    const { class: className, date, subject } = req.query;

    const grade = className.slice(0, -1);
    const section = className.slice(-1);

    const students = await StudentRegistration.find({ grade, section });
    const attendance = await Attendance.find({});

    const result = students.map(stu => {
      const record = attendance.find(a => a.student.rollNo === stu.rollNumber);
      const day = record?.attendance.find(d => d.date === date);
      const subjectStatus = day?.subjects.find(s => s.subject === subject);

      return {
        student: {
          _id: stu._id,
          name: `${stu.firstName} ${stu.lastName}`,
          rollNo: stu.rollNumber,
          class: `${stu.grade}${stu.section}`
        },
        present: subjectStatus ? subjectStatus.present : false
      };
    });

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: "Failed to load students" });
  }
});

/* =========================================================
   TEACHER – UPDATE SINGLE STUDENT ATTENDANCE
   ========================================================= */
router.put("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { date, subject, present } = req.body;

    const student = await StudentRegistration.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    let record = await Attendance.findOne({
      "student.rollNo": student.rollNumber
    });

    if (!record) {
      record = new Attendance({
        student: {
          _id: student._id,
          name: `${student.firstName} ${student.lastName}`,
          rollNo: student.rollNumber,
          class: `${student.grade}${student.section}`
        },
        attendance: []
      });
    }

    let day = record.attendance.find(a => a.date === date);
    if (!day) {
      day = { date, subjects: [{ subject, present }] };
      record.attendance.push(day);
    } else {
      const subj = day.subjects.find(s => s.subject === subject);
      if (subj) subj.present = present;
      else day.subjects.push({ subject, present });
    }

    await record.save();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to update attendance" });
  }
});

/* =========================================================
   TEACHER – BULK SAVE ATTENDANCE
   ========================================================= */
router.post("/bulk", async (req, res) => {
  try {
    for (const entry of req.body) {
      const { studentId, date, subject, present } = entry;

      const student = await StudentRegistration.findById(studentId);
      if (!student) continue;

      let record = await Attendance.findOne({
        "student.rollNo": student.rollNumber
      });

      if (!record) {
        record = new Attendance({
          student: {
            _id: student._id,
            name: `${student.firstName} ${student.lastName}`,
            rollNo: student.rollNumber,
            class: `${student.grade}${student.section}`
          },
          attendance: []
        });
      }

      let day = record.attendance.find(a => a.date === date);
      if (!day) {
        day = { date, subjects: [{ subject, present }] };
        record.attendance.push(day);
      } else {
        const subj = day.subjects.find(s => s.subject === subject);
        if (subj) subj.present = present;
        else day.subjects.push({ subject, present });
      }

      await record.save();
    }

    res.json({ message: "Attendance saved successfully" });
  } catch (e) {
    res.status(500).json({ error: "Bulk save failed" });
  }
});

/* =========================================================
   PRINCIPAL – STUDENTS WITH ATTENDANCE
   ========================================================= */
router.get("/students-with-attendance", async (req, res) => {
  try {
    const { date, class: className } = req.query;

    let query = {};
    if (className) {
      query = {
        grade: className.slice(0, -1),
        section: className.slice(-1)
      };
    }

    const students = await StudentRegistration.find(query);
    const attendance = await Attendance.find({});

    const result = students.map(stu => {
      const record = attendance.find(a => a.student.rollNo === stu.rollNumber);
      const day = record?.attendance.find(d => d.date === date);
      const present = day?.subjects?.some(s => s.present) || false;

      return {
        _id: stu._id,
        name: `${stu.firstName} ${stu.lastName}`,
        rollNo: stu.rollNumber,
        class: `${stu.grade}${stu.section}`,
        present,
        subjects: day?.subjects || []
      };
    });

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

/* =========================================================
   PRINCIPAL – ATTENDANCE STATS
   ========================================================= */
router.get("/attendance-stats", async (req, res) => {
  try {
    const { date, class: className } = req.query;

    let query = {};
    if (className) {
      query = {
        grade: className.slice(0, -1),
        section: className.slice(-1)
      };
    }

    const students = await StudentRegistration.find(query);
    const attendance = await Attendance.find({});

    let presentToday = 0;

    students.forEach(stu => {
      const record = attendance.find(a => a.student.rollNo === stu.rollNumber);
      const day = record?.attendance.find(d => d.date === date);
      if (day?.subjects?.some(s => s.present)) presentToday++;
    });

    const totalStudents = students.length;
    const absentToday = totalStudents - presentToday;
    const avgAttendance = totalStudents
      ? Number(((presentToday / totalStudents) * 100).toFixed(1))
      : 0;

    res.json({ totalStudents, presentToday, absentToday, avgAttendance });
  } catch (e) {
    res.status(500).json({ error: "Failed to compute stats" });
  }
});

/* =========================================================
   PRINCIPAL – CLASS ATTENDANCE SUMMARY
   ========================================================= */
router.get("/class-attendance-summary", async (req, res) => {
  try {
    const { date } = req.query;

    const students = await StudentRegistration.find({});
    const attendance = await Attendance.find({});

    const map = {};

    students.forEach(stu => {
      const cls = `${stu.grade}${stu.section}`;
      if (!map[cls]) map[cls] = { total: 0, present: 0 };

      map[cls].total++;

      const record = attendance.find(a => a.student.rollNo === stu.rollNumber);
      const day = record?.attendance.find(d => d.date === date);
      if (day?.subjects?.some(s => s.present)) map[cls].present++;
    });

    const result = Object.keys(map).map(cls => ({
      class: cls,
      total: map[cls].total,
      present: map[cls].present,
      percentage: map[cls].total
        ? Number(((map[cls].present / map[cls].total) * 100).toFixed(1))
        : 0
    }));

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: "Failed to summarize class attendance" });
  }
});

/* =========================================================
   PRINCIPAL – ATTENDANCE TRENDS (CHART)
   ========================================================= */
router.get("/attendance-trends", async (req, res) => {
  try {
    const { viewType = "weekly", class: className } = req.query;
    const now = new Date();

    let dates = [];
    if (viewType === "daily") {
      dates = eachDayOfInterval({ start: subDays(now, 6), end: now });
    } else if (viewType === "weekly") {
      dates = eachWeekOfInterval({ start: subMonths(now, 1), end: now });
    } else {
      dates = eachMonthOfInterval({ start: subMonths(now, 6), end: now });
    }

    let query = {};
    if (className) {
      query = {
        grade: className.slice(0, -1),
        section: className.slice(-1)
      };
    }

    const students = await StudentRegistration.find(query);
    const attendance = await Attendance.find({});

    const data = dates.map(date => {
      let present = 0;
      let absent = 0;

      students.forEach(stu => {
        const record = attendance.find(a => a.student.rollNo === stu.rollNumber);
        let match;

        if (viewType === "daily") {
          const d = format(date, "yyyy-MM-dd");
          match = record?.attendance.find(a => a.date === d);
        } else if (viewType === "weekly") {
          const end = format(date, "yyyy-MM-dd");
          const start = format(subDays(date, 6), "yyyy-MM-dd");
          match = record?.attendance.find(a => a.date >= start && a.date <= end);
        } else {
          const m = format(date, "yyyy-MM");
          match = record?.attendance.find(a => a.date.startsWith(m));
        }

        if (match?.subjects?.some(s => s.present)) present++;
        else absent++;
      });

      return {
        period:
          viewType === "monthly"
            ? format(date, "MMM yyyy")
            : format(date, "MMM dd"),
        present,
        absent
      };
    });

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to load attendance trends" });
  }
});

/* =========================================================
   GET ALL CLASSES
   ========================================================= */
router.get("/classes", async (req, res) => {
  const students = await StudentRegistration.find({});
  const classes = [...new Set(students.map(s => `${s.grade}${s.section}`))];
  res.json(classes);
});

export default router;
