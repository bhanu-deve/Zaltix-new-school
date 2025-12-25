// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// // import {Api_url} from './config/config.js'
// import api from "../api/api";


// const { width } = Dimensions.get('window');

// export default function NotificationsScreen() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchNotifications = async () => {
//     try {
//       const response = await api.get('/AddNotification');
//       const data = response.data;

//       // Handle different response formats
//       const notificationsData = Array.isArray(data) ? data : (data?.data || data?.notifications || []);

//       setNotifications(notificationsData);
//     } catch (error: any) {
//       console.error('Fetch error:', error);
//       const errorMessage = error?.response?.data?.error || error?.message || 'Failed to load notifications.';
//       Alert.alert('Error', errorMessage);
//       setNotifications([]); // Set empty array on error
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.iconWrap}>
//         <MaterialCommunityIcons name="bell-ring-outline" size={28} color="#2575fc" />
//       </View>
//       <View style={styles.textWrap}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.message}>{item.message}</Text>
//         <Text style={styles.date}>{item.date}</Text>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#2575fc" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Notifications</Text>
//       <FlatList
//         data={notifications}
//         keyExtractor={(item) => item._id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 30 }}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f4f6fc',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2575fc',
//     marginBottom: 20,
//   },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//     width: width - 40,
//   },
//   iconWrap: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   textWrap: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 6,
//   },
//   message: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 8,
//   },
//   date: {
//     fontSize: 12,
//     color: '#999',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import {Api_url} from './config/config.js'
import api from "../api/api";

const { width } = Dimensions.get('window');

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/AddNotification');
      const data = response.data;

      // Handle different response formats
      const notificationsData = Array.isArray(data) ? data : (data?.data || data?.notifications || []);

      setNotifications(notificationsData);
    } catch (error: any) {
      console.error('Fetch error:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to load notifications.';
      Alert.alert('Error', errorMessage);
      setNotifications([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFD166', '#A283D1'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderItem = ({ item, index }) => {
    const bgColor = getRandomColor();
    const iconColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    const iconColor = iconColors[index % iconColors.length];

    return (
      <View style={[styles.card, { borderLeftColor: bgColor, borderLeftWidth: 5 }]}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor + '20' }]}>
          <MaterialCommunityIcons 
            name={index % 3 === 0 ? "bell-ring" : index % 3 === 1 ? "alert-circle" : "information"} 
            size={22} 
            color={bgColor} 
          />
        </View>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: '#1e293b' }]}>{item.title}</Text>
            <View style={[styles.dateBadge, { backgroundColor: bgColor + '15' }]}>
              <Text style={[styles.date, { color: bgColor }]}>{item.date}</Text>
            </View>
          </View>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons name="bell-off" size={50} color="#94a3b8" />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyText}>You're all caught up!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    paddingTop: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },
  dateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIconContainer: {
    backgroundColor: '#e2e8f0',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
  },
});