// import express from 'express';
// import Timetable from '../models/AddTimetable.js';

// const router = express.Router();

// /* ================= GET ALL ================= */
// router.get('/', async (req, res) => {
//   try {
//     const data = await Timetable.find();
//     res.json({ data });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /* ================= GET BY CLASS (NO 404) ================= */
// router.get('/:className', async (req, res) => {
//   try {
//     let timetable = await Timetable.findOne({
//       className: req.params.className,
//     });

//     // 🔥 AUTO-CREATE IF NOT EXISTS
//     if (!timetable) {
//       timetable = await Timetable.create({
//         className: req.params.className,
//         section: req.params.className.slice(-1),
//         academicYear: '2024-25',
//         entries: {
//           Monday: [],
//           Tuesday: [],
//           Wednesday: [],
//           Thursday: [],
//           Friday: [],
//           Saturday: [],
//         },
//       });
//     }

//     res.json({ data: timetable });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /* ================= CREATE ================= */
// router.post('/', async (req, res) => {
//   try {
//     const timetable = new Timetable(req.body);
//     await timetable.save();
//     res.status(201).json({ message: 'Created', data: timetable });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /* ================= UPDATE (🔥 UPSERT FIX) ================= */
// router.put('/:className', async (req, res) => {
//   try {
//     const updated = await Timetable.findOneAndUpdate(
//       { className: req.params.className },
//       { $set: req.body },
//       { new: true, upsert: true } // 🔥 IMPORTANT
//     );

//     res.json({ message: 'Saved', data: updated });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// /* ================= GET BY TEACHER ================= */
// router.get('/teacher/:teacherName', async (req, res) => {
//   try {
//     const { teacherName } = req.params;

//     const timetables = await Timetable.find();

//     const days = [
//       'Monday',
//       'Tuesday',
//       'Wednesday',
//       'Thursday',
//       'Friday',
//       'Saturday',
//     ];

//     const result = {};
//     days.forEach(day => {
//       result[day] = Array(6).fill('Break');
//     });

//     timetables.forEach(({ className, entries }) => {
//       days.forEach(day => {
//         const slots = entries?.[day] || [];
//         slots.forEach((slot, index) => {
//           if (
//             typeof slot === 'string' &&
//             slot.toLowerCase().includes(teacherName.toLowerCase())
//           ) {
//             result[day][index] = `${slot} (${className})`;
//           }
//         });
//       });
//     });

//     res.json({ data: result });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /* ================= DELETE ================= */
// router.delete('/:className', async (req, res) => {
//   try {
//     await Timetable.findOneAndDelete({
//       className: req.params.className,
//     });
//     res.json({ message: 'Deleted' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// export default router;

import express from 'express';
import Timetable from '../models/AddTimetable.js';
import Subject from "../models/AddSubject.js";

const router = express.Router();

/* ================= GET ALL ================= */
router.get('/', async (req, res) => {
  try {
    const data = await Timetable.find();
    res.json({ data });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});



/* ================= GET BY CLASS ================= */
router.get('/:className', async (req, res) => {
  try {
    let timetable = await Timetable.findOne({
      className: req.params.className,
    });

    if (!timetable) {
      timetable = await Timetable.create({
        className: req.params.className,
        section: req.params.className.slice(-1),
        academicYear: '2024-25',
        entries: {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
        },
      });
    }

    res.json({ data: timetable });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ================= CREATE ================= */
router.post('/', async (req, res) => {
  try {
    const timetable = new Timetable(req.body);
    await timetable.save();
    res.status(201).json({ message: 'Created', data: timetable });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ================= UPDATE (UPSERT) ================= */
router.put('/:className', async (req, res) => {
  try {
    const updated = await Timetable.findOneAndUpdate(
      { className: req.params.className },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json({ message: 'Saved', data: updated });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ================= DELETE ================= */
// router.delete('/:className', async (req, res) => {
//   try {
//     await Timetable.findOneAndDelete({
//       className: req.params.className,
//     });
//     res.json({ message: 'Deleted' });
//   } catch {
//     res.status(500).json({ message: 'Server error' });
//   }
// });
router.get('/:className', async (req, res) => {
  try {
    const timetable = await Timetable.findOne({
      className: req.params.className,
    });

    if (!timetable) {
      return res.json({ data: null });
    }

    res.json({ data: timetable });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= GET TEACHER TIMETABLE (FINAL & CORRECT) =================
router.get('/teacher/:teacherName', async (req, res) => {
  try {
    const teacherName = req.params.teacherName.toLowerCase().trim();

    const timetables = await Timetable.find();

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlotsCount = 6;

    const schedule = {};
    days.forEach(day => {
      schedule[day] = Array(timeSlotsCount).fill('Break');
    });

    timetables.forEach(({ className, entries }) => {
      days.forEach(day => {
        // ✅ CORRECT FOR Map
        const daySlots = entries.get(day) || [];

        for (let i = 0; i < timeSlotsCount; i++) {
          const slot = daySlots[i];
          if (
            typeof slot === 'string' &&
            slot.toLowerCase().includes(teacherName)
          ) {
            schedule[day][i] = `${slot} (${className})`;
          }
        }
      });
    });

    res.json({ data: schedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= GET SUBJECTS BY CLASS + SECTION =================
router.get("/subjects/:className", async (req, res) => {
  try {
    const { className } = req.params;
    const { section } = req.query;

    const subjects = await Subject.find({
      className,
      section
    }).select("name teacher -_id");

    res.json({ data: subjects });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});




export default router;
