// import express from 'express';
// import {
//   getAllStaff,
//   addStaff,
//   deleteStaff
// } from '../controllers/staffController.js';

// const router = express.Router();

// router.get('/', getAllStaff);
// router.post('/', addStaff);
// router.delete('/:id', deleteStaff);

// export default router;
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

export default router; // ✅ FIX
