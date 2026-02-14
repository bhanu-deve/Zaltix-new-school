import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import * as Location from 'expo-location';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useLang } from './language';

/* ================= SOCKET ================= */
import { io } from "socket.io-client";

const socket = io("http://192.168.29.241:3000", {
  transports: ["websocket"],
});
/* ========================================== */

// Conditionally import MapView only on native platforms
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default || Maps.MapView || Maps;
    Marker = Maps.Marker || Maps.default?.Marker;
  } catch (e) {
    console.warn('react-native-maps not available:', e);
  }
}

export default function BusTrackingScreen() {
  const { t } = useLang(); // ✅ REQUIRED (LANGUAGE FIX)

  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ===== LIVE BUS LOCATION ===== */
  const [busLocation, setBusLocation] = useState<any>(null);

  /* ===== LOCATION PERMISSION ===== */
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setLoading(false);
    })();
  }, []);

  /* ===== SOCKET LISTENER ===== */
  useEffect(() => {
    const BUS_ID = "BUS101"; // must match driver busId

    socket.emit("join-bus", BUS_ID);

    socket.on("bus-location", (data) => {
      setBusLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });

    return () => {
      socket.off("bus-location");
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚌 Bus Tracking</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : MapView && Marker ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: busLocation?.latitude || location.latitude,
            longitude: busLocation?.longitude || location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* STUDENT LOCATION */}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You"
            pinColor="#3B82F6"
          />

          {/* BUS LOCATION (LIVE) */}
          {busLocation && (
            <Marker
              coordinate={busLocation}
              title="Bus"
              pinColor="#10B981"
            />
          )}
        </MapView>
      ) : (
        <Text>Map not available</Text>
      )}

      <View style={styles.busDetails}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🚌 {t.busDetails}</Text>
          <View style={[styles.busStatus, { backgroundColor: '#10B98120' }]}>
            <Text style={[styles.busStatusText, { color: '#10B981' }]}>
              {t.onTime}
            </Text>
          </View>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t.busNo}</Text>
            <Text style={styles.detailValue}>TS 09 AB 1234</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t.driver}</Text>
            <Text style={styles.detailValue}>Ramesh Kumar</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t.eta}</Text>
            <Text style={styles.detailValue}>8:25 AM</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t.contact}</Text>
            <Text style={styles.detailValue}>+91 98765 43210</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/* ===================== STYLES (UNCHANGED) ===================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  map: {
    width: '100%',
    height: 300,
  },
  busDetails: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  busStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  busStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsGrid: {
    marginTop: 16,
  },
  detailItem: {
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
});
