// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   StyleSheet,
//   FlatList,
//   Alert,
//   useWindowDimensions,
//   Text,
// } from 'react-native';
// import { Card, Title, Paragraph, Button } from 'react-native-paper';
// import * as FileSystem from 'expo-file-system/legacy';
// import * as Sharing from 'expo-sharing';
// // import axios from 'axios';
// // import {Api_url} from './config/config.js'
// import api from "../api/api";


// interface Ebook {
//   id: string;
//   title: string;
//   subject: string;
//   pdfurl: string;
//   author: string;
// }

// const EbookScreen = () => {
//   const [ebooks, setEbooks] = useState<Ebook[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { width } = useWindowDimensions();
//   const isMidSizePhone = width >= 320 && width <= 480;

//   useEffect(() => {
//     const fetchEbooks = async () => {
//       try {
//         const res = await api.get('/AddEbook', { timeout: 5000 });
//         const ebooksArray = Array.isArray(res.data)
//           ? res.data
//           : res.data?.ebooks || res.data?.data || [];

//         const formatted = ebooksArray.map((item: any) => ({
//           id: item._id || item.id || Math.random().toString(),
//           title: item.title || 'Untitled',
//           subject: item.subject || '-',
//           pdfurl: item.pdfUrl?.startsWith('http')
//             ? item.pdfUrl
//             : `${api.defaults.baseURL}${item.pdfUrl}`,
//           author: item.author || '-',
//         }));
//         setEbooks(formatted);
//       } catch (err) {
//         Alert.alert(
//           'Error',
//           'Failed to load ebooks. Please check your network or server.'
//         );
//         setEbooks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEbooks();
//   }, []);

//   const handleDownload = async (ebook: Ebook) => {
//     try {
//       if (!ebook.pdfurl) {
//         Alert.alert('Error', 'Invalid file URL');
//         return;
//       }
  
//       const safeTitle = ebook.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
//       const fileName = `${safeTitle}_${Date.now()}.pdf`;
//       const fileUri = FileSystem.documentDirectory + fileName;
  
//       console.log("Downloading from:", ebook.pdfurl);
//       console.log("Saving as:", fileUri);
  
//       const { uri } = await FileSystem.downloadAsync(
//         ebook.pdfurl,
//         fileUri
//       );
  
//       if (await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(uri);
//       } else {
//         Alert.alert("Downloaded", `Saved at ${uri}`);
//       }
//     } catch (e: any) {
//       console.error(e);
//       Alert.alert("Error", `Download failed: ${e.message || e}`);
//     }
//   };
  


//   const renderEbookCard = ({ item }: { item: Ebook }) => (
//     <Card style={[styles.card, isMidSizePhone && styles.midSizeCard]}>
//       <Card.Content>
//         <Title style={[styles.title, isMidSizePhone && styles.midSizeTitle]}>
//           {item.title}
//         </Title>
//         <Paragraph style={styles.subject}>Subject: {item.subject}</Paragraph>
//         <Paragraph style={styles.file}>Author: {item.author}</Paragraph>
//       </Card.Content>
//       <Card.Actions style={styles.actions}>
//         <Button mode="contained" onPress={() => handleDownload(item)}>
//           Download
//         </Button>
//       </Card.Actions>
//     </Card>
//   );

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text style={{ fontSize: 18, color: '#555' }}>Loading eBooks...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, isMidSizePhone && styles.midSizeContainer]}>
//       <FlatList
//         data={ebooks}
//         keyExtractor={(item) => item.id}
//         renderItem={renderEbookCard}
//         contentContainerStyle={styles.listContainer}
//         ListEmptyComponent={
//           <Text style={{ textAlign: 'center', color: '#888', marginTop: 40, fontSize: 16 }}>
//             No eBooks available.
//           </Text>
//         }
//       />
//     </View>
//   );
// };

