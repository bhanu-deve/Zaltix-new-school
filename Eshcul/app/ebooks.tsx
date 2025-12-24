import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  useWindowDimensions,
  Text,
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
  const { width } = useWindowDimensions();
  const isMidSizePhone = width >= 320 && width <= 480;

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
  


  const renderEbookCard = ({ item }: { item: Ebook }) => (
    <Card style={[styles.card, isMidSizePhone && styles.midSizeCard]}>
      <Card.Content>
        <Title style={[styles.title, isMidSizePhone && styles.midSizeTitle]}>
          {item.title}
        </Title>
        <Paragraph style={styles.subject}>Subject: {item.subject}</Paragraph>
        <Paragraph style={styles.file}>Author: {item.author}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button mode="contained" onPress={() => handleDownload(item)}>
          Download
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#555' }}>Loading eBooks...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isMidSizePhone && styles.midSizeContainer]}>
      <FlatList
        data={ebooks}
        keyExtractor={(item) => item.id}
        renderItem={renderEbookCard}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 40, fontSize: 16 }}>
            No eBooks available.
          </Text>
        }
      />
    </View>
  );
};

export default EbookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  midSizeContainer: {
    padding: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    paddingHorizontal: 10,
  },
  midSizeCard: {
    paddingHorizontal: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  midSizeTitle: {
    fontSize: 16,
  },
  subject: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  file: {
    fontSize: 13,
    color: '#999',
  },
  actions: {
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 4,
  },
});
