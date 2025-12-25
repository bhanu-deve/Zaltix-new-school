// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   FlatList,
//   Alert,
//   Image,
//   Modal,
//   Text,
//   useWindowDimensions,
//   ActivityIndicator,
// } from 'react-native';
// import { Card, Title, Paragraph, Button } from 'react-native-paper';
// import * as FileSystem from 'expo-file-system/legacy';
// import * as Sharing from 'expo-sharing';
// import { WebView } from 'react-native-webview';
// // import {Api_url} from './config/config.js'
// import api from "../api/api";


// interface Achievement {
//   id: string;
//   title: string;
//   student: string;
//   date: string;
//   description: string;
//   category: string;
//   fileUrl: string | null;
//   fileType: string;
// }

// // const BASE_URL = 'http://13.203.156.49:5000'; // ✅ Change to your server IP

// const AchievementsScreen = () => {
//   const [achievements, setAchievements] = useState<Achievement[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<Achievement | null>(null);
//   const { width } = useWindowDimensions();

//   useEffect(() => {
//     const fetchAchievements = async () => {
//       try {
//         setLoading(true);
//         console.log('Fetching achievements...');
//         const res = await api.get('/achievements');
//         console.log('Achievements response:', res.data);
//         const data = res.data;
//         const achievementsArray = Array.isArray(data)
//           ? data
//           : data?.achievements || data?.data || [];

//         console.log('Achievements array:', achievementsArray);

//         const formatted = achievementsArray.map((item: any) => ({
//           id: item._id?.$oid || item._id || Math.random().toString(),
//           title: item.title || 'Untitled',
//           student: item.student || 'Unknown',
//           date: item.date || '-',
//           description: item.description || '-',
//           category: item.category || 'General',
//           fileUrl: item.fileUrl?.startsWith('http')
//             ? item.fileUrl
//             : item.fileUrl?.startsWith('/')
//             ? `${api.defaults.baseURL}${item.fileUrl}`
//             : item.fileUrl
//             ? `${api.defaults.baseURL}/${item.fileUrl}`
//             : null,
//           fileType: item.fileType || 'image/jpeg',
//         }));

//         console.log('Formatted achievements:', formatted);
//         setAchievements(formatted);
//       } catch (error: any) {
//         console.error('Fetch error:', error);
//         console.error('Error details:', error?.response?.data || error?.message);
//         const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Failed to load achievements';
//         Alert.alert('Error', errorMessage);
//         setAchievements([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAchievements();
//   }, []);

//   const handleViewFile = (item: Achievement) => {
//     setSelectedFile(item);
//     setModalVisible(true);
//   };

//   const handleDownload = async () => {
//     if (!selectedFile || !selectedFile.fileUrl) {
//       Alert.alert('Error', 'No file URL available');
//       return;
//     }

//     try {
//       const fileExt = selectedFile.fileType.includes('pdf') ? 'pdf' : 'jpg';
//       const safeTitle = selectedFile.title
//         .replace(/[^a-z0-9]/gi, '_')
//         .toLowerCase();
//       const fileName = `${safeTitle}_${Date.now()}.${fileExt}`;
//       const fileUri = `${FileSystem.documentDirectory}${fileName}`;

//       const { uri } = await FileSystem.downloadAsync(
//         selectedFile.fileUrl,
//         fileUri
//       );

//       if (await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(uri);
//       } else {
//         Alert.alert('Downloaded', `File saved to:\n${uri}`);
//       }
//     } catch (error: any) {
//       console.error('Download error:', error);
//       Alert.alert('Error', `Failed to download file: ${error.message || error}`);
//     }
//   };

