import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { WebView } from 'react-native-webview';
import api from '../api/api';
import { useLang } from './language';
import { Ionicons } from '@expo/vector-icons';

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
  const { t } = useLang();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Achievement | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

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
        title: item.title || t.untitled || 'Untitled',
        student: item.student || t.unknown || 'Unknown',
        date: formatDate(item.date) || '-',
        description: item.description || '-',
        category: item.category || 'General',
        fileUrl: formatFileUrl(item.fileUrl),
        fileType: item.fileType || getFileTypeFromUrl(item.fileUrl),
      }));

      setAchievements(formatted);
    } catch (error: any) {
      console.error('Fetch error:', error);
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message || 
                          error?.message || 
                          'Failed to load achievements';
      Alert.alert('Error', errorMessage);
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatFileUrl = (fileUrl: string | null): string | null => {
    if (!fileUrl) return null;
    
    if (fileUrl.startsWith('http')) {
      return fileUrl;
    }
    
    const baseURL = api.defaults.baseURL?.replace(/\/$/, '') || '';
    const cleanFileUrl = fileUrl.replace(/^\//, '');
    return `${baseURL}/${cleanFileUrl}`;
  };

  const getFileTypeFromUrl = (url: string | null): string => {
    if (!url) return 'application/octet-stream';
    
    const extension = url.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    
    return mimeTypes[extension || ''] || 'application/octet-stream';
  };

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

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      academic: '📚',
      sports: '⚽',
      arts: '🎨',
      leadership: '👑',
      general: '🏆',
    };
    return icons[category.toLowerCase()] || '🏆';
  };

  const handleViewFile = (item: Achievement) => {
    if (!item.fileUrl) {
      Alert.alert('Info', 'No file attached to this achievement');
      return;
    }
    setSelectedFile(item);
    setModalVisible(true);
  };

  const handleDownload = async () => {
    if (!selectedFile || !selectedFile.fileUrl) {
      Alert.alert('Error', 'No file URL available');
      return;
    }

    try {
      setDownloading(true);
      
      const fileExt = selectedFile.fileType.includes('pdf') ? 'pdf' : 
                     selectedFile.fileType.includes('image') ? 'jpg' : 'file';
      const safeTitle = selectedFile.title
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase()
        .substring(0, 30);
      const fileName = `${safeTitle}_${Date.now()}.${fileExt}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        selectedFile.fileUrl,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          console.log(`Download progress: ${progress * 100}%`);
        }
      );

      const result = await downloadResumable.downloadAsync();
      
      if (result && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri);
      } else {
        Alert.alert('Download Complete', `File saved to device`);
      }
    } catch (error: any) {
      console.error('Download error:', error);
      Alert.alert('Error', `Failed to download file: ${error.message || error}`);
    } finally {
      setDownloading(false);
    }
  };

  const renderAchievement = ({ item }: { item: Achievement }) => {
    const categoryColor = getCategoryColor(item.category);
    const categoryIcon = getCategoryIcon(item.category);
    
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.headerRow}>
            <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
              <Text style={[styles.iconText, { color: categoryColor }]}>{categoryIcon}</Text>
            </View>
            <View style={styles.titleContainer}>
              <Title style={styles.title} numberOfLines={2}>{item.title}</Title>
              <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '15' }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {item.category}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={16} color="#64748b" />
              <Text style={styles.detailLabel}>Student:</Text>
              <Text style={styles.detailValue} numberOfLines={1}>{item.student}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color="#64748b" />
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{item.date}</Text>
            </View>
            
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionLabel}>Description:</Text>
              <Text style={styles.descriptionText} numberOfLines={3}>
                {item.description}
              </Text>
            </View>
          </View>
        </Card.Content>
        
        {item.fileUrl && (
          <Card.Actions style={styles.actions}>
            <TouchableOpacity
              style={[styles.viewButton, { backgroundColor: categoryColor }]}
              onPress={() => handleViewFile(item)}
            >
              <Ionicons name="eye-outline" size={18} color="#fff" />
              <Text style={styles.viewButtonText}>View Achievement</Text>
            </TouchableOpacity>
          </Card.Actions>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading achievements...</Text>
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
          <Text style={styles.headerSubtitle}>
            {achievements.length} {achievements.length === 1 ? 'achievement' : 'achievements'} found
          </Text>
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
            <Text style={styles.emptyTitle}>No Achievements Yet</Text>
            <Text style={styles.emptyText}>
              Check back later for updates on student achievements
            </Text>
          </View>
        }
      />

      {/* File Preview Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedFile && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderTop}>
                    <Text style={styles.modalTitle} numberOfLines={2}>
                      {selectedFile.title}
                    </Text>
                    <TouchableOpacity 
                      onPress={() => setModalVisible(false)}
                      style={styles.modalCloseButton}
                    >
                      <Ionicons name="close" size={24} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.modalCategoryBadge, { 
                    backgroundColor: getCategoryColor(selectedFile.category) + '15' 
                  }]}>
                    <Text style={[styles.modalCategoryText, { 
                      color: getCategoryColor(selectedFile.category) 
                    }]}>
                      {getCategoryIcon(selectedFile.category)} {selectedFile.category}
                    </Text>
                  </View>
                </View>
                
                <ScrollView style={styles.modalBody}>
                  {selectedFile.fileUrl && (
                    selectedFile.fileType.includes('pdf') ? (
                      <WebView
                        source={{ uri: selectedFile.fileUrl }}
                        style={styles.modalViewer}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        renderLoading={() => (
                          <View style={styles.webviewLoader}>
                            <ActivityIndicator size="large" color="#3b82f6" />
                          </View>
                        )}
                      />
                    ) : selectedFile.fileType.includes('image') ? (
                      <Image
                        source={{ uri: selectedFile.fileUrl }}
                        style={styles.modalImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.fileInfoContainer}>
                        <Ionicons name="document-outline" size={60} color="#3b82f6" />
                        <Text style={styles.fileInfoText}>
                          {selectedFile.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Text>
                      </View>
                    )
                  )}
                  
                  <View style={styles.modalDetails}>
                    <View style={styles.modalDetailRow}>
                      <Ionicons name="person-outline" size={18} color="#64748b" />
                      <Text style={styles.modalDetailLabel}>Student:</Text>
                      <Text style={styles.modalDetailValue}>{selectedFile.student}</Text>
                    </View>
                    
                    <View style={styles.modalDetailRow}>
                      <Ionicons name="calendar-outline" size={18} color="#64748b" />
                      <Text style={styles.modalDetailLabel}>Date:</Text>
                      <Text style={styles.modalDetailValue}>{selectedFile.date}</Text>
                    </View>
                    
                    <View style={styles.modalDescription}>
                      <Text style={styles.modalDescriptionLabel}>Description:</Text>
                      <Text style={styles.modalDescriptionText}>
                        {selectedFile.description}
                      </Text>
                    </View>
                  </View>
                </ScrollView>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalDownloadButton, { 
                      backgroundColor: getCategoryColor(selectedFile.category) 
                    }]}
                    onPress={handleDownload}
                    disabled={downloading}
                  >
                    {downloading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Ionicons name="download-outline" size={20} color="#fff" />
                        <Text style={styles.modalDownloadText}>Download</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.modalCloseButton2}
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedFile(null);
                    }}
                  >
                    <Text style={styles.modalCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerIconText: {
    fontSize: 26,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
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
    fontWeight: '600',
    color: '#0f172a',
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
    textTransform: 'capitalize',
  },
  detailsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
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
    fontWeight: '500',
    marginLeft: 6,
    marginRight: 8,
    width: 60,
  },
  detailValue: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  descriptionBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  descriptionLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    backgroundColor: '#f1f5f9',
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginRight: 12,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  modalCategoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalBody: {
    maxHeight: 500,
  },
  modalViewer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f8fafc',
  },
  webviewLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  modalImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f8fafc',
  },
  fileInfoContainer: {
    height: 200,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfoText: {
    marginTop: 12,
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  modalDetails: {
    padding: 20,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalDetailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginLeft: 8,
    marginRight: 12,
    width: 65,
  },
  modalDetailValue: {
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '500',
    flex: 1,
  },
  modalDescription: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  modalDescriptionLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 8,
  },
  modalDescriptionText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 12,
  },
  modalDownloadButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  modalDownloadText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  modalCloseButton2: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default AchievementsScreen;