// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
// import { MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// // import axios from 'axios';
// import moment from 'moment';
// // import {Api_url} from './config/config.js'
// import api from "../api/api";


// export default function ProjectScreen() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await api.get(`/AddProject`); // Update if needed
//         setProjects(res.data);
//       } catch (err) {
//         console.error('Failed to fetch projects', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const renderIcon = (subject) => {
//     switch (subject?.toLowerCase()) {
//       case 'mathematics':
//         return <MaterialCommunityIcons name="math-compass" size={28} color="#fff" />;
//       case 'science':
//         return <MaterialCommunityIcons name="atom" size={28} color="#fff" />;
//       case 'english':
//         return <FontAwesome5 name="pen-fancy" size={24} color="#fff" />;
//       case 'computer':
//         return <Entypo name="laptop" size={24} color="#fff" />;
//       default:
//         return <Entypo name="book" size={24} color="#fff" />;
//     }
//   };

//   const subjectColors = {
//     mathematics: '#F76E6E',
//     science: '#00B894',
//     english: '#6C5CE7',
//     computer: '#0984E3',
//     telugu: '#F0932B',
//     default: '#636e72',
//   };

//   const formatDate = (dateStr) => moment(dateStr).format('MMM DD, YYYY');

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

//         {loading ? (
//           <ActivityIndicator size="large" color="#2575fc" />
//         ) : (
//           <FlatList
//             data={projects}
//             keyExtractor={(item, i) => item._id || i.toString()}
//             renderItem={({ item }) => {
//               const color = subjectColors[item.subject?.toLowerCase()] || subjectColors.default;
//               return (
//                 <View style={[styles.projectCard, { backgroundColor: color }]}>
//                   <View style={styles.cardHeader}>
//                     {renderIcon(item.subject)}
//                     <Text style={styles.subjectText}>{item.subject}</Text>
//                   </View>
//                   <Text style={styles.projectTitle}>Title: {item.title}</Text>
//                   <Text style={styles.projectInfo}>Class: {item.class}</Text>
//                   <Text style={styles.projectInfo}>Due Date: {formatDate(item.dueDate)}</Text>
//                   <Text style={styles.projectInfo}>Description: {item.description || 'N/A'}</Text>
//                 </View>
//               );
//             }}
//             contentContainerStyle={{ paddingBottom: 40 }}
//           />
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
//   profileName: { fontSize: 20, fontWeight: 'bold', color: '#2575fc' },
//   profileInfo: { fontSize: 14, color: '#444' },
//   projectCard: {
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 3,
//   },
//   cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
//   subjectText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginLeft: 12,
//     textTransform: 'capitalize',
//   },
//   projectTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
//   projectInfo: { fontSize: 14, color: '#fff', marginBottom: 2 },
// });
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
// import { MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
// import moment from 'moment';
// // import axios from 'axios';
// // import {Api_url} from './config/config.js'
// import api from "../api/api";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function ProjectScreen() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const studentStr = await AsyncStorage.getItem('student');
//         if (!studentStr) return;

//         const student = JSON.parse(studentStr);

//         const res = await api.get('/AddProject', {
//           params: {
//             className: student.grade,
//             section: student.section,
//           },
//         });

//         setProjects(res.data);
//       } catch (err) {
//         console.log('Project fetch error', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   const renderIcon = (subject) => {
//     switch (subject?.toLowerCase()) {
//       case 'mathematics':
//         return <MaterialCommunityIcons name="math-compass" size={22} color="#3B82F6" />;
//       case 'science':
//         return <MaterialCommunityIcons name="atom" size={22} color="#10B981" />;
//       case 'english':
//         return <FontAwesome5 name="pen-fancy" size={20} color="#EF4444" />;
//       case 'computer':
//         return <Entypo name="laptop" size={20} color="#8B5CF6" />;
//       default:
//         return <Entypo name="book" size={20} color="#F59E0B" />;
//     }
//   };

//   const getSubjectColor = (subject) => {
//     switch (subject?.toLowerCase()) {
//       case 'mathematics': return '#3B82F6';
//       case 'science': return '#10B981';
//       case 'english': return '#EF4444';
//       case 'computer': return '#8B5CF6';
//       default: return '#F59E0B';
//     }
//   };

//   const formatDate = (dateStr) => moment(dateStr).format('MMM DD, YYYY');

