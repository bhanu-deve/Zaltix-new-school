// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
// import * as Location from 'expo-location';
// import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

// // Conditionally import MapView only on native platforms
// let MapView: any = null;
// let Marker: any = null;

// if (Platform.OS !== 'web') {
//   try {
//     // Try different import patterns for react-native-maps
//     const Maps = require('react-native-maps');
//     if (Maps.default) {
//       MapView = Maps.default;
//       Marker = Maps.default.Marker || Maps.Marker;
//     } else if (Maps.MapView) {
//       MapView = Maps.MapView;
//       Marker = Maps.Marker;
//     } else {
//       // Direct destructuring
//       MapView = Maps;
//       Marker = Maps.Marker;
//     }
//   } catch (e) {
//     console.warn('react-native-maps not available:', e);
//   }
// }

// export default function BusTrackingScreen() {
//   const [location, setLocation] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const busLocation = {
//     latitude: 17.4065, // mock bus location
//     longitude: 78.4772,
//   };

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Location permission denied');
//         return;
//       }

//       const currentLocation = await Location.getCurrentPositionAsync({});
//       setLocation(currentLocation.coords);
//       setLoading(false);
//     })();
//   }, []);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Bus Tracking</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#2575fc" />
//       ) : MapView && Marker ? (
//         <MapView
//           style={styles.map}
//           initialRegion={{
//             latitude: location?.latitude || busLocation.latitude,
//             longitude: location?.longitude || busLocation.longitude,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           }}
//         >
//           {location && (
//             <Marker
//               coordinate={{ latitude: location.latitude, longitude: location.longitude }}
//               title="You"
//               description="Your current location"
//               pinColor="blue"
//             />
//           )}
//           <Marker
//             coordinate={busLocation}
//             title="Bus"
//             description="School Bus Location"
//             pinColor="green"
//           />
//         </MapView>
//       ) : (
//         <View style={[styles.map, styles.mapPlaceholder]}>
//           <Text style={styles.mapPlaceholderText}>Map not available on this platform</Text>
//           <Text style={styles.mapInfoText}>
//             Your Location: {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Not available'}
//           </Text>
//           <Text style={styles.mapInfoText}>
//             Bus Location: {busLocation.latitude.toFixed(4)}, {busLocation.longitude.toFixed(4)}
//           </Text>
//         </View>
//       )}

//       <View style={styles.busDetails}>
//         <Text style={styles.sectionTitle}>Bus Details</Text>
//         <View style={styles.detailRow}>
//           <MaterialIcons name="directions-bus" size={24} color="#2575fc" />
//           <Text style={styles.detailText}>Bus No: TS 09 AB 1234</Text>
//         </View>
//         <View style={styles.detailRow}>
//           <FontAwesome5 name="user-tie" size={20} color="#2575fc" />
//           <Text style={styles.detailText}>Driver: Ramesh Kumar</Text>
//         </View>
//         <View style={styles.detailRow}>
//           <FontAwesome5 name="clock" size={20} color="#2575fc" />
//           <Text style={styles.detailText}>Estimated Arrival: 8:25 AM</Text>
//         </View>
//         <View style={styles.detailRow}>
//           <FontAwesome5 name="phone" size={20} color="#2575fc" />
//           <Text style={styles.detailText}>Driver Contact: +91 98765 43210</Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#f5f7fa',
//     flexGrow: 1,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: '700',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#2575fc',
//   },
//   map: {
//     width: '100%',
//     height: 300,
//     borderRadius: 16,
//     marginBottom: 30,
//   },
//   busDetails: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 16,
//     color: '#333',
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   detailText: {
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#555',
//   },
//   mapPlaceholder: {
//     backgroundColor: '#e0e0e0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   mapPlaceholderText: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 10,
//     fontWeight: '600',
//   },
//   mapInfoText: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 5,
//   },
// });
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
import * as Location from 'expo-location';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

// Conditionally import MapView only on native platforms
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  try {
    // Try different import patterns for react-native-maps
    const Maps = require('react-native-maps');
    if (Maps.default) {
      MapView = Maps.default;
      Marker = Maps.default.Marker || Maps.Marker;
    } else if (Maps.MapView) {
      MapView = Maps.MapView;
      Marker = Maps.Marker;
    } else {
      // Direct destructuring
      MapView = Maps;
      Marker = Maps.Marker;
    }
  } catch (e) {
    console.warn('react-native-maps not available:', e);
  }
}

