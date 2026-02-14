import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { useLang } from './language';


export default function AttendanceScreen() {
  const { t } = useLang();
  const [student, setStudent] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState('');

  /* ================= LOAD LOGGED IN STUDENT ================= */
  useEffect(() => {
    const loadStudent = async () => {
      const stored = await AsyncStorage.getItem('student');
      if (stored) {
        setStudent(JSON.parse(stored));
      } else {
        setError('Student not logged in');
      }
    };
    loadStudent();
  }, []);

  /* ================= FETCH ATTENDANCE ================= */
  useEffect(() => {
    if (!student?.rollNumber) return;

    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get('/attendance/by-roll', {
          params: { rollNumber: student.rollNumber },
        });


        const record = res.data;

        if (!record?.attendance) {
          setAttendanceData({});
          setLoading(false);
          return;
        }

        const perDay: any = {};
        record.attendance.forEach((day: any) => {
          const present = day.subjects?.some((s: any) => s.present);
          perDay[day.date] = {
            status: present ? 'present' : 'absent',
            subjects: day.subjects,
          };
        });

        setAttendanceData(perDay);
      } catch (err) {
        console.log('ATTENDANCE ERROR:', err);
        setError('Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [student]);

  /* ================= CALCULATIONS ================= */
  const markedDates = Object.keys(attendanceData).reduce((acc: any, date) => {
    acc[date] = {
      selected: true,
      selectedColor:
        attendanceData[date].status === 'present' ? '#a5d6a7' : '#ffccbc',
    };
    return acc;
  }, {});

  const totalDays = Object.keys(attendanceData).length;
  const presentDays = Object.values(attendanceData).filter(
    (d: any) => d.status === 'present'
  ).length;
  const absentDays = totalDays - presentDays;
  const totalPercentage = totalDays
    ? ((presentDays / totalDays) * 100).toFixed(2)
    : '0.00';

  const selectedSubjects =
    selected && attendanceData[selected]?.subjects
      ? attendanceData[selected].subjects
      : [];

  /* ================= UI ================= */
  return (
    <LinearGradient colors={['#edf5ff', '#fdfdfd']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <LinearGradient colors={['#dbeafe', '#e0f2fe']} style={styles.headerChip}>
              <View>
                <Text style={styles.headerTitle}>{t.attendance}</Text>
                <Text style={styles.headerSubtitle}>
                  Overview for {student?.name || ''}
                </Text>
              </View>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeLabel}>{t.overall}</Text>
                <Text style={styles.headerBadgeValue}>{totalPercentage}%</Text>
              </View>
            </LinearGradient>

            {loading ? (
              <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 30 }} />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <>
                <View style={styles.calendarCard}>
                  <Calendar
                    markedDates={markedDates}
                    onDayPress={(d) => setSelected(d.dateString)}
                  />
                </View>

                <View style={styles.summaryRow}>
                  <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
                    <Text>{t.present}</Text>
                    <Text style={styles.statValue}>{presentDays}</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: '#ffebee' }]}>
                    <Text>{t.absent}</Text>
                    <Text style={styles.statValue}>{absentDays}</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: '#e3f2fd' }]}>
                    <Text>{t.totalPercentage}</Text>
                    <Text style={styles.statValue}>{totalPercentage}</Text>
                  </View>
                </View>

                {selected && (
                  <View style={styles.detailsCard}>
                    <Text>{t.detailsFor} {selected}</Text>
                    {selectedSubjects.length ? (
                      selectedSubjects.map((s: any) => (
                        <View key={s.subject} style={styles.subjectRow}>
                          <Text>{s.subject}</Text>
                          <Text style={{ fontWeight: '700' }}>
                            {s.present ? 'Present' : 'Absent'}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text>{t.noData}</Text>
                    )}
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

/* ================= STYLES (UNCHANGED) ================= */
const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  headerChip: {
    margin: 16,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  headerSubtitle: { fontSize: 13 },
  headerBadge: { alignItems: 'flex-end' },
  headerBadgeLabel: { fontSize: 11 },
  headerBadgeValue: { fontSize: 18, fontWeight: '700' },
  calendarCard: { margin: 16, borderRadius: 20, backgroundColor: '#fff' },
  summaryRow: { flexDirection: 'row', marginHorizontal: 16 },
  statCard: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 16,
  },
  statValue: { fontSize: 18, fontWeight: '700' },
  detailsCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
  },
  detailsHeaderText: { fontSize: 15, fontWeight: '700' },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 20,
  },
});
