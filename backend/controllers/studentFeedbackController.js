import StudentFeedback from '../models/studentFeedback.js';

// CREATE student feedback
export const createStudentFeedback = async (req, res) => {
  try {
    const { teacher, feedback, rating } = req.body;

    if (!teacher || !feedback || !rating) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newFeedback = new StudentFeedback({ teacher, feedback, rating });
    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully.' });
  } catch (err) {
    console.error('Error saving feedback:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET all student feedback
export const getStudentFeedbacks = async (req, res) => {
  try {
    const feedbackList = await StudentFeedback
      .find()
      .sort({ createdAt: -1 })
      .exec();

    res.json(feedbackList);
  } catch (err) {
    console.error('Error fetching feedback:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
};
