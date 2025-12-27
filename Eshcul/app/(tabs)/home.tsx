// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   Dimensions,
//   StatusBar,
// } from 'react-native';
// import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const cardData = [
//   { name: 'Attendance', icon: (c: string) => <Ionicons name="calendar" size={28} color={c} />, bgColor: '#e3f4ff' },
//   { name: 'Timetable', icon: (c: string) => <Ionicons name="time" size={28} color={c} />, bgColor: '#e5f7f2' },
//   { name: 'Dairy', icon: (c: string) => <MaterialCommunityIcons name="notebook-outline" size={28} color={c} />, bgColor: '#ffeef3' },
//   { name: 'Fees', icon: (c: string) => <FontAwesome5 name="money-bill-wave" size={28} color={c} />, bgColor: '#fff3e0' },
//   { name: 'Notification', icon: (c: string) => <Ionicons name="notifications-outline" size={28} color={c} />, bgColor: '#fce4ec' },
//   { name: 'Reports', icon: (c: string) => <Ionicons name="document-text-outline" size={28} color={c} />, bgColor: '#fbe9e7' },
//   { name: 'Subjects', icon: (c: string) => <MaterialCommunityIcons name="book-open-page-variant" size={28} color={c} />, bgColor: '#f3e5f5' },
//   { name: 'Project Work', icon: (c: string) => <MaterialCommunityIcons name="file-document-edit-outline" size={28} color={c} />, bgColor: '#e8f5e9' },
//   { name: 'Videos/Gallery', icon: (c: string) => <Ionicons name="images-outline" size={28} color={c} />, bgColor: '#ede7f6' },
//   { name: 'Mock Test', icon: (c: string) => <MaterialCommunityIcons name="clipboard-check-outline" size={28} color={c} />, bgColor: '#fff8e1' },
//   { name: 'E Books', icon: (c: string) => <MaterialCommunityIcons name="book-outline" size={28} color={c} />, bgColor: '#e1f5fe' },
//   { name: 'Achievements', icon: (c: string) => <FontAwesome5 name="medal" size={26} color={c} />, bgColor: '#f9fbe7' },
//   { name: 'Bus Tracking', icon: (c: string) => <FontAwesome5 name="bus" size={26} color={c} />, bgColor: '#f1f8e9' },
//   { name: 'Feedback', icon: (c: string) => <Feather name="message-square" size={28} color={c} />, bgColor: '#f3e5f5' },
//   { name: 'Inventory', icon: (c: string) => <MaterialCommunityIcons name="warehouse" size={28} color={c} />, bgColor: '#fffde7' },
//   { name: 'Chat Box', icon: (c: string) => <Ionicons name="chatbubble-ellipses-outline" size={28} color={c} />, bgColor: '#ede7f6' },
// ];

// const numColumns = 3;
// const screenWidth = Dimensions.get('window').width;
// const cardSize = (screenWidth - 40 - numColumns * 16) / numColumns;

// export default function HomeScreen() {
//   const router = useRouter();
//   const [student, setStudent] = useState<any>(null);

//   useEffect(() => {
//     (async () => {
//       const s = await AsyncStorage.getItem('student');
//       if (s) setStudent(JSON.parse(s));
//     })();
//   }, []);

//   const handleCardPress = (name: string) => {
//     const routes: Record<string, string> = {
//       Attendance: '/attendance',
//       Fees: '/fee',
//       Timetable: '/timetable',
//       Subjects: '/subjects',
//       Dairy: '/dairy',
//       'Project Work': '/project',
//       'Videos/Gallery': '/videos',
//       'Mock Test': '/mocktest',
//       Reports: '/reports',
//       'E Books': '/ebooks',
//       Achievements: '/achievements',
//       Notification: '/notifications',
//       'Bus Tracking': '/bus-tracking',
//       Feedback: '/feedback',
//       Inventory: '/inventory',
//       'Chat Box': '/chatbox',
//     };
//     if (routes[name]) router.push(routes[name]);
//   };

//   return (
//     <LinearGradient colors={['#f4fbff', '#fdfefe']} style={styles.gradientContainer}>
//       <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

//       <View style={styles.container}>
//         <View style={styles.profileCard}>
//           <View style={styles.profileTopRow}>
//             <View style={styles.profileAvatarWrapper}>
//               <Image source={require('../../assets/images/profile.png')} style={styles.profileAvatar} />
//               <View style={styles.statusDot} />
//             </View>

//             <View style={styles.profileInfo}>
//               <Text style={styles.profileGreeting}>Welcome</Text>
//               <Text style={styles.profileName}>{student?.name || 'Student'}</Text>
//               <Text style={styles.profileMeta}>
//                 Class {student?.grade || '-'} • Section {student?.section || '-'}
//               </Text>
//               <Text style={styles.profileMeta}>Roll No: {student?.rollNumber || '-'}</Text>
//             </View>
//           </View>

