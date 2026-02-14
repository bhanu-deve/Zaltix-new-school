// import { Stack } from 'expo-router';

// import { ThemeProvider } from '@react-navigation/native';
// import Toast from 'react-native-toast-message';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { DarkTheme, DefaultTheme } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import * as Notifications from 'expo-notifications';
// import { useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { socket } from '@/api/socket';
// import { LanguageProvider } from './language';


// Notifications.setNotificationHandler({
//   handleNotification: async () => {
//     const enabled = await AsyncStorage.getItem('notificationsEnabled');

//     if (enabled === 'false') {
//       return {
//         shouldShowBanner: false,
//         shouldShowList: false,
//         shouldPlaySound: false,
//         shouldSetBadge: false,
//       };
//     }

//     return {
//       shouldShowBanner: true,
//       shouldShowList: true,
//       shouldPlaySound: true,
//       shouldSetBadge: true,
//     };
    
//   },
  
// });



// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//     useEffect(() => {
//       // 🔔 Ask notification permission
//       Notifications.requestPermissionsAsync();

//       // 🔌 JOIN SOCKET ROOM (CLASS-SECTION)
//       const joinSocketRoom = async () => {
//         try {
//           const studentRaw = await AsyncStorage.getItem('student');
//           if (!studentRaw) return;

//           const student = JSON.parse(studentRaw);
//           const room = `${student.grade}-${student.section}`; // example: 10-A

//           socket.emit('join-class', room);
//           console.log('Joined socket room:', room);
//         } catch (e) {
//           console.log('Socket join error:', e);
//         }
//       };

//       joinSocketRoom();

//       // return () => {
//       //   socket.disconnect(); // cleanup
//       // };
//     }, []);


//   if (!loaded) return null;

//   return (
//     <LanguageProvider>
//       <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//         <>
        
//           <Stack>
//             <Stack.Screen name="index" options={{ headerShown: false }} />
//             <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//           </Stack>
//           <Toast />
        
//         </>
//       </ThemeProvider>
//     </LanguageProvider>
//   );
// }



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
  handleNotification: async () => {
    const enabled = await AsyncStorage.getItem('notificationsEnabled');
    if (enabled === 'false') {
      return {
        shouldShowBanner: false,
        shouldShowList: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      };
    }
    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    Notifications.requestPermissionsAsync();
    
    const joinSocketRoom = async () => {
      try {
        const studentRaw = await AsyncStorage.getItem('student');
        if (!studentRaw) return;
        const student = JSON.parse(studentRaw);
        const room = `${student.grade}-${student.section}`;
        socket.emit('join-class', room);
        console.log('Joined socket room:', room);
      } catch (e) {
        console.log('Socket join error:', e);
      }
    };
    joinSocketRoom();
  }, []);

  if (!loaded) return null;

  return (
    <LanguageProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            
            {/* ✅ ADD THIS LINE - Hide header for holidays screen */}
            <Stack.Screen 
              name="holidays" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="inventory" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="chatbox" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen name="feedback" options={{ headerShown: false }} />
            <Stack.Screen name="achievements" options={{ headerShown: false }} />
            <Stack.Screen name="reports" options={{ headerShown: false }} />
            <Stack.Screen name="ebooks" options={{ headerShown: false }} />
            <Stack.Screen name="attendance" options={{ headerShown: false }} />
            <Stack.Screen name="fee" options={{ headerShown: false }} />
            <Stack.Screen name="timetable" options={{ headerShown: false }} />
            <Stack.Screen name="dairy" options={{ headerShown: false }} />
            <Stack.Screen name="project" options={{ headerShown: false }} />
            <Stack.Screen name="videos" options={{ headerShown: false }} />
            <Stack.Screen name="bus-tracking" options={{ headerShown: false }} />
            {/* Add any other screens that need header hidden */}
            {/* <Stack.Screen name="attendance" options={{ headerShown: false }} /> */}
            {/* <Stack.Screen name="fees" options={{ headerShown: false }} /> */}
          </Stack>
          <Toast />
        </>
      </ThemeProvider>
    </LanguageProvider>
  );
}