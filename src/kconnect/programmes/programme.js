import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../constants/colors";

/* ============================= */
/* PROGRAMME FILTER OPTIONS */
/* ============================= */

// These options control which programmes are displayed.
const programmeGroups = [
  "All Programmes",
  "Master Degree Programme",
  "Degree Programme",
];

/* ============================= */
/* PROGRAMME DATA */
/* ============================= */

// Each programme has a unique ID and the information required
// to display its card and open its details screen.
// This data is currently local and hardcoded.
export const programmes = [
  {
    id: "mtech-cse-ai-ml",
    group: "Master Degree Programme",
    faculty: "Faculty of Computer Technology",
    title:
      "M.Tech. in Computer Science and Engineering with Artificial Intelligence and Machine Learning",
    duration: "2 Years",
    qualification: "Graduation",
    description:
      "Build advanced skills in computer science, artificial intelligence, and machine learning for modern technology careers.",
  },
  {
    id: "mtech-cse-data-analytics",
    group: "Master Degree Programme",
    faculty: "Faculty of Computer Technology",
    title:
      "M.Tech. in Computer Science and Engineering in Data Science and Analytics",
    duration: "2 Years",
    qualification: "Graduation",
    description:
      "Learn to turn complex data into useful decisions through analytics, modelling, and intelligent systems.",
  },
  {
    id: "master-ca-ai-dl",
    group: "Master Degree Programme",
    faculty: "Faculty of Computer Technology",
    title:
      "Master of Computer Application in Artificial Intelligence and Deep Learning",
    duration: "2 Years",
    qualification: "Graduation",
    description:
      "Explore application development, artificial intelligence, and deep learning with a practical curriculum.",
  },
  {
    id: "btech-cse",
    group: "Degree Programme",
    faculty: "Faculty of Computer Technology",
    title: "B.Tech. in Computer Science and Engineering",
    duration: "4 Years",
    qualification: "12th Standard",
    description:
      "Develop a strong foundation in software, systems, programming, and engineering practice.",
  },
  {
    id: "btech-cse-business",
    group: "Degree Programme",
    faculty: "Faculty of Computer Technology",
    title: "B.Tech. in Computer Science and Engineering with Business Systems",
    duration: "4 Years",
    qualification: "12th Standard",
    description:
      "Combine computer science fundamentals with business systems and digital transformation skills.",
  },
  {
    id: "btech-cyber-security",
    group: "Degree Programme",
    faculty: "Faculty of Computer Technology",
    title: "B.Tech. in Computer Science and Engineering on Cyber Security",
    duration: "4 Years",
    qualification: "12th Standard",
    description:
      "Learn to protect applications, networks, and data through modern cyber security practices.",
  },
  {
    id: "btech-data-ai",
    group: "Degree Programme",
    faculty: "Faculty of Computer Technology",
    title:
      "B.Tech. in Computer Science and Engineering in Data Science and Artificial Intelligence",
    duration: "4 Years",
    qualification: "12th Standard",
    description:
      "Build practical expertise in data, algorithms, and artificial intelligence from an engineering perspective.",
  },
  {
    id: "btech-semiconductor",
    group: "Degree Programme",
    faculty: "Faculty of Computer Technology",
    title:
      "B.Tech. in Computer Science and Engineering on Semiconductor Technology",
    duration: "4 Years",
    qualification: "12th Standard",
    description:
      "Understand computing systems and the semiconductor technologies that power modern devices.",
  },
  {
    id: "btech-system-production",
    group: "Degree Programme",
    faculty: "Faculty of Computer Technology",
    title:
      "B.Tech. in Computer Science and Engineering on System Application and Production",
    duration: "4 Years",
    qualification: "12th Standard",
    description:
      "Study system applications, production workflows, and the engineering methods behind reliable software.",
  },
  {
    id: "bca",
    group: "Degree Programme",
    faculty: "Faculty of Computer Technology",
    title: "Bachelor of Computer Application",
    duration: "4 Years",
    qualification: "12th Standard",
    description:
      "Start a practical career in application development, programming, and information technology.",
  },
  {
    id: "bca-ai-dl",
    group: "Degree Programme",
    faculty: "Faculty of Computer Technology",
    title:
      "Bachelor of Computer Application on Artificial Intelligence and Deep Learning",
    duration: "4 Years",
    qualification: "12th Standard",
    description:
      "Learn application development with a focused introduction to artificial intelligence and deep learning.",
  },
];

