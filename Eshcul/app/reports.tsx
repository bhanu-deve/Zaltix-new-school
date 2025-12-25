// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
// // import axios from 'axios';
// import { LinearGradient } from 'expo-linear-gradient';
// // import {Api_url} from './config/config.js'
// import api from "../api/api";


// interface StudentData {
//   name: string;
//   rollNo: string;
//   class: string;
//   math: number;
//   english: number;
//   science: number;
//   socialStudies: number;
//   computer: number;
//   hindi: number;
//   totalMarks: number;
//   average: number;
//   grade: string;
// }

// export default function ReportsScreen() {
//   const [student, setStudent] = useState<StudentData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [allStudents, setAllStudents] = useState<any[]>([]);
//   const [showStudentList, setShowStudentList] = useState(false);

//   const targetStudentName = 'anjali';

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Try to fetch the student by name
//         try {
//           const res = await api.get(`/grades/student/${targetStudentName}`);
//           setStudent(res.data);
//           setShowStudentList(false);
//         } catch (studentError: any) {
//           // If student not found, try to fetch all students
//           if (studentError.response?.status === 404) {
//             console.log('Student not found, fetching all students...');
//             const allRes = await api.get('/grades');
//             const students = Array.isArray(allRes.data) ? allRes.data : [];
//             setAllStudents(students);
            
//             // Try to find a student with similar name (case-insensitive)
//             const foundStudent = students.find((s: any) => 
//               s.name?.toLowerCase() === targetStudentName.toLowerCase()
//             );
            
//             if (foundStudent) {
//               setStudent(foundStudent);
//               setShowStudentList(false);
//             } else if (students.length > 0) {
//               // Show first student as default
//               setStudent(students[0]);
//               setShowStudentList(true);
//               setError(`Student "${targetStudentName}" not found. Showing first available student.`);
//             } else {
//               setError(`No student named "${targetStudentName}" found and no students in database.`);
//               setStudent(null);
//             }
//           } else {
//             throw studentError;
//           }
//         }
//       } catch (error: any) {
//         console.error('Error fetching student data:', error);
//         const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Failed to fetch data from server';
//         setError(errorMessage);
//         setStudent(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudentData();
//   }, []);

//   const getGrade = (marks: number) => {
//     if (marks >= 90) return 'A+';
//     if (marks >= 80) return 'A';
//     if (marks >= 70) return 'B+';
//     if (marks >= 60) return 'B';
//     if (marks >= 50) return 'C';
//     return 'D';
//   };

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#2575fc" />
//       </View>
//     );
//   }

//   if (error && !student) {
//     return (
//       <View style={styles.loader}>
//         <Text style={{ color: 'red', fontSize: 16, textAlign: 'center', padding: 20 }}>{error}</Text>
//         {allStudents.length > 0 && (
//           <View style={{ marginTop: 20, padding: 20 }}>
//             <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Available Students:</Text>
//             {allStudents.slice(0, 5).map((s: any, idx: number) => (
//               <Text key={idx} style={{ fontSize: 14, marginBottom: 5 }}>
//                 • {s.name} (Class: {s.class})
//               </Text>
//             ))}
//           </View>
//         )}
//       </View>
//     );
//   }

//   if (!student) {
//     return (
//       <View style={styles.loader}>
//         <Text style={{ fontSize: 16 }}>No student data found.</Text>
//       </View>
//     );
//   }

//   const reportCardData = [
//     { subject: 'Mathematics', marks: student.math },
//     { subject: 'Science', marks: student.science },
//     { subject: 'English', marks: student.english },
//     { subject: 'Social Studies', marks: student.socialStudies },
//     { subject: 'Computer', marks: student.computer },
//     { subject: 'Hindi', marks: student.hindi },
//   ];

//   const maxMarks = reportCardData.length * 100;

//   return (
//     <LinearGradient colors={['#e0eafc', '#f5f7fa']} style={styles.gradient}>
//       <ScrollView contentContainerStyle={styles.container}>
//         {error && showStudentList && (
//           <View style={styles.warningBanner}>
//             <Text style={styles.warningText}>{error}</Text>
//           </View>
//         )}
//         {/* Profile */}
//         <View style={styles.profileCard}>
//           <Image source={require('../assets/images/profile.png')} style={styles.profileImage} />
//           <View>
//             <Text style={styles.profileName}>{student.name}</Text>
//             <Text style={styles.profileInfo}>Class: {student.class}</Text>
//             <Text style={styles.profileInfo}>Roll No: {student.rollNo}</Text>
//           </View>
//         </View>

