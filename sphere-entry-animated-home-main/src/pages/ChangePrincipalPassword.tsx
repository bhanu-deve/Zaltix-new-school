import React, { useState } from "react";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";

const ChangePrincipalPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    await api.post("/api/auth/principal/update", {
      newEmail: email,
      newPassword: password
    });

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    user.firstLogin = false;
    localStorage.setItem("user", JSON.stringify(user));

    navigate("/dashboard/principal");
  };

  return (
    <div>
      <input placeholder="New Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="New Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Update</button>
    </div>
  );
};

export default ChangePrincipalPassword;
