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
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../api/api';

export default function AttendanceScreen() {
  const [studentName, setStudentName] = useState('Anjali');
  const [attendanceData, setAttendanceData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState('');

  const fetchAttendance = async (name: string) => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.get('/attendance/by-name', { params: { name: name.trim() } });
      const record = res.data;

      if (!record || !record.student) {
        setError('No attendance records found for this student.');
        setAttendanceData({});
        setLoading(false);
        return;
      }

      const perDayStatus: any = {};
      (record.attendance || []).forEach((day: any) => {
        const present = (day.subjects || []).some((s: any) => s.present);
        perDayStatus[day.date] = {
          status: present ? 'present' : 'absent',
          subjects: day.subjects,
        };
      });

      setAttendanceData(perDayStatus);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch attendance data. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(studentName);
  }, [studentName]);

  const markedDates = Object.keys(attendanceData).reduce((acc: any, date) => {
    const day = attendanceData[date];
    acc[date] = {
      selected: true,
      selectedColor: day.status === 'present' ? '#a5d6a7' : '#ffccbc',
      customStyles: {
        container: { borderRadius: 999 },
        text: { color: '#1f2933', fontWeight: '700' },
      },
    };
    return acc;
  }, {});

  const totalDays = Object.keys(attendanceData).length;
  const presentDays = Object.values(attendanceData).filter(
    // @ts-ignore
    (d: any) => d.status === 'present'
  ).length;
  const absentDays = totalDays - presentDays;
  const totalPercentage = totalDays ? ((presentDays / totalDays) * 100).toFixed(2) : '0.00';
  const monthlyPercentage = totalPercentage;
  const dailyPercentage = selected
    ? attendanceData[selected]?.status === 'present'
      ? '100.00'
      : '0.00'
    : presentDays
    ? '100.00'
    : '0.00';

  const selectedDaySubjects =
    selected && attendanceData[selected]?.subjects ? attendanceData[selected].subjects : [];

  return (
    <LinearGradient
      colors={['#edf5ff', '#fdfdfd']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* soft header chip */}
            <LinearGradient
              colors={['#dbeafe', '#e0f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerChip}
            >
              <View>
                <Text style={styles.headerTitle}>Attendance</Text>
                <Text style={styles.headerSubtitle}>
                  Overview for {studentName || 'student'}
                </Text>
              </View>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeLabel}>Overall</Text>
                <Text style={styles.headerBadgeValue}>{totalPercentage}%</Text>
              </View>
            </LinearGradient>

            {/* Name input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Student name</Text>
              <TextInput
                value={studentName}
                onChangeText={setStudentName}
                placeholder="Enter student name"
                style={styles.input}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 24 }} />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <>
                {/* Calendar card */}
                <View style={styles.calendarCard}>
                  <View style={styles.calendarHeaderRow}>
                    <Text style={styles.sectionTitle}>Calendar overview</Text>
                    <View style={styles.calendarChipsRow}>
                      <View style={[styles.legendChip, { backgroundColor: '#e8f5e9' }]}>
                        <Text style={[styles.legendDot, { color: '#2e7d32' }]}>●</Text>
                        <Text style={styles.legendLabel}>Present</Text>
                      </View>
                      <View style={[styles.legendChip, { backgroundColor: '#ffebee' }]}>
                        <Text style={[styles.legendDot, { color: '#e53935' }]}>●</Text>
                        <Text style={styles.legendLabel}>Absent</Text>
                      </View>
                    </View>
                  </View>

                  <Calendar
                    style={styles.calendar}
                    markedDates={markedDates}
                    onDayPress={(day) => setSelected(day.dateString)}
                    markingType="custom"
                    theme={{
                      backgroundColor: '#ffffff',
                      calendarBackground: '#ffffff',
                      todayTextColor: '#1d4ed8',
                      arrowColor: '#90a4ae',
                      monthTextColor: '#111827',
                      textMonthFontWeight: '700',
                      textDayHeaderFontWeight: '600',
                      textSectionTitleColor: '#9ca3af',
                    }}
                  />
                </View>

                {/* Light summary cards */}
                <View style={styles.summaryRow}>
                  <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
                    <Text style={[styles.statLabel, { color: '#2e7d32' }]}>Present</Text>
                    <Text style={[styles.statValue, { color: '#1b5e20' }]}>{presentDays}</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: '#ffebee' }]}>
                    <Text style={[styles.statLabel, { color: '#c62828' }]}>Absent</Text>
                    <Text style={[styles.statValue, { color: '#b71c1c' }]}>{absentDays}</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: '#e3f2fd' }]}>
                    <Text style={[styles.statLabel, { color: '#1565c0' }]}>Total %</Text>
                    <Text style={[styles.statValue, { color: '#0d47a1' }]}>
                      {totalPercentage}%
                    </Text>
                  </View>
                </View>

                {/* Performance card */}
                <View style={styles.card}>
                  <View style={styles.cardAccent} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>Performance</Text>
                    <Text style={styles.detailText}>
                      Monthly:{' '}
                      <Text style={{ color: '#1565c0', fontWeight: '700' }}>
                        {monthlyPercentage}%
                      </Text>
                    </Text>
                    <Text style={styles.detailText}>
                      Daily:{' '}
                      <Text style={{ color: '#fb8c00', fontWeight: '700' }}>
                        {dailyPercentage}%
                      </Text>
                    </Text>
                  </View>
                </View>

                {/* Day details card */}
                {selected && (
                  <View style={styles.detailsCard}>
                    <View style={styles.detailsHeader}>
                      <Text style={styles.detailsHeaderText}>Details for {selected}</Text>
                    </View>
                    <View style={styles.detailsBody}>
                      {selectedDaySubjects && selectedDaySubjects.length > 0 ? (
                        selectedDaySubjects.map((subj: any) => (
                          <View key={subj.subject} style={styles.subjectRow}>
                            <Text style={styles.subjectName}>{subj.subject}</Text>
                            <Text
                              style={[
                                styles.subjectStatus,
                                { color: subj.present ? '#2e7d32' : '#e65100' },
                              ]}
                            >
                              {subj.present ? 'Present' : 'Absent'}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.detailText}>
                          No attendance records on this day.
                        </Text>
                      )}
                    </View>
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

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },

  headerChip: {
    marginTop: 16,
    marginHorizontal: 18,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#4b5563',
  },
  headerBadge: {
    backgroundColor: '#fff7ed',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignItems: 'flex-end',
  },
  headerBadgeLabel: {
    fontSize: 11,
    color: '#9a3412',
  },
  headerBadgeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#c05621',
  },

  inputWrapper: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  inputLabel: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  calendarCard: {
    marginTop: 18,
    marginHorizontal: 18,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  calendarChipsRow: {
    flexDirection: 'row',
  },
  legendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
  },
  legendDot: {
    fontSize: 10,
  },
  legendLabel: {
    fontSize: 11,
    color: '#374151',
    marginLeft: 4,
  },
  calendar: {
    borderRadius: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginTop: 18,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '700',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardAccent: {
    width: 4,
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#90caf9',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },

  detailsCard: {
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  detailsHeader: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  detailsHeaderText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  detailsBody: {
    backgroundColor: '#ffffff',
    padding: 14,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  subjectName: {
    fontSize: 14,
    color: '#374151',
  },
  subjectStatus: {
    fontSize: 14,
    fontWeight: '600',
  },

  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
