import express from "express";
import {
  studentLogin,
  changeStudentPassword,
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendOTP,
} from "../controllers/studentAuthController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { refreshStudentToken } from "../controllers/studentAuthController.js";

const router = express.Router();

router.post("/login", studentLogin);
router.put("/change-password", verifyToken, changeStudentPassword);

router.post("/forgot-password", forgotPassword);   // send OTP
router.post("/verify-otp", verifyOTP);              // verify OTP
router.post("/reset-password", resetPassword);      // set new password
router.post("/resend-otp", resendOTP);              // resend OTP
router.post("/refresh-token", refreshStudentToken);

export default router;
