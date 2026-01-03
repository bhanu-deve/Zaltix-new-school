import express from "express";
import {
  studentLogin,
  changeStudentPassword,
  sendOtp,
  verifyOtpLogin,
  changePasswordWithOtp,
} from "../controllers/studentAuthController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", studentLogin);
router.post("/forgot-password", sendOtp);
router.post("/otp-login", verifyOtpLogin);
router.put("/reset-password", changePasswordWithOtp);
router.put("/change-password", verifyToken, changeStudentPassword);

export default router;
