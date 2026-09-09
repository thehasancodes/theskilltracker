// ============================================================
// NOTIFICATION SCREEN
// ============================================================
//
// Displays notifications received from the server.
//
// Currently the screen uses dummy data through the API layer.
//
// Notification types currently supported:
//
// 1. Assignment
// 2. File uploaded
//
// The screen does not create, upload, edit, or manage files.
// It only displays notification information.
// ============================================================

import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../constants/colors";

import { getNotifications, markNotificationRead } from "../api/notificationapi";

// ============================================================
// HEADER SCALE
// ============================================================

const HEADER_SCALE = 1.2;
const SCALE = 1.2;
const PAGE_SIZE = 10;

// ============================================================
// NOTIFICATION SCREEN
// ============================================================

export default function NotificationScreen({ navigation }) {
  // ==========================================================
  // STATE
  // ==========================================================

  const [notifications, setNotifications] = useState([]);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [loading, setLoading] = useState(true);

  const initialLoad = useRef(true);

  const [error, setError] = useState("");

  // ==========================================================
  // LOAD NOTIFICATIONS
  // ==========================================================

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadNotifications);
    const refreshInterval = setInterval(loadNotifications, 30000);
    loadNotifications();

    return () => {
      unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [navigation]);

  // ==========================================================
  // FETCH NOTIFICATIONS
  // ==========================================================

  const loadNotifications = async () => {
    try {
      if (initialLoad.current) {
        setLoading(true);
      }

      setError("");

      const data = await getNotifications();

      setNotifications(data);
    } catch (error) {
      console.log("Notification error:", error);

      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
      initialLoad.current = false;
    }
  };

  const handleNotificationPress = async (notification) => {
    if (!notification.isRead) {
      setNotifications((currentNotifications) =>
        currentNotifications.map((currentNotification) =>
          currentNotification.id === notification.id
            ? { ...currentNotification, isRead: true }
            : currentNotification,
        ),
      );

      try {
        await markNotificationRead(notification.id);
      } catch (error) {
        console.log("Notification read error:", error);
      }
    }

    if (notification.type === "assignment") {
      const assignmentId =
        notification.assignmentId ||
        notification.id?.replace("assignment-", "");

      if (assignmentId) {
        navigation.navigate("MCQ", { assignmentId });
      }
    }
  };

  const loadMoreNotifications = () => {
    setVisibleCount((currentCount) =>
      Math.min(currentCount + PAGE_SIZE, notifications.length),
    );
  };

  // ==========================================================
  // NOTIFICATION ITEM
  // ==========================================================

  const renderNotification = ({ item }) => {
    return (
      <Pressable
        onPress={() => handleNotificationPress(item)}
        style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
      >
        {/* ====================================================
            ICON
        ===================================================== */}

        <View
          style={[
            styles.iconContainer,

            item.type === "assignment"
              ? styles.assignmentIcon
              : styles.fileIcon,
          ]}
        >
          <Ionicons
            name={
              item.type === "assignment"
                ? "clipboard-outline"
                : "document-text-outline"
            }
            size={20}
            color={colors.text}
          />
        </View>

        {/* ====================================================
            CONTENT
        ===================================================== */}

        <View style={styles.notificationContent}>
          {/* Title */}

          <View style={styles.titleRow}>
            <Text style={styles.notificationTitle}>{item.title}</Text>

            {!item.isRead && !item.isLocked && (
              <View style={styles.unreadDot} />
            )}
          </View>

          {/* Message */}

          <Text style={styles.notificationMessage}>{item.message}</Text>

          {/* Subject */}

          <Text style={styles.subjectText}>{item.subject}</Text>

          {/* Time */}

          <Text style={styles.timeText}>{item.createdAt}</Text>
        </View>
      </Pressable>
    );
  };

  // ==========================================================
  // HEADER
  // ==========================================================

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Hamburger */}

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

          {/* Header title */}

          <View>
            <Text style={styles.headerTitle}>Notifications</Text>

            <Text style={styles.welcome}>STUDENT NOTIFICATIONS</Text>
          </View>
        </View>
      </View>
    );
  };

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background}
        />

        {renderHeader()}

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />

          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // MAIN SCREEN
  // ==========================================================

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.container}>
        {renderHeader()}

        {/* ====================================================
            ERROR
        ===================================================== */}

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>

            <Pressable onPress={loadNotifications}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {/* ====================================================
            NOTIFICATION LIST
        ===================================================== */}

        <FlatList
          data={notifications.slice(0, visibleCount)}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          onEndReached={loadMoreNotifications}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            notifications.length === 0 ? styles.emptyList : styles.listContent
          }
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>

              <Text style={styles.sectionSubtitle}>
                Assignments and files from your courses
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="notifications-off-outline"
                size={28}
                color={colors.muted}
              />

              <Text style={styles.emptyTitle}>No notifications</Text>

              <Text style={styles.emptyText}>You are all caught up.</Text>
            </View>
          }
          ListFooterComponent={
            visibleCount < notifications.length ? (
              <View style={styles.loadMoreContainer}>
                <ActivityIndicator size="small" color={colors.primary} />

                <Text style={styles.loadMoreText}>Loading more...</Text>
              </View>
            ) : null
          }
        />
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
  // HEADER
  // ==========================================================

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

  // ==========================================================
  // SECTION
  // ==========================================================

  listContent: {
    padding: 16,

    paddingBottom: 40,
  },

  sectionHeader: {
    paddingTop: 4,

    paddingBottom: 14,
  },

  sectionTitle: {
    color: colors.text,

    fontSize: 12 * SCALE,

    fontWeight: "800",

    letterSpacing: 1,
  },

  sectionSubtitle: {
    color: colors.muted,

    fontSize: 10 * SCALE,

    marginTop: 5,
  },

  // ==========================================================
  // NOTIFICATION CARD
  // ==========================================================

  notificationCard: {
    flexDirection: "row",

    padding: 14,

    marginBottom: 10,

    borderRadius: 12,

    backgroundColor: colors.surface,

    borderWidth: 1,

    borderColor: colors.border,
  },

  unreadCard: {
    borderColor: colors.primaryDark,
  },

  // ==========================================================
  // ICON
  // ==========================================================

  iconContainer: {
    width: 42,

    height: 42,

    marginRight: 12,

    borderRadius: 11,

    alignItems: "center",

    justifyContent: "center",
  },

  assignmentIcon: {
    backgroundColor: colors.primaryDark,
  },

  fileIcon: {
    backgroundColor: colors.cyanDark,
  },

  // ==========================================================
  // NOTIFICATION CONTENT
  // ==========================================================

  notificationContent: {
    flex: 1,

    minWidth: 0,
  },

  titleRow: {
    flexDirection: "row",

    alignItems: "center",
  },

  notificationTitle: {
    flex: 1,

    color: colors.text,

    fontSize: 12 * SCALE,

    fontWeight: "800",
  },

  unreadDot: {
    width: 7,

    height: 7,

    marginLeft: 8,

    borderRadius: 4,

    backgroundColor: colors.primary,
  },

  notificationMessage: {
    marginTop: 5,

    color: colors.muted,

    fontSize: 9 * SCALE,

    lineHeight: 14 * SCALE,
  },

  subjectText: {
    marginTop: 8,

    color: colors.primary,

    fontSize: 8 * SCALE,

    fontWeight: "700",
  },

  timeText: {
    marginTop: 5,

    color: colors.muted,

    fontSize: 7 * SCALE,
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
    marginTop: 10,

    color: colors.muted,

    fontSize: 9 * SCALE,
  },

  // ==========================================================
  // ERROR
  // ==========================================================

  errorContainer: {
    marginHorizontal: 16,

    marginTop: 14,

    padding: 12,

    borderRadius: 10,

    backgroundColor: colors.surface,

    borderWidth: 1,

    borderColor: colors.border,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  errorText: {
    color: colors.muted,

    fontSize: 9 * SCALE,
  },

  retryText: {
    color: colors.primary,

    fontSize: 9 * SCALE,

    fontWeight: "800",
  },

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  emptyList: {
    flexGrow: 1,

    paddingHorizontal: 16,
  },

  emptyContainer: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    paddingBottom: 80,
  },

  emptyTitle: {
    marginTop: 10,

    color: colors.text,

    fontSize: 13 * SCALE,

    fontWeight: "800",
  },

  emptyText: {
    marginTop: 5,

    color: colors.muted,

    fontSize: 9 * SCALE,
  },

  loadMoreContainer: {
    alignItems: "center",

    paddingVertical: 12,
  },

  loadMoreText: {
    marginTop: 6,

    color: colors.muted,

    fontSize: 8 * SCALE,
  },

  // ==========================================================
  // PRESSED
  // ==========================================================

  pressed: {
    opacity: 0.65,
  },
});