//   return (
//     <View style={styles.container}>
//       {/* Profile Card */}
//       <View style={styles.profileCard}>
//         <View style={styles.profileIcon}>
//           <Text style={styles.profileIconText}>📚</Text>
//         </View>
//         <View style={styles.profileInfo}>
//           <Text style={styles.profileName}>John Doe</Text>
//           <View style={styles.profileDetails}>
//             <View style={styles.detailItem}>
//               <Text style={styles.detailLabel}>Class</Text>
//               <Text style={styles.detailValue}>10</Text>
//             </View>
//             <View style={styles.detailItem}>
//               <Text style={styles.detailLabel}>Section</Text>
//               <Text style={styles.detailValue}>A</Text>
//             </View>
//             <View style={styles.detailItem}>
//               <Text style={styles.detailLabel}>Roll No</Text>
//               <Text style={styles.detailValue}>23</Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
//       ) : (
//         <FlatList
//           data={projects}
//           keyExtractor={(item, i) => item._id || i.toString()}
//           renderItem={({ item }) => {
//             const color = getSubjectColor(item.subject);
//             return (
//               <View style={[styles.projectCard, { borderLeftColor: color, borderLeftWidth: 5 }]}>
//                 <View style={styles.cardHeader}>
//                   <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
//                     {renderIcon(item.subject)}
//                   </View>
//                   <View style={styles.subjectInfo}>
//                     <Text style={styles.subjectText}>{item.subject}</Text>
//                     <View style={styles.dueDateBadge}>
//                       <Text style={styles.dueDateText}>📅 {formatDate(item.dueDate)}</Text>
//                     </View>
//                   </View>
//                 </View>
                
//                 <Text style={styles.projectTitle}>{item.title}</Text>
                
//                 <View style={styles.detailsRow}>
//                   <View style={[styles.classBadge, { backgroundColor: color + '15' }]}>
//                     <Text style={[styles.classText, { color }]}>Class {item.class}</Text>
//                   </View>
//                 </View>
                
