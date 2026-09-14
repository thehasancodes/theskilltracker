import * as SecureStore from "expo-secure-store";

import { getAuthToken } from "./authStorage";
import { getMcqAssignments } from "./mcqApi";

const GENERAL_NOTIFICATIONS_URL =
  process.env.EXPO_PUBLIC_GENERAL_NOTIFICATIONS_URL;

const SEEN_ASSIGNMENTS_KEY = "skilltracker.notification.assignmentIds";
const ASSIGNMENT_NOTIFICATIONS_KEY = "skilltracker.notification.items";
const GENERAL_NOTIFICATION_READ_KEY =
  "skilltracker.notification.generalReadIds";

function getAssignmentId(assignment) {
  return assignment?.id || assignment?._id || assignment?.assignmentId;
}

function getAssignmentList(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.assignments)) return value.assignments;
  if (Array.isArray(value?.data)) return value.data;
  return [];
}

function formatCreatedAt(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrentCreatedAt() {
  return formatCreatedAt(new Date());
}

function getNotificationDate(notification) {
  const value =
    notification?.createdAt ||
    notification?.created_at ||
    notification?.publishedAt ||
    notification?.published_at ||
    notification?.date ||
    notification?.timestamp;

  const time = Date.parse(value || "");

  return Number.isFinite(time) ? time : 0;
}

function isAssignmentLocked(assignment) {
  if (
    assignment?.isPastDue === true ||
    assignment?.expired === true ||
    assignment?.isExpired === true ||
    assignment?.locked === true ||
    assignment?.isLocked === true
  ) {
    return true;
  }

  const dueTime = Date.parse(assignment?.dueDate || assignment?.dueAt || "");

  return Number.isFinite(dueTime) && dueTime < Date.now();
}

function getGeneralNotificationList(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.notifications)) {
    return value.notifications;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  if (Array.isArray(value?.data?.notifications)) {
    return value.data.notifications;
  }

  return [];
}

function normalizeGeneralNotification(notification) {
  const id =
    notification?.id ||
    notification?._id ||
    notification?.notificationId ||
    notification?.uuid;

  const title =
    notification?.title ||
    notification?.name ||
    notification?.subject ||
    "Notification";

  const message =
    notification?.message ||
    notification?.body ||
    notification?.description ||
    notification?.content ||
    "";

  const createdAtValue =
    notification?.createdAt ||
    notification?.created_at ||
    notification?.publishedAt ||
    notification?.published_at ||
    notification?.date ||
    notification?.timestamp;

  return {
    ...notification,
    id: id ? String(id) : String(Math.random()),
    type: "general",
    title,
    message,
    subject:
      notification?.subject ||
      notification?.category ||
      notification?.type ||
      "General",
    createdAt: formatCreatedAt(createdAtValue),
    isRead:
      notification?.isRead === true ||
      notification?.read === true ||
      notification?.read_status === true,
    isLocked: false,
  };
}

