import AddDiary from '../models/AddDiary.js';

// CREATE diary entry
export const createDiary = async (req, res) => {
  const { date, class: studentClass, section, subject, notes } = req.body;


  if (!date || !studentClass || !subject || !notes) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
      const newDiaryEntry = new AddDiary({
        date: new Date(date),
        class: studentClass,
        section,
        subject,
        notes,
      });


    const savedEntry = await newDiaryEntry.save(); // ✅ FIXED
    res.status(201).json(savedEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add diary entry' });
  }
};

// GET diary entries (by date optional)
export const getDiaryEntries = async (req, res) => {
  try {
    const { date, class: studentClass, section } = req.query;

    let filter = {};

    if (studentClass) filter.class = studentClass;
    if (section) filter.section = section;

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const entries = await AddDiary.find(filter)
      .sort({ date: -1 })
      .exec();

    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch diary entries' });
  }
};


// UPDATE diary entry
export const updateDiary = async (req, res) => {
  const { id } = req.params;
  const { date, class: studentClass, section, subject, notes } = req.body;

  if (!date || !studentClass || !section || !subject || !notes) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updated = await AddDiary.findByIdAndUpdate(
      id,
      {
        date: new Date(date),
        class: studentClass,
        section,          // ✅ SAVE SECTION
        subject,
        notes,
      },
      { new: true }
    ).exec();

    if (!updated) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update diary entry' });
  }
};


// DELETE diary entry
export const deleteDiary = async (req, res) => {
  try {
    const deleted = await AddDiary.findByIdAndDelete(req.params.id).exec(); // ✅ exec OK
    if (!deleted) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json({ message: 'Diary entry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete diary entry' });
  }
};
