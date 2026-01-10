import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import api from "../api/api";

export const unstable_settings = {
  headerShown: false,
};

const { width } = Dimensions.get('window');

export default function LoginPage() {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Admission, 2: OTP, 3: New Password
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();

  // Clear old token on load


  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  /* ===================== LOGIN HANDLER ===================== */
  const handleSignIn = async () => {
    if (!admissionNumber || !password) {
      Toast.show({
        type: "error",
        text1: "Please enter all fields",
      });
      return;
    }

    try {
      const res = await api.post("/student-auth/login", {
        rollNumber: admissionNumber,
        password,
      });

      console.log("LOGIN API RESPONSE:", res.data);

      // Save JWT & student profile

      const student = res.data.student;

      // ✅ build className correctly
      const className = `${student.grade}${student.section}`;


      // await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("accessToken", res.data.accessToken);
      await AsyncStorage.setItem("refreshToken", res.data.refreshToken);

      await AsyncStorage.setItem("student", JSON.stringify(student));

      await AsyncStorage.setItem("rollNo", student.rollNumber.toString());

      await AsyncStorage.setItem("className", className); // ✅ FIXED
      await AsyncStorage.setItem("section", student.section);


      Toast.show({
        type: "success",
        text1: "Login Successful 🎉",
      });

      router.replace("/(tabs)/home");
    } catch (err: any) {
      console.log("❌ LOGIN ERROR:", err?.response?.data);
      Toast.show({
        type: "error",
        text1: err?.response?.data?.error || "Login failed",
      });
    }
  };

  /* ===================== FORGOT PASSWORD HANDLERS ===================== */
  const handleForgotPassword = () => {
    setForgotPasswordModal(true);
    setForgotPasswordStep(1);
    setAdmissionNumber('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSendOTP = async () => {
    if (!admissionNumber) {
      Toast.show({
        type: "error",
        text1: "Please enter admission number",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/student-auth/forgot-password", {
        rollNumber: admissionNumber,
      });

      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: response.data.message || "OTP sent to your registered email",
      });

      setForgotPasswordStep(2);
      setTimer(60); // 60 seconds timer
      setCanResend(false);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err?.response?.data?.error || "Failed to send OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Please enter valid 6-digit OTP",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/student-auth/verify-otp", {
        rollNumber: admissionNumber,
        otp: otp,
      });

      Toast.show({
        type: "success",
        text1: "OTP Verified",
        text2: "Now set your new password",
      });

      setForgotPasswordStep(3);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err?.response?.data?.error || "Invalid OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Please enter both passwords",
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password must be at least 6 characters",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/student-auth/reset-password", {
        rollNumber: admissionNumber,
        otp: otp,
        newPassword: newPassword,
      });

      Toast.show({
        type: "success",
        text1: "Password Reset Successful",
        text2: "You can now login with new password",
      });

      handleCloseModal();
      setPassword(''); // Clear password field
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err?.response?.data?.error || "Failed to reset password",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const response = await api.post("/student-auth/resend-otp", {
        rollNumber: admissionNumber,
      });

      Toast.show({
        type: "success",
        text1: "OTP Resent",
        text2: "New OTP sent to your email",
      });

      setTimer(60);
      setCanResend(false);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err?.response?.data?.error || "Failed to resend OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setForgotPasswordModal(false);
    setForgotPasswordStep(1);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setTimer(0);
    setCanResend(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      <View style={styles.stepRow}>
        <View style={[styles.stepCircle, forgotPasswordStep >= 1 && styles.stepCircleActive]}>
          <Text style={[styles.stepText, forgotPasswordStep >= 1 && styles.stepTextActive]}>1</Text>
        </View>
        <View style={[styles.stepLine, forgotPasswordStep >= 2 && styles.stepLineActive]} />
        <View style={[styles.stepCircle, forgotPasswordStep >= 2 && styles.stepCircleActive]}>
          <Text style={[styles.stepText, forgotPasswordStep >= 2 && styles.stepTextActive]}>2</Text>
        </View>
        <View style={[styles.stepLine, forgotPasswordStep >= 3 && styles.stepLineActive]} />
        <View style={[styles.stepCircle, forgotPasswordStep >= 3 && styles.stepCircleActive]}>
          <Text style={[styles.stepText, forgotPasswordStep >= 3 && styles.stepTextActive]}>3</Text>
        </View>
      </View>
      <View style={styles.stepLabels}>
        <Text style={[styles.stepLabel, forgotPasswordStep >= 1 && styles.stepLabelActive]}>Admission</Text>
        <Text style={[styles.stepLabel, forgotPasswordStep >= 2 && styles.stepLabelActive]}>Verify OTP</Text>
        <Text style={[styles.stepLabel, forgotPasswordStep >= 3 && styles.stepLabelActive]}>New Password</Text>
      </View>
    </View>
  );

  const renderForgotPasswordModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={forgotPasswordModal}
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <BlurView intensity={10} style={StyleSheet.absoluteFill} />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <TouchableOpacity onPress={handleCloseModal} disabled={loading}>
              <MaterialCommunityIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          {renderStepIndicator()}

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Step 1: Admission Number */}
            {forgotPasswordStep === 1 && (
              <View style={styles.stepContainer}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="account-key" size={60} color="#008080" />
                </View>
                <Text style={styles.stepDescription}>
                  Enter your admission number to receive an OTP on your registered email
                </Text>
                <Text style={styles.inputLabel}>Admission Number</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter admission number"
                  placeholderTextColor="#94a3b8"
                  value={admissionNumber}
                  onChangeText={setAdmissionNumber}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={[styles.nextButton, loading && styles.disabledButton]}
                  onPress={handleSendOTP}
                  disabled={loading || !admissionNumber}
                >
                  {loading ? (
                    <Text style={styles.buttonText}>Sending...</Text>
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Send OTP</Text>
                      <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: OTP Verification */}
            {forgotPasswordStep === 2 && (
              <View style={styles.stepContainer}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="email-lock" size={60} color="#008080" />
                </View>
                <Text style={styles.stepDescription}>
                  Enter the 6-digit OTP sent to your registered email
                </Text>
                
                <View style={styles.timerContainer}>
                  <MaterialCommunityIcons name="timer" size={20} color="#64748b" />
                  <Text style={styles.timerText}>
                    {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : "OTP expired"}
                  </Text>
                </View>

                <Text style={styles.inputLabel}>Enter OTP</Text>
                <View style={styles.otpContainer}>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="123456"
                    placeholderTextColor="#94a3b8"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    maxLength={6}
                    editable={!loading}
                    textAlign="center"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.nextButton, loading && styles.disabledButton]}
                  onPress={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <Text style={styles.buttonText}>Verifying...</Text>
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Verify OTP</Text>
                      <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.resendButton, (!canResend || loading) && styles.disabledButton]}
                  onPress={handleResendOTP}
                  disabled={!canResend || loading}
                >
                  <MaterialCommunityIcons name="refresh" size={18} color="#008080" />
                  <Text style={styles.resendButtonText}>Resend OTP</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: New Password */}
            {forgotPasswordStep === 3 && (
              <View style={styles.stepContainer}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="lock-reset" size={60} color="#008080" />
                </View>
                <Text style={styles.stepDescription}>
                  Create a new secure password for your account
                </Text>

                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter new password"
                    placeholderTextColor="#94a3b8"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}
                  >
                    <MaterialCommunityIcons
                      name={showNewPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.passwordHint, newPassword.length > 0 && newPassword.length < 6 && styles.passwordError]}>
                  {newPassword.length > 0 && newPassword.length < 6
                    ? "Password must be at least 6 characters"
                    : "Minimum 6 characters"}
                </Text>

                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm new password"
                    placeholderTextColor="#94a3b8"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <MaterialCommunityIcons
                      name={showConfirmPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>

                {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                  <Text style={styles.passwordError}>Passwords do not match</Text>
                )}

                <TouchableOpacity
                  style={[
                    styles.resetButton,
                    (loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6) && styles.disabledButton
                  ]}
                  onPress={handleResetPassword}
                  disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
                >
                  {loading ? (
                    <Text style={styles.buttonText}>Resetting...</Text>
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Reset Password</Text>
                      <MaterialCommunityIcons name="lock-check" size={20} color="#fff" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Navigation between steps */}
          <View style={styles.modalFooter}>
            {forgotPasswordStep > 1 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setForgotPasswordStep(prev => prev - 1)}
                disabled={loading}
              >
                <MaterialCommunityIcons name="arrow-left" size={20} color="#008080" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <View style={styles.stepInfo}>
              <Text style={styles.stepInfoText}>
                Step {forgotPasswordStep} of 3
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/school-bg.gif')}
        style={styles.backgroundGif}
        resizeMode="cover"
      />

      <View style={styles.vectorContainer}>
        <Image
          source={require('../assets/school-vector.png')}
          style={styles.vectorImage}
          resizeMode="cover"
        />
        <BlurView intensity={50} style={StyleSheet.absoluteFill} />
      </View>

      <View style={styles.overlay}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.form}>
          <Text style={styles.title}>Login</Text>

          <Text style={styles.label}>Admission Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Admission Number"
            placeholderTextColor="#aaa"
            value={admissionNumber}
            onChangeText={setAdmissionNumber}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#64748b"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password Modal */}
      {renderForgotPasswordModal()}

      {/* Toast Container */}
      <Toast />
    </SafeAreaView>
  );
}

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGif: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.18,
    position: 'absolute',
    zIndex: 0,
  },
  vectorContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vectorImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    paddingTop: 80,
    zIndex: 2,
  },
  logo: {
    width: 190,
    height: 190,
    marginBottom: 10,
  },
  form: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#008080',
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderColor: '#008080',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#008080',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    height: 48,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    paddingHorizontal: 8,
  },
  forgot: {
    color: '#008080',
    textAlign: 'right',
    marginBottom: 12,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalBody: {
    padding: 20,
    maxHeight: 500,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  // Step Indicator
  stepIndicatorContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  stepCircleActive: {
    backgroundColor: '#008080',
    borderColor: '#008080',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  stepTextActive: {
    color: '#fff',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 10,
  },
  stepLineActive: {
    backgroundColor: '#008080',
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  stepLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    width: 80,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#008080',
    fontWeight: '600',
  },
  // Step Content
  stepContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6FFFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    alignSelf: 'stretch',
  },
  modalInput: {
    height: 50,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    fontSize: 16,
    alignSelf: 'stretch',
  },
  otpContainer: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  otpInput: {
    height: 60,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  timerText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginLeft: 8,
  },
  passwordHint: {
    fontSize: 12,
    color: '#64748b',
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  passwordError: {
    color: '#ef4444',
    fontSize: 12,
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  // Buttons
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#008080',
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
    alignSelf: 'stretch',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#008080',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 16,
    gap: 8,
    alignSelf: 'stretch',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#008080',
    gap: 8,
    alignSelf: 'stretch',
  },
  resendButtonText: {
    color: '#008080',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
  },
  backButtonText: {
    color: '#008080',
    fontSize: 16,
    fontWeight: '600',
  },
  stepInfo: {
    flex: 1,
    alignItems: 'center',
  },
  stepInfoText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
});