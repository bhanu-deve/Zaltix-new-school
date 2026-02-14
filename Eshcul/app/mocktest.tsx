import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import axios from 'axios';
// import {Api_url} from './config/config.js'
import api from "../api/api";
import { useLang } from './language';

export default function MockTestsScreen() {
  const { t } = useLang();
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMockTests = async () => {
    try {
      const response = await api.get(`/AddTest`);
      const data = response.data;
      console.log('Fetched mock tests:', data);

      let testsArray = [];
      if (Array.isArray(data)) {
        testsArray = data;
      } else if (data && Array.isArray(data.tests)) {
        testsArray = data.tests;
      } else {
        console.warn('Unexpected response format:', data);
        Alert.alert('Unexpected Data', 'The response format is not as expected.');
        testsArray = [];
      }
      setMockTests(testsArray);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert(
        'Error',
        `Unable to load mock tests. Make sure the backend is running and reachable.\n\n${error.message}`
      );
      setMockTests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMockTests();
  }, []);

  const getSubjectColor = (subject) => {
    const colors = {
      mathematics: '#3B82F6',
      science: '#10B981',
      english: '#EF4444',
      computer: '#8B5CF6',
      physics: '#F59E0B',
      chemistry: '#EC4899',
      biology: '#84CC16',
    };
    return colors[subject?.toLowerCase()] || '#64748B';
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
          <Text style={styles.headerIconText}>📝</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>{t.upcomingMockTests}</Text>
          <Text style={styles.headerSubtitle}>
            {mockTests.length} {t.testsScheduled}
          </Text>

        </View>
      </View>

      <FlatList
        data={mockTests}
        keyExtractor={(item, index) => item._id ? item._id : index.toString()}
        renderItem={({ item }) => {
          const subjectColor = getSubjectColor(item.subject);
          
          return (
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: subjectColor + '20' }]}>
                  <MaterialCommunityIcons 
                    name="clipboard-text-outline" 
                    size={22} 
                    color={subjectColor} 
                  />
                </View>
                
                <View style={styles.details}>
                  <Text style={styles.title}>
                    {item.title || t.untitledTest}
                  </Text>

                  
                  <View style={styles.infoRow}>
                    <View style={[styles.subjectBadge, { backgroundColor: subjectColor + '15' }]}>
                      <Text style={[styles.subjectText, { color: subjectColor }]}>
                        {item.subject || '-'}
                      </Text>
                    </View>
                    <View style={styles.classBadge}>
                      <Text style={styles.classText}>
                        {t.class} {item.class || '-'}
                      </Text>

                    </View>
                  </View>
                  
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>{t.questions}</Text>
                      <Text style={styles.detailValue}>{item.questions || '-'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>{t.duration}</Text>
                      <Text style={styles.detailValue}>
                        {item.duration ? `${item.duration} ${t.minutes}` : '-'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.dateRow}>
                    <MaterialCommunityIcons name="calendar" size={14} color="#64748b" />
                    <Text style={styles.dateText}>
                      {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={50} color="#cbd5e1" />
            </View>
            <Text style={styles.emptyTitle}>{t.noMockTests}</Text>
            <Text style={styles.emptyText}>{t.noMockTestsDesc}</Text>

          </View>
        }
      />
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
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '600',
  },
  classBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  classText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  dateText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '500',
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
});