//         <Text style={styles.heading}>Academic Report</Text>

//         {/* Table Header */}
//         <View style={[styles.row, styles.headerRow]}>
//           <Text style={[styles.cell, styles.headerText]}>Subject</Text>
//           <Text style={[styles.cell, styles.headerText]}>Marks</Text>
//           <Text style={[styles.cell, styles.headerText]}>Grade</Text>
//         </View>

//         {/* Table Rows */}
//         {reportCardData.map((item, index) => (
//           <View key={index} style={styles.row}>
//             <Text style={styles.cell}>{item.subject}</Text>
//             <Text style={styles.cell}>{item.marks}</Text>
//             <Text style={styles.cell}>{getGrade(item.marks)}</Text>
//           </View>
//         ))}

//         {/* Overall Section */}
//         <View style={[styles.row, styles.overallRow]}>
//           <Text style={styles.cellBold}>Total</Text>
//           <Text style={styles.cellBold}>
//             {student.totalMarks} / {maxMarks}
//           </Text>
//           <Text style={styles.cellBold}>Avg: {student.average}</Text>
//         </View>

//         <View style={[styles.row, styles.gradeRow]}>
//           <Text style={[styles.cell, styles.overallGradeText]}>Overall Grade:</Text>
//           <Text style={[styles.cell, styles.overallGradeValue]}>{student.grade}</Text>
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   gradient: { flex: 1 },
//   container: { padding: 20, paddingBottom: 40 },
//   loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   profileCard: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 20,
//     elevation: 3,
//   },
//   profileImage: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     marginRight: 16,
//     backgroundColor: '#ccc',
//   },
//   profileName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2575fc',
//   },
//   profileInfo: {
//     fontSize: 14,
//     color: '#555',
//   },
//   heading: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 12,
//     marginTop: 4,
//   },
//   row: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderRadius: 10,
//     marginBottom: 8,
//     elevation: 1,
//   },
//   headerRow: {
//     backgroundColor: '#2575fc',
//   },
//   headerText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   cell: {
//     flex: 1,
//     textAlign: 'center',
//     fontSize: 14,
//     color: '#444',
//   },
//   cellBold: {
//     flex: 1,
//     textAlign: 'center',
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#222',
//   },
//   overallRow: {
//     backgroundColor: '#f2f2f2',
//     borderColor: '#ddd',
//     borderWidth: 1,
//   },
//   gradeRow: {
//     backgroundColor: '#d1e7ff',
//     borderColor: '#a5c9ff',
//     borderWidth: 1,
//   },
//   overallGradeText: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#2575fc',
//   },
//   overallGradeValue: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#2575fc',
//     textAlign: 'center',
//   },
//   warningBanner: {
//     backgroundColor: '#fff3cd',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#ffc107',
//   },
//   warningText: {
//     color: '#856404',
//     fontSize: 14,
//   },
// });


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../api/api';

interface StudentData {
  name: string;
  rollNo: string;
  class: string;
  math: number;
  english: number;
  science: number;
  socialStudies: number;
  computer: number;
  hindi: number;
  totalMarks: number;
  average: number;
  grade: string;
}

