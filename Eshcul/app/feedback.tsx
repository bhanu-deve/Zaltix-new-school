import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';
import api from "@/api/api";
import { useLang } from './language';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FeedbackScreen = () => {
  const { t } = useLang();

  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const [open, setOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);     // ✅ FIX 1
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  /* ================= FETCH STAFF ================= */
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/staff');

      const staffArray = Array.isArray(res.data)
        ? res.data
        : res.data?.staff || [];

      setTeachers(
        staffArray.map(t => ({
          label: `${t.name} (${t.role})`,
          value: t._id,
          name: t.name,
          role: t.role,
        }))
      );
    } catch (err) {
      console.error('Failed to load teachers', err);
      setTeachers([]); // 👈 prevent DropDown crash
    }
  };


  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!selectedTeacher || !feedback || rating === 0) {
      Toast.show({ type: 'error', text1: 'Fill all fields' });
      return;
    }

    const studentRaw = await AsyncStorage.getItem('student');
    if (!studentRaw) {
      Toast.show({ type: 'error', text1: 'Student not logged in' });
      return;
    }

    const student = JSON.parse(studentRaw);
    const className = await AsyncStorage.getItem('className');

    const teacher = teachers.find(t => t.value === selectedTeacher);
    if (!teacher) {
      Toast.show({ type: 'error', text1: 'Teacher not found' });
      return;
    }

    await api.post('/studentfeedback', {
      studentName: student.name,
      rollNumber: student.rollNumber,
      className,

      teacherId: teacher.value,
      teacherName: teacher.name,
      teacherRole: teacher.role,

      feedback,
      rating,
    });

    Toast.show({ type: 'success', text1: 'Feedback submitted' });

    setFeedback('');
    setRating(0);
    setSelectedTeacher(null);
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Text style={styles.title}>{t.teacherFeedback}</Text>

        <DropDownPicker
          open={open}
          value={selectedTeacher}
          items={teachers}
          setOpen={setOpen}
          setValue={setSelectedTeacher}
          setItems={setTeachers}
          placeholder={t.chooseTeacher}
          style={styles.dropdown}
        />

        <Text style={styles.label}>{t.yourFeedback}</Text>
        <TextInput
          style={styles.textInput}
          multiline
          value={feedback}
          onChangeText={setFeedback}
        />

        <Text style={styles.label}>{t.rateTeacher}</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map(num => (
            <TouchableOpacity key={num} onPress={() => setRating(num)}>
              <Ionicons
                name={num <= rating ? 'star' : 'star-outline'}
                size={28}
                color="#F59E0B"
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{t.submitFeedback}</Text>
        </TouchableOpacity>

      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default FeedbackScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1e293b',
    textAlign: 'center',
  },
  dropdown: {
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    minHeight: 46,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#ffffff',
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
