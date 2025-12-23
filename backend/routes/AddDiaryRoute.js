import express from 'express';
import {
  createDiary,
  getDiaryEntries,
  updateDiary,
  deleteDiary
} from '../controllers/diaryController.js';

const router = express.Router();

router.post('/', createDiary);
router.get('/', getDiaryEntries);
router.put('/:id', updateDiary);
router.delete('/:id', deleteDiary);

export default router;
