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
  Linking,
  Modal,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api from '@/api/api';
import { useLang } from '../language';

export default function SettingsScreen() {
  const router = useRouter();
  const { lang, changeLanguage, t } = useLang();

  // States
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [student, setStudent] = useState<any>(null);

  // Modal states
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsService, setShowTermsService] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showAppInfo, setShowAppInfo] = useState(false);

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

  // ================= HELP & SUPPORT ACTIONS =================
  const handleUrgentCall = () => {
    Linking.openURL('tel:+919876543210');
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@schoolease.com');
  };

  // ================= RENDER MODALS =================

  // Personal Info Modal
  const renderPersonalInfoModal = () => (
    <Modal
      visible={showPersonalInfo}
      transparent
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Personal Information</Text>
            <TouchableOpacity onPress={() => setShowPersonalInfo(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={20} color="#008080" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Full Name</Text>
                  <Text style={styles.infoValue}>{student?.name}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color="#008080" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{student?.email || 'Not provided'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color="#008080" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{student?.phone || 'Not provided'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#008080" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Date of Birth</Text>
                  <Text style={styles.infoValue}>{student?.dob || 'Not provided'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#008080" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{student?.address || 'Not provided'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="school-outline" size={20} color="#008080" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Class & Section</Text>
                  <Text style={styles.infoValue}>{student?.grade} - {student?.section}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="hash-outline" size={20} color="#008080" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Roll Number</Text>
                  <Text style={styles.infoValue}>{student?.rollNumber}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="people-outline" size={20} color="#008080" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Parent's Name</Text>
                  <Text style={styles.infoValue}>{student?.parentName || 'Not provided'}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setShowPersonalInfo(false)}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Privacy Policy Modal
  const renderPrivacyPolicyModal = () => (
    <Modal
      visible={showPrivacyPolicy}
      transparent
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <TouchableOpacity onPress={() => setShowPrivacyPolicy(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.policyContent}>
              <Text style={styles.policySection}>Data Collection</Text>
              <Text style={styles.policyText}>
                We collect personal information including name, contact details, academic records, 
                and attendance data to provide educational services.
              </Text>

              <Text style={styles.policySection}>Data Usage</Text>
              <Text style={styles.policyText}>
                Your data is used for academic purposes, communication with parents, 
                and improving our educational services.
              </Text>

              <Text style={styles.policySection}>Data Protection</Text>
              <Text style={styles.policyText}>
                We implement security measures to protect your personal information 
                from unauthorized access or disclosure.
              </Text>

              <Text style={styles.policySection}>Third Party Sharing</Text>
              <Text style={styles.policyText}>
                We do not sell or share your personal information with third parties 
                except as required by law or with your consent.
              </Text>

              <Text style={styles.policySection}>Your Rights</Text>
              <Text style={styles.policyText}>
                You have the right to access, correct, or delete your personal information. 
                Contact us for any privacy-related requests.
              </Text>

              <Text style={styles.policySection}>Contact Us</Text>
              <Text style={styles.policyText}>
                For privacy concerns, email us at: privacy@schoolease.com
              </Text>

              <Text style={styles.policyDate}>Last Updated: February 2026</Text>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setShowPrivacyPolicy(false)}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Terms of Service Modal
  const renderTermsServiceModal = () => (
    <Modal
      visible={showTermsService}
      transparent
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Terms of Service</Text>
            <TouchableOpacity onPress={() => setShowTermsService(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.policyContent}>
              <Text style={styles.policySection}>Acceptance of Terms</Text>
              <Text style={styles.policyText}>
                By using SchoolEase, you agree to these terms. If you disagree, 
                please do not use our services.
              </Text>

              <Text style={styles.policySection}>User Responsibilities</Text>
              <Text style={styles.policyText}>
                • Keep your login credentials secure{'\n'}
                • Use the app for educational purposes only{'\n'}
                • Respect other users and school staff{'\n'}
                • Report any security issues immediately
              </Text>

              <Text style={styles.policySection}>School Responsibilities</Text>
              <Text style={styles.policyText}>
                • Provide accurate academic information{'\n'}
                • Maintain student records securely{'\n'}
                • Communicate important updates promptly
              </Text>

              <Text style={styles.policySection}>Account Termination</Text>
              <Text style={styles.policyText}>
                We reserve the right to suspend or terminate accounts that violate 
                these terms or for any other reason at our discretion.
              </Text>

              <Text style={styles.policySection}>Limitation of Liability</Text>
              <Text style={styles.policyText}>
                SchoolEase is not liable for any indirect damages arising from 
                the use or inability to use our services.
              </Text>

              <Text style={styles.policySection}>Changes to Terms</Text>
              <Text style={styles.policyText}>
                We may update these terms periodically. Continued use of the app 
                constitutes acceptance of new terms.
              </Text>

              <Text style={styles.policyDate}>Last Updated: February 2026</Text>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setShowTermsService(false)}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // App Info Modal
  const renderAppInfoModal = () => (
    <Modal
      visible={showAppInfo}
      transparent
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>App Information</Text>
            <TouchableOpacity onPress={() => setShowAppInfo(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.appInfoModalContent}>
              <Ionicons name="school" size={80} color="#008080" />
              <Text style={styles.appNameModal}>SchoolEase</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              
              <View style={styles.appDetailCard}>
                <Text style={styles.appDetailTitle}>About</Text>
                <Text style={styles.appDetailText}>
                  SchoolEase is a comprehensive school management app designed to bridge the gap between students, parents, and educational institutions.
                </Text>
              </View>

              <View style={styles.appDetailCard}>
                <Text style={styles.appDetailTitle}>Features</Text>
                <Text style={styles.appDetailText}>
                  • Real-time attendance tracking{'\n'}
                  • Assignment and homework management{'\n'}
                  • Exam results and grade viewing{'\n'}
                  • Fee payment and history{'\n'}
                  • Communication with teachers{'\n'}
                  • Event and holiday calendar
                </Text>
              </View>

              <View style={styles.appDetailCard}>
                <Text style={styles.appDetailTitle}>Developer</Text>
                <Text style={styles.appDetailText}>
                  Zaltix Soft Solutions{'\n'}
                  © 2026 All Rights Reserved
                </Text>
              </View>

              <View style={styles.appDetailCard}>
                <Text style={styles.appDetailTitle}>Contact</Text>
                <Text style={styles.appDetailText}>
                  Email: info@zaltixsoft.com{'\n'}
                  Website: www.zaltixsoft.com
                </Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setShowAppInfo(false)}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Help & Support Modal
  const renderHelpSupportModal = () => (
    <Modal
      visible={showHelpSupport}
      transparent
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.helpModalContent]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Help & Support</Text>
            <TouchableOpacity onPress={() => setShowHelpSupport(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Urgent Call Box */}
            <View style={styles.urgentCallBox}>
              <Ionicons name="alert-circle" size={40} color="#fff" />
              <Text style={styles.urgentCallTitle}>Urgent Help Needed?</Text>
              <Text style={styles.urgentCallText}>
                For immediate assistance, call our emergency support
              </Text>
              <TouchableOpacity style={styles.urgentCallButton} onPress={handleUrgentCall}>
                <Ionicons name="call" size={24} color="#fff" />
                <Text style={styles.urgentCallButtonText}>Call Now</Text>
              </TouchableOpacity>
            </View>

            {/* Support Hours */}
            <View style={styles.supportHoursBox}>
              <Text style={styles.supportHoursTitle}>Support Hours</Text>
              
              <View style={styles.hoursRow}>
                <Ionicons name="calendar-outline" size={20} color="#008080" />
                <Text style={styles.hoursText}>Monday - Friday</Text>
                <Text style={styles.hoursTime}>9:00 AM - 6:00 PM</Text>
              </View>

              <View style={styles.hoursRow}>
                <Ionicons name="calendar-outline" size={20} color="#008080" />
                <Text style={styles.hoursText}>Saturday</Text>
                <Text style={styles.hoursTime}>9:00 AM - 2:00 PM</Text>
              </View>

              <View style={styles.hoursRow}>
                <Ionicons name="calendar-outline" size={20} color="#008080" />
                <Text style={styles.hoursText}>Sunday</Text>
                <Text style={styles.hoursTime}>Closed</Text>
              </View>
            </View>

            {/* Contact Numbers */}
            <View style={styles.contactBox}>
              <Text style={styles.contactTitle}>Contact Numbers</Text>
              
              <TouchableOpacity style={styles.contactRow} onPress={handleUrgentCall}>
                <Ionicons name="call-outline" size={22} color="#008080" />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Emergency Support</Text>
                  <Text style={styles.contactNumber}>+91 98765 43210</Text>
                </View>
                <Ionicons name="open-outline" size={18} color="#888" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('tel:+911234567890')}>
                <Ionicons name="call-outline" size={22} color="#008080" />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Technical Support</Text>
                  <Text style={styles.contactNumber}>+91 12345 67890</Text>
                </View>
                <Ionicons name="open-outline" size={18} color="#888" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactRow} onPress={handleEmailSupport}>
                <Ionicons name="mail-outline" size={22} color="#008080" />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Email Support</Text>
                  <Text style={styles.contactNumber}>support@schoolease.com</Text>
                </View>
                <Ionicons name="open-outline" size={18} color="#888" />
              </TouchableOpacity>
            </View>

            {/* Quick Help */}
            <View style={styles.quickHelpBox}>
              <Text style={styles.quickHelpTitle}>Quick Help</Text>
              
              <TouchableOpacity style={styles.quickHelpRow}>
                <Ionicons name="help-circle-outline" size={22} color="#008080" />
                <Text style={styles.quickHelpText}>FAQ</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickHelpRow}>
                <Ionicons name="bug-outline" size={22} color="#008080" />
                <Text style={styles.quickHelpText}>Report a Bug</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickHelpRow}>
                <Ionicons name="chatbubble-outline" size={22} color="#008080" />
                <Text style={styles.quickHelpText}>Live Chat</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient colors={['#f0f4ff', '#e0f7fa']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Ionicons name="person-circle" size={64} color="#008080" />
          <Text style={styles.profileName}>{student?.name}</Text>
          <Text style={styles.profileSubtext}>
            {t.class}: {student?.grade} - {student?.section} | {t.rollNo}: {student?.rollNumber}
          </Text>
        </View>

        {/* Section 1: Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
          
          {/* Change Password */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setShowChangePassword(!showChangePassword)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="key" size={24} color="#008080" />
              <Text style={styles.menuText}>Change Password</Text>
            </View>
            <Ionicons name={showChangePassword ? "chevron-up" : "chevron-down"} size={20} color="#888" />
          </TouchableOpacity>

          {showChangePassword && (
            <View style={styles.passwordForm}>
              <PasswordInput
                placeholder="Old Password"
                value={oldPassword}
                onChange={setOldPassword}
                visible={showOld}
                toggle={() => setShowOld(!showOld)}
              />
              <PasswordInput
                placeholder="New Password"
                value={newPassword}
                onChange={setNewPassword}
                visible={showNew}
                toggle={() => setShowNew(!showNew)}
              />
              <PasswordInput
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                visible={showConfirm}
                toggle={() => setShowConfirm(!showConfirm)}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                <Text style={styles.saveText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Notifications */}
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications" size={24} color="#008080" />
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={async (value) => {
                setNotificationsEnabled(value);
                await AsyncStorage.setItem('notificationsEnabled', value.toString());
              }}
            />
          </View>

          {/* Language */}
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="language" size={24} color="#008080" />
              <Text style={styles.menuText}>Language</Text>
            </View>
            <View style={styles.languageButtons}>
              <TouchableOpacity onPress={() => changeLanguage('en')}>
                <Text style={[styles.langText, lang === 'en' && styles.activeLang]}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeLanguage('hi')}>
                <Text style={[styles.langText, lang === 'hi' && styles.activeLang]}>HI</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeLanguage('te')}>
                <Text style={[styles.langText, lang === 'te' && styles.activeLang]}>TE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Section 2: App Info & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP INFO & SUPPORT</Text>
          
          {/* Personal Information */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setShowPersonalInfo(true)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="person" size={24} color="#008080" />
              <Text style={styles.menuText}>Personal Information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          {/* Privacy & Security - now shows both options */}
          <View style={styles.privacySection}>
            <View style={styles.privacyHeader}>
              <Ionicons name="shield-checkmark" size={24} color="#008080" />
              <Text style={styles.privacyHeaderText}>Privacy & Security</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.privacyItem}
              onPress={() => setShowPrivacyPolicy(true)}
            >
              <Text style={styles.privacyItemText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={18} color="#888" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.privacyItem}
              onPress={() => setShowTermsService(true)}
            >
              <Text style={styles.privacyItemText}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={18} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Help & Support */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setShowHelpSupport(true)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle" size={24} color="#008080" />
              <Text style={styles.menuText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          {/* App Info - clickable */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setShowAppInfo(true)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="information-circle" size={24} color="#008080" />
              <Text style={styles.menuText}>App Info</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>{t.logout ?? 'Logout'}</Text> 
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
      {renderPersonalInfoModal()}
      {renderPrivacyPolicyModal()}
      {renderTermsServiceModal()}
      {renderHelpSupportModal()}
      {renderAppInfoModal()}

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

// ================= STYLES =================

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 60 },
  
  // Profile Card
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

  // Sections
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    elevation: 3,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#008080',
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  // Menu Items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },

  // Privacy Section
  privacySection: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  privacyHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    color: '#008080',
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  privacyItemText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 32,
  },

  // Language
  languageButtons: {
    flexDirection: 'row',
  },
  langText: {
    marginHorizontal: 8,
    fontSize: 16,
    color: '#555',
  },
  activeLang: {
    color: '#008080',
    fontWeight: 'bold',
  },

  // Password Form
  passwordForm: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginTop: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
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

  // Logout Button
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
  },
  helpModalContent: {
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008080',
  },
  modalBody: {
    padding: 16,
  },
  modalCloseButton: {
    backgroundColor: '#008080',
    margin: 16,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  // Personal Info Modal
  infoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  // Privacy & Terms Modal
  policyContent: {
    padding: 8,
  },
  policySection: {
    fontSize: 18,
    fontWeight: '600',
    color: '#008080',
    marginTop: 16,
    marginBottom: 8,
  },
  policyText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  policyDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },

  // App Info Modal
  appInfoModalContent: {
    alignItems: 'center',
    padding: 16,
  },
  appNameModal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#008080',
    marginTop: 16,
  },
  appVersion: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  appDetailCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: '100%',
  },
  appDetailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#008080',
    marginBottom: 8,
  },
  appDetailText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },

  // Help & Support Modal
  urgentCallBox: {
    backgroundColor: '#e53935',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  urgentCallTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  urgentCallText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 12,
    opacity: 0.9,
  },
  urgentCallButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
  },
  urgentCallButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53935',
    marginLeft: 8,
  },

  supportHoursBox: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  supportHoursTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 12,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  hoursText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginLeft: 8,
  },
  hoursTime: {
    fontSize: 14,
    color: '#008080',
    fontWeight: '500',
  },

  contactBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
  },
  contactNumber: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  quickHelpBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
  },
  quickHelpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 12,
  },
  quickHelpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quickHelpText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
});