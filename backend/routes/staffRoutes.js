import express from 'express';
import { AddStaff as Staff } from '../models/AddStaff.js';

const router = express.Router();

// Get all staff (including photos)
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find(); // ✅ FIXED HERE

    console.log('Backend - Found staff:', staff.length);
    if (staff.length > 0) {
      console.log('Backend - First staff photo exists:', !!staff[0].photo);
    }

    res.json(staff);
  } catch (err) {
    console.error('Backend error:', err);
    res.status(500).json({ message: 'Failed to fetch staff' });
  }
});

// Get single staff member
router.get('/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch staff' });
  }
});

export default router;
