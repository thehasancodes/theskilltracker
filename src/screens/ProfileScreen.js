import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { getProfileData } from "../api/profileApi";
import { colors as COLORS } from "../constants/colors";

const SCALE = 1.2;

// ============================================================
// SMALL REUSABLE COMPONENTS
// ============================================================

function SectionHeading({ eyebrow, title, description }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionEyebrow}>{eyebrow}</Text>

      <Text style={styles.sectionTitle}>{title}</Text>

      {description ? (
        <Text style={styles.sectionDescription}>{description}</Text>
      ) : null}
    </View>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({ icon, label, value, suffix, type = "blue" }) {
  const accent =
    type === "purple"
      ? COLORS.purple
      : type === "green"
        ? COLORS.green
        : type === "yellow"
          ? COLORS.yellow
          : COLORS.blue;

  const iconBackground =
    type === "purple"
      ? COLORS.purpleDark
      : type === "green"
        ? COLORS.greenDark
        : type === "yellow"
          ? COLORS.yellowDark
          : COLORS.blueDark;

  return (
    <View style={styles.statCard}>
      <View
        style={[
          styles.statIcon,
          {
            backgroundColor: iconBackground,
          },
        ]}
      >
        <Ionicons name={icon} size={16 * SCALE} color={accent} />
      </View>

      <Text style={styles.statLabel}>{label}</Text>

      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{value}</Text>

        {suffix ? <Text style={styles.statSuffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

// ============================================================
// PROFILE SCREEN
// ============================================================

export default function ProfileScreen({ navigation }) {
  const [showSemesterTable, setShowSemesterTable] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState(false);

  useEffect(() => {
    let mounted = true;

    getProfileData()
      .then((data) => {
        if (mounted) {
          setProfile(data);
        }
      })
      .catch(() => {
        if (mounted) {
          setProfileError(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!profile) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.loadingContainer}>
          {profileError ? (
            <Text style={styles.loadingText}>Unable to load profile.</Text>
          ) : (
            <>
              <ActivityIndicator size="small" color={COLORS.purple} />
              <Text style={styles.loadingText}>Loading profile...</Text>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const { student, academic, semesters, placement } = profile;

  // ==========================================================
  // HANDLERS
  // ==========================================================

  const openDrawer = () => {
    navigation?.openDrawer?.();
  };

  const handleEditProfile = () => {
    console.log("Edit Profile");
  };

  const handlePlacementRecord = () => {
    console.log("Placement Record");
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* ====================================================
            HEADER
        ==================================================== */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable
              onPress={openDrawer}
              style={({ pressed }) => [
                styles.menuButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="menu" size={22 * SCALE} color={COLORS.text} />
            </Pressable>

            <View>
              <Text style={styles.headerTitle}>Student Command Centre</Text>

              <Text style={styles.headerSubtitle}>PROFILE</Text>
            </View>
          </View>
        </View>

        {/* ====================================================
            SCROLL CONTENT
        ==================================================== */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* ==================================================
              STUDENT INFORMATION
          ================================================== */}

          <View style={styles.heroCard}>
            {/* ------------------------------------------------
                HERO TOP
            ------------------------------------------------ */}
            <View style={styles.heroTop}>
              {/* Avatar */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {student.name
                    .split(" ")
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </Text>
              </View>

              {/* Student Identity */}
              <View style={styles.heroIdentity}>
                <Text style={styles.studentName}>{student.name}</Text>

                <Text style={styles.enrollment}>{student.enrollmentNo}</Text>
              </View>

              {/* RIGHT SIDE */}
              <View style={styles.heroRight}>
                <View style={styles.verifiedBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={12 * SCALE}
                    color={COLORS.green}
                  />

                  <Text style={styles.verifiedText}>VERIFIED</Text>
                </View>

                <Pressable
                  onPress={handleEditProfile}
                  style={({ pressed }) => [
                    styles.heroEditButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons
                    name="create-outline"
                    size={16 * SCALE}
                    color={COLORS.blue}
                  />
                </Pressable>
              </View>
            </View>

            {/* ==================================================
                STUDENT DETAILS
            ================================================== */}

            <View style={styles.studentDetails}>
              {/* Department */}

              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons
                    name="school-outline"
                    size={14 * SCALE}
                    color={COLORS.muted}
                  />
                </View>

                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>DEPARTMENT</Text>

                  <Text style={styles.detailValue}>{student.department}</Text>
                </View>
              </View>

              {/* Semester */}

              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons
                    name="layers-outline"
                    size={14 * SCALE}
                    color={COLORS.muted}
                  />
                </View>

                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>SEMESTER</Text>

                  <Text style={styles.detailValue}>{student.semester}</Text>
                </View>
              </View>

              {/* Section */}

              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons
                    name="people-outline"
                    size={14 * SCALE}
                    color={COLORS.muted}
                  />
                </View>

                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>SECTION</Text>

                  <Text style={styles.detailValue}>{student.section}</Text>
                </View>
              </View>

              {/* Technical Track */}

              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons
                    name="code-slash-outline"
                    size={14 * SCALE}
                    color={COLORS.muted}
                  />
                </View>

                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>TECHNICAL TRACK</Text>

                  <Text style={styles.detailValue}>{student.track}</Text>
                </View>
              </View>
            </View>

            {/* Divider */}

            <View style={styles.heroDivider} />

            {/* Email */}

            <View style={styles.emailRow}>
              <Ionicons
                name="mail-outline"
                size={15 * SCALE}
                color={COLORS.muted}
              />

              <Text style={styles.emailText} numberOfLines={1}>
                {student.email}
              </Text>
            </View>
          </View>

          {/* ==================================================
              ACADEMIC OVERVIEW
          ================================================== */}

          <SectionHeading
            eyebrow="ACADEMIC"
            title="Academic Overview"
            description="A quick view of your current academic standing."
          />

          <View style={styles.statsGrid}>
            <StatCard
              icon="stats-chart-outline"
              label="CUMULATIVE CGPA"
              value={academic.cgpa}
              suffix="/ 10"
              type="purple"
            />

            <StatCard
              icon="time-outline"
              label="ATTENDANCE"
              value={academic.attendance}
              type="blue"
            />

            <StatCard
              icon="checkmark-circle-outline"
              label="BACKLOGS"
              value={academic.backlogs}
              suffix="Active"
              type="green"
            />
          </View>

          {/* ==================================================
              SEMESTER RECORD
          ================================================== */}

          <SectionHeading
            eyebrow="ACADEMIC JOURNEY"
            title="Semester Record"
            description="View your complete semester-wise academic history."
          />

          <View style={styles.semesterRecordCard}>
            {/* Record Header */}

            <View style={styles.semesterRecordHeader}>
              <View style={styles.semesterRecordHeaderLeft}>
                <Text style={styles.semesterRecordTitle}>Academic History</Text>

                <Text style={styles.semesterRecordSubtitle}>
                  {semesters.length} semesters available
                </Text>
              </View>

              <View style={styles.semesterRecordIcon}>
                <Ionicons
                  name="school-outline"
                  size={18 * SCALE}
                  color={COLORS.purple}
                />
              </View>
            </View>

            {/* View Record Button */}

            <Pressable
              onPress={() => setShowSemesterTable(!showSemesterTable)}
              style={({ pressed }) => [
                styles.semesterViewButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.semesterViewButtonText}>
                {showSemesterTable
                  ? "Hide Complete Record"
                  : "View Complete Record"}
              </Text>

              <Ionicons
                name={showSemesterTable ? "chevron-up" : "arrow-forward"}
                size={15 * SCALE}
                color={COLORS.blue}
              />
            </Pressable>

            {/* ==================================================
                SEMESTER TABLE
            ================================================== */}

            {showSemesterTable && (
              <View style={styles.semesterTableWrapper}>
                {/* Table Header */}

                <View style={styles.tableHeader}>
                  <View style={styles.semesterColumn}>
                    <Text style={styles.tableHeaderText}>SEMESTER</Text>
                  </View>

                  <View style={styles.tableColumn}>
                    <Text style={styles.tableHeaderText}>SGPA</Text>
                  </View>

                  <View style={styles.tableColumn}>
                    <Text style={styles.tableHeaderText}>BACKLOGS</Text>
                  </View>

                  <View style={styles.tableColumn}>
                    <Text style={styles.tableHeaderText}>ATT.</Text>
                  </View>

                  <View style={styles.statusColumn}>
                    <Text style={styles.tableHeaderText}>STATUS</Text>
                  </View>
                </View>

                {/* Table Rows */}

                {semesters.map((item, index) => {
                  const isCurrent = item.status === "Current";

                  const isUpcoming = item.status === "Upcoming";

                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.tableRow,

                        index === semesters.length - 1 && styles.lastTableRow,
                      ]}
                    >
                      {/* Semester */}

                      <View style={styles.semesterColumn}>
                        <View style={styles.semesterCell}>
                          <View
                            style={[
                              styles.tableDot,

                              isCurrent && {
                                backgroundColor: COLORS.purple,
                              },

                              isUpcoming && {
                                backgroundColor: COLORS.mutedDark,
                              },
                            ]}
                          />

                          <Text style={styles.tableCellText} numberOfLines={1}>
                            {item.semester.replace("Semester ", "Sem ")}
                          </Text>
                        </View>
                      </View>

                      {/* SGPA */}

                      <View style={styles.tableColumn}>
                        <Text style={styles.tableCellText}>{item.sgpa}</Text>
                      </View>

                      {/* Backlogs */}

                      <View style={styles.tableColumn}>
                        <Text
                          style={[
                            styles.tableCellText,

                            item.backlogs === 0 && styles.greenValue,
                          ]}
                        >
                          {item.backlogs}
                        </Text>
                      </View>

                      {/* Attendance */}

                      <View style={styles.tableColumn}>
                        <Text style={styles.tableCellText}>
                          {item.attendance}
                        </Text>
                      </View>

                      {/* Status */}

                      <View style={styles.statusColumn}>
                        <View
                          style={[
                            styles.statusBadge,

                            isCurrent && styles.statusBadgeCurrent,

                            isUpcoming && styles.statusBadgeUpcoming,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,

                              isCurrent && styles.statusBadgeTextCurrent,

                              isUpcoming && styles.statusBadgeTextUpcoming,
                            ]}
                            numberOfLines={1}
                          >
                            {item.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* ==================================================
              PLACEMENT PROFILE
          ================================================== */}

          <SectionHeading
            eyebrow="PLACEMENT"
            title="Placement Profile"
            description="Information used for placement readiness."
          />

          <View style={styles.placementCard}>
            <View style={styles.placementHeader}>
              <View style={styles.placementIcon}>
                <Ionicons
                  name="briefcase-outline"
                  size={19 * SCALE}
                  color={COLORS.blue}
                />
              </View>

              <View>
                <Text style={styles.placementTitle}>Placement Readiness</Text>

                <Text style={styles.placementSubtitle}>
                  Your placement profile status
                </Text>
              </View>
            </View>

            <View style={styles.placementDivider} />

            <View style={styles.placementRows}>
              {/* Technical Track */}

              <View style={styles.placementRow}>
                <Text style={styles.placementLabel}>Technical Track</Text>

                <View style={styles.trackBadge}>
                  <Text style={styles.trackBadgeText}>
                    {placement.technicalTrack}
                  </Text>
                </View>
              </View>

              {/* Readiness */}

              <View style={styles.placementRow}>
                <Text style={styles.placementLabel}>Readiness</Text>

                <Text style={styles.placementValue}>{placement.readiness}</Text>
              </View>

              {/* Placement Status */}

              <View style={styles.placementRow}>
                <Text style={styles.placementLabel}>Placement Status</Text>

                <Text style={styles.placementValueMuted}>
                  {placement.placementStatus}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handlePlacementRecord}
              style={({ pressed }) => [
                styles.placementButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.placementButtonText}>
                View Placement Record
              </Text>

              <Ionicons
                name="arrow-forward"
                size={14 * SCALE}
                color={COLORS.blue}
              />
            </Pressable>
          </View>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <View style={styles.footer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14 * SCALE}
              color={COLORS.mutedDark}
            />

            <Text style={styles.footerText}>
              Your academic information is securely maintained for official
              placement use.
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
    backgroundColor: COLORS.background,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  loadingText: {
    color: COLORS.muted,
    marginTop: 10,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 16 * SCALE,
    paddingTop: 18 * SCALE,
    paddingBottom: 40 * SCALE,
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    minHeight: 70 * SCALE,
    paddingHorizontal: 16 * SCALE,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuButton: {
    width: 42 * SCALE,
    height: 42 * SCALE,

    borderRadius: 11 * SCALE,

    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.border,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 11 * SCALE,
  },

  headerTitle: {
    color: COLORS.white,

    fontSize: 16 * SCALE,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: COLORS.muted,

    fontSize: 7.5 * SCALE,
    fontWeight: "700",

    letterSpacing: 1,

    marginTop: 3 * SCALE,
  },

  headerBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 9 * SCALE,
    paddingVertical: 6 * SCALE,

    borderRadius: 20 * SCALE,

    backgroundColor: COLORS.surface2,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  headerBadgeDot: {
    width: 5 * SCALE,
    height: 5 * SCALE,

    borderRadius: 3,

    backgroundColor: COLORS.green,

    marginRight: 5 * SCALE,
  },

  headerBadgeText: {
    color: COLORS.muted,

    fontSize: 7 * SCALE,
    fontWeight: "800",

    letterSpacing: 0.7,
  },

  // ==========================================================
  // HERO
  // ==========================================================

  heroCard: {
    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 17 * SCALE,

    padding: 16 * SCALE,
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 65 * SCALE,
    height: 65 * SCALE,

    borderRadius: 33 * SCALE,

    backgroundColor: COLORS.purpleDark,

    borderWidth: 1,
    borderColor: COLORS.purpleBorder,

    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: COLORS.purple,

    fontSize: 20 * SCALE,
    fontWeight: "800",

    letterSpacing: 0.5,
  },

  heroIdentity: {
    flex: 1,

    marginLeft: 14 * SCALE,
  },

  verifiedRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 6 * SCALE,
  },

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 5 * SCALE,
    paddingVertical: 4 * SCALE,

    borderRadius: 20 * SCALE,

    backgroundColor: COLORS.greenDark,

    borderWidth: 1,
    borderColor: COLORS.greenDark,
  },

  verifiedText: {
    color: COLORS.green,

    fontSize: 6.5 * SCALE,
    fontWeight: "800",

    letterSpacing: 0.5,

    marginLeft: 4 * SCALE,
  },

  studentName: {
    color: COLORS.white,

    fontSize: 17 * SCALE,
    fontWeight: "700",

    lineHeight: 21 * SCALE,
  },

  enrollment: {
    color: COLORS.muted,

    fontSize: 8.5 * SCALE,

    marginTop: 3 * SCALE,
  },

  // ==========================================================
  // STUDENT DETAILS
  // ==========================================================

  studentDetails: {
    flexDirection: "row",
    flexWrap: "wrap",

    marginTop: 16 * SCALE,

    marginHorizontal: -5 * SCALE,
  },

  detailItem: {
    width: "50%",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 5 * SCALE,

    marginBottom: 14 * SCALE,
  },

  detailIcon: {
    width: 31 * SCALE,
    height: 31 * SCALE,

    borderRadius: 9 * SCALE,

    backgroundColor: COLORS.surface2,

    borderWidth: 1,
    borderColor: COLORS.border,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 8 * SCALE,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    color: COLORS.muted,

    fontSize: 6.5 * SCALE,
    fontWeight: "800",

    letterSpacing: 0.5,

    marginBottom: 3 * SCALE,
  },

  detailValue: {
    color: COLORS.white,

    fontSize: 9 * SCALE,
    fontWeight: "600",
  },

  heroDivider: {
    height: 1,

    backgroundColor: COLORS.border,

    marginVertical: 14 * SCALE,
  },

  emailRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  emailText: {
    flex: 1,

    color: COLORS.white,

    fontSize: 8.5 * SCALE,

    marginLeft: 7 * SCALE,
  },

  heroEditButton: {
    width: 36 * SCALE,
    height: 36 * SCALE,

    borderRadius: 10 * SCALE,

    backgroundColor: COLORS.blueDark,

    borderWidth: 1,
    borderColor: COLORS.blueDark,

    alignItems: "center",
    justifyContent: "center",

    marginLeft: 8 * SCALE,
  },

  // ==========================================================
  // SECTION HEADINGS
  // ==========================================================

  sectionHeading: {
    marginTop: 23 * SCALE,
    marginBottom: 11 * SCALE,
  },

  sectionEyebrow: {
    color: COLORS.purple,

    fontSize: 7 * SCALE,
    fontWeight: "800",

    letterSpacing: 1,
  },

  sectionTitle: {
    color: COLORS.white,

    fontSize: 17 * SCALE,
    fontWeight: "700",

    marginTop: 4 * SCALE,
  },

  sectionDescription: {
    color: COLORS.muted,

    fontSize: 8.5 * SCALE,

    lineHeight: 14 * SCALE,

    marginTop: 3 * SCALE,
  },

  // ==========================================================
  // STATS
  // ==========================================================

  statsGrid: {
    flexDirection: "row",
  },

  statCard: {
    flex: 1,

    minHeight: 120 * SCALE,

    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 14 * SCALE,

    padding: 12 * SCALE,

    marginRight: 8 * SCALE,
  },

  statIcon: {
    width: 31 * SCALE,
    height: 31 * SCALE,

    borderRadius: 9 * SCALE,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 11 * SCALE,
  },

  statLabel: {
    color: COLORS.muted,

    fontSize: 6.5 * SCALE,
    fontWeight: "800",

    letterSpacing: 0.55,
  },

  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",

    marginTop: 5 * SCALE,
  },

  statValue: {
    color: COLORS.white,

    fontSize: 19 * SCALE,
    fontWeight: "800",
  },

  statSuffix: {
    color: COLORS.muted,

    fontSize: 7 * SCALE,

    marginLeft: 3 * SCALE,
  },

  // ==========================================================
  // SEMESTER RECORD
  // ==========================================================

  semesterRecordCard: {
    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 16 * SCALE,

    padding: 14 * SCALE,
  },

  semesterRecordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  semesterRecordHeaderLeft: {
    flex: 1,
  },

  semesterRecordTitle: {
    color: COLORS.white,

    fontSize: 12 * SCALE,
    fontWeight: "700",
  },

  semesterRecordSubtitle: {
    color: COLORS.muted,

    fontSize: 8 * SCALE,

    marginTop: 3 * SCALE,
  },

  semesterRecordIcon: {
    width: 38 * SCALE,
    height: 38 * SCALE,

    borderRadius: 10 * SCALE,

    backgroundColor: COLORS.purpleDark,

    borderWidth: 1,
    borderColor: COLORS.purpleBorder,

    alignItems: "center",
    justifyContent: "center",
  },

  semesterViewButton: {
    height: 40 * SCALE,

    borderRadius: 10 * SCALE,

    backgroundColor: COLORS.surface2,

    borderWidth: 1,
    borderColor: COLORS.border,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7 * SCALE,

    marginTop: 14 * SCALE,
  },

  semesterViewButtonText: {
    color: COLORS.white,

    fontSize: 8.5 * SCALE,
    fontWeight: "700",
  },

  // ==========================================================
  // SEMESTER TABLE
  // ==========================================================

  semesterTableWrapper: {
    marginTop: 14 * SCALE,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 10 * SCALE,

    overflow: "hidden",
  },

  tableHeader: {
    minHeight: 38 * SCALE,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: COLORS.surface2,

    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,

    paddingHorizontal: 9 * SCALE,
  },

  tableHeaderText: {
    color: COLORS.mutedDark,

    fontSize: 6 * SCALE,
    fontWeight: "800",

    letterSpacing: 0.35,
  },

  tableRow: {
    minHeight: 50 * SCALE,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 9 * SCALE,

    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  lastTableRow: {
    borderBottomWidth: 0,
  },

  semesterColumn: {
    flex: 1.35,
  },

  tableColumn: {
    flex: 0.8,

    alignItems: "flex-start",
  },

  statusColumn: {
    flex: 0.95,

    alignItems: "flex-start",
  },

  semesterCell: {
    flexDirection: "row",
    alignItems: "center",
  },

  tableDot: {
    width: 6 * SCALE,
    height: 6 * SCALE,

    borderRadius: 3,

    backgroundColor: COLORS.green,

    marginRight: 7 * SCALE,
  },

  tableCellText: {
    color: COLORS.white,

    fontSize: 7.5 * SCALE,
    fontWeight: "600",
  },

  greenValue: {
    color: COLORS.green,
  },

  statusBadge: {
    paddingHorizontal: 6 * SCALE,
    paddingVertical: 4 * SCALE,

    borderRadius: 6 * SCALE,

    backgroundColor: COLORS.greenDark,

    maxWidth: 75 * SCALE,
  },

  statusBadgeCurrent: {
    backgroundColor: COLORS.purpleDark,
  },

  statusBadgeUpcoming: {
    backgroundColor: COLORS.surface3,
  },

  statusBadgeText: {
    color: COLORS.green,

    fontSize: 5.5 * SCALE,
    fontWeight: "800",
  },

  statusBadgeTextCurrent: {
    color: COLORS.purple,
  },

  statusBadgeTextUpcoming: {
    color: COLORS.muted,
  },

  // ==========================================================
  // PLACEMENT
  // ==========================================================

  placementCard: {
    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 16 * SCALE,

    padding: 14 * SCALE,
  },

  placementHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },

  placementIcon: {
    width: 39 * SCALE,
    height: 39 * SCALE,

    borderRadius: 11 * SCALE,

    backgroundColor: COLORS.blueDark,

    borderWidth: 1,
    borderColor: COLORS.blueDark,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10 * SCALE,
  },

  placementTitle: {
    color: COLORS.white,

    fontSize: 12 * SCALE,
    fontWeight: "700",
  },

  placementSubtitle: {
    color: COLORS.muted,

    fontSize: 8 * SCALE,

    marginTop: 2 * SCALE,
  },

  placementDivider: {
    height: 1,

    backgroundColor: COLORS.border,

    marginVertical: 13 * SCALE,
  },

  placementRows: {
    marginBottom: 12 * SCALE,
  },

  placementRow: {
    minHeight: 34 * SCALE,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  placementLabel: {
    color: COLORS.muted,

    fontSize: 8.5 * SCALE,
  },

  placementValue: {
    color: COLORS.white,

    fontSize: 9 * SCALE,

    fontWeight: "600",
  },

  placementValueMuted: {
    color: COLORS.mutedDark,

    fontSize: 8.5 * SCALE,
  },

  trackBadge: {
    paddingHorizontal: 8 * SCALE,
    paddingVertical: 4 * SCALE,

    borderRadius: 7 * SCALE,

    backgroundColor: COLORS.purpleDark,

    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
  },

  trackBadgeText: {
    color: COLORS.purple,

    fontSize: 7 * SCALE,
    fontWeight: "800",
  },

  placementButton: {
    height: 40 * SCALE,

    borderRadius: 10 * SCALE,

    backgroundColor: COLORS.surface2,

    borderWidth: 1,
    borderColor: COLORS.border,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7 * SCALE,
  },

  placementButtonText: {
    color: COLORS.white,

    fontSize: 9 * SCALE,
    fontWeight: "700",
  },

  // ==========================================================
  // FOOTER
  // ==========================================================

  footer: {
    marginTop: 13 * SCALE,

    padding: 12 * SCALE,

    borderRadius: 11 * SCALE,

    backgroundColor: COLORS.footer,

    borderWidth: 1,
    borderColor: COLORS.border,

    flexDirection: "row",
    alignItems: "center",
  },

  footerText: {
    flex: 1,

    color: COLORS.mutedDark,

    fontSize: 7.5 * SCALE,
    lineHeight: 13 * SCALE,

    marginLeft: 7 * SCALE,
  },

  bottomSpace: {
    height: 25 * SCALE,
  },

  // ==========================================================
  // INTERACTION
  // ==========================================================

  pressed: {
    opacity: 0.65,
  },
});
