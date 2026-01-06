import Subject from '../models/AddSubject.js';

// CREATE subject
export const createSubject = async (req, res) => {
  try {
    const saved = await new Subject(req.body).save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET subjects (optionally by class)
export const getSubjects = async (req, res) => {
  try {
    const { className, section } = req.query;

    const filter = {};
    if (className) filter.className = className;
    if (section) filter.section = section;

    const subjects = await Subject.find(filter).exec();
    res.json(subjects);
  } catch {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};


// UPDATE subject
export const updateSubject = async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).exec();
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
};

// DELETE subject
export const deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id).exec();
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
};
