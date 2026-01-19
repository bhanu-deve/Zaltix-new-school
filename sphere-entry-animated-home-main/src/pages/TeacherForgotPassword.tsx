import React, { useState } from "react";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";

const TeacherForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ===== SEND / RESEND OTP ===== */
  const sendOTP = async () => {
    if (!email) {
      alert("Enter email");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/teacher/forgot-password", { email });
      alert("OTP sent to email");
      setStep(2);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ===== VERIFY OTP & RESET PASSWORD ===== */
  const resetPassword = async () => {
    if (!otp || !newPassword) {
      alert("Enter OTP and new password");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/teacher/reset-password", {
        email,
        otp,
        newPassword
      });

      alert("Password updated successfully");
      navigate("/login?role=teacher");
    } catch (err: any) {
      alert(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Teacher Forgot Password</h2>

      {/* ===== STEP 1: EMAIL ===== */}
      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br /><br />
          <button onClick={sendOTP} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {/* ===== STEP 2: OTP + PASSWORD ===== */}
      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <br /><br />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <br /><br />

          <button onClick={resetPassword} disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>

          <br /><br />

          {/* 🔁 RESEND OTP */}
          <button onClick={sendOTP} disabled={loading}>
            Resend OTP
          </button>
        </>
      )}
    </div>
  );
};

export default TeacherForgotPassword;
