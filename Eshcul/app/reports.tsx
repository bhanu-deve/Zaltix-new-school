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
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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

interface ExamData {
  examName: string;
  data: StudentData;
}

export default function ReportsScreen() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState('FA1');
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const targetStudentName = 'anjali';

  const examOptions = [
    { key: 'FA1', label: 'Formative 1', type: 'formative' },
    { key: 'FA2', label: 'Formative 2', type: 'formative' },
    { key: 'FA3', label: 'Formative 3', type: 'formative' },
    { key: 'SA1', label: 'Summative 1', type: 'summative' },
    { key: 'FA4', label: 'Formative 4', type: 'formative' },
    { key: 'FA5', label: 'Formative 5', type: 'formative' },
    { key: 'SA2', label: 'Summative 2', type: 'summative' },
    { key: 'Final', label: 'Final Result', type: 'final' },
  ];

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          const res = await api.get(`/grades/student/${targetStudentName}`);
          setStudent(res.data);
        } catch (studentError: any) {
          if (studentError.response?.status === 404) {
            const allRes = await api.get('/grades');
            const students = Array.isArray(allRes.data) ? allRes.data : [];
            setAllStudents(students);
            const foundStudent = students.find((s: any) => s.name?.toLowerCase() === targetStudentName.toLowerCase());
            setStudent(foundStudent || students[0] || null);
          }
        }

        try {
          const examsRes = await api.get(`/grades/exams/${targetStudentName}`);
          setExams(examsRes.data || []);
        } catch (examError) {
          console.log('No exam data available');
        }

      } catch (err: any) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  const getGrade = (marks: number) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    return 'D';
  };

  const currentExamData = exams.find(e => e.examName === selectedExam)?.data || student;
  const currentExamLabel = examOptions.find(e => e.key === selectedExam)?.label || selectedExam;

  const handleExamSelect = (examKey: string) => {
    const examData = exams.find(e => e.examName === examKey);
    if (examData) {
      setStudent(examData.data);
    }
    setSelectedExam(examKey);
    setShowDropdown(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error && !currentExamData) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!currentExamData) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  const reportCardData = [
    { subject: 'Mathematics', marks: currentExamData.math },
    { subject: 'Science', marks: currentExamData.science },
    { subject: 'English', marks: currentExamData.english },
    { subject: 'Social Studies', marks: currentExamData.socialStudies },
    { subject: 'Computer', marks: currentExamData.computer },
    { subject: 'Hindi', marks: currentExamData.hindi },
  ];

  const maxMarks = reportCardData.length * 100;

  return (
    <LinearGradient colors={['#edf5ff', '#fdfdfd']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Clean Dropdown */}
        <TouchableOpacity
          style={styles.dropdownButton}
          activeOpacity={0.7}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.dropdownButtonText}>{currentExamLabel}</Text>
          <Ionicons 
            name={showDropdown ? "chevron-up" : "chevron-down"} 
            size={18} 
            color="#64748b" 
          />
        </TouchableOpacity>

        {/* Dropdown Menu - All exams ACTIVE */}
        {showDropdown && (
          <View style={styles.dropdownMenu}>
            {examOptions.map((exam) => (
              <TouchableOpacity
                key={exam.key}
                style={[
                  styles.dropdownMenuItem,
                  selectedExam === exam.key && styles.dropdownMenuItemSelected
                ]}
                onPress={() => handleExamSelect(exam.key)}
              >
                <View style={styles.examTypeContainer}>
                  <View style={[
                    styles.examTypeBadge,
                    exam.type === 'formative' && styles.formativeBadge,
                    exam.type === 'summative' && styles.summativeBadge,
                    exam.type === 'final' && styles.finalBadge
                  ]}>
                    <Text style={[
                      styles.examTypeText,
                      exam.type === 'formative' && styles.formativeText,
                      exam.type === 'summative' && styles.summativeText,
                      exam.type === 'final' && styles.finalText
                    ]}>
                      {exam.type === 'formative' ? 'FA' : exam.type === 'summative' ? 'SA' : 'FINAL'}
                    </Text>
                  </View>
                  <Text style={[
                    styles.dropdownMenuItemText,
                    selectedExam === exam.key && styles.dropdownMenuItemTextSelected
                  ]}>
                    {exam.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Student Header */}
        <View style={styles.headerCard}>
          <Image source={require('../assets/images/profile.png')} style={styles.profileImage} />
          <View style={styles.profileInfoContainer}>
            <Text style={styles.profileName}>{currentExamData.name}</Text>
            <Text style={styles.profileDetails}>
              Class {currentExamData.class} • Roll {currentExamData.rollNo}
            </Text>
          </View>
          <View style={styles.gradeChip}>
            <Text style={styles.gradeChipLabel}>Overall</Text>
            <Text style={styles.gradeChipValue}>{currentExamData.grade}</Text>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.summaryTotal]}>
            <Text style={styles.summaryLabel}>Total Marks</Text>
            <Text style={styles.summaryValue}>{currentExamData.totalMarks}/{maxMarks}</Text>
          </View>
          <View style={[styles.summaryCard, styles.summaryAverage]}>
            <Text style={styles.summaryLabel}>Average</Text>
            <Text style={styles.summaryValue}>{currentExamData.average}%</Text>
          </View>
        </View>

        {/* Subjects Table */}
        <Text style={styles.sectionTitle}>Subject Performance</Text>
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderSubject}>Subject</Text>
            <Text style={styles.tableHeaderMarks}>Marks</Text>
            <Text style={styles.tableHeaderGrade}>Grade</Text>
          </View>
          {reportCardData.map((item, index) => (
            <View key={index} style={[
              styles.tableRow,
              index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
            ]}>
              <Text style={styles.tableSubject}>{item.subject}</Text>
              <Text style={styles.tableMarks}>{item.marks}/100</Text>
              <Text style={styles.tableGrade}>{getGrade(item.marks)}</Text>
            </View>
          ))}
        </View>

        {/* Final Grade Band */}
        <View style={styles.finalGradeCard}>
          <Text style={styles.finalGradeLabel}>
            Overall Grade - {currentExamLabel}
          </Text>
          <Text style={styles.finalGradeValue}>{currentExamData.grade}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { 
    flexGrow: 1, 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 40 
  },
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  errorText: { 
    color: '#ef4444', 
    fontSize: 14, 
    textAlign: 'center' 
  },

  // Dropdown
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },

  dropdownMenu: {
    backgroundColor: 'white',
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  dropdownMenuItemSelected: {
    backgroundColor: '#eff6ff',
  },
  examTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  examTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 36,
    alignItems: 'center',
  },
  formativeBadge: {
    backgroundColor: '#dbeafe',
  },
  summativeBadge: {
    backgroundColor: '#fef3c7',
  },
  finalBadge: {
    backgroundColor: '#dcfce7',
  },
  examTypeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  formativeText: {
    color: '#3b82f6',
  },
  summativeText: {
    color: '#d97706',
  },
  finalText: {
    color: '#16a34a',
  },
  dropdownMenuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  dropdownMenuItemTextSelected: {
    color: '#3b82f6',
  },

  // Rest of styles remain the same (smaller fonts)
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  profileInfoContainer: { flex: 1 },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  profileDetails: {
    fontSize: 12,
    color: '#6b7280',
  },
  gradeChip: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  gradeChipLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  gradeChipValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  summaryTotal: {
    backgroundColor: '#e0f2fe',
  },
  summaryAverage: {
    backgroundColor: '#dcfce7',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  tableCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableHeaderSubject: {
    flex: 2.2,
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  tableHeaderMarks: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  tableHeaderGrade: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  tableRowEven: {
    backgroundColor: '#f8fafc',
  },
  tableRowOdd: {
    backgroundColor: 'white',
  },
  tableSubject: {
    flex: 2.2,
    fontSize: 13,
    color: '#374151',
  },
  tableMarks: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
  },
  tableGrade: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    textAlign: 'right',
    fontWeight: '600',
  },
  finalGradeCard: {
    backgroundColor: '#e0f7fa',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finalGradeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  finalGradeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0284c7',
  },
});
