// import React from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
// import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';

// const cardData = [
//   // Priority items first
//   {
//     name: 'Attendance',
//     icon: (color: string) => <Ionicons name="calendar" size={32} color={color} />,
//     bgColor: '#e0f7fa',
//     color: '#00796b',
//   },
//   {
//     name: 'Timetable',
//     icon: (color: string) => <Ionicons name="time" size={32} color={color} />,
//     bgColor: '#e3f2fd',
//     color: '#1976d2',
//   },
//   {
//     name: 'Dairy',
//     icon: (color: string) => <MaterialCommunityIcons name="notebook" size={32} color={color} />,
//     bgColor: '#fce4ec',
//     color: '#ad1457',
//   },
//   {
//     name: 'Fees',
//     icon: (color: string) => <FontAwesome5 name="money-bill-wave" size={32} color={color} />,
//     bgColor: '#fff3e0',
//     color: '#f57c00',
//   },
//   {
//     name: 'Notification',
//     icon: (color: string) => <Ionicons name="notifications" size={32} color={color} />,
//     bgColor: '#fce4ec',
//     color: '#ec407a',
//   },
//   {
//     name: 'Reports',
//     icon: (color: string) => <Ionicons name="document-text" size={32} color={color} />,
//     bgColor: '#fbe9e7',
//     color: '#d84315',
//   },

//   // Middle section — Subjects here
//   {
//     name: 'Subjects',
//     icon: (color: string) => <MaterialCommunityIcons name="book-open-page-variant" size={32} color={color} />,
//     bgColor: '#f3e5f5',
//     color: '#6a1b9a',
//   },

//   // Remaining items
//   {
//     name: 'Project Work',
//     icon: (color: string) => <MaterialCommunityIcons name="file-document-edit" size={32} color={color} />,
//     bgColor: '#e8f5e9',
//     color: '#2e7d32',
//   },
//   {
//     name: 'Videos/Gallery',
//     icon: (color: string) => <Ionicons name="images" size={32} color={color} />,
//     bgColor: '#ede7f6',
//     color: '#512da8',
//   },
//   {
//     name: 'Mock Test',
//     icon: (color: string) => <MaterialCommunityIcons name="clipboard-check" size={32} color={color} />,
//     bgColor: '#fff8e1',
//     color: '#f9a825',
//   },
//   {
//     name: 'E Books',
//     icon: (color: string) => <MaterialCommunityIcons name="book" size={32} color={color} />,
//     bgColor: '#e1f5fe',
//     color: '#0288d1',
//   },
//   {
//     name: 'Achievements',
//     icon: (color: string) => <FontAwesome5 name="medal" size={32} color={color} />,
//     bgColor: '#f9fbe7',
//     color: '#9e9d24',
//   },
//   {
//     name: 'Bus Tracking',
//     icon: (color: string) => <FontAwesome5 name="bus" size={32} color={color} />,
//     bgColor: '#f1f8e9',
//     color: '#689f38',
//   },
//   {
//     name: 'Feedback',
//     icon: (color: string) => <Feather name="message-square" size={32} color={color} />,
//     bgColor: '#f3e5f5',
//     color: '#8e24aa',
//   },
//   {
//     name: 'Inventory',
//     icon: (color: string) => <MaterialCommunityIcons name="warehouse" size={32} color={color} />,
//     bgColor: '#fffde7',
//     color: '#fbc02d',
//   },
//   {
//     name: 'Chat Box',
//     icon: (color: string) => <Ionicons name="chatbubble-ellipses" size={32} color={color} />,
//     bgColor: '#ede7f6',
//     color: '#7b1fa2',
//   },
// ];

// const numColumns = 3;
// const screenWidth = Dimensions.get('window').width;
// const cardSize = (screenWidth - 40 - (numColumns * 16)) / numColumns;

// export default function HomeScreen() {
//   const router = useRouter();

//   const handleCardPress = (cardName: string) => {
//     const routes: Record<string, string> = {
//       'Attendance': '/attendance',
//       'Fees': '/fee',
//       'Timetable': '/timetable',
//       'Subjects': '/subjects',
//       'Dairy': '/dairy',
//       'Project Work': '/project',
//       'Videos/Gallery': '/videos',
//       'Mock Test': '/mocktest',
//       'Reports': '/reports',
//       'E Books': '/ebooks',
//       'Achievements': '/achievements',
//       'Notification': '/notifications',
//       'Bus Tracking': '/bus-tracking',
//       'Feedback': '/feedback',
//       'Inventory': '/inventory',
//       'Chat Box': '/chatbox',
//     };

