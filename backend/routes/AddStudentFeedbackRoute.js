import express from 'express';
import {
  createStudentFeedback,
  getStudentFeedbacks
} from '../controllers/studentFeedbackController.js';

const router = express.Router();

router.post('/', createStudentFeedback);
router.get('/', getStudentFeedbacks);

export default router;