//   const renderAchievement = ({ item }: { item: Achievement }) => (
//     <Card style={styles.card}>
//       <Card.Content>
//         <Title>{item.title}</Title>
//         <Paragraph>👤 {item.student}</Paragraph>
//         <Paragraph>🏅 {item.category}</Paragraph>
//         <Paragraph>📅 {item.date}</Paragraph>
//         <Paragraph>Description: {item.description}</Paragraph>
//         {item.fileType.includes('image') && item.fileUrl && (
//           <Image source={{ uri: item.fileUrl }} style={styles.image} />
//         )}
//       </Card.Content>
//       <Card.Actions>
//         <Button mode="contained" onPress={() => handleViewFile(item)}>
//           View File
//         </Button>
//       </Card.Actions>
//     </Card>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#2575fc" />
//         <Text style={styles.loadingText}>Loading achievements...</Text>
//       </View>
//     );
//   }

//   if (achievements.length === 0) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyText}>No achievements found</Text>
//         <Text style={styles.emptySubtext}>Check back later for new achievements</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Achievements</Text>
//       <FlatList
//         data={achievements}
//         keyExtractor={(item) => item.id}
//         renderItem={renderAchievement}
//         contentContainerStyle={{ paddingBottom: 20 }}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No achievements available</Text>
//           </View>
//         }
//       />