//     if (routes[cardName]) {
//       router.push(routes[cardName]);
//     }
//   };

//   return (
//     <LinearGradient colors={['#e0eafc', '#cfdef3', '#f5f7fa']} style={styles.gradientContainer}>
//       <View style={styles.container}>
//         {/* Profile Info */}
//         <View style={styles.profileCardRow}>
//           <Image source={require('../../assets/images/profile.png')} style={styles.profileImage} />
//           <View style={styles.profileDetails}>
//             <Text style={styles.profileName}>Anjali</Text>
//             <View style={styles.profileRow}>
//               <Text style={styles.profileDetail}>Class: 10</Text>
//               <Text style={styles.profileDetail}>Section: A</Text>
//             </View>
//             <Text style={styles.profileDetail}>Roll No: 23</Text>
//           </View>
//         </View>

//         {/* Cards Section */}
//         <FlatList
//           data={cardData}
//           keyExtractor={(_, idx) => idx.toString()}
//           numColumns={numColumns}
//           contentContainerStyle={styles.cardsContainer}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={[
//                 styles.card,
//                 {
//                   width: cardSize,
//                   height: cardSize,
//                   backgroundColor: item.bgColor,
//                 },
//               ]}
//               onPress={() => handleCardPress(item.name)}
//               activeOpacity={0.85}
//             >
//               {item.icon(item.color)}
//               <Text style={[styles.cardText, { color: item.color }]}>{item.name}</Text>
//             </TouchableOpacity>
//           )}
//         />
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   gradientContainer: {
//     flex: 1,
//   },
//   container: {
//     padding: 30,
//     flex: 1,
//   },
//   profileCardRow: {
//     flexDirection: 'row',
//     backgroundColor: '#ffffff',
//     borderRadius: 20,
//     padding: 20,
//     alignItems: 'center',
//     marginBottom: 32,
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   profileImage: {
//     width: 75,
//     height: 75,
//     borderRadius: 75 / 2,
//     marginRight: 16,
//     borderWidth: 2,
//     borderColor: '#2575fc',
//     backgroundColor: '#e6f0ff',
//   },
//   profileDetails: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   profileName: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1a237e',
//     marginBottom: 4,
//   },
//   profileDetail: {
//     fontSize: 15,
//     color: '#333',
//     marginRight: 12,
//   },
//   profileRow: {
//     flexDirection: 'row',
//     marginBottom: 4,
//   },
//   cardsContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingBottom: 80,
//   },
//   card: {
//     borderRadius: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: 8,
//     padding: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   cardText: {
//     marginTop: 6,
//     fontSize: 13,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
// });

import React from 'react';
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

const cardData = [
  {
    name: 'Attendance',
    icon: (color: string) => <Ionicons name="calendar" size={28} color={color} />,
    bgColor: '#e3f4ff',
    color: '#1976d2',
  },
  {
    name: 'Timetable',
    icon: (color: string) => <Ionicons name="time" size={28} color={color} />,
    bgColor: '#e5f7f2',
    color: '#00796b',
  },
  {
    name: 'Dairy',
    icon: (color: string) => (
      <MaterialCommunityIcons name="notebook-outline" size={28} color={color} />
    ),
    bgColor: '#ffeef3',
    color: '#ad1457',
  },
  {
    name: 'Fees',
    icon: (color: string) => (
      <FontAwesome5 name="money-bill-wave" size={28} color={color} />
    ),
    bgColor: '#fff3e0',
    color: '#f57c00',
  },
  {
    name: 'Notification',
    icon: (color: string) => (
      <Ionicons name="notifications-outline" size={28} color={color} />
    ),
    bgColor: '#fce4ec',
    color: '#ec407a',
  },
  {
    name: 'Reports',
    icon: (color: string) => (
      <Ionicons name="document-text-outline" size={28} color={color} />
    ),
    bgColor: '#fbe9e7',
    color: '#d84315',
  },
  {
    name: 'Subjects',
    icon: (color: string) => (
      <MaterialCommunityIcons
        name="book-open-page-variant"
        size={28}
        color={color}
      />
    ),
    bgColor: '#f3e5f5',
    color: '#6a1b9a',
  },
  {
    name: 'Project Work',
    icon: (color: string) => (
      <MaterialCommunityIcons
        name="file-document-edit-outline"
        size={28}
        color={color}
      />
    ),
    bgColor: '#e8f5e9',
    color: '#2e7d32',
  },
  {
    name: 'Videos/Gallery',
    icon: (color: string) => (
      <Ionicons name="images-outline" size={28} color={color} />
    ),
    bgColor: '#ede7f6',
    color: '#512da8',
  },
  {
    name: 'Mock Test',
    icon: (color: string) => (
      <MaterialCommunityIcons
        name="clipboard-check-outline"
        size={28}
        color={color}
      />
    ),
    bgColor: '#fff8e1',
    color: '#f9a825',
  },
  {
    name: 'E Books',
    icon: (color: string) => (
      <MaterialCommunityIcons name="book-outline" size={28} color={color} />
    ),
    bgColor: '#e1f5fe',
    color: '#0288d1',
  },
  {
    name: 'Achievements',
    icon: (color: string) => <FontAwesome5 name="medal" size={26} color={color} />,
    bgColor: '#f9fbe7',
    color: '#9e9d24',
  },
  {
    name: 'Bus Tracking',
    icon: (color: string) => <FontAwesome5 name="bus" size={26} color={color} />,
    bgColor: '#f1f8e9',
    color: '#689f38',
  },
  {
    name: 'Feedback',
    icon: (color: string) => <Feather name="message-square" size={28} color={color} />,
    bgColor: '#f3e5f5',
    color: '#8e24aa',
  },
  {
    name: 'Inventory',
    icon: (color: string) => (
      <MaterialCommunityIcons name="warehouse" size={28} color={color} />
    ),
    bgColor: '#fffde7',
    color: '#fbc02d',
  },
  {
    name: 'Chat Box',
    icon: (color: string) => (
      <Ionicons
        name="chatbubble-ellipses-outline"
        size={28}
        color={color}
      />
    ),
    bgColor: '#ede7f6',
    color: '#7b1fa2',
  },
];

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 40 - numColumns * 16) / numColumns;

export default function HomeScreen() {
  const router = useRouter();

  const handleCardPress = (cardName: string) => {
    const routes: Record<string, string> = {
      Attendance: '/attendance',
      Fees: '/fee',
      Timetable: '/timetable',
      Subjects: '/subjects',
      Dairy: '/dairy',
      'Project Work': '/project',
      'Videos/Gallery': '/videos',
      'Mock Test': '/mocktest',
      Reports: '/reports',
      'E Books': '/ebooks',
      Achievements: '/achievements',
      Notification: '/notifications',
      'Bus Tracking': '/bus-tracking',
      Feedback: '/feedback',
      Inventory: '/inventory',
      'Chat Box': '/chatbox',
    };

    if (routes[cardName]) router.push(routes[cardName]);
  };

  const renderCard = ({ item }: { item: (typeof cardData)[number] }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleCardPress(item.name)}
      style={[styles.cardWrapper, { width: cardSize, height: cardSize }]}
    >
      <View style={[styles.card, { backgroundColor: item.bgColor }]}>
        <View style={styles.cardIconContainer}>{item.icon('#1e88e5')}</View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardText} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#f4fbff', '#fdfefe']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={styles.container}>
        {/* New style profile card only */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.profileAvatarWrapper}>
              <Image
                source={require('../../assets/images/profile.png')}
                style={styles.profileAvatar}
              />
              <View style={styles.statusDot} />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileGreeting}>Good morning</Text>
              <Text style={styles.profileName}>Anjali</Text>
              <Text style={styles.profileMeta}>Class 10 • Section A</Text>
              <Text style={styles.profileMeta}>Roll No: 23</Text>
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

        {/* Cards grid */}
        <FlatList
          data={cardData}
          keyExtractor={(item) => item.name}
          numColumns={numColumns}
          contentContainerStyle={styles.cardsContainer}
          renderItem={renderCard}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },

  /* PROFILE CARD NEW STYLE */
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileAvatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 3,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  statusDot: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileGreeting: {
    fontSize: 12,
    color: '#9ca3af',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 2,
  },
  profileMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  profileBottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 6,
  },
  badgeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#e0f2fe',
    marginRight: 8,
  },
  badgeChipText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '600',
    color: '#2563eb',
  },
  badgeChipLight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#ecfdf3',
  },
  badgeChipLightText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '600',
    color: '#16a34a',
  },

  /* CARDS GRID */
  cardsContainer: {
    paddingBottom: 80,
    paddingTop: 4,
  },
  cardWrapper: {
    margin: 8,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    paddingHorizontal: 6,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    overflow: 'hidden',
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardTextContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cardText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 12,
  },
});