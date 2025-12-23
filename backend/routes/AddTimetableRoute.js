import express from 'express';
import {
  saveOrUpdateTimetable,
  getTimetableByClass
} from '../controllers/timetableController.js';

const router = express.Router();

router.post('/', saveOrUpdateTimetable);
router.get('/:className', getTimetableByClass);

export default router;