/* ============================= */
/* PROGRAMME CARD */
/* ============================= */

// Reusable card that displays a programme's basic information.
// The entire card is pressable and opens the programme details.
function ProgrammeCard({ programme, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Learn more about ${programme.title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {/* Faculty or department name */}
      <Text style={styles.faculty}>{programme.faculty}</Text>

      {/* Programme title */}
      <Text numberOfLines={4} style={styles.cardTitle}>
        {programme.title}
      </Text>

      {/* Duration and minimum qualification */}
      <View style={styles.meta}>
        <Text style={styles.metaText}>✓ Duration: {programme.duration}</Text>

        <Text style={styles.metaText}>
          ✓ Minimum Qualification: {programme.qualification}
        </Text>
      </View>

      {/* Visual indicator that more information is available */}
      <View style={styles.learnButton}>
        <Text style={styles.learnText}>Learn More</Text>
        <Ionicons name="arrow-forward" size={13} color="#ffffff" />
      </View>
    </Pressable>
  );
}

/* ============================= */
/* PROGRAMMES SCREEN */
/* ============================= */

export default function ProgrammesScreen({ navigation }) {
  // By default, display every programme.
  const [selectedGroup, setSelectedGroup] = useState(programmeGroups[0]);

  /* ============================= */
  /* FILTER PROGRAMMES */
  /* ============================= */

  // Recalculate the displayed programmes when the selected group changes.
  // useMemo avoids filtering the complete array on every unrelated render.
  const visibleProgrammes = useMemo(
    () =>
      selectedGroup === programmeGroups[0]
        ? programmes
        : programmes.filter((programme) => programme.group === selectedGroup),
    [selectedGroup],
  );

  /* ============================= */
  /* SCREEN UI */
  /* ============================= */

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header and back navigation */}
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={23} color={colors.text} />
          </Pressable>

          <Text style={styles.heading}>Our Programmes</Text>

          {/* Balances the header layout */}
          <View style={styles.backButton} />
        </View>

        {/* Horizontal programme category filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {programmeGroups.map((group) => {
            const selected = selectedGroup === group;

            return (
              <Pressable
                key={group}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setSelectedGroup(group)}
                style={[styles.tab, selected && styles.selectedTab]}
              >
                <Text
                  style={[styles.tabText, selected && styles.selectedTabText]}
                >
                  {group}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Display only the programmes matching the selected filter */}
        <View style={styles.grid}>
          {visibleProgrammes.map((programme) => (
            <ProgrammeCard
              key={programme.id}
              programme={programme}
              onPress={() =>
                navigation.navigate("ProgrammeDetails", {
                  programme,
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============================= */
/* STYLES */
/* ============================= */

const styles = StyleSheet.create({
  /* Main screen */
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingBottom: 22,
  },

  /* Header */
  header: {
    height: 66,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  heading: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
  },

  /* Category filter tabs */
  tabs: {
    paddingHorizontal: 16,
    paddingBottom: 13,
    gap: 12,
  },

  tab: {
    minHeight: 38,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    backgroundColor: colors.surface,
  },

  selectedTab: {
    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },

  tabText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "600",
  },

  selectedTabText: {
    color: colors.text,
  },

  /* Programme card list */
  grid: {
    paddingHorizontal: 14,
    gap: 12,
  },

  card: {
    width: "100%",
    minHeight: 180,
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },

  faculty: {
    color: colors.muted,
    fontSize: 10,
    textAlign: "center",
  },

  cardTitle: {
    marginTop: 10,
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    fontWeight: "800",
  },

  /* Programme duration and qualification */
  meta: {
    marginTop: 8,
  },

  metaText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 18,
  },

  /* Learn More indicator */
  learnButton: {
    height: 42,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },

  learnText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "800",
  },

  /* Press feedback */
  pressed: {
    opacity: 0.7,
  },
});
