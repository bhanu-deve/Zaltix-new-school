import express from 'express';
import {
  getAllFees,
  getStudentFees,
  getClassWiseFees,
  createFee,
  updateFee,
  deleteFee
} from '../controllers/feeController.js';

const router = express.Router();

router.get('/', getAllFees);
router.get('/student', getStudentFees);
router.get('/class', getClassWiseFees);
router.post('/', createFee);
router.put('/:id', updateFee);
router.delete('/:id', deleteFee);

export default router;
