// import express from "express";
// import { login } from "../controllers/authController.js";

// const router = express.Router();
// router.post("/login", login);

// export default router;


import express from "express";
import {
  login,
  updatePrincipal,
  principalForgotPassword,
  principalLoginWithOTP,
  teacherForgotPassword,
  teacherResetPassword,
  teacherChangePassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/principal/update", updatePrincipal);
router.post("/principal/forgot-password", principalForgotPassword);
router.post("/principal/login-otp", principalLoginWithOTP);
router.post("/teacher/forgot-password", teacherForgotPassword);
router.post("/teacher/reset-password", teacherResetPassword);
router.post("/teacher/change-password", teacherChangePassword);



export default router;