//                 {item.description && (
//                   <View style={styles.descriptionBox}>
//                     <Text style={styles.descriptionLabel}>Description:</Text>
//                     <Text style={styles.descriptionText}>{item.description}</Text>
//                   </View>
//                 )}
//               </View>
//             );
//           }}
//           contentContainerStyle={styles.list}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   loader: {
//     marginTop: 50,
//   },
//   profileCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#f1f5f9',
//   },
//   profileIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 12,
//     backgroundColor: '#e0f2fe',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 14,
//   },
//   profileIconText: {
//     fontSize: 28,
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   profileName: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1e293b',
//     marginBottom: 8,
//   },
//   profileDetails: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   detailItem: {
//     flex: 1,
//   },
//   detailLabel: {
//     fontSize: 12,
//     color: '#64748b',
//     marginBottom: 2,
//   },
//   detailValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#475569',
//   },
//   list: {
//     paddingBottom: 20,
//   },
//   projectCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#f1f5f9',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   iconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   subjectInfo: {
//     flex: 1,
//   },
//   subjectText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1e293b',
//     marginBottom: 4,
//   },
//   dueDateBadge: {
//     alignSelf: 'flex-start',
//   },
//   dueDateText: {
//     fontSize: 12,
//     color: '#64748b',
//     fontWeight: '500',
//   },
//   projectTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1e293b',
//     marginBottom: 12,
//   },
//   detailsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   classBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   classText: {
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   descriptionBox: {
//     backgroundColor: '#f8fafc',
//     borderRadius: 10,
//     padding: 12,
//     marginTop: 4,
//   },
//   descriptionLabel: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#475569',
//     marginBottom: 4,
//   },
//   descriptionText: {
//     fontSize: 14,
//     color: '#475569',
//     lineHeight: 20,
//   },
// });



import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import moment from 'moment';
import api from "../api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLang } from './language';

export default function ProjectScreen() {
  const { t } = useLang();

  /* ===================== 1️⃣ ADD THESE STATES (TOP) ===================== */
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);

  /* ===================== 2️⃣ LOAD STUDENT + FETCH PROJECTS ===================== */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // 🔹 GET STUDENT FROM STORAGE
        const studentStr = await AsyncStorage.getItem('student');

        if (!studentStr) {
          setLoading(false); // ✅ IMPORTANT
          return;
        }

        const studentData = JSON.parse(studentStr);
        setStudent(studentData);

        // 🔹 CLASS + SECTION WISE API CALL
        const res = await api.get('/AddProject', {
          params: {
            className: studentData.grade,
            section: studentData.section,
          },
        });

        setProjects(res.data);
      } catch (err) {
        console.log('Project fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /* ===================== ICON HELPERS (NO CHANGE) ===================== */
  const renderIcon = (subject: string) => {
    switch (subject?.toLowerCase()) {
      case 'mathematics':
        return <MaterialCommunityIcons name="math-compass" size={22} color="#3B82F6" />;
      case 'science':
        return <MaterialCommunityIcons name="atom" size={22} color="#10B981" />;
      case 'english':
        return <FontAwesome5 name="pen-fancy" size={20} color="#EF4444" />;
      case 'computer':
        return <Entypo name="laptop" size={20} color="#8B5CF6" />;
      default:
        return <Entypo name="book" size={20} color="#F59E0B" />;
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject?.toLowerCase()) {
      case 'mathematics': return '#3B82F6';
      case 'science': return '#10B981';
      case 'english': return '#EF4444';
      case 'computer': return '#8B5CF6';
      default: return '#F59E0B';
    }
  };

  const formatDate = (dateStr: string) =>
    moment(dateStr).format('MMM DD, YYYY');

  return (
    <View style={styles.container}>

      {/* ===================== 3️⃣ PROFILE CARD (DYNAMIC) ===================== */}
      <View style={styles.profileCard}>
        <View style={styles.profileIcon}>
          <Text style={styles.profileIconText}>📚</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {student?.name || t.student}
          </Text>

          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>{t.class}</Text>
              <Text style={styles.detailValue}>{student?.grade || '-'}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>{t.section}</Text>
              <Text style={styles.detailValue}>{student?.section || '-'}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>{t.rollNo}</Text>
              <Text style={styles.detailValue}>{student?.rollNumber || '-'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ===================== 4️⃣ LOADER ===================== */}
      {loading && (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
      )}

      {/* ===================== 5️⃣ EMPTY STATE ===================== */}
      {!loading && projects.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 40 }}>
          📘 {t.noProjects}
        </Text>

      )}

      {/* ===================== 6️⃣ PROJECT LIST ===================== */}
      {!loading && projects.length > 0 && (
        <FlatList
          data={projects}
          keyExtractor={(item: any) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }: any) => {
            const color = getSubjectColor(item.subject);

            return (
              <View style={[styles.projectCard, { borderLeftColor: color, borderLeftWidth: 5 }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    {renderIcon(item.subject)}
                  </View>

                  <View style={styles.subjectInfo}>
                    <Text style={styles.subjectText}>{item.subject}</Text>
                    <Text style={styles.dueDateText}>
                      📅 {formatDate(item.dueDate)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.projectTitle}>{item.title}</Text>

                <View style={styles.classBadge}>
                  <Text style={[styles.classText, { color }]}>
                    {t.class} {item.class} - {item.section}
                  </Text>
                </View>

                <View style={styles.descriptionBox}>
                  <Text style={styles.descriptionLabel}>{t.description}:</Text>
                  <Text style={styles.descriptionText}>{item.description}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

/* ===================== STYLES (UNCHANGED) ===================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  loader: { marginTop: 50 },

  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  profileIcon: {
    width: 60, height: 60, borderRadius: 12,
    backgroundColor: '#e0f2fe',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  profileIconText: { fontSize: 28 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  profileDetails: { flexDirection: 'row', gap: 16 },
  detailItem: { flex: 1 },
  detailLabel: { fontSize: 12, color: '#64748b' },
  detailValue: { fontSize: 14, fontWeight: '600' },

  list: { paddingBottom: 20 },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: { flexDirection: 'row', marginBottom: 12 },
  iconContainer: {
    width: 50, height: 50, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  subjectInfo: { flex: 1 },
  subjectText: { fontSize: 16, fontWeight: '700' },
  dueDateText: { fontSize: 12, color: '#64748b' },

  projectTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },

  classBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginBottom: 10,
  },
  classText: { fontSize: 13, fontWeight: '600' },

  descriptionBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
  },
  descriptionLabel: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  descriptionText: { fontSize: 14, lineHeight: 20 },
});
