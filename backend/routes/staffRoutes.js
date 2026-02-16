// import express from 'express';
// import { AddStaff as Staff } from '../models/AddStaff.js';


// const router = express.Router();

// router.get('/', async (req, res) => {
//   try {
//     const staff = await Staff.find({ status: 'Active' })
//       .select('_id name role subjects classes');
//     res.json(staff);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch staff' });
//   }
// });

// export default router;


import express from 'express';
import { AddStaff as Staff } from '../models/AddStaff.js';

const router = express.Router();

// Get all staff (including photos)
router.get('/', async (req, res) => {
  try {
    // Get all fields including photo
    const staff = await Staff.find({ status: 'Active' });
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