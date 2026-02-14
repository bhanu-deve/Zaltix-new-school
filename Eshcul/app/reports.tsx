import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { useLang } from './language';

/* =========================
   TYPES
========================= */
interface StudentData {
  name: string;
  rollNo: string;
  class: string;
  examType: string;
  marks: Record<string, number>;
  totalMarks: number;
  average: number;
  grade: string;
}

/* =========================
   COMPONENT
========================= */
export default function ReportsScreen() {
  const { t } = useLang();

  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState("FA1");
  const [showDropdown, setShowDropdown] = useState(false);
  const [noReport, setNoReport] = useState(false);

  /* =========================
     EXAM OPTIONS (REQUIRED)
  ========================= */
  const examOptions = [
    { key: "FA1", label: "Formative 1", type: "formative" },
    { key: "FA2", label: "Formative 2", type: "formative" },
    { key: "FA3", label: "Formative 3", type: "formative" },
    { key: "SA1", label: "Summative 1", type: "summative" },
    { key: "FA4", label: "Formative 4", type: "formative" },
    { key: "FA5", label: "Formative 5", type: "formative" },
    { key: "SA2", label: "Summative 2", type: "summative" },
    { key: "Final", label: "Final Result", type: "final" },
  ];

  /* =========================
     FETCH STUDENT BY ROLL NO
  ========================= */
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setNoReport(false);        // ✅ RESET BEFORE API CALL
        setError(null);

        const rollNo = await AsyncStorage.getItem("rollNo");

        if (!rollNo) {
          setError("Roll number not found");
          return;
        }

        const res = await api.get(`/grades/roll/${rollNo}`, {
          params: { examType: selectedExam }, // 👈 exam wise
        });

        setStudent(res.data);
      } catch {
        setNoReport(true);         // ✅ NO DATA CASE
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [selectedExam]);



  /* =========================
     GRADE HELPER
  ========================= */
  const getGrade = (marks: number) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B+";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C";
    if (marks >= 40) return "D";
    return "F";
  };

  /* =========================
     LOADING / ERROR
  ========================= */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  if (noReport) {
    return (
      <LinearGradient colors={['#edf5ff', '#fdfdfd']} style={styles.gradient}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>📄 {t.noReport}</Text>
          <Text style={styles.emptyText}>{t.noReportDesc}</Text>
        </View>
      </LinearGradient>
    );
  }


  if (error || !student) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  /* =========================
     DYNAMIC SUBJECTS
  ========================= */
  const reportCardData = Object.entries(student.marks || {}).map(
    ([subject, marks]) => ({
      subject: subject.replace(/_/g, " ").toUpperCase(),
      marks,
    })
  );

  const maxMarks = reportCardData.length * 100;
  const currentExamLabel =
    examOptions.find((e) => e.key === selectedExam)?.label || selectedExam;

  /* =========================
     UI (UNCHANGED)
  ========================= */
  return (
    <LinearGradient colors={["#edf5ff", "#fdfdfd"]} style={styles.gradient}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* EXAM DROPDOWN */}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.dropdownButtonText}>{currentExamLabel}</Text>
          <Ionicons
            name={showDropdown ? "chevron-up" : "chevron-down"}
            size={18}
            color="#64748b"
          />
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdownMenu}>
            {examOptions.map((exam) => (
              <TouchableOpacity
                key={exam.key}
                style={[
                  styles.dropdownMenuItem,
                  selectedExam === exam.key &&
                    styles.dropdownMenuItemSelected,
                ]}
                onPress={() => {
                  setSelectedExam(exam.key);
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownMenuItemText}>{exam.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* STUDENT HEADER */}
        <View style={styles.headerCard}>
          <Image
            source={require("../assets/images/profile.png")}
            style={styles.profileImage}
          />
          <View style={styles.profileInfoContainer}>
            <Text style={styles.profileName}>{student.name}</Text>
            <Text style={styles.profileDetails}>
              {t.class} {student.class} • {t.rollNo} {student.rollNo}
            </Text>
          </View>
          <View style={styles.gradeChip}>
            <Text style={styles.gradeChipLabel}>{t.overall}</Text>

            <Text style={styles.gradeChipValue}>{student.grade}</Text>
          </View>
        </View>

        {/* SUMMARY */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.summaryTotal]}>
            <Text style={styles.summaryLabel}>{t.totalMarks}</Text>
            <Text style={styles.summaryValue}>
              {student.totalMarks}/{maxMarks}
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.summaryAverage]}>
            <Text style={styles.summaryLabel}>{t.average}</Text>
            <Text style={styles.summaryValue}>{student.average}%</Text>
          </View>
        </View>

        {/* SUBJECT TABLE */}
        <Text style={styles.sectionTitle}>{t.subjectPerformance}</Text>

        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderSubject}>{t.subject}</Text>
            <Text style={styles.tableHeaderMarks}>{t.marks}</Text>
            <Text style={styles.tableHeaderGrade}>{t.grade}</Text>
          </View>

          {reportCardData.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
              ]}
            >
              <Text style={styles.tableSubject}>{item.subject}</Text>
              <Text style={styles.tableMarks}>{item.marks}/100</Text>
              <Text style={styles.tableGrade}>
                {getGrade(item.marks)}
              </Text>
            </View>
          ))}
        </View>

        {/* FINAL GRADE */}
        <View style={styles.finalGradeCard}>
          <Text style={styles.finalGradeLabel}>
            {t.overallGrade} - {currentExamLabel}
          </Text>

          <Text style={styles.finalGradeValue}>{student.grade}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

