import express from 'express';
import {
  createStock,
  getAllStock,
  updateStock,
  deleteStock
} from '../controllers/stockController.js';

const router = express.Router();

router.post('/', createStock);
router.get('/', getAllStock);
router.put('/:id', updateStock);
router.delete('/:id', deleteStock);

export default router;
