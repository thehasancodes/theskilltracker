import React from "react";

import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors as COLORS } from "../constants/colors";

const SCALE = 1.2;

// ============================================================
// TECHNICAL TRACKS SCREEN
// ============================================================

export default function TechnicalTracksScreen({ navigation }) {
  const openDrawer = () => {
    navigation?.openDrawer?.();
  };

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

              <Text style={styles.headerSubtitle}>TECHNICAL TRACKS</Text>
            </View>
          </View>
        </View>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* ==================================================
              PAGE INTRO
          ================================================== */}

          <View style={styles.introSection}>
            <Text style={styles.eyebrow}>TECHNICAL DEVELOPMENT</Text>

            <Text style={styles.pageTitle}>Technical Tracks</Text>

            <Text style={styles.pageDescription}>
              Access and manage your technical track information through the
              SkillTracker website.
            </Text>
          </View>

          {/* ==================================================
              DESKTOP ACCESS CARD
          ================================================== */}

          <View style={styles.desktopCard}>
            {/* Icon */}

            <View style={styles.desktopIconWrapper}>
              <Ionicons
                name="desktop-outline"
                size={34 * SCALE}
                color={COLORS.blue}
              />
            </View>

            {/* Title */}

            <Text style={styles.desktopTitle}>
              Use the SkillTracker Website
            </Text>

            {/* Description */}

            <Text style={styles.desktopDescription}>
              Technical Tracks are currently available through the desktop
              version of SkillTracker. Please use your desktop browser to access
              this section.
            </Text>

            {/* Divider */}

            <View style={styles.divider} />

            {/* Information */}

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="information-circle-outline"
                  size={16 * SCALE}
                  color={COLORS.purple}
                />
              </View>

              <Text style={styles.infoText}>
                This mobile screen is only an entry point. Your Technical Track
                data and management tools are available on the website.
              </Text>
            </View>

            {/* Website Indicator */}

            <View style={styles.websiteIndicator}>
              <View style={styles.websiteIndicatorLeft}></View>
            </View>
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
              Technical Track information is maintained through the official
              SkillTracker website.
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
  // INTRO
  // ==========================================================

  introSection: {
    marginBottom: 16 * SCALE,
  },

  eyebrow: {
    color: COLORS.purple,

    fontSize: 7 * SCALE,
    fontWeight: "800",

    letterSpacing: 1,
  },

  pageTitle: {
    color: COLORS.white,

    fontSize: 22 * SCALE,
    fontWeight: "800",

    marginTop: 5 * SCALE,
  },

  pageDescription: {
    color: COLORS.muted,

    fontSize: 9 * SCALE,
    lineHeight: 15 * SCALE,

    marginTop: 5 * SCALE,

    maxWidth: 360 * SCALE,
  },

  // ==========================================================
  // DESKTOP CARD
  // ==========================================================

  desktopCard: {
    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 18 * SCALE,

    padding: 20 * SCALE,

    alignItems: "center",
  },

  desktopIconWrapper: {
    width: 72 * SCALE,
    height: 72 * SCALE,

    borderRadius: 20 * SCALE,

    backgroundColor: COLORS.blueDark,

    borderWidth: 1,
    borderColor: COLORS.blueDark,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 16 * SCALE,
  },

  desktopTitle: {
    color: COLORS.white,

    fontSize: 15 * SCALE,
    fontWeight: "800",

    textAlign: "center",
  },

  desktopDescription: {
    color: COLORS.muted,

    fontSize: 9 * SCALE,
    lineHeight: 15 * SCALE,

    textAlign: "center",

    marginTop: 8 * SCALE,

    maxWidth: 360 * SCALE,
  },

  divider: {
    width: "100%",

    height: 1,

    backgroundColor: COLORS.border,

    marginVertical: 17 * SCALE,
  },

  // ==========================================================
  // INFO ROW
  // ==========================================================

  infoRow: {
    width: "100%",

    flexDirection: "row",
    alignItems: "flex-start",

    padding: 11 * SCALE,

    backgroundColor: COLORS.surface2,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 11 * SCALE,
  },

  infoIcon: {
    width: 28 * SCALE,
    height: 28 * SCALE,

    borderRadius: 8 * SCALE,

    backgroundColor: COLORS.purpleDark,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 8 * SCALE,
  },

  infoText: {
    flex: 1,

    color: COLORS.muted,

    fontSize: 8 * SCALE,
    lineHeight: 13 * SCALE,
  },

  // ==========================================================
  // WEBSITE STATUS
  // ==========================================================

  websiteIndicator: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 13 * SCALE,

    paddingHorizontal: 4 * SCALE,
  },

  websiteIndicatorLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ==========================================================
  // SECTION
  // ==========================================================

  sectionHeading: {
    marginTop: 24 * SCALE,
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
