import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import api from "@/api/api";

export default function ForgotPassword() {
  const router = useRouter();

  const [step, setStep] = useState<"ROLL" | "RESET">("ROLL");

  const [rollNumber, setRollNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    if (!rollNumber.trim()) {
      Toast.show({ type: "error", text1: "Enter roll number" });
      return;
    }

    try {
      await api.post("/student-auth/forgot-password", { rollNumber });

      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: "Check parent email",
      });

      setStep("RESET");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err?.response?.data?.error || "Failed to send OTP",
      });
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      Toast.show({ type: "error", text1: "Fill all fields" });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match" });
      return;
    }

    try {
      await api.put("/student-auth/reset-password", {
        otp,
        newPassword,
      });

      Toast.show({
        type: "success",
        text1: "Password reset successful",
      });

      router.replace("/"); // 👈 Login page
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err?.response?.data?.error || "Reset failed",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>

        {step === "ROLL" && (
          <>
            <Text style={styles.label}>Roll Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter roll number"
              value={rollNumber}
              onChangeText={setRollNumber}
            />

            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          </>
        )}

        {step === "RESET" && (
          <>
            <Text style={styles.label}>OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
            />

            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="New password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#fff", padding: 24, borderRadius: 16 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#008080",
    textAlign: "center",
    marginBottom: 20,
  },
  label: { marginBottom: 6, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#008080",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#008080",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
