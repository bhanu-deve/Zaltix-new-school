import path from 'path';
import fs from 'fs';
import Achievement from '../models/AddAchievements.js';

// CREATE Achievement
export const createAchievement = async (req, res) => {
  try {
    const { student, title, category, date, description } = req.body;

    if (!student || !title || !category || !date || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newAchievement = new Achievement({
      student,
      title,
      category,
      date,
      description,
      fileUrl: req.file ? `/uploads/achievements/${req.file.filename}` : null,
      fileType: req.file ? req.file.mimetype : null
    });

    await newAchievement.save();
    res.status(201).json(newAchievement);

  } catch (err) {
    console.error('Error creating achievement:', err);

    if (req.file) {
      const filePath = path.join(process.cwd(), 'uploads/achievements', req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.status(500).json({
      message: 'Failed to create achievement',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// GET all achievements
export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ date: -1 }).exec();
    res.status(200).json(achievements);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch achievements',
      error: err.message
    });
  }
};

// DELETE achievement
export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id).exec();
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    if (achievement.fileUrl) {
      const filePath = path.join(process.cwd(), achievement.fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Achievement.findByIdAndDelete(req.params.id).exec();
    res.status(200).json({ message: 'Achievement deleted successfully' });

  } catch (err) {
    res.status(500).json({
      message: 'Failed to delete achievement',
      error: err.message
    });
  }
};
