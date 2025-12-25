// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import DropDownPicker from 'react-native-dropdown-picker';
// // import axios from 'axios';
// import Toast from 'react-native-toast-message';
// // import {Api_url} from './config/config.js'
// import  api  from "@/api/api";

// const FeedbackScreen = () => {
//   const [feedback, setFeedback] = useState('');
//   const [rating, setRating] = useState(0);
//   const [open, setOpen] = useState(false);
//   const [selectedTeacher, setSelectedTeacher] = useState(null);
//   const [teachers, setTeachers] = useState([
//     { label: 'Mr. Ramesh (Math)', value: 'ramesh' },
//     { label: 'Ms. Priya (Science)', value: 'priya' },
//     { label: 'Mr. Kiran (English)', value: 'kiran' },
//     { label: 'Ms. Sneha (Computer)', value: 'sneha' },
//   ]);

//   const handleSubmit = async () => {
//     if (!selectedTeacher || !feedback || rating === 0) {
//       Toast.show({
//         type: 'error',
//         text1: 'Incomplete Form',
//         text2: 'Please complete all fields before submitting.',
//       });
//       return;
//     }

//     try {
//       const res = await api.post(`/studentfeedback`, {
//         teacher: selectedTeacher,
//         feedback,
//         rating,
//       });

//       Toast.show({
//         type: 'success',
//         text1: 'Success',
//         text2: res.data.message || 'Feedback submitted successfully!',
//       });

//       // Reset fields
//       setFeedback('');
//       setRating(0);
//       setSelectedTeacher(null);
//     } catch (err) {
//       console.error(err);
//       Toast.show({
//         type: 'error',
//         text1: 'Submission Failed',
//         text2: 'Could not submit feedback. Try again.',
//       });
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.title}>Give Feedback on Teachers</Text>

//         <DropDownPicker
//           open={open}
//           value={selectedTeacher}
//           items={teachers}
//           setOpen={setOpen}
//           setValue={setSelectedTeacher}
//           setItems={setTeachers}
//           placeholder="Select a Teacher"
//           style={styles.dropdown}
//           dropDownContainerStyle={{ borderColor: '#ccc' }}
//         />

//         <Text style={styles.label}>Your Feedback</Text>
//         <TextInput
//           style={styles.textInput}
//           multiline
//           numberOfLines={5}
//           value={feedback}
//           onChangeText={setFeedback}
//           placeholder="Write your feedback here..."
//           placeholderTextColor="#888"
//         />

//         <Text style={styles.label}>Rate the Teacher</Text>
//         <View style={styles.ratingContainer}>
//           {[1, 2, 3, 4, 5].map((num) => (
//             <TouchableOpacity key={num} onPress={() => setRating(num)}>
//               <Ionicons
//                 name={num <= rating ? 'star' : 'star-outline'}
//                 size={32}
//                 color="#fdd835"
//                 style={{ marginHorizontal: 6 }}
//               />
//             </TouchableOpacity>
//           ))}
//         </View>

//         <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//           <Text style={styles.buttonText}>Submit Feedback</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* Toast Container */}
//       <Toast />
//     </SafeAreaView>
//   );
// };

// export default FeedbackScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f7f9fc',
//   },
//   scrollContainer: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#2575fc',
//     textAlign: 'center',
//   },
//   dropdown: {
//     marginBottom: 20,
//     borderColor: '#ccc',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 6,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 16,
//     backgroundColor: '#fff',
//     marginBottom: 20,
//     textAlignVertical: 'top',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     marginBottom: 24,
//   },
//   button: {
//     backgroundColor: '#2575fc',
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#2575fc',
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 17,
//     fontWeight: '600',
//   },
// });
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
// import axios from 'axios';
import Toast from 'react-native-toast-message';
// import {Api_url} from './config/config.js'
import  api  from "@/api/api";

const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teachers, setTeachers] = useState([
    { label: 'Mr. Ramesh (Math)', value: 'ramesh' },
    { label: 'Ms. Priya (Science)', value: 'priya' },
    { label: 'Mr. Kiran (English)', value: 'kiran' },
    { label: 'Ms. Sneha (Computer)', value: 'sneha' },
  ]);

  const handleSubmit = async () => {
    if (!selectedTeacher || !feedback || rating === 0) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Form',
        text2: 'Please complete all fields before submitting.',
      });
      return;
    }

    try {
      const res = await api.post(`/studentfeedback`, {
        teacher: selectedTeacher,
        feedback,
        rating,
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: res.data.message || 'Feedback submitted successfully!',
      });

      // Reset fields
      setFeedback('');
      setRating(0);
      setSelectedTeacher(null);
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: 'Could not submit feedback. Try again.',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>💬</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Teacher Feedback</Text>
          <Text style={styles.headerSubtitle}>Share your experience with teachers</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <View style={styles.section}>
            <Text style={styles.label}>Select Teacher</Text>
            <DropDownPicker
              open={open}
              value={selectedTeacher}
              items={teachers}
              setOpen={setOpen}
              setValue={setSelectedTeacher}
              setItems={setTeachers}
              placeholder="Choose a teacher"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Your Feedback</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={5}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Write your feedback here..."
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Rate the Teacher</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity 
                  key={num} 
                  onPress={() => setRating(num)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={num <= rating ? 'star' : 'star-outline'}
                    size={28}
                    color={num <= rating ? '#F59E0B' : '#cbd5e1'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingText}>
              {rating === 0 ? 'Select a rating' : `${rating} out of 5 stars`}
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Toast />
    </SafeAreaView>
  );
};

export default FeedbackScreen;

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
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  dropdown: {
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    minHeight: 46,
  },
  dropdownContainer: {
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1e293b',
  },
  dropdownPlaceholder: {
    color: '#94a3b8',
    fontSize: 14,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#ffffff',
    textAlignVertical: 'top',
    minHeight: 120,
    color: '#1e293b',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starButton: {
    padding: 8,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});