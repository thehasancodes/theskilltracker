import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../constants/colors";

import {
  getSemesterNotifications,
  markNotificationRead,
} from "../../api/notificationapi";

const SCALE = 1.2;
const PAGE_SIZE = 10;

export default function SemesterSpecificNotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const initialLoad = useRef(true);

  const loadNotifications = async () => {
    try {
      if (initialLoad.current) {
        setLoading(true);
      }

      setError("");

      const data = await getSemesterNotifications();

      const notificationList = Array.isArray(data) ? data : [];

      setNotifications(notificationList);

      setVisibleCount(Math.min(PAGE_SIZE, notificationList.length));
    } catch (error) {
      console.log("Notification error:", error);

      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
      initialLoad.current = false;
    }
  };

  useEffect(() => {
    const unsubscribe = navigation?.addListener("focus", loadNotifications);

    const refreshInterval = setInterval(loadNotifications, 30000);

    loadNotifications();

    return () => {
      unsubscribe?.();
      clearInterval(refreshInterval);
    };
  }, [navigation]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadNotifications();
    } finally {
      setRefreshing(false);
    }
  };

  const loadMoreNotifications = () => {
    setVisibleCount((currentCount) =>
      Math.min(currentCount + PAGE_SIZE, notifications.length),
    );
  };

  const handleNotificationPress = async (notification) => {
    if (!notification.isRead) {
      setNotifications((currentNotifications) =>
        currentNotifications
          .map((currentNotification) =>
            currentNotification.id === notification.id
              ? {
                  ...currentNotification,
                  isRead: true,
                }
              : currentNotification,
          )
          .sort((a, b) => {
            if (a.isRead !== b.isRead) {
              return a.isRead ? 1 : -1;
            }

            const dateA = Date.parse(a.createdAt || "");
            const dateB = Date.parse(b.createdAt || "");

            if (Number.isFinite(dateA) && Number.isFinite(dateB)) {
              return dateB - dateA;
            }

            return 0;
          }),
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
        navigation.navigate("MCQ", {
          assignmentId,
        });
      }
    }
  };

  const renderNotification = ({ item }) => {
    return (
      <Pressable
        onPress={() => handleNotificationPress(item)}
        style={({ pressed }) => [
          styles.notificationCard,
          !item.isRead && styles.unreadCard,
          pressed && styles.pressed,
        ]}
      >
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

        <View style={styles.notificationContent}>
          <View style={styles.titleRow}>
            <Text style={styles.notificationTitle}>{item.title}</Text>

            {!item.isRead && !item.isLocked ? (
              <View style={styles.unreadDot} />
            ) : null}
          </View>

          <Text style={styles.notificationMessage}>{item.message}</Text>

          <Text style={styles.subjectText}>{item.subject}</Text>

          <Text style={styles.timeText}>{item.createdAt}</Text>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />

        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>

          <Pressable onPress={loadNotifications}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={notifications.slice(0, visibleCount)}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderNotification}
        onEndReached={loadMoreNotifications}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

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

  pressed: {
    opacity: 0.75,
  },

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
});
