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

const HEADER_SCALE = 1.2;

export default function DashboardScreen({ navigation }) {
  const [dashboard, setDashboard] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

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

  if (!dashboard) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          {error ? (
            <>
              <Text style={styles.loadingText}>{error}</Text>
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

  const userName = user?.name || "STUDENT";
  const semester = user?.semester ? `Semester ${user.semester}` : "";
  const degree = user?.department || "";
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

              <Text style={styles.welcome}>WELCOME {userName}</Text>
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
              {degree} · {semester} Coursework & Practice Track Progress
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
                      course: degree,
                      duration: 30 * 60,
                    });
                  }
                }}
              />
            ))}
          </View>

          <View style={styles.activityCard}>
            <Text style={styles.activityLabel}>RECENT ACTIVITY</Text>
            <Text style={styles.activityTitle}>
              {dashboard.recentActivity?.title || "No recent activity"}
            </Text>
            {dashboard.recentActivity ? (
              <Text style={styles.activityScore}>
                Score: {dashboard.recentActivity.score} /{" "}
                {dashboard.recentActivity.maxScore}
              </Text>
            ) : null}
            <Text style={styles.pendingText}>
              MCQ accuracy: {dashboard.mcqAccuracy || 0}%
            </Text>
            <Text style={styles.pendingText}>
              {dashboard.pendingTasks?.length || 0} pending tasks
            </Text>
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

  logoutButton: {
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  logoutButtonText: {
    color: colors.muted,
    fontWeight: "600",
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

  activityCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
  },

  activityLabel: {
    color: colors.blue,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },

  activityTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
  },

  activityScore: {
    color: colors.green,
    fontSize: 12,
    marginTop: 8,
  },

  pendingText: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 12,
  },

  pressed: {
    opacity: 0.65,
  },
});
