import Timetable from "../models/AddTimetable.js";

// CREATE or UPDATE timetable
export const saveOrUpdateTimetable = async (req, res) => {
  // const { className, section, academicYear, entries } = req.body;
  const className = req.params.className || req.body.className;
  const { section, academicYear, entries } = req.body;

  if (!className || !section || !academicYear || !entries) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existing = await Timetable
      .findOne({ className, section, academicYear })
      .exec();

    if (existing) {
      existing.entries = entries;
      await existing.save();
      return res.json({ message: 'Timetable updated', data: existing });
    }

    const timetable = new Timetable({ className, section, academicYear, entries });
    await timetable.save();

    res.status(201).json({ message: 'Timetable created', data: timetable });
  } catch (err) {
    console.error('Error saving timetable:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET timetable by class
// GET timetable by class + section
export const getTimetableByClass = async (req, res) => {
  try {
    const { className } = req.params;
    const { section } = req.query;

    const query = section
      ? { className, section }
      : { className };

    const timetable = await Timetable.findOne(query)
      .populate('entries.$*.teacher');

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.json({ data: timetable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getTimetableByTeacher = async (req, res) => {
  try {
    const { teacherName } = req.params;

    const timetables = await Timetable.find();

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const result = {};
    days.forEach(day => {
      result[day] = Array(6).fill("Break");
    });

    timetables.forEach(({ className, entries }) => {
      days.forEach(day => {
        const slots = entries.get(day) || [];
        slots.forEach((slot, index) => {
          if (
            typeof slot === "string" &&
            slot.toLowerCase().includes(teacherName.toLowerCase())
          ) {
            result[day][index] = `${slot} (${className})`;
          }
        });
      });
    });

    res.json({ data: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


