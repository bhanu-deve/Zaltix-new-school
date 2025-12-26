import express from "express";
import {
  studentLogin,
  changeStudentPassword,
} from "../controllers/studentAuthController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", studentLogin);
router.put("/change-password", verifyToken, changeStudentPassword);

export default router;
