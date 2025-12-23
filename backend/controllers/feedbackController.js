import TeacherFeedback from '../models/AddFeedback.js';

// GET all feedbacks
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await TeacherFeedback.find().sort({ date: -1 }).exec();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE feedback
export const createFeedback = async (req, res) => {
  const { class: cls, subject, type, feedback, rating } = req.body;

  if (!cls || !subject || !type || !feedback || !rating) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const newFeedback = new TeacherFeedback({
    date: new Date().toISOString().split('T')[0],
    class: cls,
    subject,
    type,
    feedback,
    rating,
    status: 'Submitted',
  });

  try {
    const saved = await newFeedback.save();
    res.status(201).json({ success: true, insertedId: saved._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE feedback (this is the ACTUAL working one)
export const updateFeedback = async (req, res) => {
  try {
    const updated = await TeacherFeedback.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).exec();

    if (!updated) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE feedback
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await TeacherFeedback.findByIdAndDelete(req.params.id).exec();
    if (!feedback) return res.status(404).json({ message: 'Feedback not found.' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
