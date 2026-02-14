import express from 'express';
import {
  createEvent,
  getEvents,
  deleteEvent,
  updateEvent
} from '../controllers/eventController.js';

const router = express.Router();

router.post('/', createEvent);
router.get('/', getEvents);
router.delete('/:id', deleteEvent);
router.put('/:id', updateEvent);

export default router;