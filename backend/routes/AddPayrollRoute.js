import express from 'express';
import {
  createPayroll,
  getPayrolls,
  updatePayroll,
  deletePayroll
} from '../controllers/payrollController.js';

const router = express.Router();

router.post('/', createPayroll);
router.get('/', getPayrolls);
router.put('/:id', updatePayroll);
router.delete('/:id', deletePayroll);

export default router;
