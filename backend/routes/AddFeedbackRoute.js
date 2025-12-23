import express from 'express';
import {
  getAllFeedbacks,
  createFeedback,
  updateFeedback,
  deleteFeedback
} from '../controllers/teacherFeedbackController.js';

const router = express.Router();

router.get('/', getAllFeedbacks);
router.post('/', createFeedback);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

export default router;
