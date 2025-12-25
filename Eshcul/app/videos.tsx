// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   Linking,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// // import axios from 'axios';
// import { FontAwesome } from '@expo/vector-icons'; // FontAwesome for play icon
// // import {Api_url} from './config/config.js'
// import api from "../api/api";


// const screenWidth = Dimensions.get('window').width;

// type VideoItem = {
//   _id: string;
//   title: string;
//   subject: string;
//   thumbnail: string;
//   url: string;
// };

// export default function VideosScreen() {
//   const [videos, setVideos] = useState<VideoItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchData = async () => {
//     try {
//       const res = await api.get(`/videos`);
//       if (Array.isArray(res.data)) {
//         const formatted = res.data.map((item: any) => ({
//           ...item,
//           thumbnail: item.thumbnail?.startsWith('http')
//             ? item.thumbnail
//             : item.thumbnail?.startsWith('/')
//             ? `${api.defaults.baseURL}${item.thumbnail}`
//             : item.thumbnail
//             ? `${api.defaults.baseURL}/${item.thumbnail}`
//             : null,
//         }));
//         setVideos(formatted);
//       } else {
//         setVideos([]);
//         Alert.alert('Error', 'Unexpected API response format');
//       }
//     } catch (error: any) {
//       Alert.alert('Error', 'Failed to load video content');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const openLink = async (url: string) => {
//     const supported = await Linking.canOpenURL(url);
//     if (supported) {
//       await Linking.openURL(url);
//     } else {
//       Alert.alert("Can't open this URL");
//     }
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color="#2575fc" />
//       </View>
//     );
//   }

//   return (
//     <LinearGradient colors={['#e0eafc', '#f5f7fa']} style={styles.gradient}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.header}>📹 Teacher Videos</Text>
//         <View style={styles.videoList}>
//           {videos.length === 0 ? (
//             <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
//               No videos available.
//             </Text>
//           ) : (
//             videos.map((item) => (
//               <TouchableOpacity
//                 key={item._id}
//                 style={styles.videoCard}
//                 onPress={() => openLink(item.url)}
//               >
//                 {item.thumbnail ? (
//                   <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
//                 ) : (
//                   <View style={styles.iconWrapper}>
//                     <FontAwesome name="play-circle" size={70} color="#2575fc" />
//                   </View>
//                 )}
//                 <Text style={styles.videoTitle}>{item.title}</Text>
//                 <Text style={styles.subject}>{item.subject}</Text>
//               </TouchableOpacity>
//             ))
//           )}
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   gradient: {
//     flex: 1,
//   },
//   container: {
//     padding: 20,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#2575fc',
//   },
//   videoList: {
//     marginBottom: 24,
//   },
//   videoCard: {
//     marginBottom: 16,
//     borderRadius: 16,
//     backgroundColor: '#fff',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     overflow: 'hidden',
//   },
//   thumbnail: {
//     width: '100%',
//     height: 180,
//   },
//   iconWrapper: {
//     height: 180,
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#edf2fc',
//   },
//   videoTitle: {
//     paddingHorizontal: 12,
//     paddingTop: 10,
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   subject: {
//     paddingHorizontal: 12,
//     paddingBottom: 12,
//     fontSize: 14,
//     color: '#666',
//   },
// });


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
// import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
// import {Api_url} from './config/config.js'
import api from "../api/api";

type VideoItem = {
  _id: string;
  title: string;
  subject: string;
  thumbnail: string;
  url: string;
};

export default function VideosScreen() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get(`/videos`);
      if (Array.isArray(res.data)) {
        const formatted = res.data.map((item: any) => ({
          ...item,
          thumbnail: item.thumbnail?.startsWith('http')
            ? item.thumbnail
            : item.thumbnail?.startsWith('/')
            ? `${api.defaults.baseURL}${item.thumbnail}`
            : item.thumbnail
            ? `${api.defaults.baseURL}/${item.thumbnail}`
            : null,
        }));
        setVideos(formatted);
      } else {
        setVideos([]);
        Alert.alert('Error', 'Unexpected API response format');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load video content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Can't open this URL");
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      mathematics: '#3B82F6',
      science: '#10B981',
      english: '#EF4444',
      computer: '#8B5CF6',
      physics: '#F59E0B',
      chemistry: '#EC4899',
      biology: '#84CC16',
    };
    return colors[subject.toLowerCase()] || '#64748B';
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>🎬</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Teacher Videos</Text>
          <Text style={styles.headerSubtitle}>{videos.length} videos available</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {videos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <FontAwesome name="video-camera" size={50} color="#cbd5e1" />
            </View>
            <Text style={styles.emptyTitle}>No videos available</Text>
            <Text style={styles.emptyText}>Check back later for new content</Text>
          </View>
        ) : (
          videos.map((item) => {
            const subjectColor = getSubjectColor(item.subject);
            
            return (
              <TouchableOpacity
                key={item._id}
                style={styles.videoCard}
                onPress={() => openLink(item.url)}
              >
                <View style={styles.videoHeader}>
                  <View style={styles.subjectRow}>
                    <View style={[styles.subjectBadge, { backgroundColor: subjectColor + '20' }]}>
                      <Text style={[styles.subjectText, { color: subjectColor }]}>
                        {item.subject}
                      </Text>
                    </View>
                    <View style={styles.playIconContainer}>
                      <FontAwesome name="play-circle" size={24} color={subjectColor} />
                    </View>
                  </View>
                </View>
                
                <View style={styles.videoContent}>
                  <Text style={styles.videoTitle}>{item.title}</Text>
                  
                  <View style={styles.videoFooter}>
                    <View style={styles.durationBadge}>
                      <FontAwesome name="clock-o" size={12} color="#64748b" />
                      <Text style={styles.durationText}>Watch Now</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerIconText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    backgroundColor: '#f1f5f9',
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
    textAlign: 'center',
  },
  videoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  videoHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 13,
    fontWeight: '600',
  },
  playIconContainer: {
    padding: 6,
  },
  videoContent: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
    lineHeight: 22,
  },
  videoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginLeft: 6,
  },
});