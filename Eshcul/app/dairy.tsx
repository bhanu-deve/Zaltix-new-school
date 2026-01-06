// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   FlatList,
//   Platform,
//   Button,
//   ActivityIndicator,
// } from 'react-native';
// import { MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import DateTimePicker from '@react-native-community/datetimepicker';
// // import axios from 'axios';
// // import {Api_url} from '../app/config/config';
// import  api  from "@/api/api";

// export default function DiaryScreen() {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [diaryData, setDiaryData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showPicker, setShowPicker] = useState(false);
  
// const formatDate = (date: Date) => {
//   // Always format as YYYY-MM-DD (UTC safe)
//   return date.toISOString().split("T")[0];
// };
//   const formattedDate = formatDate(selectedDate);

//   const iconMap: Record<string, JSX.Element> = {
//     Math: <MaterialCommunityIcons name="math-compass" size={28} color="#fff" />,
//     Science: <MaterialCommunityIcons name="flask-outline" size={28} color="#fff" />,
//     English: <FontAwesome5 name="book-open" size={24} color="#fff" />,
//     Computer: <Entypo name="laptop" size={24} color="#fff" />,
//     Default: <FontAwesome5 name="book" size={24} color="#fff" />,
//   };

//   const fetchDiary = async (dateStr: string) => {
//   setLoading(true);
//   try {
//     const res = await api.get(`/AddDiary`, {
//       params: { date: dateStr }
//     });
//     setDiaryData(res.data || []);
//   } catch (err) {
//     console.error('Fetch diary error:', err);
//     setDiaryData([]);
//   } finally {
//     setLoading(false);
//   }
// };


//   useEffect(() => {
//     fetchDiary(formattedDate);
//   }, [formattedDate]);

//   const handleDateChange = (_: any, date?: Date) => {
//     if (Platform.OS !== 'ios') setShowPicker(false);
//     if (date) setSelectedDate(date);
//   };

//   return (
//     <LinearGradient colors={['#e0eafc', '#f5f7fa']} style={styles.gradient}>
//       <View style={styles.container}>
//         <View style={styles.profileCard}>
//           <Image source={require('../assets/images/profile.png')} style={styles.profileImage} />
//           <View>
//             <Text style={styles.profileName}>John Doe</Text>
//             <Text style={styles.profileInfo}>Class: 10 | Section: A</Text>
//             <Text style={styles.profileInfo}>Roll No: 23</Text>
//           </View>
//         </View>

//         <View style={styles.datePicker}>
//           <Button title="Select Date" onPress={() => setShowPicker(true)} color="#2575fc" />
//           <Text style={styles.selectedDateText}>{formattedDate}</Text>
//         </View>

//         {showPicker && (
//           <DateTimePicker
//             value={selectedDate}
//             mode="date"
//             display="default"
//             onChange={handleDateChange}
//           />
//         )}

//         {loading ? (
//           <ActivityIndicator size="large" color="#2575fc" />
//         ) : diaryData.length > 0 ? (
//           <FlatList
//             data={diaryData}
//             keyExtractor={(item) => item._id}
//             renderItem={({ item }) => (
//               <View style={[styles.diaryCard, { backgroundColor: '#4a90e2' }]}>
//                 <View style={styles.cardHeader}>
//                   {iconMap[item.subject] || iconMap.Default}
//                   <View style={{ marginLeft: 12 }}>
//                     <Text style={styles.subjectText}>{item.subject}</Text>
//                     <Text style={styles.teacherText}>Class: {item.class}</Text>
//                   </View>
//                 </View>
//                 <Text style={styles.diaryText}>{item.notes}</Text>
//               </View>
//             )}
//           />
//         ) : (
//           <Text style={styles.noDataText}>No diary entries for this date.</Text>
//         )}
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   gradient: { flex: 1 },
//   container: { flex: 1, padding: 20 },
//   profileCard: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//     alignItems: 'center',
//     elevation: 4,
//   },
//   profileImage: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     marginRight: 16,
//     backgroundColor: '#ddd',
//   },
//   profileName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2575fc',
//   },
//   profileInfo: {
//     fontSize: 14,
//     color: '#444',
//   },
//   datePicker: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     justifyContent: 'space-between',
//   },
//   selectedDateText: {
//     fontSize: 16,
//     color: '#2575fc',
//   },
//   diaryCard: {
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   subjectText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   teacherText: {
//     fontSize: 13,
//     color: '#f1f1f1',
//     marginTop: 2,
//   },
//   diaryText: {
//     fontSize: 15,
//     color: '#fff',
//     lineHeight: 20,
//     marginTop: 8,
//   },
//   noDataText: {
//     textAlign: 'center',
//     color: '#999',
//     fontSize: 16,
//     marginTop: 30,
//   },
// });

import React, { useState, useEffect, JSX } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Entypo, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLang } from './language';

