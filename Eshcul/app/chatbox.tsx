// import React, { useState } from 'react';
// import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';

// interface Message {
//   id: string;
//   text: string;
//   sender: 'student' | 'teacher';
//   time: string;
// }

// export default function ChatBox() {
//   const [messages, setMessages] = useState<Message[]>([
//     { id: '1', text: 'Hello Ma’am, I have a doubt in today’s homework.', sender: 'student', time: '10:01 AM' },
//     { id: '2', text: 'Sure, what’s your doubt?', sender: 'teacher', time: '10:03 AM' },
//   ]);
//   const [inputText, setInputText] = useState('');

//   const handleSend = () => {
//     if (inputText.trim() === '') return;

//     const newMessage: Message = {
//       id: Date.now().toString(),
//       text: inputText,
//       sender: 'student',
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     };

//     setMessages((prev) => [...prev, newMessage]);
//     setInputText('');
//   };

//   const renderItem = ({ item }: { item: Message }) => (
//     <View style={[styles.messageBubble, item.sender === 'student' ? styles.student : styles.teacher]}>
//       <Text style={styles.messageText}>{item.text}</Text>
//       <Text style={styles.messageTime}>{item.time}</Text>
//     </View>
//   );

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       keyboardVerticalOffset={80}
//     >
//       <Text style={styles.header}>Chat with Class Teacher</Text>
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={styles.chatContainer}
//         showsVerticalScrollIndicator={false}
//       />

//       <View style={styles.inputContainer}>
//         <TextInput
//           value={inputText}
//           onChangeText={setInputText}
//           placeholder="Type your message..."
//           style={styles.textInput}
//         />
//         <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
//           <MaterialIcons name="send" size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f1f8e9',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#33691e',
//     padding: 16,
//     backgroundColor: '#dcedc8',
//     textAlign: 'center',
//     elevation: 2,
//   },
//   chatContainer: {
//     padding: 16,
//   },
//   messageBubble: {
//     maxWidth: '75%',
//     padding: 12,
//     marginBottom: 12,
//     borderRadius: 16,
//   },
//   student: {
//     backgroundColor: '#a5d6a7',
//     alignSelf: 'flex-end',
//     borderTopRightRadius: 0,
//   },
//   teacher: {
//     backgroundColor: '#fff',
//     alignSelf: 'flex-start',
//     borderTopLeftRadius: 0,
//     borderWidth: 1,
//     borderColor: '#cfd8dc',
//   },
//   messageText: {
//     fontSize: 16,
//     color: '#212121',
//   },
//   messageTime: {
//     fontSize: 12,
//     color: '#616161',
//     marginTop: 6,
//     textAlign: 'right',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 12,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderColor: '#cfd8dc',
//   },
//   textInput: {
//     flex: 1,
//     backgroundColor: '#f0f4c3',
//     borderRadius: 25,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     marginRight: 10,
//   },
//   sendButton: {
//     backgroundColor: '#558b2f',
//     borderRadius: 25,
//     padding: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  sender: 'student' | 'teacher';
  time: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello Ma’am, I have a doubt in today’s homework.', sender: 'student', time: '10:01 AM' },
    { id: '2', text: 'Sure, what’s your doubt?', sender: 'teacher', time: '10:03 AM' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'student',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer, 
      item.sender === 'student' ? styles.studentContainer : styles.teacherContainer
    ]}>
      <View style={[
        styles.messageBubble, 
        item.sender === 'student' ? styles.studentBubble : styles.teacherBubble
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>💬</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Chat with Teacher</Text>
          <Text style={styles.headerSubtitle}>Online - Class Teacher</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#94a3b8"
          style={styles.textInput}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <MaterialIcons name="send" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerIconText: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  studentContainer: {
    alignItems: 'flex-end',
  },
  teacherContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  studentBubble: {
    backgroundColor: '#3B82F6',
    borderTopRightRadius: 4,
  },
  teacherBubble: {
    backgroundColor: '#f1f5f9',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  studentText: {
    color: '#ffffff',
  },
  teacherText: {
    color: '#1e293b',
  },
  messageTime: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    maxHeight: 100,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});