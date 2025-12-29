import Notification from '../models/AddNotifications.js';

/* 🔴 CHANGE 1: IMPORT io */
import { io } from '../index.js';

// ================= CREATE notification =================
export const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();

    /* 🔴 CHANGE 2: EMIT REAL-TIME SOCKET EVENT */
    if (notification.audience === 'All Classes' || notification.audience === 'ALL') {
      io.emit('new-notification', notification); // send to everyone
    } else {
      io.to(notification.audience).emit('new-notification', notification);
      // example audience: "10-A"
    }

    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ================= GET all notifications =================
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .exec();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= GET notification by ID =================
export const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).exec();
    if (!notification) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= UPDATE notification =================
export const updateNotification = async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).exec();

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(updatedNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= DELETE notification =================
export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id).exec();
    if (!deleted) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
