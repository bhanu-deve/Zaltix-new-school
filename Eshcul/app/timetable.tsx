// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// // import axios from 'axios';
// // import {Api_url} from './config/config.js'
// import api from "../api/api";


// export default function TimetableScreen() {
//   const [timetable, setTimetable] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const className = '10A';

//   const periodTimeMap: { [key: number]: string } = {
//     0: '9:00 - 10:00',
//     1: '10:00 - 11:00',
//     2: '11:00 - 12:00',
//     3: '12:00 - 1:00',
//     4: '2:00 - 3:00',
//     5: '3:00 - 4:00',
//   };

//   useEffect(() => {
//     const fetchTimetable = async () => {
//       try {
//         const res = await api.get(`/timetable/${className}`);
//         console.log('Fetched timetable:', res.data);
//         setTimetable(res.data.data);
//       } catch (err) {
//         console.error('Failed to fetch timetable:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTimetable();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#2575fc" />
//       </View>
//     );
//   }

//   if (!timetable || !timetable.entries || Object.keys(timetable.entries).length === 0) {
//     return (
//       <View style={styles.centered}>
//         <Text style={{ color: '#333' }}>No timetable data found.</Text>
//       </View>
//     );
//   }

//   return (
//     <LinearGradient colors={['#e0eafc', '#cfdef3']} style={styles.gradientContainer}>
//       <ScrollView contentContainerStyle={styles.container}>
//         {/* Class Info */}
//         <View style={styles.studentCard}>
// <LinearGradient colors={['#2575fc', '#6a11cb']} style={styles.studentHeader} />
//           <Text style={styles.studentName}>Class: {timetable.className}</Text>
//           <Text style={styles.studentDetail}>Section: {timetable.section}</Text>
//           <Text style={styles.studentDetail}>Academic Year: {timetable.academicYear}</Text>
//         </View>

//         {/* Timetable Entries */}
//         <View style={styles.timetableCard}>
//           <Text style={styles.timetableTitle}>Weekly Timetable</Text>

//           {Object.entries(timetable.entries).map(([day, dailyEntries]: [string, string[]]) => (
//             <View key={day} style={styles.dayBlock}>
//               <Text style={styles.dayHeader}>{day}</Text>

