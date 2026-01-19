import React, { useState } from "react";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";

const PrincipalForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ===== SEND OTP ===== */
  const sendOTP = async () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/principal/forgot-password", { email });
      alert("OTP sent to email");
      setStep(2);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ===== VERIFY OTP ===== */
  const verifyOTP = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/auth/principal/login-otp", {
        email,
        otp,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/principal/change-password");
    } catch (err: any) {
      alert(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Principal Forgot Password</h2>

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

      {/* ===== STEP 2: OTP ===== */}
      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <br /><br />
          <button onClick={verifyOTP} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
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

export default PrincipalForgotPassword;
