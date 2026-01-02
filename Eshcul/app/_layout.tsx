import { Stack } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket } from '@/api/socket';
import { LanguageProvider } from './language';

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,   // popup
    shouldPlaySound: true,
    shouldSetBadge: false,  // ❌ no app icon badge
    shouldShowBanner: true, // iOS banner
    shouldShowList: true,   // iOS notification list
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

    useEffect(() => {
      // 🔔 Ask notification permission
      Notifications.requestPermissionsAsync();

      // 🔌 JOIN SOCKET ROOM (CLASS-SECTION)
      const joinSocketRoom = async () => {
        try {
          const studentRaw = await AsyncStorage.getItem('student');
          if (!studentRaw) return;

          const student = JSON.parse(studentRaw);
          const room = `${student.grade}-${student.section}`; // example: 10-A

          socket.emit('join-class', room);
          console.log('Joined socket room:', room);
        } catch (e) {
          console.log('Socket join error:', e);
        }
      };

      joinSocketRoom();

      // return () => {
      //   socket.disconnect(); // cleanup
      // };
    }, []);


  if (!loaded) return null;

  return (
    <LanguageProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <>
        
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <Toast />
        
        </>
      </ThemeProvider>
    </LanguageProvider>
  );
}