//               {dailyEntries.map((subject: string, index: number) => (
//                 <View
//                   key={index}
//                   style={[styles.timetableRow, index % 2 === 0 && styles.altRow]}
//                 >
//                   <Text style={styles.time}>{periodTimeMap[index]}</Text>
//                   <Text style={styles.subject}>{subject}</Text>
//                 </View>
//               ))}
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   gradientContainer: { flex: 1 },
//   container: { padding: 20, alignItems: 'center' },
//   studentCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 20,
//     padding: 24,
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 28,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 6,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   studentHeader: {
//     position: 'absolute',
//     top: 0, left: 0, right: 0, height: 8,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   studentName: { fontSize: 22, fontWeight: 'bold', color: '#1a237e', marginBottom: 6 },
//   studentDetail: { fontSize: 16, color: '#555', marginBottom: 2 },
//   timetableCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 20,
//     padding: 20,
//     width: '100%',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   timetableTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2575fc',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   dayBlock: {
//     marginBottom: 20,
//   },
//   dayHeader: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#6a11cb',
//     marginBottom: 10,
//   },
//   timetableRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderBottomColor: '#eee',
//     borderBottomWidth: 1,
//   },
//   altRow: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//   },
//   subject: { fontSize: 15, color: '#333', width: 140, textAlign: 'right' },
//   time: { fontSize: 15, color: '#555', width: 140 },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// ============================================================================================================
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import api from '../api/api';

// export default function TimetableScreen() {
//   const [timetable, setTimetable] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const className = '10A';

//   const periodTimeMap: { [key: number]: string } = {
//     0: '9:00 - 10:00',
//     1: '10:00 - 11:00',
//     2: '11:00 - 12:00',
//     3: '12:00 - 1:00',
//     4: '2:00 - 3:00',
//     5: '3:00 - 4:00',
//   };

//   useEffect(() => {
//     const fetchTimetable = async () => {
//       try {
//         const res = await api.get(`/timetable/${className}`);
//         console.log('Fetched timetable:', res.data);
//         setTimetable(res.data.data);
//       } catch (err) {
//         console.error('Failed to fetch timetable:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTimetable();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#2563eb" />
//       </View>
//     );
//   }

//   if (!timetable || !timetable.entries || Object.keys(timetable.entries).length === 0) {
//     return (
//       <View style={styles.centered}>
//         <Text style={{ color: '#333' }}>No timetable data found.</Text>
//       </View>
//     );
//   }

//   return (
//     <LinearGradient
//       colors={['#edf5ff', '#fdfdfd']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 0, y: 1 }}
//       style={styles.gradientContainer}
//     >
//       <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
//         {/* header chip */}
//         <LinearGradient
//           colors={['#dbeafe', '#e0f2fe']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.headerChip}
//         >
//           <View>
//             <Text style={styles.headerTitle}>Timetable</Text>
//             <Text style={styles.headerSubtitle}>
//               Class {timetable.className} • Section {timetable.section}
//             </Text>
//           </View>
//           <View style={styles.headerBadge}>
//             <Text style={styles.headerBadgeLabel}>Year</Text>
//             <Text style={styles.headerBadgeValue}>{timetable.academicYear}</Text>
//           </View>
//         </LinearGradient>

//         {/* timetable card */}
//         <View style={styles.timetableCard}>
//   {Object.entries(timetable.entries as Record<string, string[]>).map(
//     ([day, dailyEntries]) => (
//       <View key={day} style={styles.dayBlock}>
//         <View style={styles.dayHeaderRow}>
//           <Text style={styles.dayHeaderText}>{day}</Text>
//         </View>

//         {dailyEntries.map((subject, index) => (
//           <View key={index} style={styles.periodCard}>
//             <View style={styles.periodLeft}>
//               <Text style={styles.periodLabel}>Period {index + 1}</Text>
//               <Text style={styles.periodTime}>{periodTimeMap[index]}</Text>
//             </View>
//             <View style={styles.subjectPill}>
//               <Text style={styles.subjectText}>{subject}</Text>
//             </View>
//           </View>
//         ))}
//       </View>
//     ),
//   )}
// </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   gradientContainer: { flex: 1 },
//   container: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 32 },

//   /* header */
//   headerChip: {
//     borderRadius: 22,
//     paddingHorizontal: 18,
//     paddingVertical: 14,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 18,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 3,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#0f172a',
//   },
//   headerSubtitle: {
//     marginTop: 4,
//     fontSize: 13,
//     color: '#4b5563',
//   },
//   headerBadge: {
//     backgroundColor: '#fff7ed',
//     borderRadius: 999,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     alignItems: 'flex-end',
//   },
//   headerBadgeLabel: {
//     fontSize: 11,
//     color: '#9a3412',
//   },
//   headerBadgeValue: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#c05621',
//   },

//   /* main card */
//   timetableCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 20,
//     paddingHorizontal: 14,
//     paddingVertical: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 3,
//   },

//   dayBlock: {
//     marginBottom: 20,
//   },
//   dayHeaderRow: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#e0f2fe',
//     borderRadius: 999,
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     marginBottom: 10,
//   },
//   dayHeaderText: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#1d4ed8',
//   },

//   periodCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 14,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     marginBottom: 8,
//     backgroundColor: '#f9fafb',
//   },
//   periodLeft: {
//     flex: 1,
//   },
//   periodLabel: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#4b5563',
//   },
//   periodTime: {
//     fontSize: 12,
//     color: '#9ca3af',
//     marginTop: 2,
//   },
//   subjectPill: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 999,
//     backgroundColor: '#e0f7fa',
//   },
//   subjectText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#006064',
//   },

//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/api';
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function TimetableScreen() {
  const [timetable, setTimetable] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');

  // const className = '10A';
  // const section = 'A';
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');


  const periodTimeMap: { [key: number]: string } = {
    0: '9:00 - 10:00',
    1: '10:00 - 11:00',
    2: '11:00 - 12:00',
    3: '12:00 - 1:00',
    4: '2:00 - 3:00',
    5: '3:00 - 4:00',
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    useEffect(() => {
      const loadUser = async () => {
        const cls = await AsyncStorage.getItem("className");
        const sec = await AsyncStorage.getItem("section");

        setClassName(cls || '');
        setSection(sec || '');
      };

      loadUser();
    }, []);

  useEffect(() => {
      if (!className || !section) return;

      const fetchTimetable = async () => {
        const res = await api.get(`/timetable/${className}`, {
          params: { section }
        });

        setTimetable(res.data.data);
        setLoading(false);
      };

      fetchTimetable();
    }, [className, section]);


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!timetable || !timetable.entries || Object.keys(timetable.entries).length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#333' }}>No timetable data found.</Text>
      </View>
    );
  }

  const currentDayEntries = timetable.entries[selectedDay] || [];

  return (
    <LinearGradient
      colors={['#edf5ff', '#fdfdfd']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradientContainer}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header chip */}
        <LinearGradient
          colors={['#dbeafe', '#e0f2fe']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerChip}
        >
          <View>
            <Text style={styles.headerTitle}>Timetable</Text>
            <Text style={styles.headerSubtitle}>
              Class {timetable.className} • Section {timetable.section}
            </Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeLabel}>Year</Text>
            <Text style={styles.headerBadgeValue}>{timetable.academicYear}</Text>
          </View>
        </LinearGradient>

        {/* Compact Day selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.daySelectorContainer}
          contentContainerStyle={styles.daySelectorContent}
        >
          {days.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayChip,
                selectedDay === day && styles.dayChipSelected
              ]}
              onPress={() => setSelectedDay(day)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayChipText,
                selectedDay === day && styles.dayChipTextSelected
              ]}>
                {day.slice(0,3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 3-Column Timetable Table */}
        <View style={styles.timetableSheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetDayTitle}>{selectedDay}</Text>
          </View>

          {currentDayEntries.length === 0 ? (
            <View style={styles.emptySchedule}>
              <Text style={styles.emptyScheduleText}>No classes</Text>
            </View>
          ) : (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Period</Text>
                <Text style={styles.tableHeaderText}>Time</Text>
                <Text style={styles.tableHeaderText}>Subject / Teacher</Text>
              </View>
              
              {currentDayEntries.map((subject: string, index: number) => {
                const teacher = timetable.subjects?.[subject]?.teacher || 'TBD';
                return (
                  <View key={index} style={styles.tableRow}>
                    <View style={styles.periodCell}>
                      <Text style={styles.periodNumber}>P{index + 1}</Text>
                    </View>
                    <View style={styles.timeCell}>
                      <Text style={styles.timeText}>{periodTimeMap[index]}</Text>
                    </View>
                    <View style={styles.subjectCell}>
                      <Text style={styles.subjectText}>{subject}</Text>
                      <Text style={styles.teacherText}>{teacher}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Compact Subjects Section */}
        <View style={styles.subjectsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Subjects</Text>
          </View>

          {timetable.subjects && Object.keys(timetable.subjects).length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.subjectsHorizontalScroll}
            >
              {Object.entries(timetable.subjects).map(([subjectName, subjectData]: [string, any]) => (
                <View key={subjectName} style={styles.compactSubjectCard}>
                  <View style={[styles.compactSubjectColor, { backgroundColor: getSubjectColor(subjectName) }]}>
                    <Text style={styles.compactSubjectInitial}>{subjectName.charAt(0)}</Text>
                  </View>
                  <Text style={styles.compactSubjectName} numberOfLines={1}>{subjectName}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noSubjects}>
              <Text style={styles.noSubjectsText}>No subjects</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const getSubjectColor = (subjectName: string) => {
  const colors = ['#ef4444', '#82817fff', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
  return colors[subjectName.charCodeAt(0) % colors.length];
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 32 },

  /* Header */
  headerChip: {
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'flex-end',
  },
  headerBadgeLabel: {
    fontSize: 11,
    color: '#9a3412',
  },
  headerBadgeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#c05621',
  },

  /* Day Selector */
  daySelectorContainer: {
    marginBottom: 12,
  },
  daySelectorContent: {
    gap: 8,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dayChipSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
  },
  dayChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  dayChipTextSelected: {
    color: '#ffffff',
  },

  /* 3-Column Table */
  timetableSheet: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  sheetHeader: {
    marginBottom: 16,
  },
  sheetDayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },

  tableContainer: {},
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    flex: 1,
    textAlign: 'center',
  },

  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  periodCell: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3b82f6',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeCell: {
    flex: 1.5,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  subjectCell: {
    flex: 2.2,
    justifyContent: 'center',
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  teacherText: {
    fontSize: 11,
    color: '#6b7280',
  },

  /* Empty Schedule */
  emptySchedule: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyScheduleText: {
    fontSize: 14,
    color: '#9ca3af',
  },

  /* Subjects */
  subjectsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  subjectsHorizontalScroll: {},
  compactSubjectCard: {
    width: 72,
    alignItems: 'center',
    marginRight: 12,
  },
  compactSubjectColor: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  compactSubjectInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  compactSubjectName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },

  noSubjects: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noSubjectsText: {
    fontSize: 14,
    color: '#9ca3af',
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
