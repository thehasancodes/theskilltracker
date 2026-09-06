import React from "react";
import {
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

/* =========================================================
   MOCK DATA
   Replace this with API data later
========================================================= */

const TOP_STUDENTS = [
  {
    rank: 1,
    name: "Merina Sonowal",
    email: "merinasonowal094@gmail.com",
    solved: 53,
    mcq: "0 / 0",
  },
  {
    rank: 2,
    name: "Bhumika Barman",
    email: "barmanhbumika2005@gmail.com",
    solved: 52,
    mcq: "0 / 0",
  },
  {
    rank: 3,
    name: "Abhijit Sharma",
    email: "abhijitsharmaadtu19@gmail.com",
    solved: 50,
    mcq: "0 / 0",
  },
];

const CURRENT_USER = {
  rank: 12,
  name: "Sourav Pratim Kashyap",
  email: "souravpratim01@gmail.com",
  solved: 0,
  mcq: "0 / 0",
};

const TOTAL_STUDENTS = 13;

/* =========================================================
   BADGE
========================================================= */

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

/* =========================================================
   RANK MEDAL
========================================================= */

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
          color={rank === 1 ? "#fbbf24" : rank === 2 ? "#cbd5e1" : "#d97706"}
        />
      ) : null}

      <Text style={[styles.rankText, current && styles.rankCurrentText]}>
        {rank}
      </Text>
    </View>
  );
}

/* =========================================================
   LEADERBOARD ROW
========================================================= */

