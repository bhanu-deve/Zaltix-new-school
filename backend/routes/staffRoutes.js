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
    // Remove the .select() to get all fields, or explicitly include photo
    const staff = await Staff.find({ status: 'Active' })
      .select('_id name role subjects classes email phone status photo joinDate'); // Added photo here
    res.json(staff);
  } catch (err) {
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