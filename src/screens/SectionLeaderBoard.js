import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  useWindowDimensions,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../constants/colors";

import { getSectionLeaderboard } from "../api/sectionleaderboardapi";

import { getStoredUser } from "../api/authStorage";

const HEADER_SCALE = 1.2;

// ============================================================
// BADGE
// ============================================================

function Badge({ children, variant = "purple" }) {
  return (
    <View style={[styles.badge, variant === "cyan" && styles.badgeCyan]}>
      <Text
        style={[styles.badgeText, variant === "cyan" && styles.badgeTextCyan]}
      >
        {children}
      </Text>
    </View>
  );
}

// ============================================================
// RANK BADGE
// ============================================================

function RankBadge({ rank, current = false }) {
  let icon = null;

  if (!current && rank === 1) {
    icon = "trophy";
  } else if (!current && rank === 2) {
    icon = "medal";
  } else if (!current && rank === 3) {
    icon = "medal-outline";
  }

  return (
    <View
      style={[
        styles.rankBadge,

        rank === 1 && !current && styles.rankOne,

        rank === 2 && !current && styles.rankTwo,

        rank === 3 && !current && styles.rankThree,

        current && styles.rankCurrent,
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={13}
          color={
            rank === 1
              ? colors.yellow
              : rank === 2
                ? colors.text
                : colors.yellow
          }
        />
      ) : null}

      <Text style={[styles.rankText, current && styles.rankCurrentText]}>
        {rank}
      </Text>
    </View>
  );
}

// ============================================================
// LEADERBOARD ROW
// ============================================================

