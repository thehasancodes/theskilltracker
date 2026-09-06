import React from "react";

import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import DashboardCard from "../components/DashboardCard";
import { colors } from "../constants/colors";
import { dashboardData } from "../data/dashboardData";

const HEADER_SCALE = 1.2;

export default function DashboardScreen({ navigation }) {
  const { user, academic, tracks } = dashboardData;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ============================= */}
        {/* HEADER                         */}
        {/* ============================= */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Menu */}
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={({ pressed }) => [
                styles.menuButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="menu"
                size={22 * HEADER_SCALE}
                color={colors.text}
              />
            </Pressable>

            {/* Header Title */}
            <View>
              <Text style={styles.headerTitle}>Student Command Centre</Text>

              <Text style={styles.welcome}>WELCOME {user.name}</Text>
            </View>
          </View>
        </View>

        {/* ============================= */}
        {/* CONTENT                        */}
        {/* ============================= */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Dashboard Hero */}

          <View style={styles.hero}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>
                STUDENT ACADEMIC DASHBOARD
              </Text>
            </View>

            <Text style={styles.heroTitle}>MY STUDENT DASHBOARD</Text>

            <Text style={styles.heroSubtitle}>
              {academic.degree} · {academic.semester} {academic.subtitle}
            </Text>
          </View>

          {/* Dashboard Cards */}

          <View style={styles.cardsContainer}>
            {tracks.map((track) => (
              <DashboardCard
                key={track.id}
                {...track}
                onPress={() => {
                  if (track.id === "leetcode") {
                    navigation.navigate("TechnicalTracks");
                  }

                  if (track.id === "labs") {
                    navigation.navigate("MCQ", {
                      title: "Lab Assessment",
                      course: academic.degree,
                      duration: 30 * 60,
                    });
                  }
                }}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ================================= */
/* STYLES                            */
/* ================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* Header */

  header: {
    minHeight: 70 * HEADER_SCALE,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,

    paddingHorizontal: 16 * HEADER_SCALE,

    flexDirection: "row",
    alignItems: "center",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  menuButton: {
    width: 42 * HEADER_SCALE,
    height: 42 * HEADER_SCALE,

    borderRadius: 11 * HEADER_SCALE,

    backgroundColor: colors.surface,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 11 * HEADER_SCALE,
  },

  headerTitle: {
    color: colors.text,
    fontSize: 16 * HEADER_SCALE,
    fontWeight: "700",
  },

  welcome: {
    color: colors.muted,

    fontSize: 7.5 * HEADER_SCALE,
    fontWeight: "700",

    letterSpacing: 1,

    marginTop: 3 * HEADER_SCALE,
  },

  /* Content */

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  /* Hero */

  hero: {
    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 16,

    minHeight: 145,

    alignItems: "center",
    justifyContent: "center",

    padding: 20,

    marginBottom: 20,
  },

  heroBadge: {
    borderWidth: 1,
    borderColor: colors.purple,

    backgroundColor: colors.purpleDark,

    borderRadius: 20,

    paddingHorizontal: 12,
    paddingVertical: 6,

    marginBottom: 12,
  },

  heroBadgeText: {
    color: colors.purple,

    fontSize: 9,
    fontWeight: "700",

    letterSpacing: 1,
  },

  heroTitle: {
    color: colors.text,

    fontSize: 24,
    fontWeight: "500",

    textAlign: "center",
  },

  heroSubtitle: {
    color: colors.blue,

    fontSize: 10,

    marginTop: 8,

    textAlign: "center",
  },

  /* Cards */

  cardsContainer: {
    width: "100%",
  },

  pressed: {
    opacity: 0.65,
  },
});