async function getStoredJson(key, fallback) {
  try {
    const value = await SecureStore.getItemAsync(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function saveStoredJson(key, value) {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}

export async function markNotificationRead(notificationId) {
  const storedNotifications = await getStoredJson(
    ASSIGNMENT_NOTIFICATIONS_KEY,
    [],
  );

  const updatedNotifications = storedNotifications.map((notification) =>
    String(notification.id) === String(notificationId)
      ? {
          ...notification,
          isRead: true,
        }
      : notification,
  );

  await saveStoredJson(ASSIGNMENT_NOTIFICATIONS_KEY, updatedNotifications);

  const storedGeneralReadIds = await getStoredJson(
    GENERAL_NOTIFICATION_READ_KEY,
    [],
  );

  const readIds = new Set(storedGeneralReadIds.map((id) => String(id)));

  readIds.add(String(notificationId));

  await saveStoredJson(GENERAL_NOTIFICATION_READ_KEY, Array.from(readIds));
}

export async function getSemesterNotifications() {
  const response = await getMcqAssignments();

  const assignments = getAssignmentList(response).filter((assignment) =>
    getAssignmentId(assignment),
  );

  const seenIds = await getStoredJson(SEEN_ASSIGNMENTS_KEY, []);

  const storedNotifications = await getStoredJson(
    ASSIGNMENT_NOTIFICATIONS_KEY,
    [],
  );

  const assignmentIds = new Set(
    assignments.map((assignment) => String(getAssignmentId(assignment))),
  );

  const relevantNotifications = storedNotifications.filter((notification) => {
    if (!notification.assignmentId) {
      return true;
    }

    return assignmentIds.has(String(notification.assignmentId));
  });

  const existingNotificationIds = new Set(
    relevantNotifications.map((notification) => String(notification.id)),
  );

  const newNotifications = assignments
    .filter((assignment) => {
      const assignmentId = getAssignmentId(assignment);
      const notificationId = `assignment-${assignmentId}`;

      return !existingNotificationIds.has(String(notificationId));
    })
    .map((assignment) => {
      const assignmentId = getAssignmentId(assignment);

      const assignmentCreatedAt =
        assignment?.createdAt ||
        assignment?.created_at ||
        assignment?.publishedAt ||
        assignment?.published_at ||
        assignment?.assignedAt ||
        assignment?.assigned_at;

      return {
        id: `assignment-${assignmentId}`,
        assignmentId,
        type: "assignment",
        title: "New Assignment",
        message: `A new assignment was added: ${
          assignment.title || "Untitled assignment"
        }`,
        subject: assignment.title || "Assignment",
        createdAt:
          formatCreatedAt(assignmentCreatedAt) || formatCurrentCreatedAt(),
        isRead: false,
        isLocked: isAssignmentLocked(assignment),
      };
    });

  const assignmentById = new Map(
    assignments.map((assignment) => [
      String(getAssignmentId(assignment)),
      assignment,
    ]),
  );

  const notifications = [...newNotifications, ...relevantNotifications].map(
    (notification) => {
      const assignmentId =
        notification.assignmentId ||
        notification.id?.replace("assignment-", "");

      const assignment = assignmentById.get(String(assignmentId));

      if (!assignment) {
        return notification;
      }

      const assignmentCreatedAt =
        assignment?.createdAt ||
        assignment?.created_at ||
        assignment?.publishedAt ||
        assignment?.published_at ||
        assignment?.assignedAt ||
        assignment?.assigned_at;

      return {
        ...notification,
        assignmentId: getAssignmentId(assignment),
        isLocked: isAssignmentLocked(assignment),
        createdAt:
          notification.createdAt ||
          formatCreatedAt(assignmentCreatedAt) ||
          formatCurrentCreatedAt(),
      };
    },
  );

  notifications.sort((a, b) => {
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }

    return getNotificationDate(b) - getNotificationDate(a);
  });

  await saveStoredJson(ASSIGNMENT_NOTIFICATIONS_KEY, notifications);

  const allIds = Array.from(
    new Set([...seenIds, ...assignments.map(getAssignmentId)]),
  );

  await saveStoredJson(SEEN_ASSIGNMENTS_KEY, allIds);

  return notifications;
}

export async function getNotifications() {
  return getSemesterNotifications();
}

export async function getGeneralNotifications() {
  if (!GENERAL_NOTIFICATIONS_URL) {
    throw new Error("EXPO_PUBLIC_GENERAL_NOTIFICATIONS_URL is not configured.");
  }

  const token = await getAuthToken();

  if (!token) {
    throw new Error("Your session has expired.");
  }

  const response = await fetch(GENERAL_NOTIFICATIONS_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await response.text();

  let result = {};

  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(
        "The general notification server returned an invalid response.",
      );
    }
  }

  if (!response.ok || result?.success === false) {
    const serverError = result?.error;

    const message =
      result?.message ||
      (typeof serverError === "string" ? serverError : serverError?.message) ||
      "Unable to load general notifications.";

    throw new Error(message);
  }

  const rawNotifications = getGeneralNotificationList(result?.data ?? result);

  const storedReadIds = await getStoredJson(GENERAL_NOTIFICATION_READ_KEY, []);

  const readIdSet = new Set(storedReadIds.map((id) => String(id)));

  const notifications = rawNotifications
    .map(normalizeGeneralNotification)
    .map((notification) => ({
      ...notification,
      isRead: notification.isRead || readIdSet.has(String(notification.id)),
    }));

  notifications.sort((a, b) => {
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }

    return getNotificationDate(b) - getNotificationDate(a);
  });

  return notifications;
}
