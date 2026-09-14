// ============================================================
// NOTIFICATION SCREEN
// ============================================================
//
// Parent screen for notifications.
//
// Tabs:
//
// 1. General
// 2. Semester Specific
//
// General notifications:
//    GeneralNotificationScreen.js
//
// Semester-specific notifications:
//    SemesterSpecificNotificationScreen.js
//
// ============================================================

import React, { useState } from "react";

import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../constants/colors";

import GeneralNotificationScreen from "./notification/GeneralNotificationScreen";

import SemesterSpecificNotificationScreen from "./notification/SemesterSpecificNotificationScreen";

const SCALE = 1.2;

const HEADER_SCALE = 1.2;

// ============================================================
// NOTIFICATION SCREEN
// ============================================================

export default function NotificationScreen({ navigation }) {
  // ==========================================================
  // ACTIVE TAB
  // ==========================================================

  const [activeTab, setActiveTab] = useState("semester");

  // ==========================================================
  // HEADER
  // ==========================================================

  const renderHeader = () => {
    return (
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
            <Text style={styles.headerTitle}>Notifications</Text>

            <Text style={styles.headerSubtitle}>STUDENT NOTIFICATIONS</Text>
          </View>
        </View>
      </View>
    );
  };

  // ==========================================================
  // TAB BAR
  // ==========================================================

  const renderTabs = () => {
    return (
      <View style={styles.tabContainer}>
        {/* ====================================================
            GENERAL
        ==================================================== */}

        <Pressable
          onPress={() => setActiveTab("general")}
          style={({ pressed }) => [
            styles.tab,
            activeTab === "general" && styles.activeTab,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={16 * SCALE}
            color={activeTab === "general" ? colors.primary : colors.muted}
          />

          <Text
            style={[
              styles.tabText,
              activeTab === "general" && styles.activeTabText,
            ]}
          >
            General
          </Text>
        </Pressable>

        {/* ====================================================
            SEMESTER SPECIFIC
        ==================================================== */}

        <Pressable
          onPress={() => setActiveTab("semester")}
          style={({ pressed }) => [
            styles.tab,
            activeTab === "semester" && styles.activeTab,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="school-outline"
            size={16 * SCALE}
            color={activeTab === "semester" ? colors.primary : colors.muted}
          />

          <Text
            style={[
              styles.tabText,
              activeTab === "semester" && styles.activeTabText,
            ]}
          >
            Semester Specific
          </Text>
        </Pressable>
      </View>
    );
  };

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.container}>
        {/* ====================================================
            HEADER
        ==================================================== */}

        {renderHeader()}

        {/* ====================================================
            TABS
        ==================================================== */}

        {renderTabs()}

        {/* ====================================================
            TAB CONTENT
        ==================================================== */}

        <View style={styles.content}>
          {activeTab === "general" ? (
            <GeneralNotificationScreen />
          ) : (
            <SemesterSpecificNotificationScreen navigation={navigation} />
          )}
        </View>
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

  content: {
    flex: 1,

    paddingHorizontal: 16 * SCALE,

    paddingTop: 14 * SCALE,
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

  headerSubtitle: {
    color: colors.muted,

    fontSize: 7.5 * HEADER_SCALE,

    fontWeight: "700",

    letterSpacing: 1,

    marginTop: 3 * HEADER_SCALE,
  },

  // ==========================================================
  // TABS
  // ==========================================================

  tabContainer: {
    flexDirection: "row",

    marginHorizontal: 16 * SCALE,

    marginTop: 14 * SCALE,

    backgroundColor: colors.surface,

    borderRadius: 12 * SCALE,

    borderWidth: 1,

    borderColor: colors.border,

    padding: 4 * SCALE,
  },

  tab: {
    flex: 1,

    minHeight: 43 * SCALE,

    borderRadius: 9 * SCALE,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 5 * SCALE,
  },

  activeTab: {
    backgroundColor: colors.primaryDark,

    borderWidth: 1,

    borderColor: colors.purpleBorder,
  },

  tabText: {
    color: colors.muted,

    fontSize: 8.5 * SCALE,

    fontWeight: "700",

    marginLeft: 6 * SCALE,
  },

  activeTabText: {
    color: colors.text,
  },

  // ==========================================================
  // INTERACTION
  // ==========================================================

  pressed: {
    opacity: 0.65,
  },
});
