import React, { useState , useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const unstable_settings = {
  headerShown: false,
};



export default function LoginPage() {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
    /* ✅ CLEAR OLD TOKEN ONCE (FIX INVALID TOKEN ISSUE) */
    useEffect(() => {
      AsyncStorage.clear();
    }, []);

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


      const student = res.data.student;

      // ✅ build className correctly
      const className = `${student.grade}${student.section}`;

      await AsyncStorage.setItem("token", res.data.token);
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
        console.log("❌ LOGIN ERROR FULL:", err);
        console.log("❌ LOGIN ERROR RESPONSE:", err?.response);
        console.log("❌ LOGIN ERROR DATA:", err?.response?.data);
        console.log("❌ LOGIN ERROR STATUS:", err?.response?.status);

        Toast.show({
          type: "error",
          text1: err?.response?.data?.error || "Login failed",
        });
      }
  };

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
              <Text style={{ fontSize: 18 }}>
                {showPassword ? '🙈' : '👁'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() =>
              Toast.show({
                type: 'info',
                text1: 'Password reset',
                text2: 'Please contact your school admin',
                position: 'bottom',
              })
            }
          >
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toast Container */}
      <Toast />
    </SafeAreaView>
  );
}

/* ===================== STYLES (UNCHANGED) ===================== */
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
});
