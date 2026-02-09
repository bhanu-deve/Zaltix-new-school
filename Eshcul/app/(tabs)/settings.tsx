// SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api from '@/api/api';
import { useLang } from '../language';


export default function SettingsScreen() {
  const router = useRouter();
  const { lang, changeLanguage, t } = useLang();
  


  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [student, setStudent] = useState<any>(null);

  // ================= LOAD STUDENT =================
  useEffect(() => {
    const loadStudent = async () => {
      const stored = await AsyncStorage.getItem('student');
      if (stored) setStudent(JSON.parse(stored));
    };
    loadStudent();
  }, []);
  useEffect(() => {
    const loadSetting = async () => {
      const value = await AsyncStorage.getItem('notificationsEnabled');
      if (value !== null) {
        setNotificationsEnabled(value === 'true');
      }
    };
    loadSetting();
  }, []);


  // ================= LOGOUT =================
  const handleLogout = async () => {
    Toast.show({
      type: 'info',
      text1: t.loggingOut ?? 'Logging out...',
      text2: t.redirecting ?? 'You will be redirected shortly.',
    });

    // await AsyncStorage.multiRemove(['token', 'student']);
    await AsyncStorage.multiRemove([
      'accessToken',
      'refreshToken',
      'student'
    ]);


    setTimeout(() => {
      router.replace('/');
    }, 1500);
  };

  // ================= CHANGE PASSWORD =================
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: t.missingFields ?? 'Missing Fields',
        text2: t.fillAll ?? 'Please fill all fields.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: t.passwordMismatch ?? 'Password Mismatch',
        text2: t.passwordNotMatch ?? 'New passwords do not match.',
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: t.passwordLength ?? 'Password must be at least 6 characters',
      });
      return;
    }

    try {
      await api.put('/student-auth/change-password', {
        oldPassword,
        newPassword,
      });

      Toast.show({
        type: 'success',
        text1: t.passwordUpdated ?? 'Password Updated',
        text2: t.passwordSuccess ?? 'Your password was updated successfully.',
      });

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.message || t.passwordFailed || 'Password update failed',
      });
    }
  };

  // ================= HELP & INFO =================
  const handleHelpSupport = () => {
    Toast.show({
      type: 'info',
      text1: t.helpSupport ?? 'Help & Support',
      text2: '📧 help@yourapp.com | 📞 +91 98765 43210',
      visibilityTime: 4000,
    });
  };

  const handleAppInfo = () => {
    Toast.show({
      type: 'info',
      text1: t.appInfo ?? 'App Info',
      text2: '📱 SchoolEase v1.0.0\n🧑‍💻 Zaltix Soft Solutions',
      visibilityTime: 4000,
    });
  };

  return (
    <LinearGradient colors={['#f0f4ff', '#e0f7fa']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <Ionicons name="person-circle" size={64} color="#008080" />
          <Text style={styles.profileName}>{student?.name}</Text>
          <Text style={styles.profileSubtext}>
            {t.class}: {student?.grade} - {student?.section} | {t.rollNo}: {student?.rollNumber}
          </Text>
        </View>

        <View style={styles.settingGroup}>
          <SettingItem
            icon="key"
            text={t.changePassword ?? 'Change Password'}
            onPress={() => setShowChangePassword(!showChangePassword)}
          />

          {showChangePassword && (
            <View style={styles.passwordForm}>
              <PasswordInput
                placeholder={t.oldPassword ?? 'Old Password'}
                value={oldPassword}
                onChange={setOldPassword}
                visible={showOld}
                toggle={() => setShowOld(!showOld)}
              />
              <PasswordInput
                placeholder={t.newPassword ?? 'New Password'}
                value={newPassword}
                onChange={setNewPassword}
                visible={showNew}
                toggle={() => setShowNew(!showNew)}
              />
              <PasswordInput
                placeholder={t.confirmPassword ?? 'Confirm New Password'}
                value={confirmPassword}
                onChange={setConfirmPassword}
                visible={showConfirm}
                toggle={() => setShowConfirm(!showConfirm)}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                <Text style={styles.saveText}>
                  {t.updatePassword ?? 'Update Password'}
                </Text>
              </TouchableOpacity>

            </View>
          )}

          <SettingItem icon="notifications" text={t.notifications ?? 'Notifications'}>
            <Switch
              value={notificationsEnabled}
              onValueChange={async (value) => {
                setNotificationsEnabled(value);
                await AsyncStorage.setItem('notificationsEnabled', value.toString());
              }}
            />

          </SettingItem>

          <SettingItem icon="help-circle" text={t.helpSupport ?? 'Help & Support'} onPress={handleHelpSupport} />
          <SettingItem icon="information-circle" text={t.appInfo ?? 'App Info'} onPress={handleAppInfo} />
          <SettingItem
              icon="language"
              text={t.language ?? 'Language'}
              onPress={undefined}
            >
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => changeLanguage('en')}>
                  <Text style={{ marginRight: 10, color: lang === 'en' ? '#008080' : '#555' }}>
                    EN
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeLanguage('hi')}>
                  <Text style={{ marginRight: 10, color: lang === 'hi' ? '#008080' : '#555' }}>
                    HI
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeLanguage('te')}>
                  <Text style={{ color: lang === 'te' ? '#008080' : '#555' }}>
                    TE
                  </Text>
                </TouchableOpacity>
              </View>
          </SettingItem>

        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>{t.logout ?? 'Logout'}</Text> 
        </TouchableOpacity>
      </ScrollView>

      <Toast />
    </LinearGradient>
  );
}

// ================= COMPONENTS =================

const PasswordInput = ({ placeholder, value, onChange, visible, toggle }: any) => (
  <View style={styles.inputWrapper}>
    <TextInput
      placeholder={placeholder}
      style={styles.input}
      secureTextEntry={!visible}
      value={value}
      onChangeText={onChange}
    />
    <TouchableOpacity onPress={toggle} style={styles.eyeIcon}>
      <Ionicons name={visible ? 'eye-off' : 'eye'} size={22} color="#555" />
    </TouchableOpacity>
  </View>
);

const SettingItem = ({ icon, text, children, onPress }: any) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.settingLeft}>
      <Ionicons name={icon} size={24} color="#008080" />
      <Text style={styles.settingText}>{text}</Text>
    </View>
    {children ?? <Ionicons name="chevron-forward" size={20} color="#888" />}
  </TouchableOpacity>
);

// ================= STYLES (UNCHANGED) =================

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 60 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
    elevation: 4,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    marginTop: 10,
  },
  profileSubtext: {
    color: '#555',
    fontSize: 14,
    marginTop: 4,
  },
  settingGroup: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 12,
    elevation: 3,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#e53935',
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  passwordForm: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    padding: 12,
  },
  eyeIcon: {
    padding: 6,
  },
  saveButton: {
    backgroundColor: '#008080',
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
