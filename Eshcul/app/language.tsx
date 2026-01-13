import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Lang = 'en' | 'hi' | 'te';

const translations = {
  en: {
    home: 'Home',
    settings: 'Settings',
    language: 'Language',
    logout: 'Logout',
    attendance: 'Attendance',
    fees: 'Fees',
    notifications: 'Notifications',
    changePassword: 'Change Password',

    loggingOut: 'Logging out...',
    redirecting: 'Redirecting...',
    missingFields: 'Missing Fields',
    fillAll: 'Please fill all fields',
    passwordMismatch: 'Password Mismatch',
    passwordNotMatch: 'Passwords do not match',
    passwordLength: 'Password must be at least 6 characters',
    passwordUpdated: 'Password Updated',
    passwordSuccess: 'Password updated successfully',
    passwordFailed: 'Password update failed',
    helpSupport: 'Help & Support',
    appInfo: 'App Info',
    oldPassword: 'Old Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    updatePassword: 'Update Password',
    welcome: 'Welcome',

    timetable: 'Timetable',
    reports: 'Reports',
    'project-work': 'Project Work',
    'videos-gallery': 'Videos / Gallery',
    'mock-test': 'Mock Test',
    'e-books': 'E Books',
    achievements: 'Achievements',
    'bus-tracking': 'Bus Tracking',
    feedback: 'Feedback',
    inventory: 'Inventory',
    'chat-box': 'Chat Box',
    dairy: 'Diary',

    student: 'Student',
    date: 'Date',
    description: 'Description',
    viewAchievement: 'View Achievement',
    noAchievements: 'No achievements found',
    checkLater: 'Check back later',
    close: 'Close',
    error: 'Error',
    failedToLoad: 'Failed to load achievements',
    untitled: 'Untitled',
    unknown: 'Unknown',
    imagePreview: 'Image Preview',

    schoolName: 'NARAYANA',
    schoolSubTitle: 'Educational Institutions',

    overall: 'Overall',
    present: 'Present',
    absent: 'Absent',
    totalPercentage: 'Total %',
    noData: 'No data',
    detailsFor: 'Details for',

    busTracking: 'Bus Tracking',
    trackBusRealtime: 'Track your school bus in real-time',
    fetchingLocation: 'Fetching location...',
    yourLocation: 'Your Location',
    busLocation: 'Bus Location',
    locationDetails: 'Location Details',
    busDetails: 'Bus Details',
    onTime: 'On Time',
    busNo: 'Bus No',
    driver: 'Driver',
    eta: 'ETA',
    contact: 'Contact',

    welcomeToSchool: 'Welcome to Zaltix School',
    hi: 'Hi',
    askQuestion: 'ask any question',
    chatbotHelp: 'I can help with attendance and school information.',
    chatbot: 'Zaltix Chatbot',
    schoolAssistant: 'School Assistant',
    typeMessage: 'Type your message...',
    noEbooks: 'No eBooks available',

    class: 'Class',
    section: 'Section',
    rollNo: 'Roll No',
    diaryDate: 'Diary Date',
    tapToChooseDate: 'Tap to choose another date',
    homeworkNotes: 'Homework / Notes',
    noDiary: 'No diary entries for this date',

    ebooksLibrary: 'E-Books Library',
    ebooksAvailable: 'e-books available',
    author: 'Author',
    downloadPdf: 'Download PDF',
    // noEbooks: 'No e-books available',
    noEbooksDesc: 'No e-books found in the library',
    failedToLoadEbooks: 'Failed to load e-books. Please check your network.',
    // error: 'Error',
    // untitled: 'Untitled',
    notAvailable: 'Not available',

    totalFees: 'Total Fees',
    paidAmount: 'Paid Amount',
    termsPaid: 'Terms Paid',
    due: 'Due',
    totalAmount: 'Total Amount',
    remaining: 'Remaining',
    invoice: 'Invoice',
    payNow: 'Pay Now',
    paymentSuccessful: 'Payment Successful',
    invoiceFailed: 'Failed to generate invoice',
    status: 'Status',
    dueDate: 'Due Date',

    teacherFeedback: 'Teacher Feedback',
    shareExperience: 'Share your experience with teachers',
    selectTeacher: 'Select Teacher',
    chooseTeacher: 'Choose a teacher',
    yourFeedback: 'Your Feedback',
    writeFeedback: 'Write your feedback here...',
    rateTeacher: 'Rate the Teacher',
    selectRating: 'Select a rating',
    outOf: 'out of',
    stars: 'stars',
    submitFeedback: 'Submit Feedback',
    incompleteForm: 'Incomplete Form',
    completeAllFields: 'Please complete all fields before submitting.',
    success: 'Success',
    feedbackSubmitted: 'Feedback submitted successfully!',
    submissionFailed: 'Submission Failed',
    tryAgain: 'Could not submit feedback. Try again.',

    inventorys: 'Student Inventory',
    itemsInStock: 'items in stock',
    available: 'Available',
    noInventory: 'No inventory items',
    noInventoryDesc: 'No items found in inventory',

    upcomingMockTests: 'Upcoming Mock Tests',
    testsScheduled: 'tests scheduled',
    untitledTest: 'Untitled Test',
    // class: 'Class',
    questions: 'Questions',
    duration: 'Duration',
    minutes: 'mins',
    noMockTests: 'No mock tests available',
    noMockTestsDesc: 'No tests scheduled at the moment',

    noNotifications: 'No notifications',
    failedToLoadNotifications: 'Failed to load notifications',

    noProjects: 'No projects assigned for your class',
    noReport: 'No Report Available',
    noReportDesc: 'Report has not been published for this exam yet.',
    totalMarks: 'Total Marks',
    average: 'Average',
    subject: 'Subject',
    marks: 'Marks',
    grade: 'Grade',
    subjectPerformance: 'Subject Performance',
    overallGrade: 'Overall Grade',

    teacherVideos: 'Teacher Videos',
    videosAvailable: 'videos available',
    noVideos: 'No videos available',
    checkLaters: 'Check back later for new content',
    watchNow: 'Watch Now',

    subjects: {
      mathematics: 'Mathematics',
      science: 'Science',
      english: 'English',
      computer: 'Computer',
      physics: 'Physics',
      chemistry: 'Chemistry',
      biology: 'Biology',
    },

    // timetable: "Timetable",
    // class: "Class",
    // section: "Section",
    year: "Year",
    period: "Period",
    periodShort: "P",
    time: "Time",
    subjectTeacher: "Subject / Teacher",
    noClasses: "No classes",
    subjectsTitle: "Subjects",

    days: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],









  },

  hi: {
    home: 'होम',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    logout: 'लॉग आउट',
    attendance: 'उपस्थिति',
    fees: 'शुल्क',
    notifications: 'सूचनाएं',
    changePassword: 'पासवर्ड बदलें',

    loggingOut: 'लॉग आउट हो रहा है',
    redirecting: 'रीडायरेक्ट किया जा रहा है',
    missingFields: 'जानकारी अधूरी है',
    fillAll: 'सभी फ़ील्ड भरें',
    passwordMismatch: 'पासवर्ड मेल नहीं खाते',
    passwordNotMatch: 'पासवर्ड समान नहीं हैं',
    passwordLength: 'कम से कम 6 अक्षर',
    passwordUpdated: 'पासवर्ड अपडेट हुआ',
    passwordSuccess: 'सफलतापूर्वक अपडेट',
    passwordFailed: 'अपडेट असफल',
    helpSupport: 'सहायता',
    appInfo: 'ऐप जानकारी',
    oldPassword: 'पुराना पासवर्ड',
    newPassword: 'नया पासवर्ड',
    confirmPassword: 'पासवर्ड पुष्टि',
    updatePassword: 'अपडेट करें',
    welcome: 'स्वागत है',

    timetable: 'समय सारणी',
    reports: 'रिपोर्ट',
    'project-work': 'प्रोजेक्ट',
    'videos-gallery': 'वीडियो / गैलरी',
    'mock-test': 'मॉक टेस्ट',
    'e-books': 'ई-बुक',
    achievements: 'उपलब्धियां',
    'bus-tracking': 'बस ट्रैकिंग',
    feedback: 'प्रतिक्रिया',
    inventory: 'स्टॉक',
    'chat-box': 'चैट बॉक्स',
    dairy: 'डायरी',

    student: 'छात्र',
    date: 'तिथि',
    description: 'विवरण',
    viewAchievement: 'उपलब्धि देखें',
    noAchievements: 'कोई उपलब्धि नहीं मिली',
    checkLater: 'नई उपलब्धियों के लिए बाद में देखें',
    close: 'बंद करें',
    error: 'त्रुटि',
    failedToLoad: 'उपलब्धियाँ लोड नहीं हो सकीं',
    untitled: 'बिना शीर्षक',
    unknown: 'अज्ञात',
    imagePreview: 'चित्र पूर्वावलोकन',

    schoolName: 'नारायणा',
    schoolSubTitle: 'शैक्षणिक संस्थान',

    overall: 'कुल',
    present: 'उपस्थित',
    absent: 'अनुपस्थित',
    totalPercentage: 'कुल प्रतिशत',
    noData: 'कोई डेटा नहीं',
    detailsFor: 'विवरण:',

    busTracking: 'बस ट्रैकिंग',
    trackBusRealtime: 'अपने स्कूल बस को रियल-टाइम में ट्रैक करें',
    fetchingLocation: 'स्थान प्राप्त किया जा रहा है...',
    yourLocation: 'आपका स्थान',
    busLocation: 'बस का स्थान',
    locationDetails: 'स्थान विवरण',
    busDetails: 'बस विवरण',
    onTime: 'समय पर',
    busNo: 'बस नंबर',
    driver: 'चालक',
    eta: 'अनुमानित समय',
    contact: 'संपर्क',

    welcomeToSchool: 'ज़ाल्टिक्स स्कूल में आपका स्वागत है',
    hi: 'नमस्ते',
    askQuestion: 'कोई भी प्रश्न पूछें',
    chatbotHelp: 'मैं उपस्थिति और स्कूल जानकारी में मदद कर सकता हूँ',
    chatbot: 'ज़ाल्टिक्स चैटबॉट',
    schoolAssistant: 'स्कूल सहायक',
    typeMessage: 'अपना संदेश लिखें...',
    noEbooks: 'कोई ई-बुक उपलब्ध नहीं है',

    class: 'कक्षा',
    section: 'सेक्शन',
    rollNo: 'रोल नंबर',
    diaryDate: 'डायरी तिथि',
    tapToChooseDate: 'दूसरी तारीख चुनने के लिए टैप करें',
    homeworkNotes: 'होमवर्क / नोट्स',
    noDiary: 'इस तारीख के लिए कोई डायरी नहीं है',

    ebooksLibrary: 'ई-बुक्स लाइब्रेरी',
    ebooksAvailable: 'ई-बुक उपलब्ध',
    author: 'लेखक',
    downloadPdf: 'पीडीएफ डाउनलोड करें',
    // noEbooks: 'कोई ई-बुक उपलब्ध नहीं',
    noEbooksDesc: 'लाइब्रेरी में कोई ई-बुक नहीं मिली',
    failedToLoadEbooks: 'ई-बुक लोड नहीं हो सकीं',
    // error: 'त्रुटि',
    // untitled: 'बिना शीर्षक',
    notAvailable: 'उपलब्ध नहीं',

    totalFees: 'कुल शुल्क',
    paidAmount: 'भुगतान राशि',
    termsPaid: 'भुगतान किए गए टर्म',
    due: 'देय',
    totalAmount: 'कुल राशि',
    remaining: 'शेष राशि',
    invoice: 'इनवॉइस',
    payNow: 'अभी भुगतान करें',
    paymentSuccessful: 'भुगतान सफल',
    invoiceFailed: 'इनवॉइस नहीं बन सका',
    status: 'स्थिति',
    dueDate: 'देय तिथि',
    teacherFeedback: 'शिक्षक प्रतिक्रिया',
    shareExperience: 'शिक्षकों के साथ अपना अनुभव साझा करें',
    selectTeacher: 'शिक्षक चुनें',
    chooseTeacher: 'शिक्षक चुनें',
    yourFeedback: 'आपकी प्रतिक्रिया',
    writeFeedback: 'यहाँ अपनी प्रतिक्रिया लिखें...',
    rateTeacher: 'शिक्षक को रेट करें',
    selectRating: 'रेटिंग चुनें',
    outOf: 'में से',
    stars: 'स्टार',
    submitFeedback: 'प्रतिक्रिया भेजें',
    incompleteForm: 'अधूरा फॉर्म',
    completeAllFields: 'सब फ़ील्ड भरें',
    success: 'सफल',
    feedbackSubmitted: 'प्रतिक्रिया सफलतापूर्वक भेजी गई',
    submissionFailed: 'भेजना असफल',
    tryAgain: 'फिर से प्रयास करें',

    inventorys: 'छात्र स्टॉक',
    itemsInStock: 'आइटम उपलब्ध',
    available: 'उपलब्ध',
    noInventory: 'कोई स्टॉक उपलब्ध नहीं',
    noInventoryDesc: 'इन्वेंटरी में कोई आइटम नहीं मिला',

    upcomingMockTests: 'आगामी मॉक टेस्ट',
    testsScheduled: 'टेस्ट निर्धारित हैं',
    untitledTest: 'शीर्षक रहित टेस्ट',
    // class: 'कक्षा',
    questions: 'प्रश्न',
    duration: 'अवधि',
    minutes: 'मिनट',
    noMockTests: 'कोई मॉक टेस्ट उपलब्ध नहीं',
    noMockTestsDesc: 'फिलहाल कोई टेस्ट निर्धारित नहीं है',

    noNotifications: 'कोई सूचनाएं नहीं',
    failedToLoadNotifications: 'सूचनाएं लोड नहीं हो सकीं',

    noProjects: 'आपकी कक्षा के लिए कोई प्रोजेक्ट नहीं है',

    noReport: 'रिपोर्ट उपलब्ध नहीं है',
    noReportDesc: 'इस परीक्षा के लिए अभी रिपोर्ट जारी नहीं हुई है',
    totalMarks: 'कुल अंक',
    average: 'औसत',
    subject: 'विषय',
    marks: 'अंक',
    grade: 'ग्रेड',
    subjectPerformance: 'विषय प्रदर्शन',
    overallGrade: 'कुल ग्रेड',

    teacherVideos: 'शिक्षक वीडियो',
    videosAvailable: 'वीडियो उपलब्ध हैं',
    noVideos: 'कोई वीडियो उपलब्ध नहीं है',
    checkLaters: 'नए वीडियो के लिए बाद में देखें',
    watchNow: 'अभी देखें',

    subjects: {
      mathematics: 'गणित',
      science: 'विज्ञान',
      english: 'अंग्रेज़ी',
      computer: 'कंप्यूटर',
      physics: 'भौतिकी',
      chemistry: 'रसायन विज्ञान',
      biology: 'जीवविज्ञान',
    },
    // timetable: "समय सारणी",
    // class: "कक्षा",
    // section: "सेक्शन",
    year: "वर्ष",
    period: "पीरियड",
    periodShort: "पी",
    time: "समय",
    subjectTeacher: "विषय / शिक्षक",
    noClasses: "आज कोई कक्षा नहीं है",
    subjectsTitle: "विषय",

    days: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],












  },

  te: {
    home: 'హోమ్',
    settings: 'సెట్టింగ్స్',
    language: 'భాష',
    logout: 'లాగ్ అవుట్',
    attendance: 'హాజరు',
    fees: 'ఫీజులు',
    notifications: 'నోటిఫికేషన్లు',
    changePassword: 'పాస్‌వర్డ్ మార్చండి',

    loggingOut: 'లాగ్ అవుట్ అవుతోంది',
    redirecting: 'మళ్లిస్తున్నాం',
    missingFields: 'ఖాళీ ఫీల్డ్స్',
    fillAll: 'అన్ని ఫీల్డ్స్ నింపండి',
    passwordMismatch: 'పాస్‌వర్డ్ సరిపోలలేదు',
    passwordNotMatch: 'పాస్‌వర్డ్ ఒకేలా లేవు',
    passwordLength: 'కనీసం 6 అక్షరాలు',
    passwordUpdated: 'పాస్‌వర్డ్ అప్డేట్ అయింది',
    passwordSuccess: 'విజయవంతం',
    passwordFailed: 'విఫలమైంది',
    helpSupport: 'సహాయం',
    appInfo: 'యాప్ సమాచారం',
    oldPassword: 'పాత పాస్‌వర్డ్',
    newPassword: 'కొత్త పాస్‌వర్డ్',
    confirmPassword: 'పాస్‌వర్డ్ నిర్ధారణ',
    updatePassword: 'అప్డేట్',
    welcome: 'స్వాగతం',

    timetable: 'టైమ్‌టేబుల్',
    reports: 'రిపోర్ట్స్',
    'project-work': 'ప్రాజెక్ట్',
    'videos-gallery': 'వీడియోలు / గ్యాలరీ',
    'mock-test': 'మాక్ టెస్ట్',
    'e-books': 'ఈ-బుక్స్',
    achievements: 'విజయాలు',
    'bus-tracking': 'బస్ ట్రాకింగ్',
    feedback: 'ఫీడ్‌బ్యాక్',
    inventory: 'ఇన్వెంటరీ',
    'chat-box': 'చాట్ బాక్స్',
    dairy: 'డైరీ',

    student: 'విద్యార్థి',
    date: 'తేదీ',
    description: 'వివరణ',
    viewAchievement: 'విజయం చూడండి',
    noAchievements: 'విజయాలు కనుగొనబడలేదు',
    checkLater: 'కొత్త విజయాల కోసం తర్వాత చూడండి',
    close: 'మూసివేయి',
    error: 'లోపం',
    failedToLoad: 'విజయాలను లోడ్ చేయలేకపోయాం',
    untitled: 'శీర్షిక లేదు',
    unknown: 'తెలియదు',
    imagePreview: 'చిత్ర ప్రివ్యూ',

    schoolName: 'నారాయణ',
    schoolSubTitle: 'విద్యా సంస్థలు',

    overall: 'మొత్తం',
    present: 'హాజరు',
    absent: 'గైర్హాజరు',
    totalPercentage: 'మొత్తం శాతం',
    noData: 'డేటా లేదు',
    detailsFor: 'వివరాలు:',

    busTracking: 'బస్ ట్రాకింగ్',
    trackBusRealtime: 'మీ పాఠశాల బస్సును ప్రత్యక్షంగా ట్రాక్ చేయండి',
    fetchingLocation: 'స్థానం పొందుతున్నాం...',
    yourLocation: 'మీ స్థానం',
    busLocation: 'బస్ స్థానం',
    locationDetails: 'స్థాన వివరాలు',
    busDetails: 'బస్ వివరాలు',
    onTime: 'సమయానికి',
    busNo: 'బస్ నంబర్',
    driver: 'డ్రైవర్',
    eta: 'అంచనా సమయం',
    contact: 'సంప్రదింపు',

    welcomeToSchool: 'జాల్టిక్స్ స్కూల్‌కు స్వాగతం',
    hi: 'హాయ్',
    askQuestion: 'ఏ ప్రశ్నైనా అడగండి',
    chatbotHelp: 'హాజరు మరియు పాఠశాల సమాచారం అందించగలను',
    chatbot: 'జాల్టిక్స్ చాట్‌బాట్',
    schoolAssistant: 'పాఠశాల సహాయకుడు',
    typeMessage: 'మీ సందేశాన్ని టైప్ చేయండి...',
    noEbooks: 'ఈ-బుక్స్ లేవు',

    class: 'తరగతి',
    section: 'విభాగం',
    rollNo: 'రోల్ నంబర్',
    diaryDate: 'డైరీ తేదీ',
    tapToChooseDate: 'ఇతర తేదీని ఎంచుకోవడానికి ట్యాప్ చేయండి',
    homeworkNotes: 'హోంవర్క్ / నోట్స్',
    noDiary: 'ఈ తేదీకి డైరీ లేదు',

    ebooksLibrary: 'ఈ-బుక్స్ లైబ్రరీ',
    ebooksAvailable: 'ఈ-బుక్స్ అందుబాటులో ఉన్నాయి',
    author: 'రచయిత',
    downloadPdf: 'PDF డౌన్‌లోడ్',
    // noEbooks: 'ఈ-బుక్స్ లేవు',
    noEbooksDesc: 'లైబ్రరీలో ఈ-బుక్స్ లభించలేదు',
    failedToLoadEbooks: 'ఈ-బుక్స్ లోడ్ చేయలేకపోయాం',
    // error: 'లోపం',
    // untitled: 'శీర్షిక లేదు',
    notAvailable: 'అందుబాటులో లేదు',

    totalFees: 'మొత్తం ఫీజు',
    paidAmount: 'చెల్లించిన మొత్తం',
    termsPaid: 'చెల్లించిన టర్ములు',
    due: 'చెల్లించాల్సిన తేదీ',
    totalAmount: 'మొత్తం మొత్తం',
    remaining: 'మిగిలిన మొత్తం',
    invoice: 'ఇన్వాయిస్',
    payNow: 'ఇప్పుడు చెల్లించండి',
    paymentSuccessful: 'చెల్లింపు విజయవంతం',
    invoiceFailed: 'ఇన్వాయిస్ రూపొందించలేకపోయాం',
    status: 'స్థితి',  
    dueDate: 'చెల్లించాల్సిన తేదీ',
    teacherFeedback: 'గురువు అభిప్రాయం',
    shareExperience: 'గురువులతో మీ అనుభవాన్ని పంచుకోండి',
    selectTeacher: 'గురువును ఎంచుకోండి',
    chooseTeacher: 'గురువును ఎంచుకోండి',
    yourFeedback: 'మీ అభిప్రాయం',
    writeFeedback: 'మీ అభిప్రాయాన్ని ఇక్కడ వ్రాయండి...',
    rateTeacher: 'గురువుకు రేటింగ్ ఇవ్వండి',
    selectRating: 'రేటింగ్ ఎంచుకోండి',
    outOf: 'లో',
    stars: 'నక్షత్రాలు',
    submitFeedback: 'అభిప్రాయం పంపండి',
    incompleteForm: 'అపూర్తి ఫారం',
    completeAllFields: 'అన్ని ఫీల్డ్స్ నింపండి',
    success: 'విజయం',
    feedbackSubmitted: 'అభిప్రాయం విజయవంతంగా పంపబడింది',
    submissionFailed: 'పంపడం విఫలమైంది',
    tryAgain: 'మళ్లీ ప్రయత్నించండి',
    inventorys: 'విద్యార్థి ఇన్వెంటరీ',
    itemsInStock: 'అంశాలు స్టాక్‌లో ఉన్నాయి',
    available: 'అందుబాటులో',
    noInventory: 'ఇన్వెంటరీ లేదు',
    noInventoryDesc: 'ఇన్వెంటరీలో అంశాలు లేవు',

    upcomingMockTests: 'రాబోయే మాక్ పరీక్షలు',
    testsScheduled: 'పరీక్షలు షెడ్యూల్ అయ్యాయి',
    untitledTest: 'శీర్షిక లేని పరీక్ష',
    // class: 'తరగతి',
    questions: 'ప్రశ్నలు',
    duration: 'వ్యవధి',
    minutes: 'నిమిషాలు',
    noMockTests: 'మాక్ పరీక్షలు లేవు',
    noMockTestsDesc: 'ప్రస్తుతం పరీక్షలు షెడ్యూల్ కాలేదు',

    noNotifications: 'నోటిఫికేషన్లు లేవు',
    failedToLoadNotifications: 'నోటిఫికేషన్లు లోడ్ కాలేదు',

    noProjects: 'మీ తరగతికి ప్రాజెక్టులు లేవు',

    noReport: 'రిపోర్ట్ అందుబాటులో లేదు',
    noReportDesc: 'ఈ పరీక్షకు ఇంకా రిపోర్ట్ విడుదల కాలేదు',
    totalMarks: 'మొత్తం మార్కులు',
    average: 'సగటు',
    subject: 'విషయం',
    marks: 'మార్కులు',
    grade: 'గ్రేడ్',
    subjectPerformance: 'విషయ ప్రదర్శన',
    overallGrade: 'మొత్తం గ్రేడ్',

    teacherVideos: 'ఉపాధ్యాయుల వీడియోలు',
    videosAvailable: 'వీడియోలు అందుబాటులో ఉన్నాయి',
    noVideos: 'వీడియోలు అందుబాటులో లేవు',
    checkLaters: 'కొత్త వీడియోల కోసం తరువాత చూడండి',
    watchNow: 'ఇప్పుడు చూడండి',

    subjects: {
      mathematics: 'గణితం',
      science: 'సైన్స్',
      english: 'ఇంగ్లీష్',
      computer: 'కంప్యూటర్',
      physics: 'ఫిజిక్స్',
      chemistry: 'కెమిస్ట్రీ',
      biology: 'బయాలజీ',
    },
        // timetable: "కాలపట్టిక",
        // class: "తరగతి",
        // section: "విభాగం",
        year: "సంవత్సరం",
        period: "పీరియడ్",
        periodShort: "పి",
        time: "సమయం",
        subjectTeacher: "విషయం / ఉపాధ్యాయుడు",
        noClasses: "ఈ రోజు తరగతులు లేవు",
        subjectsTitle: "విషయాలు",

        days: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],








 
    

  },
};

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: any) => {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    AsyncStorage.getItem('appLanguage').then(saved => {
      if (saved) setLang(saved as Lang);
    });
  }, []);

  const changeLanguage = async (l: Lang) => {
    setLang(l);
    await AsyncStorage.setItem('appLanguage', l);
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        t: translations[lang] || translations.en,
        changeLanguage
      }}
    >

      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
