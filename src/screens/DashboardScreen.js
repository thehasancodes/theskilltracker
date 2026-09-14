// ============================================================
// DASHBOARD SCREEN
// ============================================================
//
// Main student dashboard.
//
// Features:
// 1. Student welcome header
// 2. Notification shortcut
// 3. Academic dashboard summary
// 4. LeetCode progress
// 5. Lab assignment progress
// 6. API-based dashboard data
// 7. Retry and logout handling
// ============================================================

import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import DashboardCard from "../components/DashboardCard";

import { colors } from "../constants/colors";

import { DashboardApiError, getDashboardData } from "../api/dashboardApi";

import { clearAuthSession, getStoredUser } from "../api/authStorage";

// ============================================================
// CONSTANTS
// ============================================================

const HEADER_SCALE = 1.2;

// ============================================================
// DASHBOARD SCREEN
// ============================================================

export default function DashboardScreen({ navigation }) {
  // ==========================================================
  // STATE
  // ==========================================================

  const [dashboard, setDashboard] = useState(null);

  const [user, setUser] = useState(null);

  const [error, setError] = useState(null);

  const [retryKey, setRetryKey] = useState(0);

  // ==========================================================
  // LOAD DASHBOARD DATA
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    setError(null);

    Promise.all([getDashboardData(), getStoredUser()])
      .then(([dashboardData, storedUser]) => {
        if (mounted) {
          setDashboard(dashboardData);
          setUser(storedUser);
        }
      })
      .catch((requestError) => {
        if (mounted) {
          setError(
            requestError instanceof DashboardApiError
              ? requestError.message
              : "Unable to load dashboard.",
          );
        }
      });

    return () => {
      mounted = false;
    };
  }, [retryKey]);

  // ==========================================================
  // LOADING / ERROR SCREEN
  // ==========================================================

  if (!dashboard) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          {error ? (
            <>
              <Text style={styles.loadingText}>{error}</Text>

              {/* Retry */}

              <Pressable
                onPress={() => {
                  setDashboard(null);
                  setRetryKey((value) => value + 1);
                }}
                style={({ pressed }) => [
                  styles.retryButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>

              {/* Logout */}

              <Pressable
                onPress={async () => {
                  await clearAuthSession();

                  navigation.getParent()?.replace("Login");
                }}
                style={({ pressed }) => [
                  styles.logoutButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.logoutButtonText}>Log out</Text>
              </Pressable>
            </>
          ) : (
            <>
              <ActivityIndicator size="small" color={colors.purple} />

              <Text style={styles.loadingText}>Loading dashboard...</Text>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // USER INFORMATION
  // ==========================================================

  const userName = user?.name || "STUDENT";

  const semester = user?.semester ? `Semester ${user.semester}` : "";

  const degree = user?.department || "";

  // ==========================================================
  // DASHBOARD TRACKS
  // ==========================================================

  const tracks = [
    {
      id: "leetcode",

      type: "DSA PRACTICE",

      title: "LeetCode 300",

      description:
        "Master fundamental data structures & algorithms through 300 curated industry-standard challenges.",

      solved: dashboard.totalLeetcodeSolved,

      total: 300,

      accent: "primary",
    },

    {
      id: "labs",

      type: "CURRICULUM CORE",

      title: "Lab Assignments",

      description:
        "Internal assessments, MCQs, and programming labs for your current semester coursework.",

      solved: dashboard.totalLabsCompleted,

      total: dashboard.totalLabsCompleted,

      accent: "cyan",
    },
  ];

  // ==========================================================
  // MAIN SCREEN
  // ==========================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ====================================================
            HEADER
        ==================================================== */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* ==================================================
                MENU BUTTON
            ================================================== */}

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

            {/* ==================================================
                HEADER TITLE
            ================================================== */}

            <View>
              <Text style={styles.headerTitle}>Student Command Centre</Text>

              <Text style={styles.welcome}>WELCOME {userName}</Text>
            </View>
          </View>

          {/* ====================================================
              NOTIFICATION BUTTON
          ==================================================== */}

          <Pressable
            onPress={() => navigation.navigate("Notifications")}
            style={({ pressed }) => [
              styles.notificationButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="notifications-outline"
              size={22 * HEADER_SCALE}
              color={colors.text}
            />
          </Pressable>
        </View>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* ==================================================
              DASHBOARD HERO
          ================================================== */}

          <View style={styles.hero}>
            {/* Hero Badge */}

            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>
                STUDENT ACADEMIC DASHBOARD
              </Text>
            </View>

            {/* Hero Title */}

            <Text style={styles.heroTitle}>MY STUDENT DASHBOARD</Text>

            {/* Hero Subtitle */}

            <Text style={styles.heroSubtitle}>
              {degree} · {semester} Coursework & Practice Track Progress
            </Text>
          </View>

          {/* ==================================================
              DASHBOARD CARDS
          ================================================== */}

          <View style={styles.cardsContainer}>
            {tracks.map((track) => (
              <DashboardCard
                key={track.id}
                {...track}
                onPress={() => {
                  // --------------------------------------------
                  // LEETCODE
                  // --------------------------------------------

                  if (track.id === "leetcode") {
                    navigation.navigate("TechnicalTracks");
                  }

                  // --------------------------------------------
                  // LABS / MCQ
                  // --------------------------------------------

                  if (track.id === "labs") {
                    navigation.navigate("MCQ");
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

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  // ==========================================================
  // SCREEN
  // ==========================================================

  safeArea: {
    flex: 1,

    backgroundColor: colors.background,
  },

  container: {
    flex: 1,

    backgroundColor: colors.background,
  },

  // ==========================================================
  // LOADING
  // ==========================================================

  loadingContainer: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",
  },

  loadingText: {
    color: colors.muted,

    marginTop: 10,

    textAlign: "center",

    paddingHorizontal: 24,
  },

  // ==========================================================
  // RETRY BUTTON
  // ==========================================================

  retryButton: {
    marginTop: 16,

    paddingHorizontal: 18,

    paddingVertical: 10,

    borderRadius: 8,

    backgroundColor: colors.purpleDark,

    borderWidth: 1,

    borderColor: colors.purple,
  },

  retryButtonText: {
    color: colors.purple,

    fontWeight: "700",
  },

  // ==========================================================
  // LOGOUT BUTTON
  // ==========================================================

  logoutButton: {
    marginTop: 12,

    paddingHorizontal: 18,

    paddingVertical: 10,
  },

  logoutButtonText: {
    color: colors.muted,

    fontWeight: "600",
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    minHeight: 70 * HEADER_SCALE,

    borderBottomWidth: 1,

    borderBottomColor: colors.border,

    paddingHorizontal: 16 * HEADER_SCALE,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  headerLeft: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,
  },

  // ==========================================================
  // MENU BUTTON
  // ==========================================================

  menuButton: {
    width: 42 * HEADER_SCALE,

    height: 42 * HEADER_SCALE,

    borderRadius: 11 * HEADER_SCALE,

    backgroundColor: colors.surface,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 11 * HEADER_SCALE,
  },

  // ==========================================================
  // NOTIFICATION BUTTON
  // ==========================================================

  notificationButton: {
    width: 42 * HEADER_SCALE,

    height: 42 * HEADER_SCALE,

    borderRadius: 11 * HEADER_SCALE,

    backgroundColor: colors.surface,

    alignItems: "center",

    justifyContent: "center",

    marginLeft: 10,
  },

  // ==========================================================
  // HEADER TITLE
  // ==========================================================

  headerTitle: {
    color: colors.text,

    fontSize: 16 * HEADER_SCALE,

    fontWeight: "700",
  },

  // ==========================================================
  // WELCOME TEXT
  // ==========================================================

  welcome: {
    color: colors.muted,

    fontSize: 7.5 * HEADER_SCALE,

    fontWeight: "700",

    letterSpacing: 1,

    marginTop: 3 * HEADER_SCALE,
  },

  // ==========================================================
  // CONTENT
  // ==========================================================

  content: {
    padding: 16,

    paddingBottom: 40,
  },

  // ==========================================================
  // HERO
  // ==========================================================

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

  // ==========================================================
  // HERO BADGE
  // ==========================================================

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

  // ==========================================================
  // HERO TITLE
  // ==========================================================

  heroTitle: {
    color: colors.text,

    fontSize: 24,

    fontWeight: "500",

    textAlign: "center",
  },

  // ==========================================================
  // HERO SUBTITLE
  // ==========================================================

  heroSubtitle: {
    color: colors.blue,

    fontSize: 10,

    marginTop: 8,

    textAlign: "center",
  },

  // ==========================================================
  // CARDS
  // ==========================================================

  cardsContainer: {
    width: "100%",
  },

  // ==========================================================
  // PRESSED
  // ==========================================================

  pressed: {
    opacity: 0.65,
  },
});