//       {/* File Preview Modal */}
//       <Modal
//         animationType="slide"
//         transparent
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             {selectedFile && selectedFile.fileUrl && (
//               <>
//                 <Text style={styles.modalTitle}>{selectedFile.title}</Text>
//                 {selectedFile.fileType.includes('pdf') ? (
//                   <WebView
//                     source={{ uri: selectedFile.fileUrl }}
//                     style={styles.modalViewer}
//                   />
//                 ) : (
//                   <Image
//                     source={{ uri: selectedFile.fileUrl }}
//                     style={styles.modalViewer}
//                     resizeMode="contain"
//                   />
//                 )}
//                 <View style={styles.modalActions}>
//                   <Button mode="contained" onPress={handleDownload}>
//                     Download
//                   </Button>
//                   <Button
//                     mode="outlined"
//                     onPress={() => {
//                       setModalVisible(false);
//                       setSelectedFile(null);
//                     }}
//                     style={{ marginLeft: 10 }}
//                   >
//                     Close
//                   </Button>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default AchievementsScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f6f9ff',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2575fc',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f6f9ff',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//     backgroundColor: '#f6f9ff',
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 8,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//   },
//   card: {
//     marginBottom: 16,
//     borderRadius: 10,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     marginTop: 10,
//     borderRadius: 8,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     maxHeight: '85%',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   modalViewer: {
//     width: 300,
//     height: 400,
//     borderRadius: 10,
//     backgroundColor: '#eee',
//   },
//   modalActions: {
//     flexDirection: 'row',
//     marginTop: 16,
//   },
// });
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { WebView } from 'react-native-webview';
// import {Api_url} from './config/config.js'
import api from "../api/api";

interface Achievement {
  id: string;
  title: string;
  student: string;
  date: string;
  description: string;
  category: string;
  fileUrl: string | null;
  fileType: string;
}

const AchievementsScreen = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Achievement | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const res = await api.get('/achievements');
        const data = res.data;
        const achievementsArray = Array.isArray(data)
          ? data
          : data?.achievements || data?.data || [];

        const formatted = achievementsArray.map((item: any) => ({
          id: item._id?.$oid || item._id || Math.random().toString(),
          title: item.title || 'Untitled',
          student: item.student || 'Unknown',
          date: item.date || '-',
          description: item.description || '-',
          category: item.category || 'General',
          fileUrl: item.fileUrl?.startsWith('http')
            ? item.fileUrl
            : item.fileUrl?.startsWith('/')
            ? `${api.defaults.baseURL}${item.fileUrl}`
            : item.fileUrl
            ? `${api.defaults.baseURL}/${item.fileUrl}`
            : null,
          fileType: item.fileType || 'image/jpeg',
        }));

        setAchievements(formatted);
      } catch (error: any) {
        console.error('Fetch error:', error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Failed to load achievements';
        Alert.alert('Error', errorMessage);
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      academic: '#3B82F6',
      sports: '#10B981',
      arts: '#EC4899',
      leadership: '#F59E0B',
      general: '#64748B',
    };
    return colors[category.toLowerCase()] || '#64748B';
  };

  const handleViewFile = (item: Achievement) => {
    setSelectedFile(item);
    setModalVisible(true);
  };

  const handleDownload = async () => {
    if (!selectedFile || !selectedFile.fileUrl) {
      Alert.alert('Error', 'No file URL available');
      return;
    }

    try {
      const fileExt = selectedFile.fileType.includes('pdf') ? 'pdf' : 'jpg';
      const safeTitle = selectedFile.title
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      const fileName = `${safeTitle}_${Date.now()}.${fileExt}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const { uri } = await FileSystem.downloadAsync(
        selectedFile.fileUrl,
        fileUri
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Downloaded', `File saved to:\n${uri}`);
      }
    } catch (error: any) {
      console.error('Download error:', error);
      Alert.alert('Error', `Failed to download file: ${error.message || error}`);
    }
  };

  const renderAchievement = ({ item }: { item: Achievement }) => {
    const categoryColor = getCategoryColor(item.category);
    
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.headerRow}>
            <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
              <Text style={[styles.iconText, { color: categoryColor }]}>🏆</Text>
            </View>
            <View style={styles.titleContainer}>
              <Title style={styles.title}>{item.title}</Title>
              <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '15' }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {item.category}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>👤 Student:</Text>
              <Text style={styles.detailValue}>{item.student}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📅 Date:</Text>
              <Text style={styles.detailValue}>{item.date}</Text>
            </View>
            
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionLabel}>Description:</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button 
            mode="contained"
            style={[styles.viewButton, { backgroundColor: categoryColor }]}
            onPress={() => handleViewFile(item)}
          >
            View Achievement
          </Button>
        </Card.Actions>
      </Card>
    );
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
          <Text style={styles.headerIconText}>🏆</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Achievements</Text>
          <Text style={styles.headerSubtitle}>{achievements.length} achievements</Text>
        </View>
      </View>

      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        renderItem={renderAchievement}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>🏆</Text>
            </View>
            <Text style={styles.emptyTitle}>No achievements found</Text>
            <Text style={styles.emptyText}>Check back later for new achievements</Text>
          </View>
        }
      />

      {/* File Preview Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedFile && selectedFile.fileUrl && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedFile.title}</Text>
                  <View style={[styles.modalCategoryBadge, { 
                    backgroundColor: getCategoryColor(selectedFile.category) + '15' 
                  }]}>
                    <Text style={[styles.modalCategoryText, { 
                      color: getCategoryColor(selectedFile.category) 
                    }]}>
                      {selectedFile.category}
                    </Text>
                  </View>
                </View>
                
                {selectedFile.fileType.includes('pdf') ? (
                  <WebView
                    source={{ uri: selectedFile.fileUrl }}
                    style={styles.modalViewer}
                  />
                ) : (
                  <View style={styles.imageContainer}>
                    {/* Image would be shown here if we had an Image component */}
                    <Text style={styles.imagePlaceholder}>📷 Image Preview</Text>
                  </View>
                )}
                
                <View style={styles.modalActions}>
                  <Button 
                    mode="contained" 
                    style={[styles.downloadButton, { 
                      backgroundColor: getCategoryColor(selectedFile.category) 
                    }]}
                    onPress={handleDownload}
                  >
                    Download
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedFile(null);
                    }}
                    style={styles.closeButton}
                  >
                    Close
                  </Button>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AchievementsScreen;

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
  list: {
    paddingHorizontal: 16,
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconText: {
    fontSize: 22,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
    lineHeight: 22,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  descriptionBox: {
    marginTop: 4,
  },
  descriptionLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  viewButton: {
    flex: 1,
    borderRadius: 8,
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
  emptyIconText: {
    fontSize: 32,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  modalCategoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  modalCategoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalViewer: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  imageContainer: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    fontSize: 16,
    color: '#64748b',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  downloadButton: {
    flex: 1,
    borderRadius: 8,
  },
  closeButton: {
    marginLeft: 10,
  },
});