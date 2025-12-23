import express from 'express';
import {
  createMockTest,
  getMockTests,
  updateMockTest,
  deleteMockTest
} from '../controllers/mocktestController.js';

const router = express.Router();

router.post('/', createMockTest);
router.get('/', getMockTests);
router.put('/:id', updateMockTest);
router.delete('/:id', deleteMockTest);

export default router;
