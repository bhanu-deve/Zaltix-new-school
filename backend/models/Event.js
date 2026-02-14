import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  participants: { type: Number, default: 0 },
  description: { type: String, default: '' },
  status: { type: String, default: 'Upcoming' },
  createdBy: { type: String, default: 'teacher' },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', EventSchema);
export default Event;