function LeaderboardRow({ student, currentUser = false }) {
  return (
    <View style={[styles.studentRow, currentUser && styles.currentStudentRow]}>
      {/* Rank */}
      <View style={styles.rankColumn}>
        <RankBadge rank={student.rank} current={currentUser} />
      </View>

      {/* Student */}
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

        <Text
          style={styles.studentEmail}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {student.email}
        </Text>
      </View>

      {/* Problems */}
      <View style={styles.solvedColumn}>
        <View style={styles.solvedBadge}>
          <Text style={styles.solvedNumber}>{student.solved}</Text>
        </View>
      </View>

      {/* MCQ */}
      <View style={styles.mcqColumn}>
        <Text style={styles.mcqScore}>{student.mcq}</Text>

        <Text style={styles.mcqLabel}>marks</Text>
      </View>
    </View>
  );
}

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function SectionLeaderBoard({ navigation }) {
  const { width } = useWindowDimensions();

  const isSmall = width < 380;
  const isPhone = width < 600;

  const horizontalPadding = isSmall ? 14 : isPhone ? 16 : 32;

  const studentsAhead = CURRENT_USER.rank - 1;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={({ pressed }) => [
                styles.menuButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="menu" size={23} color={colors.text} />
            </Pressable>

            <View>
              <Text style={styles.headerTitle}>Student Command Centre</Text>

              <Text style={styles.headerWelcome}>
                WELCOME{" "}
                <Text style={styles.headerName}>
                  {CURRENT_USER.name.toUpperCase()}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            CONTENT
        ================================================= */}

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
          {/* =================================================
              HERO
          ================================================= */}

          <View style={styles.heroCard}>
            <View style={styles.heroBadges}>
              <Badge>SECTION RANKINGS</Badge>

              <Badge variant="cyan">BTECH · SEM 5 · SECTION B</Badge>
            </View>

            <Text style={styles.heroTitle}>MY SECTION LEADERBOARD</Text>

            <Text style={styles.heroDescription}>
              Your real-time standings among classmates based on problems solved
              and lab MCQ scores.
            </Text>
          </View>

          {/* =================================================
              QUICK STATS
          ================================================= */}

          <View
            style={[
              styles.statsContainer,
              isPhone && styles.statsContainerMobile,
            ]}
          >
            {/* Champion */}

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.iconCircleGold}>
                  <Ionicons name="trophy-outline" size={16} color="#fbbf24" />
                </View>

                <Text style={styles.goldLabel}>SECTION CHAMPION</Text>
              </View>

              <Text style={styles.championName} numberOfLines={1}>
                {TOP_STUDENTS[0].name}
              </Text>

              <Text style={styles.championStats}>
                {TOP_STUDENTS[0].solved} problems
                {"  ·  "}
                {TOP_STUDENTS[0].mcq} marks
              </Text>
            </View>

            {/* Your Rank */}

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.iconCirclePurple}>
                  <Ionicons name="podium-outline" size={16} color="#818cf8" />
                </View>

                <Text style={styles.purpleLabel}>YOUR RANK</Text>
              </View>

              <View style={styles.rankInfo}>
                <Text style={styles.bigRank}>#{CURRENT_USER.rank}</Text>

                <Text style={styles.rankOf}>of {TOTAL_STUDENTS} students</Text>
              </View>

              <Text style={styles.rankAhead}>
                {studentsAhead} students ahead of you
              </Text>
            </View>
          </View>

          {/* =================================================
              LEADERBOARD
          ================================================= */}

          <View style={styles.leaderboardCard}>
            {/* Card Header */}

            <View style={styles.leaderboardHeader}>
              <View>
                <Text style={styles.leaderboardTitle}>
                  TOP 3 IN YOUR SECTION
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

            {/* Table */}

            <View style={styles.table}>
              {/* Header */}

              <View style={styles.tableHeader}>
                <View style={styles.rankColumn}>
                  <Text style={styles.tableHeaderText}>RANK</Text>
                </View>

                <View style={styles.studentColumn}>
                  <Text style={styles.tableHeaderText}>STUDENT</Text>
                </View>

                <View style={styles.solvedColumn}>
                  <Text style={styles.tableHeaderText}>SOLVED</Text>
                </View>

                <View style={styles.mcqColumn}>
                  <Text style={styles.tableHeaderText}>MCQ</Text>
                </View>
              </View>

              {/* Students */}

              {TOP_STUDENTS.map((student) => (
                <LeaderboardRow key={student.rank} student={student} />
              ))}

              {/* Separator */}

              <View style={styles.separator}>
                <View style={styles.separatorLine} />

                <Text style={styles.separatorText}>YOUR POSITION</Text>

                <View style={styles.separatorLine} />
              </View>

              {/* Current User */}

              <LeaderboardRow student={CURRENT_USER} currentUser />
            </View>
          </View>

          {/* =================================================
              FOOTER INFO
          ================================================= */}

          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#64748b"
            />

            <Text style={styles.infoText}>
              Rankings are calculated using your solved problems and lab MCQ
              performance.
            </Text>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* -------------------------------------------------------
     ROOT
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     HEADER
  ------------------------------------------------------- */

  header: {
    minHeight: 70,

    paddingHorizontal: 16,
    paddingVertical: 10,

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
    width: 42,
    height: 42,

    borderRadius: 11,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  headerTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },

  headerWelcome: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.7,
    marginTop: 3,
  },

  headerName: {
    color: "#b6becb",
  },

  /* -------------------------------------------------------
     HERO
  ------------------------------------------------------- */

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

    backgroundColor: "#211d46",

    borderWidth: 1,
    borderColor: "#4c43a4",
  },

  badgeCyan: {
    backgroundColor: "#102d36",
    borderColor: "#155e75",
  },

  badgeText: {
    color: "#938aff",

    fontSize: 8,
    fontWeight: "800",

    letterSpacing: 0.8,
  },

  badgeTextCyan: {
    color: "#22d3ee",
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

    color: "#7899ba",

    fontSize: 11,

    lineHeight: 18,

    textAlign: "center",
  },

  /* -------------------------------------------------------
     STATS
  ------------------------------------------------------- */

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

    backgroundColor: "#261a05",

    alignItems: "center",
    justifyContent: "center",
  },

  iconCirclePurple: {
    width: 28,
    height: 28,

    borderRadius: 8,

    backgroundColor: "#211d46",

    alignItems: "center",
    justifyContent: "center",
  },

  goldLabel: {
    color: "#fbbf24",

    fontSize: 8,
    fontWeight: "800",

    letterSpacing: 0.8,
  },

  purpleLabel: {
    color: "#818cf8",

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
    color: "#94a3b8",

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

  rankOf: {
    color: "#64748b",

    fontSize: 10,

    marginLeft: 5,
  },

  rankAhead: {
    color: "#94a3b8",

    fontSize: 10,

    marginTop: 2,
  },

  /* -------------------------------------------------------
     LEADERBOARD CARD
  ------------------------------------------------------- */

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
    color: "#64748b",

    fontSize: 9,

    marginTop: 3,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 20,

    backgroundColor: "#10241d",

    borderWidth: 1,
    borderColor: "#164e3a",
  },

  liveDot: {
    width: 5,
    height: 5,

    borderRadius: 5,

    backgroundColor: "#6ee7b7",

    marginRight: 5,
  },

  liveText: {
    color: "#6ee7b7",

    fontSize: 7,
    fontWeight: "800",

    letterSpacing: 0.8,
  },

  /* -------------------------------------------------------
     TABLE
  ------------------------------------------------------- */

  table: {
    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#262626",

    borderRadius: 12,
  },

  tableHeader: {
    minHeight: 48,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#090909",

    borderBottomWidth: 1,
    borderBottomColor: "#292929",
  },

  tableHeaderText: {
    color: "#6f91b4",

    fontSize: 7.5,
    fontWeight: "800",

    letterSpacing: 0.7,
  },

  /* -------------------------------------------------------
     COLUMNS
  ------------------------------------------------------- */

  rankColumn: {
    width: "14%",

    paddingLeft: 10,
  },

  studentColumn: {
    width: "44%",

    paddingRight: 6,
  },

  solvedColumn: {
    width: "19%",
  },

  mcqColumn: {
    flex: 1,

    paddingRight: 10,
  },

  /* -------------------------------------------------------
     STUDENT ROW
  ------------------------------------------------------- */

  studentRow: {
    minHeight: 70,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#0b0b0b",

    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },

  currentStudentRow: {
    backgroundColor: "#141329",

    borderBottomWidth: 0,
  },

  /* -------------------------------------------------------
     RANK
  ------------------------------------------------------- */

  rankBadge: {
    width: 27,
    height: 27,

    borderRadius: 9,

    backgroundColor: "#18202c",

    borderWidth: 1,
    borderColor: "#334155",

    alignItems: "center",
    justifyContent: "center",

    flexDirection: "row",

    gap: 3,
  },

  rankOne: {
    backgroundColor: "#261a05",
    borderColor: "#8a5700",
  },

  rankTwo: {
    backgroundColor: "#1b2532",
    borderColor: "#475569",
  },

  rankThree: {
    backgroundColor: "#241806",
    borderColor: "#8a5700",
  },

  rankCurrent: {
    backgroundColor: "#211d46",
    borderColor: "#4c43a4",
  },

  rankText: {
    color: colors.text,

    fontSize: 10,
    fontWeight: "800",
  },

  rankCurrentText: {
    color: "#a5b4fc",
  },

  /* -------------------------------------------------------
     STUDENT
  ------------------------------------------------------- */

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
    color: "#c7c9ff",
  },

  studentEmail: {
    color: "#648db5",

    fontSize: 7.5,

    marginTop: 4,

    flexShrink: 1,
  },

  youBadge: {
    paddingHorizontal: 5,
    paddingVertical: 3,

    borderRadius: 5,

    backgroundColor: "#5b4de8",
  },

  youBadgeText: {
    color: "#ffffff",

    fontSize: 6,
    fontWeight: "900",

    letterSpacing: 0.5,
  },

  /* -------------------------------------------------------
     SOLVED
  ------------------------------------------------------- */

  solvedBadge: {
    alignSelf: "flex-start",

    minWidth: 30,

    paddingHorizontal: 7,
    paddingVertical: 5,

    borderRadius: 7,

    backgroundColor: "#090909",

    borderWidth: 1,
    borderColor: "#292929",

    alignItems: "center",
  },

  solvedNumber: {
    color: colors.text,

    fontSize: 9,
    fontWeight: "800",
  },

  /* -------------------------------------------------------
     MCQ
  ------------------------------------------------------- */

  mcqScore: {
    color: colors.text,

    fontSize: 9,
    fontWeight: "800",
  },

  mcqLabel: {
    color: "#64748b",

    fontSize: 7,

    marginTop: 2,
  },

  /* -------------------------------------------------------
     SEPARATOR
  ------------------------------------------------------- */

  separator: {
    minHeight: 35,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,

    backgroundColor: "#090909",

    gap: 8,
  },

  separatorLine: {
    flex: 1,

    height: 1,

    backgroundColor: "#242424",
  },

  separatorText: {
    color: "#555555",

    fontSize: 6.5,
    fontWeight: "800",

    letterSpacing: 0.8,
  },

  /* -------------------------------------------------------
     INFO
  ------------------------------------------------------- */

  infoCard: {
    marginTop: 12,

    padding: 13,

    borderRadius: 12,

    backgroundColor: "#0d0d0d",

    borderWidth: 1,
    borderColor: "#202020",

    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    flex: 1,

    color: "#64748b",

    fontSize: 8.5,

    lineHeight: 14,

    marginLeft: 9,
  },

  bottomSpace: {
    height: 20,
  },

  pressed: {
    opacity: 0.65,
  },
});
