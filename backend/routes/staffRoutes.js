import express from 'express';
import { AddStaff as Staff } from '../models/AddStaff.js';


const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find({ status: 'Active' })
      .select('_id name role subjects classes');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch staff' });
  }
});

export default router;
