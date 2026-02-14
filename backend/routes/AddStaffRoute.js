import express from 'express';
import {
  addStaff,
  getAllStaff,
  deleteStaff,
  updateStaff,
} from '../controllers/staffController.js';

const router = express.Router();

router.post('/', addStaff);
router.get('/', getAllStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

export default router;
