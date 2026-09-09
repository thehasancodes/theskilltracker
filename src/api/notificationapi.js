import * as SecureStore from "expo-secure-store";

import { getMcqAssignments } from "./mcqApi";

const SEEN_ASSIGNMENTS_KEY = "skilltracker.notification.assignmentIds";
const ASSIGNMENT_NOTIFICATIONS_KEY = "skilltracker.notification.items";

function getAssignmentId(assignment) {
  return assignment?.id || assignment?._id || assignment?.assignmentId;
}

function getAssignmentList(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.assignments)) return value.assignments;
  if (Array.isArray(value?.data)) return value.data;
  return [];
}

function formatCreatedAt() {
  return new Date().toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
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

export async function markNotificationRead(notificationId) {
  const storedNotifications = await SecureStore.getItemAsync(
    ASSIGNMENT_NOTIFICATIONS_KEY,
  );
  const notifications = storedNotifications
    ? JSON.parse(storedNotifications)
    : [];
  const updatedNotifications = notifications.map((notification) =>
    notification.id === notificationId
      ? { ...notification, isRead: true }
      : notification,
  );

  await SecureStore.setItemAsync(
    ASSIGNMENT_NOTIFICATIONS_KEY,
    JSON.stringify(updatedNotifications),
  );
}

export async function getNotifications() {
  const response = await getMcqAssignments();
  const assignments = getAssignmentList(response).filter((assignment) =>
    getAssignmentId(assignment),
  );
  const storedIds = await SecureStore.getItemAsync(SEEN_ASSIGNMENTS_KEY);
  const seenIds = storedIds ? JSON.parse(storedIds) : [];
  const seenSet = new Set(seenIds);

  const storedNotifications = await SecureStore.getItemAsync(
    ASSIGNMENT_NOTIFICATIONS_KEY,
  );
  const existingNotifications = storedNotifications
    ? JSON.parse(storedNotifications)
    : [];
  const assignmentIds = new Set(
    assignments.map((assignment) => String(getAssignmentId(assignment))),
  );
  const relevantNotifications = existingNotifications.filter((notification) => {
    if (!notification.assignmentId) return true;
    return assignmentIds.has(String(notification.assignmentId));
  });
  const isFirstSync = !storedIds;
  const newNotifications = isFirstSync
    ? []
    : assignments
        .filter((assignment) => !seenSet.has(getAssignmentId(assignment)))
        .map((assignment) => ({
          id: `assignment-${getAssignmentId(assignment)}`,
          assignmentId: getAssignmentId(assignment),
          type: "assignment",
          title: "New Assignment",
          message: `A new assignment was added: ${assignment.title || "Untitled assignment"}`,
          subject: assignment.title || "Assignment",
          createdAt: formatCreatedAt(),
          isRead: false,
          isLocked: isAssignmentLocked(assignment),
        }));

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
      return assignment
        ? {
            ...notification,
            assignmentId: getAssignmentId(assignment),
            isLocked: isAssignmentLocked(assignment),
          }
        : notification;
    },
  );

  await SecureStore.setItemAsync(
    ASSIGNMENT_NOTIFICATIONS_KEY,
    JSON.stringify(notifications),
  );

  const allIds = Array.from(
    new Set([...seenIds, ...assignments.map(getAssignmentId)]),
  );
  await SecureStore.setItemAsync(SEEN_ASSIGNMENTS_KEY, JSON.stringify(allIds));

  return notifications;
}
