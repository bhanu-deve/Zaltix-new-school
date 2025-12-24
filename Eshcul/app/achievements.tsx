import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  Modal,
  Text,
  useWindowDimensions,
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

// const BASE_URL = 'http://13.203.156.49:5000'; // ✅ Change to your server IP

const AchievementsScreen = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Achievement | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        console.log('Fetching achievements...');
        const res = await api.get('/achievements');
        console.log('Achievements response:', res.data);
        const data = res.data;
        const achievementsArray = Array.isArray(data)
          ? data
          : data?.achievements || data?.data || [];

        console.log('Achievements array:', achievementsArray);

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

        console.log('Formatted achievements:', formatted);
        setAchievements(formatted);
      } catch (error: any) {
        console.error('Fetch error:', error);
        console.error('Error details:', error?.response?.data || error?.message);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Failed to load achievements';
        Alert.alert('Error', errorMessage);
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

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

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>👤 {item.student}</Paragraph>
        <Paragraph>🏅 {item.category}</Paragraph>
        <Paragraph>📅 {item.date}</Paragraph>
        <Paragraph>Description: {item.description}</Paragraph>
        {item.fileType.includes('image') && item.fileUrl && (
          <Image source={{ uri: item.fileUrl }} style={styles.image} />
        )}
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => handleViewFile(item)}>
          View File
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2575fc" />
        <Text style={styles.loadingText}>Loading achievements...</Text>
      </View>
    );
  }

  if (achievements.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No achievements found</Text>
        <Text style={styles.emptySubtext}>Check back later for new achievements</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Achievements</Text>
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        renderItem={renderAchievement}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No achievements available</Text>
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
                <Text style={styles.modalTitle}>{selectedFile.title}</Text>
                {selectedFile.fileType.includes('pdf') ? (
                  <WebView
                    source={{ uri: selectedFile.fileUrl }}
                    style={styles.modalViewer}
                  />
                ) : (
                  <Image
                    source={{ uri: selectedFile.fileUrl }}
                    style={styles.modalViewer}
                    resizeMode="contain"
                  />
                )}
                <View style={styles.modalActions}>
                  <Button mode="contained" onPress={handleDownload}>
                    Download
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedFile(null);
                    }}
                    style={{ marginLeft: 10 }}
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
    padding: 16,
    backgroundColor: '#f6f9ff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2575fc',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f9ff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f6f9ff',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalViewer: {
    width: 300,
    height: 400,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
});
