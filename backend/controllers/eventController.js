import Event from '../models/Event.js';

// CREATE Event
export const createEvent = async (req, res) => {
  try {
    const { title, category, date, participants, description, status } = req.body;

    if (!title || !category || !date) {
      return res.status(400).json({ message: 'Title, category and date are required' });
    }

    const newEvent = new Event({
      title,
      category,
      date,
      participants: participants || 0,
      description: description || '',
      status: status || 'Upcoming'
    });

    await newEvent.save();
    res.status(201).json(newEvent);

  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({
      message: 'Failed to create event',
      error: err.message
    });
  }
};

// GET all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).exec();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch events',
      error: err.message
    });
  }
};

// DELETE event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event deleted successfully' });

  } catch (err) {
    res.status(500).json({
      message: 'Failed to delete event',
      error: err.message
    });
  }
};

// UPDATE event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to update event',
      error: err.message
    });
  }
};