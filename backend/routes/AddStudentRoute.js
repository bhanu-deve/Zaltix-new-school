import express from 'express';
import { addStudent } from '../controllers/studentController.js';

const router = express.Router();

router.post('/Addstudent', addStudent);


export default router;
