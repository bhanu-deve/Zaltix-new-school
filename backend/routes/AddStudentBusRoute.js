import express from 'express';
import {
  getAllBusStudents,
  addBusStudent
} from '../controllers/studentBusController.js';

const router = express.Router();

router.get('/', getAllBusStudents);
router.post('/', addBusStudent);

export default router;
