import express from 'express';
import {
  getAllReports,
  getStudentByName,
  getStudentsByClass,
  addStudentReport,
  updateStudentReport,
  deleteStudentReport
} from '../controllers/gradeController.js';

const router = express.Router();

router.get('/', getAllReports);
router.get('/student/:name', getStudentByName);   // 🔥 must be before :className
router.get('/:className', getStudentsByClass);

router.post('/', addStudentReport);
router.put('/:id', updateStudentReport);
router.delete('/:id', deleteStudentReport);

export default router;