// export default EbookScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F9F9F9',
//   },
//   midSizeContainer: {
//     padding: 12,
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   card: {
//     marginBottom: 16,
//     borderRadius: 12,
//     backgroundColor: '#fff',
//     elevation: 3,
//     paddingHorizontal: 10,
//   },
//   midSizeCard: {
//     paddingHorizontal: 6,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   midSizeTitle: {
//     fontSize: 16,
//   },
//   subject: {
//     marginTop: 4,
//     fontSize: 14,
//     color: '#555',
//   },
//   file: {
//     fontSize: 13,
//     color: '#999',
//   },
//   actions: {
//     justifyContent: 'flex-end',
//     marginTop: 8,
//     marginBottom: 4,
//   },
// });
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
// import axios from 'axios';
// import {Api_url} from './config/config.js'
import api from "../api/api";

interface Ebook {
  id: string;
  title: string;
  subject: string;
  pdfurl: string;
  author: string;
}

const EbookScreen = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const res = await api.get('/AddEbook', { timeout: 5000 });
        const ebooksArray = Array.isArray(res.data)
          ? res.data
          : res.data?.ebooks || res.data?.data || [];

        const formatted = ebooksArray.map((item: any) => ({
          id: item._id || item.id || Math.random().toString(),
          title: item.title || 'Untitled',
          subject: item.subject || '-',
          pdfurl: item.pdfUrl?.startsWith('http')
            ? item.pdfUrl
            : `${api.defaults.baseURL}${item.pdfUrl}`,
          author: item.author || '-',
        }));
        setEbooks(formatted);
      } catch (err) {
        Alert.alert(
          'Error',
          'Failed to load ebooks. Please check your network or server.'
        );
        setEbooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

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

  const handleDownload = async (ebook: Ebook) => {
    try {
      if (!ebook.pdfurl) {
        Alert.alert('Error', 'Invalid file URL');
        return;
      }
  
      const safeTitle = ebook.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const fileName = `${safeTitle}_${Date.now()}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;
  
      console.log("Downloading from:", ebook.pdfurl);
      console.log("Saving as:", fileUri);
  
      const { uri } = await FileSystem.downloadAsync(
        ebook.pdfurl,
        fileUri
      );
  
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Downloaded", `Saved at ${uri}`);
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert("Error", `Download failed: ${e.message || e}`);
    }
  };

  const renderEbookCard = ({ item }: { item: Ebook }) => {
    const subjectColor = getSubjectColor(item.subject);
    
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.headerRow}>
            <View style={[styles.iconContainer, { backgroundColor: subjectColor + '20' }]}>
              <Text style={[styles.iconText, { color: subjectColor }]}>📚</Text>
            </View>
            <View style={styles.titleContainer}>
              <Title style={styles.title}>{item.title}</Title>
              <View style={styles.subjectRow}>
                <View style={[styles.subjectBadge, { backgroundColor: subjectColor + '15' }]}>
                  <Text style={[styles.subjectText, { color: subjectColor }]}>
                    {item.subject}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Author:</Text>
              <Text style={styles.detailValue}>{item.author}</Text>
            </View>
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button 
            mode="contained" 
            style={[styles.downloadButton, { backgroundColor: subjectColor }]}
            onPress={() => handleDownload(item)}
          >
            Download PDF
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
          <Text style={styles.headerIconText}>📖</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>E-Books Library</Text>
          <Text style={styles.headerSubtitle}>{ebooks.length} e-books available</Text>
        </View>
      </View>

      <FlatList
        data={ebooks}
        keyExtractor={(item) => item.id}
        renderItem={renderEbookCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>📚</Text>
            </View>
            <Text style={styles.emptyTitle}>No e-books available</Text>
            <Text style={styles.emptyText}>No e-books found in the library</Text>
          </View>
        }
      />
    </View>
  );
};

export default EbookScreen;

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
  listContainer: {
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
  subjectRow: {
    flexDirection: 'row',
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  subjectText: {
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
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  downloadButton: {
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
});