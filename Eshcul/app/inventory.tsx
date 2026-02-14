import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

import api from "../api/api";
import { useLang } from './language';

export default function InventoryScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { t } = useLang();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hide default navbar
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const getIconForItem = (itemName) => {
    const name = itemName.toLowerCase();

    if (name.includes('book')) return 'book-open-page-variant';
    if (name.includes('uniform')) return 'tshirt-crew';
    if (name.includes('id card')) return 'card-account-details';
    if (name.includes('notebook')) return 'notebook';
    if (name.includes('shoe')) return 'shoe-formal';
    if (name.includes('bag')) return 'bag-personal';

    return 'package-variant'; // default fallback icon
  };

  const fetchInventory = async () => {
    try {
      const response = await api.get('/Addstock');
      const data = response.data;

      // Handle different response formats
      const inventoryData = Array.isArray(data) ? data : (data?.data || data?.inventory || []);

      const formatted = inventoryData.map(item => ({
        id: item._id,
        name: item.item,
        quantity: item.minStock,
        icon: getIconForItem(item.item),
      }));

      setInventory(formatted);
    } catch (error: any) {
      console.error('Failed to fetch inventory:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      setInventory([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={item.icon} size={24} color="#3B82F6" />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQuantity}>
            {t.available}: {item.quantity}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Custom Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>📦</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>{t.inventorys}</Text>
            <Text style={styles.headerSubtitle}>
              {inventory.length} {t.itemsInStock}
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <MaterialCommunityIcons name="package-variant" size={50} color="#cbd5e1" />
              </View>
              <Text style={styles.emptyTitle}>{t.noInventory}</Text>
              <Text style={styles.emptyText}>{t.noInventoryDesc}</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 50, // Increased for status bar
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardContent: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#64748b',
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