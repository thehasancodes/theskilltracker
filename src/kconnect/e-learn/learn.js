import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
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

// Replace with your existing e-SLM API endpoint.
const ESLM_API_URL = "YOUR_EXISTING_ESLM_API_ENDPOINT";

/* ============================= */
/* COURSE CARD */
/* ============================= */

function CourseCard({ course, semester }) {
  const openMaterial = async () => {
    if (!course.fileUrl) {
      Alert.alert(
        "Material unavailable",
        "A PDF or document link has not been provided for this material.",
      );
      return;
    }

    try {
      await Linking.openURL(course.fileUrl);
    } catch {
      Alert.alert(
        "Unable to open material",
        "Please check the document link and try again.",
      );
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Read ${course.title}`}
      onPress={openMaterial}
      style={({ pressed }) => [styles.courseCard, pressed && styles.pressed]}
    >
      <Image
        source={require("../../../assets/allinone.png")}
        style={styles.universityLogo}
      />

      <Text style={styles.universityName}>Assam down town University</Text>

      <View style={styles.divider} />

      <View style={styles.typePill}>
        <Text style={styles.typeText}>{course.type || "Study Material"}</Text>
      </View>

      <Text style={styles.courseTitle}>{course.title}</Text>

      <View style={styles.bottomDivider} />

      <View style={styles.semesterPill}>
        <Text style={styles.semesterText}>{semester || "SEMESTER"}</Text>
      </View>

      <View style={styles.readIndicator}>
        <Ionicons name="book-outline" size={14} color="#ffffff" />
        <Text style={styles.readText}>Read material</Text>
      </View>
    </Pressable>
  );
}

/* ============================= */
/* E-SLM SCREEN */
/* ============================= */

export default function ESlmScreen({ navigation }) {
  const [materials, setMaterials] = useState([]);
  const [programName, setProgramName] = useState("");
  const [semesterName, setSemesterName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* ============================= */
  /* FETCH MATERIALS FROM API */
  /* ============================= */

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch(ESLM_API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch study materials");
      }

      const data = await response.json();

      // These values come from the API, not a user selection.
      setProgramName(data.programName || "");
      setSemesterName(data.semesterName || "");
      setMaterials(Array.isArray(data.materials) ? data.materials : []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  /* ============================= */
  /* SCREEN UI */
  /* ============================= */

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
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
            accessibilityLabel="Refresh study materials"
            onPress={loadMaterials}
            style={styles.headerButton}
          >
            <Ionicons name="refresh" size={24} color={colors.text} />
          </Pressable>
        </View>

        {/* Automatically assigned semester and course */}
        {!loading && !error && (
          <View style={styles.studentInfo}>
            <View style={styles.infoIcon}>
              <Ionicons name="school-outline" size={25} color={colors.yellow} />
            </View>

            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>YOUR PROGRAM</Text>

              <Text style={styles.infoValue}>
                {programName || "Program not available"}
              </Text>

              <Text style={styles.infoSemester}>
                {semesterName || "Semester not available"}
              </Text>
            </View>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={colors.yellow} />
            <Text style={styles.stateText}>Loading study materials...</Text>
          </View>
        )}

        {/* API error */}
        {!loading && error && (
          <View style={styles.stateContainer}>
            <Ionicons
              name="cloud-offline-outline"
              size={38}
              color={colors.muted}
            />

            <Text style={styles.stateText}>
              Unable to load study materials.
            </Text>

            <Pressable onPress={loadMaterials} style={styles.retryButton}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {/* No materials */}
        {!loading && !error && materials.length === 0 && (
          <View style={styles.stateContainer}>
            <Ionicons name="documents-outline" size={38} color={colors.muted} />

            <Text style={styles.stateText}>
              No study materials available for your semester yet.
            </Text>
          </View>
        )}

        {/* API-driven material cards */}
        {!loading && !error && materials.length > 0 && (
          <>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>AVAILABLE STUDY MATERIALS</Text>

              <Text style={styles.materialCount}>
                {materials.length} materials
              </Text>
            </View>

            <View style={styles.courseGrid}>
              {materials.map((course, index) => (
                <CourseCard
                  key={course.id ?? `${course.title}-${index}`}
                  course={course}
                  semester={semesterName}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============================= */
/* STYLES */
/* ============================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 22,
  },
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
    fontSize: 21,
    fontWeight: "500",
  },
  studentInfo: {
    marginHorizontal: 23,
    marginBottom: 24,
    padding: 16,
    minHeight: 95,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  infoValue: {
    marginTop: 5,
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  infoSemester: {
    marginTop: 5,
    color: colors.yellow,
    fontSize: 13,
    fontWeight: "700",
  },
  sectionHeading: {
    marginHorizontal: 23,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    flex: 1,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  materialCount: {
    marginLeft: 8,
    color: colors.muted,
    fontSize: 11,
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
    marginTop: 20,
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
  semesterText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "800",
  },
  readIndicator: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  readText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },
  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 55,
  },
  stateText: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 9,
    backgroundColor: colors.primaryDark,
  },
  retryText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.78,
  },
});