export default function DiaryScreen() {
  const { t } = useLang();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryData, setDiaryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const formattedDate = formatDate(selectedDate);

  const iconMap: Record<string, JSX.Element> = {
    Math: <MaterialCommunityIcons name="math-compass" size={18} color="#2563eb" />,
    Science: <MaterialCommunityIcons name="flask-outline" size={18} color="#2563eb" />,
    English: <FontAwesome5 name="book-open" size={16} color="#2563eb" />,
    Computer: <Entypo name="laptop" size={16} color="#2563eb" />,
    Default: <FontAwesome5 name="book" size={16} color="#2563eb" />,
  };
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const s = await AsyncStorage.getItem('student');
      if (s) setStudent(JSON.parse(s));
    })();
  }, []);

  const fetchDiary = async (dateStr: string) => {
    if (!student) return;

    setLoading(true);
    try {
      const res = await api.get('/AddDiary', {
        params: {
          date: dateStr,
          class: student.grade,
          section: student.section,
        },
      });

      setDiaryData(res.data || []);
    } catch (err) {
      console.error('Fetch diary error:', err);
      setDiaryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (student) {
      fetchDiary(formattedDate);
    }
  }, [formattedDate, student]);


  const handleDateChange = (_: any, date?: Date) => {
    if (Platform.OS !== 'ios') setShowPicker(false);
    if (date) setSelectedDate(date);
  };

  const renderDiaryItem = ({ item }: { item: any }) => {
    const icon = iconMap[item.subject] || iconMap.Default;

    return (
      <View style={styles.diaryCard}>
        {/* colored top strip */}
        <View style={styles.cardStrip} />

        <View style={styles.cardBody}>
          {/* subject + icon row */}
          <View style={styles.subjectHeader}>
            <View style={styles.subjectChip}>
              {icon}
              <Text style={styles.subjectChipText}>{item.subject}</Text>
            </View>

            <Text style={styles.classChipText}>
              {t.class} {item.class}-{item.section}
            </Text>


          </View>

          {/* notes */}
          <Text style={styles.notesLabel}>{t.homeworkNotes}</Text>

          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#edf5ff', '#fdfdfd']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* profile chip */}
        <LinearGradient
          colors={['#dbeafe', '#e0f2fe']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <Image
            source={require('../assets/images/profile.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{student?.name}</Text>
            <Text style={styles.profileInfo}>
              {t.class} {student?.grade} • {t.section} {student?.section}
            </Text>
            <Text style={styles.profileInfo}>
              {t.rollNo}: {student?.rollNumber}
            </Text>

          </View>
        </LinearGradient>

        {/* date row */}
        <View style={styles.dateRow}>
          <View style={styles.dateLabelBlock}>
            <Text style={styles.dateLabel}>{t.diaryDate}</Text>
            <Text style={styles.dateHint}>{t.tapToChooseDate}</Text>

          </View>
          <TouchableOpacity
            style={styles.datePill}
            onPress={() => setShowPicker(true)}
            activeOpacity={0.9}
          >
            <Ionicons name="calendar-outline" size={18} color="#1d4ed8" />
            <Text style={styles.datePillText}>{formattedDate}</Text>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 24 }} />
        ) : diaryData.length > 0 ? (
          <FlatList
            data={diaryData}
            keyExtractor={(item) => item._id}
            renderItem={renderDiaryItem}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.noDataText}>{t.noDiary}</Text>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 16 },

  /* profile chip */
  profileCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    backgroundColor: '#e5e7eb',
  },
  profileTextContainer: { flex: 1 },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  profileInfo: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 2,
  },

  /* date row */
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateLabelBlock: { flex: 1 },
  dateLabel: { fontSize: 14, fontWeight: '600', color: '#111827' },
  dateHint: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  datePillText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#2a88e0ff',
  },

  /* note-style diary cards */
  diaryCard: {
    borderRadius: 18,
    backgroundColor: '#ffffff',
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardStrip: {
    height: 6,
    backgroundColor: '#417a47ff',
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  subjectChipText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  classChip: {
    borderRadius: 999,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  classChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400e',
  },
  notesLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },

  noDataText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 15,
    marginTop: 32,
  },
});