/* =========================
   STYLES (UNCHANGED)
========================= */
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#ef4444", fontSize: 14 },

  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  dropdownButtonText: { fontSize: 15, fontWeight: "600" },
  dropdownMenu: { backgroundColor: "white", borderRadius: 14 },
  dropdownMenuItem: { padding: 14 },
  dropdownMenuItemSelected: { backgroundColor: "#eff6ff" },
  dropdownMenuItemText: { fontSize: 14 },

  headerCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  profileImage: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  profileInfoContainer: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: "700" },
  profileDetails: { fontSize: 12, color: "#6b7280" },

  gradeChip: {
    backgroundColor: "#e0f2fe",
    padding: 8,
    borderRadius: 10,
  },
  gradeChipLabel: { fontSize: 10 },
  gradeChipValue: { fontSize: 14, fontWeight: "700" },

  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  summaryCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  summaryTotal: { backgroundColor: "#e0f2fe" },
  summaryAverage: { backgroundColor: "#dcfce7" },
  summaryLabel: { fontSize: 11 },
  summaryValue: { fontSize: 16, fontWeight: "700" },

  sectionTitle: { fontSize: 15, fontWeight: "700", marginBottom: 12 },

  tableCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    padding: 12,
  },
  tableHeaderSubject: { flex: 2 },
  tableHeaderMarks: { flex: 1, textAlign: "center" },
  tableHeaderGrade: { flex: 1, textAlign: "right" },

  tableRow: { flexDirection: "row", padding: 12 },
  tableRowEven: { backgroundColor: "#f8fafc" },
  tableRowOdd: { backgroundColor: "white" },
  tableSubject: { flex: 2 },
  tableMarks: { flex: 1, textAlign: "center" },
  tableGrade: { flex: 1, textAlign: "right" },

  finalGradeCard: {
    backgroundColor: "#e0f7fa",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  finalGradeLabel: { fontSize: 13, fontWeight: "600" },
  finalGradeValue: { fontSize: 20, fontWeight: "800" },


  emptyContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: 30,
},
emptyTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#2563eb",
  marginBottom: 8,
},
emptyText: {
  fontSize: 14,
  color: "#64748b",
  textAlign: "center",
},

});