function LeaderboardRow({ student, currentUser = false }) {
  console.log("[leaderboard] Rendering score:", {
    name: student?.name,
    score: student?.score,
    student,
  });

  return (
    <View style={[styles.studentRow, currentUser && styles.currentStudentRow]}>
      {/* ======================================================
          RANK
      ====================================================== */}

      <View style={styles.rankColumn}>
        <RankBadge rank={student.rank} current={currentUser} />
      </View>

      {/* ======================================================
          STUDENT
      ====================================================== */}

      <View style={styles.studentColumn}>
        <View style={styles.nameContainer}>
          <Text
            style={[
              styles.studentName,
              currentUser && styles.currentStudentName,
            ]}
            numberOfLines={1}
          >
            {student.name}
          </Text>

          {currentUser && (
            <View style={styles.youBadge}>
              <Text style={styles.youBadgeText}>YOU</Text>
            </View>
          )}
        </View>
      </View>

      {/* ======================================================
          SCORE
      ====================================================== */}

      <View style={styles.scoreColumn}>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreNumber}>{student.score}</Text>
        </View>
      </View>
    </View>
  );
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function SectionLeaderBoard({ navigation }) {
  const { width } = useWindowDimensions();

  const isSmall = width < 380;

  const isPhone = width < 600;

  const horizontalPadding = isSmall ? 14 : isPhone ? 16 : 32;

  // ==========================================================
  // STATE
  // ==========================================================

  const [leaderboard, setLeaderboard] = useState(null);

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // ==========================================================
  // LOAD SECTION LEADERBOARD
  // ==========================================================

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [leaderboardData, storedUser] = await Promise.all([
        getSectionLeaderboard(),
        getStoredUser(),
      ]);

      console.log("[leaderboard] API response:", leaderboardData);

      setLeaderboard(leaderboardData);

      setUser(storedUser);
    } catch (error) {
      console.log("Section leaderboard error:", error);

      setError(error.message || "Unable to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.purple} />

          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={36}
            color={colors.purple}
          />

          <Text style={styles.errorTitle}>Unable to load leaderboard</Text>

          <Text style={styles.errorText}>{error}</Text>

          <Pressable
            onPress={loadLeaderboard}
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="refresh-outline" size={16} color={colors.white} />

            <Text style={styles.retryText}>RETRY</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // API DATA
  // ==========================================================

  const topStudents = leaderboard?.topStudents || [];

  const currentUser = leaderboard?.myRank || null;

  const studentsAhead = currentUser?.studentsAhead || 0;

  const champion = topStudents.length > 0 ? topStudents[0] : null;

  // ==========================================================
  // USER DATA
  // ==========================================================

  const department = user?.department || "-";

  const semester = user?.semester || "-";

  const section = user?.section || "-";

  const userName =
    user?.name || currentUser?.name?.replace(" (You)", "") || "STUDENT";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* ====================================================
            HEADER
        ==================================================== */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
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

            <View>
              <Text style={styles.headerTitle}>Student Command Centre</Text>

              <Text style={styles.headerWelcome}>
                WELCOME{" "}
                <Text style={styles.headerName}>{userName.toUpperCase()}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* ====================================================
            PAGE CONTENT
        ==================================================== */}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            {
              paddingHorizontal: horizontalPadding,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* ==================================================
              HERO
          ================================================== */}

          <View style={styles.heroCard}>
            <View style={styles.heroBadges}>
              <Badge>SECTION RANKINGS</Badge>

              <Badge variant="cyan">
                {department} · SEM {semester} · SECTION {section}
              </Badge>
            </View>

            <Text style={styles.heroTitle}>MY SECTION LEADERBOARD</Text>

            <Text style={styles.heroDescription}>
              Your real-time standings among classmates based on your
              leaderboard score.
            </Text>
          </View>

          {/* ==================================================
              QUICK STATS
          ================================================== */}

          <View
            style={[
              styles.statsContainer,
              isPhone && styles.statsContainerMobile,
            ]}
          >
            {/* =================================================
                CHAMPION
            ================================================= */}

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.iconCircleGold}>
                  <Ionicons
                    name="trophy-outline"
                    size={16}
                    color={colors.yellow}
                  />
                </View>

                <Text style={styles.goldLabel}>SECTION CHAMPION</Text>
              </View>

              <Text style={styles.championName} numberOfLines={1}>
                {champion?.name || "No data"}
              </Text>

              <Text style={styles.championStats}>
                {champion?.score ?? 0} score
              </Text>
            </View>

            {/* =================================================
                YOUR RANK
            ================================================= */}

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.iconCirclePurple}>
                  <Ionicons
                    name="podium-outline"
                    size={16}
                    color={colors.purple}
                  />
                </View>

                <Text style={styles.purpleLabel}>YOUR RANK</Text>
              </View>

              <View style={styles.rankInfo}>
                <Text style={styles.bigRank}>#{currentUser?.rank ?? "-"}</Text>
              </View>

              <Text style={styles.rankAhead}>
                {studentsAhead} students ahead of you
              </Text>
            </View>
          </View>

          {/* ==================================================
              LEADERBOARD
          ================================================== */}

          <View style={styles.leaderboardCard}>
            {/* =================================================
                CARD HEADER
            ================================================= */}

            <View style={styles.leaderboardHeader}>
              <View>
                <Text style={styles.leaderboardTitle}>
                  TOP STUDENTS IN YOUR SECTION
                </Text>

                <Text style={styles.leaderboardSubtitle}>
                  Current standings
                </Text>
              </View>

              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />

                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>

            {/* =================================================
                SCROLLABLE LEADERBOARD
            ================================================= */}

            <ScrollView
              style={styles.leaderboardScroll}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.table}>
                {/* =============================================
                    TABLE HEADER
                ============================================= */}

                <View style={styles.tableHeader}>
                  <View style={styles.rankColumn}>
                    <Text style={styles.tableHeaderText}>RANK</Text>
                  </View>

                  <View style={styles.studentColumn}>
                    <Text style={styles.tableHeaderText}>STUDENT</Text>
                  </View>

                  <View style={styles.scoreColumn}>
                    <Text style={styles.tableHeaderText}>SCORE</Text>
                  </View>
                </View>

                {/* =============================================
                    TOP STUDENTS
                ============================================= */}

                {topStudents.map((student) => (
                  <LeaderboardRow key={student.id} student={student} />
                ))}

                {/* =============================================
                    SEPARATOR
                ============================================= */}

                {currentUser && (
                  <View style={styles.separator}>
                    <View style={styles.separatorLine} />

                    <Text style={styles.separatorText}>YOUR POSITION</Text>

                    <View style={styles.separatorLine} />
                  </View>
                )}

                {/* =============================================
                    CURRENT USER
                ============================================= */}

                {currentUser && (
                  <LeaderboardRow student={currentUser} currentUser={true} />
                )}
              </View>
            </ScrollView>
          </View>

          {/* ==================================================
              FOOTER INFO
          ================================================== */}

          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={colors.mutedDark}
            />

            <Text style={styles.infoText}>
              Rankings are calculated using the score provided by the Section
              Leaderboard service.
            </Text>
          </View>

          <View style={styles.bottomSpace} />
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
  // ROOT
  // ==========================================================

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingTop: 18,
    paddingBottom: 40,
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    minHeight: 70 * HEADER_SCALE,

    paddingHorizontal: 16 * HEADER_SCALE,

    flexDirection: "row",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: colors.border,

    backgroundColor: colors.background,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuButton: {
    width: 42 * HEADER_SCALE,

    height: 42 * HEADER_SCALE,

    borderRadius: 11 * HEADER_SCALE,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 11 * HEADER_SCALE,
  },

  headerTitle: {
    color: colors.text,

    fontSize: 16 * HEADER_SCALE,

    fontWeight: "700",
  },

  headerWelcome: {
    color: colors.muted,

    fontSize: 7.5 * HEADER_SCALE,

    fontWeight: "700",

    letterSpacing: 1,

    marginTop: 3 * HEADER_SCALE,
  },

  headerName: {
    color: colors.text,
  },

  // ==========================================================
  // HERO
  // ==========================================================

  heroCard: {
    backgroundColor: colors.card,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 17,

    minHeight: 175,

    paddingHorizontal: 20,
    paddingVertical: 28,

    alignItems: "center",
    justifyContent: "center",
  },

  heroBadges: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    flexWrap: "wrap",

    gap: 8,

    marginBottom: 14,
  },

  badge: {
    paddingHorizontal: 11,
    paddingVertical: 6,

    borderRadius: 20,

    backgroundColor: colors.purpleDark,

    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },

  badgeCyan: {
    backgroundColor: colors.blueDark,

    borderColor: colors.cyanDark,
  },

  badgeText: {
    color: colors.purple,

    fontSize: 8,
    fontWeight: "800",

    letterSpacing: 0.8,
  },

  badgeTextCyan: {
    color: colors.cyan,
  },

  heroTitle: {
    color: colors.text,

    fontSize: 26,
    fontWeight: "500",

    letterSpacing: -0.8,

    textAlign: "center",
  },

  heroDescription: {
    maxWidth: 600,

    marginTop: 10,

    color: colors.muted,

    fontSize: 11,

    lineHeight: 18,

    textAlign: "center",
  },

  // ==========================================================
  // QUICK STATS
  // ==========================================================

  statsContainer: {
    flexDirection: "row",

    gap: 14,

    marginTop: 16,
  },

  statsContainerMobile: {
    flexDirection: "column",
  },

  statCard: {
    flex: 1,

    minHeight: 122,

    padding: 17,

    backgroundColor: colors.card,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 15,
  },

  statHeader: {
    flexDirection: "row",
    alignItems: "center",

    gap: 8,
  },

  iconCircleGold: {
    width: 28,
    height: 28,

    borderRadius: 8,

    backgroundColor: colors.yellowDark,

    alignItems: "center",
    justifyContent: "center",
  },

  iconCirclePurple: {
    width: 28,
    height: 28,

    borderRadius: 8,

    backgroundColor: colors.purpleDark,

    alignItems: "center",
    justifyContent: "center",
  },

  goldLabel: {
    color: colors.yellow,

    fontSize: 8,
    fontWeight: "800",

    letterSpacing: 0.8,
  },

  purpleLabel: {
    color: colors.purple,

    fontSize: 8,
    fontWeight: "800",

    letterSpacing: 0.8,
  },

  championName: {
    color: colors.text,

    fontSize: 19,
    fontWeight: "600",

    marginTop: 10,
  },

  championStats: {
    color: colors.muted,

    fontSize: 10,

    marginTop: 4,
  },

  rankInfo: {
    flexDirection: "row",
    alignItems: "baseline",

    marginTop: 7,
  },

  bigRank: {
    color: colors.text,

    fontSize: 27,
    fontWeight: "600",
  },

  rankAhead: {
    color: colors.muted,

    fontSize: 10,

    marginTop: 7,
  },

  // ==========================================================
  // LEADERBOARD CARD
  // ==========================================================

  leaderboardCard: {
    marginTop: 16,

    padding: 15,

    backgroundColor: colors.card,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 16,
  },

  leaderboardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 14,
  },

  leaderboardTitle: {
    color: colors.text,

    fontSize: 15,
    fontWeight: "600",
  },

  leaderboardSubtitle: {
    color: colors.mutedDark,

    fontSize: 9,

    marginTop: 3,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 20,

    backgroundColor: colors.greenDark,

    borderWidth: 1,
    borderColor: colors.greenDark,
  },

  liveDot: {
    width: 5,
    height: 5,

    borderRadius: 5,

    backgroundColor: colors.green,

    marginRight: 5,
  },

  liveText: {
    color: colors.green,

    fontSize: 7,
    fontWeight: "800",

    letterSpacing: 0.8,
  },

  // ==========================================================
  // LEADERBOARD SCROLL
  // ==========================================================

  leaderboardScroll: {
    maxHeight: 360,
  },

  // ==========================================================
  // TABLE
  // ==========================================================

  table: {
    overflow: "hidden",

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 12,
  },

  tableHeader: {
    minHeight: 48,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: colors.background,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  tableHeaderText: {
    color: colors.muted,

    fontSize: 7.5,
    fontWeight: "800",

    letterSpacing: 0.7,
  },

  // ==========================================================
  // COLUMNS
  // ==========================================================

  rankColumn: {
    width: "16%",

    paddingLeft: 10,
  },

  studentColumn: {
    flex: 1,

    paddingRight: 6,
  },

  scoreColumn: {
    width: "21%",

    paddingRight: 10,
  },

  // ==========================================================
  // STUDENT ROW
  // ==========================================================

  studentRow: {
    minHeight: 70,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: colors.footer,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  currentStudentRow: {
    backgroundColor: colors.purpleDark,

    borderBottomWidth: 0,
  },

  // ==========================================================
  // RANK
  // ==========================================================

  rankBadge: {
    width: 27,
    height: 27,

    borderRadius: 9,

    backgroundColor: colors.blueDark,

    borderWidth: 1,
    borderColor: colors.borderLight,

    alignItems: "center",
    justifyContent: "center",

    flexDirection: "row",

    gap: 3,
  },

  rankOne: {
    backgroundColor: colors.yellowDark,

    borderColor: colors.yellow,
  },

  rankTwo: {
    backgroundColor: colors.surface3,

    borderColor: colors.borderLight,
  },

  rankThree: {
    backgroundColor: colors.yellowDark,

    borderColor: colors.yellow,
  },

  rankCurrent: {
    backgroundColor: colors.purpleDark,

    borderColor: colors.purpleBorder,
  },

  rankText: {
    color: colors.text,

    fontSize: 10,
    fontWeight: "800",
  },

  rankCurrentText: {
    color: colors.purple,
  },

  // ==========================================================
  // STUDENT
  // ==========================================================

  nameContainer: {
    flexDirection: "row",
    alignItems: "center",

    gap: 5,
  },

  studentName: {
    color: colors.text,

    fontSize: 11,
    fontWeight: "700",

    flexShrink: 1,
  },

  currentStudentName: {
    color: colors.purple,
  },

  youBadge: {
    paddingHorizontal: 5,
    paddingVertical: 3,

    borderRadius: 5,

    backgroundColor: colors.primary,
  },

  youBadgeText: {
    color: colors.white,

    fontSize: 6,
    fontWeight: "900",

    letterSpacing: 0.5,
  },

  // ==========================================================
  // SCORE
  // ==========================================================

  scoreBadge: {
    alignSelf: "flex-start",

    minWidth: 36,

    paddingHorizontal: 7,
    paddingVertical: 5,

    borderRadius: 7,

    backgroundColor: colors.background,

    borderWidth: 1,
    borderColor: colors.border,

    alignItems: "center",
  },

  scoreNumber: {
    color: colors.text,

    fontSize: 9,
    fontWeight: "800",
  },

  // ==========================================================
  // SEPARATOR
  // ==========================================================

  separator: {
    minHeight: 35,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,

    backgroundColor: colors.background,

    gap: 8,
  },

  separatorLine: {
    flex: 1,

    height: 1,

    backgroundColor: colors.border,
  },

  separatorText: {
    color: colors.mutedDark,

    fontSize: 6.5,
    fontWeight: "800",

    letterSpacing: 0.8,
  },

  // ==========================================================
  // INFO
  // ==========================================================

  infoCard: {
    marginTop: 12,

    padding: 13,

    borderRadius: 12,

    backgroundColor: colors.card,

    borderWidth: 1,
    borderColor: colors.border,

    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    flex: 1,

    color: colors.mutedDark,

    fontSize: 8.5,

    lineHeight: 14,

    marginLeft: 9,
  },

  // ==========================================================
  // LOADING
  // ==========================================================

  loadingContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
  },

  loadingText: {
    color: colors.muted,

    fontSize: 11,

    marginTop: 12,
  },

  // ==========================================================
  // ERROR
  // ==========================================================

  errorContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
  },

  errorTitle: {
    color: colors.text,

    fontSize: 15,
    fontWeight: "700",

    marginTop: 12,

    textAlign: "center",
  },

  errorText: {
    color: colors.muted,

    fontSize: 10,

    marginTop: 6,

    textAlign: "center",

    lineHeight: 16,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginTop: 18,

    paddingHorizontal: 18,
    paddingVertical: 10,

    borderRadius: 9,

    backgroundColor: colors.primary,
  },

  retryText: {
    color: colors.white,

    fontSize: 9,
    fontWeight: "800",

    marginLeft: 7,

    letterSpacing: 0.5,
  },

  // ==========================================================
  // PRESS STATE
  // ==========================================================

  pressed: {
    opacity: 0.65,
  },

  // ==========================================================
  // BOTTOM SPACE
  // ==========================================================

  bottomSpace: {
    height: 20,
  },
});
