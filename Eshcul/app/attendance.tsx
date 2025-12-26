// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   SafeAreaView
// } from 'react-native';
// import { Calendar } from 'react-native-calendars';
// import { LinearGradient } from 'expo-linear-gradient';
// // import axios from 'axios';
// // import { Api_url } from './config/config.js';
// import api from "../api/api";

// export default function AttendanceScreen() {
//   const [studentName, setStudentName] = useState('Anjali');
//   const [attendanceData, setAttendanceData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selected, setSelected] = useState('');

//   const fetchAttendance = async (name) => {
//     if (!name.trim()) return;
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await api.get('/attendance/by-name', { params: { name: name.trim() } });
//       const record = res.data;

//       if (!record || !record.student) {
//         setError('No attendance records found for this student.');
//         setAttendanceData({});
//         setLoading(false);
//         return;
//       }

//       const perDayStatus = {};
//       (record.attendance || []).forEach(day => {
//         const present = (day.subjects || []).some(s => s.present);
//         perDayStatus[day.date] = {
//           status: present ? 'present' : 'absent',
//           subjects: day.subjects,
//         };
//       });

//       setAttendanceData(perDayStatus);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to fetch attendance data. Please check your network.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance(studentName);
//   }, [studentName]);

//   const markedDates = Object.keys(attendanceData).reduce((acc, date) => {
//     const day = attendanceData[date];
//     acc[date] = {
//       selected: true,
//       selectedColor: day.status === 'present' ? '#4CAF50' : '#F44336',
//       customStyles: {
//         container: { borderRadius: 8 },
//         text: { color: '#fff', fontWeight: 'bold' },
//       },
//     };
//     return acc;
//   }, {});

//   const totalDays = Object.keys(attendanceData).length;
//   const presentDays = Object.values(attendanceData).filter(d => d.status === 'present').length;
//   const absentDays = totalDays - presentDays;
//   const totalPercentage = totalDays ? ((presentDays / totalDays) * 100).toFixed(2) : '0.00';
//   const monthlyPercentage = totalPercentage;
//   const dailyPercentage = selected
//     ? attendanceData[selected]?.status === 'present' ? '100.00' : '0.00'
//     : presentDays ? '100.00' : '0.00';

//   const selectedDaySubjects = selected && attendanceData[selected]?.subjects;

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#eef1f5' }}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Header */}
//           <LinearGradient colors={['#2575fc', '#6a11cb']} style={styles.header}>
//             <Text style={styles.headerText}>📅 Attendance for {studentName || '...'}</Text>
//           </LinearGradient>

//           {/* Input */}
//           <View style={styles.inputWrapper}>
//             <TextInput
//               value={studentName}
//               onChangeText={setStudentName}
//               placeholder="Enter student name"
//               style={styles.input}
//               autoCapitalize="words"
//               autoCorrect={false}
//             />
//           </View>

//           {/* State Handling */}
//           {loading ? (
//             <ActivityIndicator size="large" color="#2575fc" style={{ marginTop: 24 }} />
//           ) : error ? (
//             <Text style={styles.errorText}>{error}</Text>
//           ) : (
//             <>
//               {/* Calendar */}
//               <Calendar
//                 style={styles.calendar}
//                 markedDates={markedDates}
//                 onDayPress={day => setSelected(day.dateString)}
//                 markingType="custom"
//                 theme={{
//                   todayTextColor: '#2575fc',
//                   arrowColor: '#2575fc',
//                   textSectionTitleColor: '#444',
//                   textMonthFontWeight: 'bold',
//                   textDayHeaderFontWeight: '600',
//                 }}
//               />

//               {/* Summary */}
//               <View style={styles.card}>
//                 <Text style={styles.cardTitle}>Summary</Text>
//                 <Text style={styles.detailText}>
//                   ✅ Total Present: <Text style={{ color: '#4CAF50' }}>{presentDays}</Text>
//                 </Text>
//                 <Text style={styles.detailText}>
//                   ❌ Total Absent: <Text style={{ color: '#F44336' }}>{absentDays}</Text>
//                 </Text>
//                 <Text style={styles.detailText}>
//                   📊 Total Percentage: <Text style={{ color: '#2575fc' }}>{totalPercentage}%</Text>
//                 </Text>
//               </View>

//               {/* Performance */}
//               <View style={styles.card}>
//                 <Text style={styles.cardTitle}>Performance</Text>
//                 <Text style={styles.detailText}>
//                   📆 Monthly Percentage: <Text style={{ color: '#2575fc' }}>{monthlyPercentage}%</Text>
//                 </Text>
//                 <Text style={styles.detailText}>
//                   🗓️ Daily Percentage: <Text style={{ color: '#2575fc' }}>{dailyPercentage}%</Text>
//                 </Text>
//               </View>

//               {/* Day Details */}
//               {selected ? (
//                 <View style={styles.card}>
//                   <Text style={styles.cardTitle}>Details for {selected}</Text>
//                   {selectedDaySubjects && selectedDaySubjects.length > 0 ? (
//                     selectedDaySubjects.map(subj => (
//                       <Text key={subj.subject} style={styles.detailText}>
//                         {subj.subject}:{' '}
//                         <Text style={{ color: subj.present ? '#4CAF50' : '#F44336' }}>
//                           {subj.present ? 'Present' : 'Absent'}
//                         </Text>
//                       </Text>
//                     ))
//                   ) : (
//                     <Text style={styles.detailText}>No attendance records on this day.</Text>
//                   )}
//                 </View>
//               ) : null}
//             </>
//           )}
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContent: {
//     paddingBottom: 40
//   },
//   header: {
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     alignItems: 'center',
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     elevation: 4,
//   },
//   headerText: { fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
//   inputWrapper: { padding: 12 },
//   input: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 12,
//     fontSize: 16,
//     elevation: 2,
//   },
//   calendar: {
//     marginTop: 16,
//     marginHorizontal: 18,
//     borderRadius: 12,
//     backgroundColor: '#fff',
//     elevation: 3,
//     paddingBottom: 8,
//   },
//   card: {
//     marginHorizontal: 18,
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 18,
//     marginTop: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#2575fc',
//   },
//   detailText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 6,
//   },
//   errorText: {
//     color: '#ff4d4d',
//     textAlign: 'center',
//     fontSize: 16,
//     marginTop: 20,
//     paddingHorizontal: 20,
//   },
// });
// AttendanceScreen.tsx
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

export default function AttendanceScreen() {
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
                <Text style={styles.headerTitle}>Attendance</Text>
                <Text style={styles.headerSubtitle}>
                  Overview for {student?.name || ''}
                </Text>
              </View>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeLabel}>Overall</Text>
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
                    <Text>Present</Text>
                    <Text style={styles.statValue}>{presentDays}</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: '#ffebee' }]}>
                    <Text>Absent</Text>
                    <Text style={styles.statValue}>{absentDays}</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: '#e3f2fd' }]}>
                    <Text>Total %</Text>
                    <Text style={styles.statValue}>{totalPercentage}</Text>
                  </View>
                </View>

                {selected && (
                  <View style={styles.detailsCard}>
                    <Text style={styles.detailsHeaderText}>
                      Details for {selected}
                    </Text>
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
                      <Text>No data</Text>
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