export default function ReportsScreen() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [showStudentList, setShowStudentList] = useState(false);

  const targetStudentName = 'anjali';

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          const res = await api.get(`/grades/student/${targetStudentName}`);
          setStudent(res.data);
          setShowStudentList(false);
        } catch (studentError: any) {
          if (studentError.response?.status === 404) {
            const allRes = await api.get('/grades');
            const students = Array.isArray(allRes.data) ? allRes.data : [];
            setAllStudents(students);

            const foundStudent = students.find(
              (s: any) =>
                s.name?.toLowerCase() === targetStudentName.toLowerCase(),
            );

            if (foundStudent) {
              setStudent(foundStudent);
              setShowStudentList(false);
            } else if (students.length > 0) {
              setStudent(students[0]);
              setShowStudentList(true);
              setError(
                `Student "${targetStudentName}" not found. Showing first available student.`,
              );
            } else {
              setError(
                `No student named "${targetStudentName}" found and no students in database.`,
              );
              setStudent(null);
            }
          } else {
            throw studentError;
          }
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          'Failed to fetch data from server';
        setError(errorMessage);
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const getGrade = (marks: number) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    return 'D';
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error && !student) {
    return (
      <View style={styles.loader}>
        <Text
          style={{
            color: 'red',
            fontSize: 16,
            textAlign: 'center',
            padding: 20,
          }}
        >
          {error}
        </Text>
        {allStudents.length > 0 && (
          <View style={{ marginTop: 20, padding: 20 }}>
            <Text
              style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}
            >
              Available Students:
            </Text>
            {allStudents.slice(0, 5).map((s: any, idx: number) => (
              <Text key={idx} style={{ fontSize: 14, marginBottom: 5 }}>
                • {s.name} (Class: {s.class})
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.loader}>
        <Text style={{ fontSize: 16 }}>No student data found.</Text>
      </View>
    );
  }

  const reportCardData = [
    { subject: 'Mathematics', marks: student.math },
    { subject: 'Science', marks: student.science },
    { subject: 'English', marks: student.english },
    { subject: 'Social Studies', marks: student.socialStudies },
    { subject: 'Computer', marks: student.computer },
    { subject: 'Hindi', marks: student.hindi },
  ];

  const maxMarks = reportCardData.length * 100;

  return (
    <LinearGradient
      colors={['#edf5ff', '#fdfdfd']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {error && showStudentList && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>{error}</Text>
          </View>
        )}

        {/* top header chip */}
        <View style={styles.headerCard}>
          <Image
            source={require('../assets/images/profile.png')}
            style={styles.profileImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{student.name}</Text>
            <Text style={styles.profileInfo}>
              Class {student.class} • Roll {student.rollNo}
            </Text>
          </View>
          <View style={styles.gradeChip}>
            <Text style={styles.gradeChipLabel}>Overall</Text>
            <Text style={styles.gradeChipValue}>{student.grade}</Text>
          </View>
        </View>

        {/* summary strip */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#e0f2fe' }]}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>
              {student.totalMarks}/{maxMarks}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#dcfce7' }]}>
            <Text style={styles.summaryLabel}>Average</Text>
            <Text style={styles.summaryValue}>{student.average}</Text>
          </View>
        </View>

        <Text style={styles.heading}>Subject wise performance</Text>

        {/* table-style card */}
        <View style={styles.tableCard}>
          <View style={[styles.tableRow, styles.tableHeaderRow]}>
            <Text style={[styles.colSubject, styles.headerText]}>Subject</Text>
            <Text style={[styles.colMarks, styles.headerText]}>Marks</Text>
            <Text style={[styles.colGrade, styles.headerText]}>Grade</Text>
          </View>

          {reportCardData.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 0 && styles.tableRowAlt,
              ]}
            >
              <Text style={styles.colSubject}>{item.subject}</Text>
              <Text style={styles.colMarks}>{item.marks}</Text>
              <Text style={styles.colGrade}>{getGrade(item.marks)}</Text>
            </View>
          ))}
        </View>

        {/* overall grade band */}
        <View style={styles.overallBand}>
          <Text style={styles.overallBandLabel}>Overall grade</Text>
          <Text style={styles.overallBandGrade}>{student.grade}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 32 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  warningBanner: {
    backgroundColor: '#fef9c3',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#facc15',
  },
  warningText: {
    color: '#854d0e',
    fontSize: 13,
  },

  /* header/profile card */
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
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
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  profileInfo: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  gradeChip: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#e0f2fe',
    alignItems: 'flex-end',
  },
  gradeChipLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  gradeChipValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1d4ed8',
  },

  /* summary */
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#4b5563',
  },
  summaryValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },

  /* table card */
  tableCard: {
    borderRadius: 18,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderRow: {
    backgroundColor: '#e0f2fe',
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  colSubject: {
    flex: 2,
    fontSize: 13,
    color: '#374151',
  },
  colMarks: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
  },
  colGrade: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    textAlign: 'right',
  },
  headerText: {
    fontWeight: '700',
    color: '#111827',
  },

  /* overall band */
  overallBand: {
    marginTop: 16,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#e0f7fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallBandLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  overallBandGrade: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0284c7',
  },
});
