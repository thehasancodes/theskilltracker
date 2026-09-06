// ============================================================
// NOTIFICATION MOCK DATA
// ============================================================
//
// Temporary data used while the backend is being developed.
//
// Later, this will be replaced by real notification data
// received from the server.
// ============================================================

export const notificationMock = [

  {
    id: "notification-001",

    type: "assignment",

    title: "New Assignment",

    message:
      "A new assignment has been given for Compiler Design.",

    subject: "Compiler Design",

    createdAt: "Today, 10:30 AM",

    isRead: false,
  },

  {
    id: "notification-002",

    type: "file",

    title: "New File Uploaded",

    message:
      "A new lecture material has been uploaded for Data Structures.",

    subject: "Data Structures",

    createdAt: "Today, 09:15 AM",

    isRead: false,
  },

  {
    id: "notification-003",

    type: "assignment",

    title: "New Assignment",

    message:
      "A new assignment has been given for Business Strategy.",

    subject: "Business Strategy",

    createdAt: "Yesterday, 04:20 PM",

    isRead: true,
  },

  {
    id: "notification-004",

    type: "file",

    title: "New File Uploaded",

    message:
      "A new study material has been uploaded for Computer Networks.",

    subject: "Computer Networks",

    createdAt: "Yesterday, 11:40 AM",

    isRead: true,
  },

];