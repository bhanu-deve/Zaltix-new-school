import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/api/api';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // 🔔 SYSTEM (TOP BAR) NOTIFICATION
  useEffect(() => {
    // ask permission once
    Notifications.requestPermissionsAsync();

    const interval = setInterval(async () => {
      try {
        const studentRaw = await AsyncStorage.getItem('student');
        if (!studentRaw) return;

        const student = JSON.parse(studentRaw);
        const studentClass = `${student.grade}-${student.section}`; // 10-A

        const lastSeen = await AsyncStorage.getItem('lastNotificationTime');

        const res = await api.get('/AddNotification');
        if (!Array.isArray(res.data) || res.data.length === 0) return;

        // class-wise filter
        const filtered = res.data.filter(
          (n: any) => n.audience === 'ALL' || n.audience === studentClass
        );

        if (filtered.length === 0) return;

        // latest notification
        const latest = filtered.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )[0];

        const latestTime = new Date(latest.createdAt).getTime();

        if (!lastSeen || latestTime > Number(lastSeen)) {
          // 🔔 show system notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: latest.title,
              body: latest.message,
            },
            trigger: null,
          });

          await AsyncStorage.setItem(
            'lastNotificationTime',
            latestTime.toString()
          );
        }
      } catch (e) {
        // silent fail (safe)
      }
    }, 5000); // every 5 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
