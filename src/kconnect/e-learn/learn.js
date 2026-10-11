import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";

const semesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4"];

const courses = [
  {
    type: "Discipline Specific Course",
    title: "English Social and Cultural History",
  },
  {
    type: "Discipline Specific Course",
    title: "English Poetry: Chaucer to the Neo-classical",
  },
  {
    type: "Discipline Specific Course",
    title: "English Drama: Elizabethan to Restoration",
  },
  { type: "Discipline Specific Elective", title: "Non-Fictional Prose" },
  { type: "Value Added Course", title: "English Communication Skills" },
  { type: "Ability Enhancement Course", title: "English for Media Studies" },
];

function CourseCard({ course }) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.courseCard, pressed && styles.pressed]}
    >
      <Image
        source={require("../../../assets/allinone.png")}
        style={styles.universityLogo}
      />
      <Text style={styles.universityName}>
        Krishna Kanta Handique State Open University
      </Text>
      <View style={styles.divider} />
      <View style={styles.typePill}>
        <Text style={styles.typeText}>{course.type}</Text>
      </View>
      <Text style={styles.courseTitle}>{course.title}</Text>
      <View style={styles.bottomDivider} />
      <View style={styles.semesterPill}>
        <Text style={styles.semesterText}>SEMESTER 1</Text>
      </View>
    </Pressable>
  );
}

export default function ESlmScreen({ navigation }) {
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");
  const [semesterMenuOpen, setSemesterMenuOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={25} color={colors.text} />
          </Pressable>
          <Text numberOfLines={1} style={styles.headerTitle}>
            e-SLM (Self Learning Material)
          </Text>
          <Pressable
            accessibilityLabel="Refresh courses"
            onPress={() => setSelectedSemester(selectedSemester)}
            style={styles.headerButton}
          >
            <Ionicons name="refresh" size={24} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.semesterSelectorWrap}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setSemesterMenuOpen((open) => !open)}
            style={styles.semesterSelector}
          >
            <Ionicons name="school-outline" size={27} color={colors.yellow} />
            <Text style={styles.selectorLabel}>Select Semester:</Text>
            <Text style={styles.selectedSemester}>{selectedSemester}</Text>
            <Ionicons
              name={semesterMenuOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.muted}
            />
          </Pressable>
          {semesterMenuOpen && (
            <View style={styles.semesterMenu}>
              {semesters.map((semester) => (
                <Pressable
                  key={semester}
                  onPress={() => {
                    setSelectedSemester(semester);
                    setSemesterMenuOpen(false);
                  }}
                  style={styles.menuOption}
                >
                  <Text style={styles.menuOptionText}>{semester}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.programHeading}>
          <Ionicons name="school-outline" size={17} color={colors.muted} />
          <Text style={styles.programText}>MASTER OF ARTS IN ENGLISH</Text>
        </View>

        <View style={styles.courseGrid}>
          {courses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 22 },
  header: {
    height: 78,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: 8,
    color: colors.text,
    fontSize: 25,
    fontWeight: "500",
  },
  semesterSelectorWrap: { marginHorizontal: 23, zIndex: 2 },
  semesterSelector: {
    minHeight: 78,
    paddingHorizontal: 21,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  selectorLabel: {
    marginLeft: 12,
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  selectedSemester: {
    flex: 1,
    marginLeft: 18,
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  semesterMenu: {
    position: "absolute",
    top: 83,
    left: 0,
    right: 0,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  menuOption: { paddingHorizontal: 18, paddingVertical: 12 },
  menuOptionText: { color: colors.text, fontSize: 14, fontWeight: "600" },
  programHeading: {
    marginTop: 22,
    marginBottom: 14,
    marginHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  programText: {
    marginLeft: 8,
    color: colors.muted,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  courseGrid: {
    paddingHorizontal: 19,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  courseCard: {
    width: "47.8%",
    minHeight: 309,
    marginBottom: 19,
    paddingHorizontal: 11,
    paddingTop: 17,
    paddingBottom: 14,
    borderRadius: 9,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  universityLogo: {
    width: 57,
    height: 57,
    borderRadius: 29,
    backgroundColor: "#ffffff",
  },
  universityName: {
    marginTop: 8,
    color: "#ffffff",
    fontSize: 8,
    lineHeight: 11,
    textAlign: "center",
  },
  divider: {
    width: 28,
    height: 2,
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.48)",
  },
  typePill: {
    alignSelf: "stretch",
    minHeight: 40,
    marginTop: 10,
    paddingHorizontal: 9,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
  },
  typeText: {
    color: "#ffffff",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
  },
  courseTitle: {
    flex: 1,
    marginTop: 25,
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
    textAlign: "center",
  },
  bottomDivider: {
    width: 28,
    height: 2,
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.48)",
  },
  semesterPill: {
    marginTop: 8,
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  semesterText: { color: "#ffffff", fontSize: 9, fontWeight: "800" },
  pressed: { opacity: 0.78 },
});
