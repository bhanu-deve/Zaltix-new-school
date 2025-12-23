import express from 'express';
import {
  getAllBuses,
  createBus,
  getBusStudents,
  deleteBus
} from '../controllers/busController.js';

const router = express.Router();

router.get('/', getAllBuses);
router.post('/', createBus);
router.get('/:busId', getBusStudents);
router.delete('/:id', deleteBus);

export default router;
