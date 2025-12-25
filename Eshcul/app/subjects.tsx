// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
// import { Card } from 'react-native-paper';
// import { FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
// // import axios from 'axios';
// // import {Api_url} from './config/config.js'
// import api from "../api/api";


// const student = {
//   name: 'John Doe',
//   class: '10',
//   section: 'A',
//   rollNo: '23',
//   profilePic: require('../assets/images/profile.png'),
// };

// export default function SubjectsScreen() {
//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const iconMap = {
//     calculator: <FontAwesome5 name="calculator" size={28} color="#fff" />,
//     book: <Entypo name="book" size={28} color="#fff" />,
//     atom: <MaterialCommunityIcons name="atom" size={28} color="#fff" />,
//     landmark: <FontAwesome5 name="landmark" size={28} color="#fff" />,
//     'laptop-code': <FontAwesome5 name="laptop-code" size={28} color="#fff" />,
//     'run-fast': <MaterialCommunityIcons name="run-fast" size={28} color="#fff" />,
//   };

//   useEffect(() => {
//     api.get(`/subjects`)
//       .then(res => {
//         setSubjects(res.data);
//       })
//       .catch(err => {
//         console.error('Error fetching subjects:', err);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <View style={styles.container}>
//       {/* Student Info */}
//       <View style={styles.profileCard}>
//         <Image source={student.profilePic} style={styles.profileImage} />
//         <View style={styles.profileDetails}>
//           <Text style={styles.name}>{student.name}</Text>
//           <Text style={styles.detail}>Class: {student.class}</Text>
//           <Text style={styles.detail}>Section: {student.section}</Text>
//           <Text style={styles.detail}>Roll No: {student.rollNo}</Text>
//         </View>
//       </View>

//       {/* Subjects */}
//       {loading ? (
//         <ActivityIndicator size="large" color="#2575fc" />
//       ) : (
//         <FlatList
//           data={subjects}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => (
//             <Card style={[styles.card, { backgroundColor: item.bgColor || '#4a90e2' }]}>
//               <Card.Content style={styles.cardContent}>
//                 <View style={styles.icon}>
//                   {iconMap[item.subjectIcon] || <FontAwesome5 name="book" size={28} color="#fff" />}
//                 </View>
//                 <View>
//                   <Text style={styles.subjectName}>{item.name}</Text>
//                   <Text style={styles.subjectInfo}>Teacher: {item.teacher}</Text>
//                 </View>
//               </Card.Content>
//             </Card>
//           )}
//           contentContainerStyle={styles.list}
//         />
//       )}
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f0f4f7',
//   },
//   profileCard: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 14,
//     marginBottom: 16,
//     elevation: 3,
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginRight: 16,
//     backgroundColor: '#e0e0e0',
//   },
//   profileDetails: {
//     flex: 1,
//   },
//   name: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#2575fc',
//   },
//   detail: {
//     fontSize: 16,
//     color: '#444',
//     marginTop: 4,
//   },
//   list: {
//     paddingBottom: 20,
//   },
//   card: {
//     marginVertical: 10,
//     borderRadius: 16,
//     elevation: 4,
//   },
//   cardContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   icon: {
//     marginRight: 16,
//   },
//   subjectName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   subjectInfo: {
//     fontSize: 15,
//     color: '#f0f0f0',
//     marginTop: 4,
//   },
// });


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import { FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
// import axios from 'axios';
// import {Api_url} from './config/config.js'
import api from "../api/api";

const student = {
  name: 'John Doe',
  class: '10',
  section: 'A',
  rollNo: '23',
};

export default function SubjectsScreen() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    calculator: <FontAwesome5 name="calculator" size={22} color="#3B82F6" />,
    book: <Entypo name="book" size={22} color="#10B981" />,
    atom: <MaterialCommunityIcons name="atom" size={22} color="#EF4444" />,
    landmark: <FontAwesome5 name="landmark" size={22} color="#F59E0B" />,
    'laptop-code': <FontAwesome5 name="laptop-code" size={22} color="#8B5CF6" />,
    'run-fast': <MaterialCommunityIcons name="run-fast" size={22} color="#EC4899" />,
  };

  const getSubjectColor = (index) => {
    const colors = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];
    return colors[index % colors.length];
  };

  useEffect(() => {
    api.get(`/subjects`)
      .then(res => {
        setSubjects(res.data);
      })
      .catch(err => {
        console.error('Error fetching subjects:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      {/* Student Info */}
      <View style={styles.profileCard}>
        <View style={styles.profileIcon}>
          <Text style={styles.profileIconText}>👨‍🎓</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{student.name}</Text>
          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Class</Text>
              <Text style={styles.detailValue}>{student.class}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Section</Text>
              <Text style={styles.detailValue}>{student.section}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Roll No</Text>
              <Text style={styles.detailValue}>{student.rollNo}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Subjects */}
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => {
            const color = getSubjectColor(index);
            return (
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    {iconMap[item.subjectIcon] || <FontAwesome5 name="book" size={22} color={color} />}
                  </View>
                  <View style={styles.subjectInfo}>
                    <Text style={styles.subjectName}>{item.name}</Text>
                    <Text style={styles.subjectTeacher}>Teacher: {item.teacher}</Text>
                  </View>
                  <View style={styles.badgeContainer}>
                    <View style={[styles.subjectBadge, { backgroundColor: color + '15' }]}>
                      <Text style={[styles.subjectCode, { color }]}>
                        {item.name.substring(0, 3).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loader: {
    marginTop: 50,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  profileIconText: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  profileDetails: {
    flexDirection: 'row',
    gap: 16,
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
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subjectTeacher: {
    fontSize: 13,
    color: '#64748b',
  },
  badgeContainer: {
    marginLeft: 8,
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  subjectCode: {
    fontSize: 12,
    fontWeight: '700',
  },
});