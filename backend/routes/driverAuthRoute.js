import express from "express";
import Driver from "../models/Driver.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (otp !== "1234") {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    const driver = await Driver.findOne({ mobile });
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
