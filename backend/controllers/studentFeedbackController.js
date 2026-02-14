import StudentFeedback from '../models/studentFeedback.js';

export const createStudentFeedback = async (req, res) => {
  try {
    const {
      studentName,
      rollNumber,
      className,
      teacherId,
      teacherName,
      teacherRole,
      feedback,
      rating,
    } = req.body;

    const newFeedback = new StudentFeedback({
      studentName,
      rollNumber,
      className,
      teacherId,
      teacherName,
      teacherRole,
      feedback,
      rating,
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentFeedbacks = async (req, res) => {
  try {
    const feedbacks = await StudentFeedback
      .find()
      .populate('teacherId', 'name role')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch feedbacks' });
  }
};

