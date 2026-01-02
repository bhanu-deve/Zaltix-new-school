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
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { useLang } from "./language";
/* ================= TYPES ================= */
interface Message {
  id: string;
  text: string;
  type: "user" | "bot";
  time: string;
}

/* ================= CHATBOT INTENTS ================= */
const chatbotIntents: Record<string, () => Promise<string>> = {};

/* ================= COMPONENT ================= */
export default function ChatBox() {
  const { t } = useLang();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  /* ============ WELCOME MESSAGE ============ */
  useEffect(() => {
    const loadStudent = async () => {
      const stored = await AsyncStorage.getItem("student");
      const student = JSON.parse(stored || "{}");

      setMessages([
        {
          id: "welcome",
          text: `👋 ${t.welcomeToSchool}${t.hi} ${student?.name || t.student}, ${t.askQuestion}`,
          type: "bot",
          time: getTime(),
        },
      ]);
    };
    loadStudent();
  }, []);

    /* ================= HELPERS ================= */
  const getStudent = async () => {
    const stored = await AsyncStorage.getItem("student");
    return JSON.parse(stored || "{}");
  };

  /* ================= HANDLERS ================= */

  chatbotIntents.attendance = async () => {
    const student = await getStudent();
    const res = await api.get("/attendance/by-roll", {
      params: { rollNumber: student.rollNumber },
    });

    const days = res.data?.attendance || [];
    const present = days.filter((d: any) =>
      d.subjects?.some((s: any) => s.present)
    ).length;

    return `📊 Attendance\nPresent: ${present}/${days.length}\nPercentage: ${
      days.length ? ((present / days.length) * 100).toFixed(2) : 0
    }%`;
  };

  chatbotIntents.subjects = async () => {
    const res = await api.get("/subjects");
    return `📚 Subjects Offered:\n${res.data
      .map((s: any) => `• ${s.name}`)
      .join("\n")}`;
  };

  chatbotIntents.achievements = async () => {
    const res = await api.get("/achievements");
    return `🏆 Achievements:\n${res.data
      .slice(0, 5)
      .map((a: any) => `• ${a.title}`)
      .join("\n")
    }`;
  };

  chatbotIntents.ebooks = async () => {
    try {
      const res = await api.get("/AddEbook");

      const ebooks = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.ebooks || [];

      if (!ebooks.length) return `📘 ${t.noEbooks}`;


      return (
        "📘 eBooks:\n" +
        ebooks
          .slice(0, 5)
          .map((e: any) => `• ${e.title} (${e.subject})`)
          .join("\n")
      );
    } catch {
      return "📘 eBooks not available.";
    }
  };


  chatbotIntents.fee = async () => {
    return `💰 Fee Module\nYou can view invoices & payment status in Fee section.`;
  };

  chatbotIntents.inventory = async () => {
    const res = await api.get("/Addstock");
    const items = Array.isArray(res.data) ? res.data : res.data?.data || [];

    if (!items.length) return "🎒 Inventory is empty.";

    return (
      "🎒 Inventory Items:\n" +
      items
        .slice(0, 10)
        .map((i: any) => `• ${i.item} (Qty: ${i.minStock})`)
        .join("\n")
    );
  };


  chatbotIntents.mocktest = async () => {
    const res = await api.get("/AddTest");
    const tests = Array.isArray(res.data) ? res.data : res.data?.tests || [];

    if (!tests.length) return "📝 No mock tests available.";

    return (
      "📝 Upcoming Mock Tests:\n" +
      tests
        .slice(0, 5)
        .map(
          (t: any) =>
            `• ${t.title}\n  Subject: ${t.subject}\n  Date: ${new Date(
              t.date
            ).toLocaleDateString()}`
        )
        .join("\n\n")
    );
  };


  chatbotIntents.notifications = async () => {
    const res = await api.get("/AddNotification");
    const notes = Array.isArray(res.data) ? res.data : res.data?.data || [];

    if (!notes.length) return "🔔 No notifications found.";

    return (
      "🔔 Notifications:\n" +
      notes
        .slice(0, 5)
        .map((n: any) => `• ${n.title}\n  ${n.message}`)
        .join("\n\n")
    );
  };


  chatbotIntents.reports = async () => {
    try {
      const student = await getStudent();
      const res = await api.get("/grades/by-roll", {
        params: { rollNumber: student.rollNumber },
      });

      const r = res.data;

      return (
        "📄 Report Summary\n" +
        `Math: ${r.math}\n` +
        `Science: ${r.science}\n` +
        `English: ${r.english}\n` +
        `Total: ${r.totalMarks}\n` +
        `Grade: ${r.grade}`
      );
    } catch {
      return "📄 Report not available yet.";
    }
  };



  chatbotIntents.timetable = async () => {
    const studentStr = await AsyncStorage.getItem("student");
    const student = JSON.parse(studentStr || "{}");

    // Adjust class/section logic if needed
    const className = student.class || "10A";

    const res = await api.get(`/timetable/${className}`);
    const timetable = res.data?.data;

    if (!timetable || !timetable.entries) {
      return "📅 Timetable not available.";
    }

    let response = "📅 Weekly Timetable:\n\n";

    Object.entries(timetable.entries).forEach(
      ([day, subjects]: [string, any]) => {
        response += `📌 ${day}\n`;
        subjects.forEach((sub: string, index: number) => {
          response += `  ${index + 1}. ${sub}\n`;
        });
        response += "\n";
      }
    );

    return response;
  };


  chatbotIntents.videos = async () => {
    const res = await api.get("/videos");
    return `🎥 Video Lessons Available: ${res.data.length}`;
  };

  /* ================= INTENT DETECTOR ================= */
  const detectIntent = (msg: string) => {
    const t = msg.toLowerCase();
    if (t.includes("attendance")) return "attendance";
    if (t.includes("subject")) return "subjects";
    if (t.includes("achievement") || t.includes("achivement")) return "achievements";
    if (t.includes("ebook")) return "ebooks";
    if (t.includes("fee")) return "fee";
    if (t.includes("inventory")) return "inventory";
    if (t.includes("mock")) return "mocktest";
    if (t.includes("notification")) return "notifications";
    if (t.includes("report")) return "reports";
    if (t.includes("timetable")) return "timetable";
    if (t.includes("video")) return "videos";
    return "unknown";
  };


  /* ============ SEND MESSAGE ============ */
  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      type: "user",
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    const intent = detectIntent(inputText);
    let reply = t.chatbotHelp;

    if (chatbotIntents[intent]) {
      reply = await chatbotIntents[intent]();
    }

    const botMsg: Message = {
      id: Date.now().toString() + "_bot",
      text: reply,
      type: "bot",
      time: getTime(),
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  /* ============ RENDER ============ */
  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.type === "user" ? styles.userAlign : styles.botAlign,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.type === "user" ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.type === "user" && { color: "#fff" },
          ]}
        >
          {item.text}
        </Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>💬</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>{t.chatbot}</Text>
          <Text style={styles.headerSubtitle}>{t.schoolAssistant}</Text>

        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder={t.typeMessage}
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

/* ================= HELPERS ================= */
const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ================= STYLES (UNCHANGED UI) ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerIconText: { fontSize: 22 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  headerSubtitle: { fontSize: 13, color: "#64748b", marginTop: 2 },
  chatContainer: { paddingHorizontal: 16, paddingVertical: 16 },
  messageContainer: { marginBottom: 16 },
  userAlign: { alignItems: "flex-end" },
  botAlign: { alignItems: "flex-start" },
  messageBubble: { maxWidth: "80%", padding: 12, borderRadius: 16 },
  userBubble: { backgroundColor: "#3B82F6", borderTopRightRadius: 4 },
  botBubble: { backgroundColor: "#f1f5f9", borderTopLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 20, color: "#1e293b" },
  messageTime: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    maxHeight: 100,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
});
