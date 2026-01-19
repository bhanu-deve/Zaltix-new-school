import React, { useState } from "react";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";

const TeacherChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/teacher/change-password", {
        userId: user._id,
        oldPassword,
        newPassword
      });

      alert("Password changed. Please login again.");
      localStorage.clear();
      navigate("/login?role=teacher");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Change Password</h2>

      <input
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleChangePassword} disabled={loading}>
        {loading ? "Updating..." : "Change Password"}
      </button>
    </div>
  );
};

export default TeacherChangePassword;