export default function BusTrackingScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const busLocation = {
    latitude: 17.4065, // mock bus location
    longitude: 78.4772,
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>🚌</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Bus Tracking</Text>
          <Text style={styles.headerSubtitle}>Track your school bus in real-time</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Fetching location...</Text>
        </View>
      ) : MapView && Marker ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location?.latitude || busLocation.latitude,
              longitude: location?.longitude || busLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {location && (
              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="You"
                description="Your current location"
                pinColor="#3B82F6"
              />
            )}
            <Marker
              coordinate={busLocation}
              title="Bus"
              description="School Bus Location"
              pinColor="#10B981"
            />
          </MapView>
          <View style={styles.mapOverlay}>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Your Location:</Text>
              <Text style={styles.locationValue}>
                {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Not available'}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.mapContainer, styles.mapPlaceholder]}>
          <Text style={styles.mapPlaceholderTitle}>Location Details</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationItem}>
              <View style={[styles.locationIcon, { backgroundColor: '#3B82F6' + '20' }]}>
                <MaterialIcons name="person-pin-circle" size={20} color="#3B82F6" />
              </View>
              <View>
                <Text style={styles.locationItemLabel}>Your Location</Text>
                <Text style={styles.locationItemValue}>
                  {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Not available'}
                </Text>
              </View>
            </View>
            
            <View style={styles.locationItem}>
              <View style={[styles.locationIcon, { backgroundColor: '#10B981' + '20' }]}>
                <MaterialIcons name="directions-bus" size={20} color="#10B981" />
              </View>
              <View>
                <Text style={styles.locationItemLabel}>Bus Location</Text>
                <Text style={styles.locationItemValue}>
                  {busLocation.latitude.toFixed(4)}, {busLocation.longitude.toFixed(4)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={styles.busDetails}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🚌 Bus Details</Text>
          <View style={[styles.busStatus, { backgroundColor: '#10B981' + '20' }]}>
            <Text style={[styles.busStatusText, { color: '#10B981' }]}>On Time</Text>
          </View>
        </View>
        
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: '#3B82F6' + '20' }]}>
              <Text style={[styles.detailIconText, { color: '#3B82F6' }]}>🚌</Text>
            </View>
            <Text style={styles.detailLabel}>Bus No</Text>
            <Text style={styles.detailValue}>TS 09 AB 1234</Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: '#F59E0B' + '20' }]}>
              <FontAwesome5 name="user-tie" size={16} color="#F59E0B" />
            </View>
            <Text style={styles.detailLabel}>Driver</Text>
            <Text style={styles.detailValue}>Ramesh Kumar</Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: '#EF4444' + '20' }]}>
              <FontAwesome5 name="clock" size={16} color="#EF4444" />
            </View>
            <Text style={styles.detailLabel}>ETA</Text>
            <Text style={styles.detailValue}>8:25 AM</Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: '#8B5CF6' + '20' }]}>
              <FontAwesome5 name="phone" size={16} color="#8B5CF6" />
            </View>
            <Text style={styles.detailLabel}>Contact</Text>
            <Text style={styles.detailValue}>+91 98765 43210</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 16,
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
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  mapContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  map: {
    width: '100%',
    height: 250,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  locationValue: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  mapPlaceholder: {
    backgroundColor: '#ffffff',
    padding: 16,
  },
  mapPlaceholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  locationCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationItemLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
    fontWeight: '500',
  },
  locationItemValue: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  busDetails: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  detailIconText: {
    fontSize: 20,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
});