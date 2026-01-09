// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
// import { MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
// import moment from 'moment';
// // import axios from 'axios';
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


import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import api from "../api/api";
import { useLang } from './language';

export default function ProjectScreen() {
  const { t } = useLang();

  /* ===================== STATES ===================== */
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionModal, setSubmissionModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [student, setStudent] = useState(null);

  /* ===================== LOAD STUDENT + FETCH PROJECTS ===================== */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // 🔹 GET STUDENT FROM STORAGE
        const studentStr = await AsyncStorage.getItem('student');

        if (!studentStr) {
          setLoading(false);
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
        Alert.alert('Error', 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  };

  /* ===================== HELPER FUNCTIONS ===================== */
  const renderIcon = (subject) => {
    if (!subject) return <MaterialCommunityIcons name="book" size={22} color="#F59E0B" />;
    
    const lowerSubject = subject.toLowerCase();
    if (lowerSubject.includes('math')) return <MaterialCommunityIcons name="math-compass" size={22} color="#3B82F6" />;
    if (lowerSubject.includes('science')) return <MaterialCommunityIcons name="atom" size={22} color="#10B981" />;
    if (lowerSubject.includes('english')) return <MaterialCommunityIcons name="book-open-variant" size={22} color="#EF4444" />;
    if (lowerSubject.includes('computer')) return <MaterialCommunityIcons name="laptop" size={22} color="#8B5CF6" />;
    return <MaterialCommunityIcons name="book" size={22} color="#F59E0B" />;
  };

  const getSubjectColor = (subject) => {
    if (!subject) return '#F59E0B';
    
    const lowerSubject = subject.toLowerCase();
    if (lowerSubject.includes('math')) return '#3B82F6';
    if (lowerSubject.includes('science')) return '#10B981';
    if (lowerSubject.includes('english')) return '#EF4444';
    if (lowerSubject.includes('computer')) return '#8B5CF6';
    return '#F59E0B';
  };

  const formatDate = (dateStr) => {
    try {
      return moment(dateStr).format('MMM DD, YYYY');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleSubmitProject = (project) => {
    setSelectedProject(project);
    setSubmissionModal(true);
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 
               'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
               'text/plain'],
        copyToCacheDirectory: true
      });

      if (result.canceled === false && result.assets && result.assets[0]) {
        const file = result.assets[0];
        setAttachments([...attachments, {
          type: 'document',
          uri: file.uri,
          name: file.name || 'document',
          size: file.size,
          mimeType: file.mimeType
        }]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const image = result.assets[0];
        setAttachments([...attachments, {
          type: 'image',
          uri: image.uri,
          name: `image_${Date.now()}.jpg`,
          size: image.fileSize,
          width: image.width,
          height: image.height
        }]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleSubmission = async () => {
    if (attachments.length === 0 && !submissionNote.trim()) {
      Alert.alert('Alert', 'Please add at least one attachment or a note.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      
      // Add project ID
      formData.append('projectId', selectedProject._id);
      
      // Add note if exists
      if (submissionNote.trim()) {
        formData.append('note', submissionNote);
      }

      // Add student info
      formData.append('studentName', student?.name || 'Student');
      formData.append('studentId', student?._id || '');
      formData.append('submittedAt', new Date().toISOString());

      // Add attachments
      attachments.forEach((attachment, index) => {
        const fileType = attachment.type === 'image' ? 'image/jpeg' : attachment.mimeType || 'application/octet-stream';
        const fileName = attachment.name || `file_${index}`;
        
        formData.append('attachments', {
          uri: attachment.uri,
          type: fileType,
          name: fileName
        });
      });

      // Submit to your API endpoint
      const response = await api.post('/submitProject', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Project submitted successfully!');
        
        // Update the project status in the local state
        setProjects(prevProjects => 
          prevProjects.map(proj => 
            proj._id === selectedProject._id 
              ? { ...proj, status: 'submitted' }
              : proj
          )
        );
        
        resetSubmissionForm();
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetSubmissionForm = () => {
    setSubmissionModal(false);
    setSelectedProject(null);
    setSubmissionNote('');
    setAttachments([]);
  };

  const getFileIcon = (type) => {
    if (type === 'image') {
      return <MaterialCommunityIcons name="image" size={24} color="#3B82F6" />;
    } else if (type === 'document') {
      return <MaterialCommunityIcons name="file-document" size={24} color="#10B981" />;
    } else if (type.includes('pdf')) {
      return <MaterialCommunityIcons name="file-pdf" size={24} color="#EF4444" />;
    } else if (type.includes('word') || type.includes('document')) {
      return <MaterialCommunityIcons name="file-word" size={24} color="#2563EB" />;
    }
    return <MaterialCommunityIcons name="file" size={24} color="#64748b" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderAttachment = (attachment, index) => {
    return (
      <View key={index} style={styles.attachmentItem}>
        <View style={styles.attachmentInfo}>
          {getFileIcon(attachment.type)}
          <View style={styles.attachmentDetails}>
            <Text style={styles.attachmentName} numberOfLines={1}>
              {attachment.name}
            </Text>
            {attachment.size && (
              <Text style={styles.attachmentSize}>
                {formatFileSize(attachment.size)}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => removeAttachment(index)}
          style={styles.removeButton}
          disabled={submitting}
        >
          <MaterialCommunityIcons name="close-circle" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <View style={styles.profileIcon}>
          <MaterialCommunityIcons name="account-circle" size={50} color="#3B82F6" />
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {student?.name || t.student || 'Student'}
          </Text>

          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>{t?.class || 'Class'}</Text>
              <Text style={styles.detailValue}>{student?.grade || '-'}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>{t?.section || 'Section'}</Text>
              <Text style={styles.detailValue}>{student?.section || '-'}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>{t?.rollNo || 'Roll No'}</Text>
              <Text style={styles.detailValue}>{student?.rollNumber || '-'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* LOADER */}
      {loading && (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
      )}

      {/* EMPTY STATE */}
      {!loading && projects.length === 0 && (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="file-document-outline" size={60} color="#94a3b8" />
          <Text style={styles.emptyStateText}>No projects assigned</Text>
        </View>
      )}

      {/* PROJECT LIST */}
      {!loading && projects.length > 0 && (
        <FlatList
          data={projects}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const color = getSubjectColor(item.subject);
            const isSubmitted = item.status === 'submitted';

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
                    {t?.class || 'Class'} {item.class} - {item.section}
                  </Text>
                </View>

                <View style={styles.descriptionBox}>
                  <Text style={styles.descriptionLabel}>{t?.description || 'Description'}:</Text>
                  <Text style={styles.descriptionText}>{item.description}</Text>
                </View>

                {isSubmitted ? (
                  <View style={[styles.statusBadge, { backgroundColor: '#10B98120' }]}>
                    <MaterialCommunityIcons name="check-circle" size={14} color="#10B981" />
                    <Text style={[styles.statusText, { color: '#10B981' }]}>
                      Submitted
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={[styles.submitButton, { backgroundColor: color }]}
                    onPress={() => handleSubmitProject(item)}
                  >
                    <MaterialCommunityIcons name="upload" size={16} color="#fff" />
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
      )}

      {/* Submission Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={submissionModal}
        onRequestClose={() => !submitting && resetSubmissionForm()}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Project</Text>
              <TouchableOpacity 
                onPress={resetSubmissionForm}
                disabled={submitting}
              >
                <MaterialCommunityIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {selectedProject && (
              <View style={styles.projectInfo}>
                <Text style={styles.modalProjectTitle}>{selectedProject.title}</Text>
                <View style={styles.modalProjectDetails}>
                  <View style={[styles.subjectBadge, { backgroundColor: getSubjectColor(selectedProject.subject) + '20' }]}>
                    {renderIcon(selectedProject.subject)}
                    <Text style={[styles.subjectBadgeText, { color: getSubjectColor(selectedProject.subject) }]}>
                      {selectedProject.subject}
                    </Text>
                  </View>
                  <Text style={styles.modalDueDate}>Due: {formatDate(selectedProject.dueDate)}</Text>
                </View>
              </View>
            )}

            <ScrollView style={styles.modalBody}>
              {/* Attachments Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Attachments</Text>
                <Text style={styles.sectionSubtitle}>
                  Upload images (JPG, PNG) or documents (PDF, DOC, DOCX, TXT)
                </Text>
                
                <View style={styles.attachmentButtons}>
                  <TouchableOpacity 
                    style={styles.attachmentButton}
                    onPress={pickImage}
                    disabled={submitting}
                  >
                    <MaterialCommunityIcons name="image" size={20} color="#3B82F6" />
                    <Text style={styles.attachmentButtonText}>Add Image</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.attachmentButton}
                    onPress={pickDocument}
                    disabled={submitting}
                  >
                    <MaterialCommunityIcons name="file-document" size={20} color="#10B981" />
                    <Text style={styles.attachmentButtonText}>Add Document</Text>
                  </TouchableOpacity>
                </View>

                {attachments.length > 0 && (
                  <View style={styles.attachmentsList}>
                    <Text style={styles.attachmentsCount}>
                      {attachments.length} file{attachments.length !== 1 ? 's' : ''} selected
                    </Text>
                    {attachments.map(renderAttachment)}
                  </View>
                )}
              </View>

              {/* Note Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Submission Notes</Text>
                <Text style={styles.sectionSubtitle}>
                  Add notes about your submission (optional)
                </Text>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Describe your submission, mention any attachments, or provide additional context..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={6}
                  value={submissionNote}
                  onChangeText={setSubmissionNote}
                  editable={!submitting}
                />
              </View>

              {/* File Size Warning */}
              <View style={styles.warningBox}>
                <MaterialCommunityIcons name="alert-circle" size={20} color="#F59E0B" />
                <Text style={styles.warningText}>
                  Maximum file size: 10MB per file. Supported formats: Images (JPG, PNG), Documents (PDF, DOC, DOCX, TXT)
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.cancelButton, submitting && styles.disabledButton]}
                onPress={resetSubmissionForm}
                disabled={submitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.submitModalButton, submitting && styles.disabledButton, 
                  (attachments.length === 0 && !submissionNote.trim()) && styles.disabledButton]}
                onPress={handleSubmission}
                disabled={submitting || (attachments.length === 0 && !submissionNote.trim())}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="send" size={18} color="#fff" />
                    <Text style={styles.submitModalButtonText}>
                      {attachments.length > 0 ? `Submit (${attachments.length})` : 'Submit'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  loader: {
    marginTop: 50,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileIcon: {
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  profileDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
  },
  classBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginBottom: 10,
  },
  classText: {
    fontSize: 13,
    fontWeight: '600',
  },
  descriptionBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  descriptionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
    marginTop: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  projectInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalProjectTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  modalProjectDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  subjectBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalDueDate: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
  modalBody: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  attachmentButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  attachmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  attachmentButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  attachmentsList: {
    marginTop: 8,
  },
  attachmentsCount: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  attachmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  attachmentDetails: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  attachmentSize: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
  noteInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#475569',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    textAlignVertical: 'top',
    minHeight: 120,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  submitModalButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
  },
  submitModalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5,
  },
});