//           <View style={styles.profileBottomRow}>
//             <View style={styles.badgeChip}>
//               <Ionicons name="school-outline" size={14} color="#2563eb" />
//               <Text style={styles.badgeChipText}>Student</Text>
//             </View>
//             <View style={styles.badgeChipLight}>
//               <Ionicons name="checkmark-circle" size={14} color="#16a34a" />
//               <Text style={styles.badgeChipLightText}>Active</Text>
//             </View>
//           </View>
//         </View>

//         <FlatList
//           data={cardData}
//           keyExtractor={(i) => i.name}
//           numColumns={numColumns}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.cardsContainer}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={[styles.cardWrapper, { width: cardSize, height: cardSize }]}
//               onPress={() => handleCardPress(item.name)}
//               activeOpacity={0.9}
//             >
//               <View style={[styles.card, { backgroundColor: item.bgColor }]}>
//                 <View style={styles.cardIconContainer}>{item.icon('#1e88e5')}</View>
//                 <Text style={styles.cardText}>{item.name}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   gradientContainer: { flex: 1 },
//   container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },

//   profileCard: {
//     backgroundColor: '#fff',
//     borderRadius: 24,
//     padding: 18,
//     marginBottom: 18,
//     elevation: 4,
//   },
//   profileTopRow: { flexDirection: 'row', alignItems: 'center' },
//   profileAvatarWrapper: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     backgroundColor: '#e0f2fe',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   profileAvatar: { width: 56, height: 56, borderRadius: 28 },
//   statusDot: {
//     position: 'absolute',
//     bottom: 6,
//     right: 8,
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#22c55e',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   profileInfo: { flex: 1 },
//   profileGreeting: { fontSize: 12, color: '#9ca3af' },
//   profileName: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
//   profileMeta: { fontSize: 12, color: '#6b7280', marginTop: 2 },
//   profileBottomRow: { flexDirection: 'row', marginTop: 8 },
//   badgeChip: {
//     flexDirection: 'row',
//     backgroundColor: '#e0f2fe',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 999,
//     marginRight: 8,
//   },
//   badgeChipText: { marginLeft: 4, fontSize: 11, fontWeight: '600', color: '#2563eb' },
//   badgeChipLight: {
//     flexDirection: 'row',
//     backgroundColor: '#ecfdf3',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 999,
//   },
//   badgeChipLightText: { marginLeft: 4, fontSize: 11, fontWeight: '600', color: '#16a34a' },

//   cardsContainer: { paddingBottom: 80 },
//   cardWrapper: { margin: 8 },
//   card: {
//     flex: 1,
//     borderRadius: 18,
//     paddingVertical: 14,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     elevation: 3,
//   },
//   cardIconContainer: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cardText: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: '#374151',
//     textAlign: 'center',
//   },
// });
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cardData = [
  { name: 'Attendance', icon: (c: string) => <Ionicons name="calendar" size={28} color={c} />, bgColor: '#e3f4ff' },
  { name: 'Timetable', icon: (c: string) => <Ionicons name="time" size={28} color={c} />, bgColor: '#e5f7f2' },
  { name: 'Dairy', icon: (c: string) => <MaterialCommunityIcons name="notebook-outline" size={28} color={c} />, bgColor: '#ffeef3' },
  { name: 'Fees', icon: (c: string) => <FontAwesome5 name="money-bill-wave" size={28} color={c} />, bgColor: '#fff3e0' },
  { name: 'Reports', icon: (c: string) => <Ionicons name="document-text-outline" size={28} color={c} />, bgColor: '#fbe9e7' },
  { name: 'Project Work', icon: (c: string) => <MaterialCommunityIcons name="file-document-edit-outline" size={28} color={c} />, bgColor: '#e8f5e9' },
  { name: 'Videos/Gallery', icon: (c: string) => <Ionicons name="images-outline" size={28} color={c} />, bgColor: '#ede7f6' },
  { name: 'Mock Test', icon: (c: string) => <MaterialCommunityIcons name="clipboard-check-outline" size={28} color={c} />, bgColor: '#fff8e1' },
  { name: 'E Books', icon: (c: string) => <MaterialCommunityIcons name="book-outline" size={28} color={c} />, bgColor: '#e1f5fe' },
  { name: 'Achievements', icon: (c: string) => <FontAwesome5 name="medal" size={26} color={c} />, bgColor: '#f9fbe7' },
  { name: 'Bus Tracking', icon: (c: string) => <FontAwesome5 name="bus" size={26} color={c} />, bgColor: '#f1f8e9' },
  { name: 'Feedback', icon: (c: string) => <Feather name="message-square" size={28} color={c} />, bgColor: '#f3e5f5' },
  { name: 'Inventory', icon: (c: string) => <MaterialCommunityIcons name="warehouse" size={28} color={c} />, bgColor: '#fffde7' },
  { name: 'Chat Box', icon: (c: string) => <Ionicons name="chatbubble-ellipses-outline" size={28} color={c} />, bgColor: '#ede7f6' },
];

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 40 - numColumns * 16) / numColumns;

