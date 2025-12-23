import express from 'express';
import uploadAchievement from '../Middlewares/AchieveUpload.js';
import {
  createAchievement,
  getAchievements,
  deleteAchievement
} from '../controllers/achievementController.js';

const router = express.Router();

router.post('/', uploadAchievement.single('file'), createAchievement);
router.get('/', getAchievements);
router.delete('/:id', deleteAchievement);

export default router;
