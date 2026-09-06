// ============================================================
// NOTIFICATION API
// ============================================================
//
// This file handles communication with the notification
// backend.
//
// The UI should NOT contain API URLs or fetch logic.
//
// Currently:
// We use dummy data.
//
// Later:
// Replace the dummy implementation with the real API request.
// ============================================================

import {
  notificationMock,
} from "../data/notificationMock";


// ============================================================
// GET NOTIFICATIONS
// ============================================================
//
// Returns the notifications available for the current student.
//
// CURRENT:
// Returns dummy notification data.
//
// FUTURE:
// This function will make a request to the backend.
// ============================================================

export async function getNotifications() {

  // ----------------------------------------------------------
  // Temporary delay to behave more like a real API request.
  // ----------------------------------------------------------

  await new Promise(
    (resolve) =>
      setTimeout(resolve, 300)
  );


  // ----------------------------------------------------------
  // Return dummy data.
  // ----------------------------------------------------------

  return notificationMock;
}