export default function HomeScreen() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const s = await AsyncStorage.getItem('student');
      if (s) setStudent(JSON.parse(s));
    })();
  }, []);

  const handleCardPress = (name: string) => {
    const routes: Record<string, string> = {
      Attendance: '/attendance',
      Fees: '/fee',
      Timetable: '/timetable',
      Dairy: '/dairy',
      'Project Work': '/project',
      'Videos/Gallery': '/videos',
      'Mock Test': '/mocktest',
      Reports: '/reports',
      'E Books': '/ebooks',
      Achievements: '/achievements',
      'Bus Tracking': '/bus-tracking',
      Feedback: '/feedback',
      Inventory: '/inventory',
      'Chat Box': '/chatbox',
    };
    if (routes[name]) router.push(routes[name]);
  };

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  return (
    <LinearGradient colors={['#f4fbff', '#fdfefe']} style={styles.gradientContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <View style={styles.container}>

        {/* School header */}
        <View style={styles.schoolHeader}>
          <View style={styles.schoolLogoWrapper}>
            <Image
              source={require('../../assets/images/school-logo.png')}
              style={styles.schoolLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.schoolTextWrapper}>
            <Text style={styles.schoolName}>NARAYANA</Text>
            <Text style={styles.schoolSubTitle}>Educational Institutions</Text>
          </View>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.profileAvatarWrapper}>
              <Image source={require('../../assets/images/profile.png')} style={styles.profileAvatar} />
              <View style={styles.statusDot} />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileGreeting}>Welcome</Text>
              <Text style={styles.profileName}>{student?.name || 'Student'}</Text>
              <Text style={styles.profileMeta}>
                Class {student?.grade || '-'} • Section {student?.section || '-'}
              </Text>
              <Text style={styles.profileMeta}>Roll No: {student?.rollNumber || '-'}</Text>
            </View>
          </View>

          <View style={styles.profileBottomRow}>
            <View style={styles.badgeChip}>
              <Ionicons name="school-outline" size={14} color="#2563eb" />
              <Text style={styles.badgeChipText}>Student</Text>
            </View>
            <View style={styles.badgeChipLight}>
              <Ionicons name="checkmark-circle" size={14} color="#16a34a" />
              <Text style={styles.badgeChipLightText}>Active</Text>
            </View>
          </View>
        </View>

        {/* Notification card */}
        <TouchableOpacity
          style={styles.notificationCard}
          activeOpacity={0.9}
          onPress={handleNotificationPress}
        >
          <View style={styles.notificationLeft}>
            <Text style={styles.notificationTitle}>Notifications</Text>
            <Text style={styles.notificationSubtitle}>Exam results and updates are now available</Text>
            <Text style={styles.notificationDate}>22nd April, 2020</Text>
          </View>
          <View style={styles.notificationRight}>
            <View style={styles.notificationIconWrapper}>
              <Ionicons name="notifications-outline" size={26} color="#1e88e5" />
            </View>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          </View>
        </TouchableOpacity>

        <FlatList
          data={cardData}
          keyExtractor={(i) => i.name}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.cardWrapper, { width: cardSize, height: cardSize }]}
              onPress={() => handleCardPress(item.name)}
              activeOpacity={0.9}
            >
              <View style={[styles.card, { backgroundColor: item.bgColor }]}>
                <View style={styles.cardIconContainer}>{item.icon('#1e88e5')}</View>
                <Text style={styles.cardText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },

  /* School header */
  schoolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  schoolLogoWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  schoolLogo: {
    width: 40,
    height: 40,
  },
  schoolTextWrapper: {
    flex: 1,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  schoolSubTitle: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },

  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    elevation: 4,
  },
  profileTopRow: { flexDirection: 'row', alignItems: 'center' },
  profileAvatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileAvatar: { width: 56, height: 56, borderRadius: 28 },
  statusDot: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: { flex: 1 },
  profileGreeting: { fontSize: 12, color: '#9ca3af' },
  profileName: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  profileMeta: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  profileBottomRow: { flexDirection: 'row', marginTop: 8 },
  badgeChip: {
    flexDirection: 'row',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 8,
  },
  badgeChipText: { marginLeft: 4, fontSize: 11, fontWeight: '600', color: '#2563eb' },
  badgeChipLight: {
    flexDirection: 'row',
    backgroundColor: '#ecfdf3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeChipLightText: { marginLeft: 4, fontSize: 11, fontWeight: '600', color: '#16a34a' },

  /* Notification card */
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  },
  notificationLeft: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  notificationDate: {
    fontSize: 11,
    color: '#9ca3af',
  },
  notificationRight: {
    alignItems: 'center',
  },
  notificationIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 18,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadge: {
    marginTop: 6,
    backgroundColor: '#fb7185',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },

  cardsContainer: { paddingBottom: 80 },
  cardWrapper: { margin: 8 },
  card: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});
