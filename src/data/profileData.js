// src/data/profileData.js

// This object is intentionally shaped like an API response.
// Later, replace this with your actual API call without
// changing the ProfileScreen UI.

export const profileData = {
  student: {
    name: "Junevenson Mark Kharkongor",
    enrollmentNo: "ADTU/0/2024-28/BCST/005",
    email: "junevensonmarkkharkongor@gmail.com",

    department: "BTECH",
    semester: "Semester 5",
    section: "Section B",
    track: "TCS",
  },

  academic: {
    cgpa: "N/A",
    attendance: "N/A",
    backlogs: 0,
  },

  semesters: [
    {
      id: 1,
      semester: "Semester 1",
      sgpa: "—",
      backlogs: 0,
      attendance: "—",
      status: "Completed",
    },

    {
      id: 2,
      semester: "Semester 2",
      sgpa: "—",
      backlogs: 0,
      attendance: "—",
      status: "Completed",
    },

    {
      id: 3,
      semester: "Semester 3",
      sgpa: "—",
      backlogs: 0,
      attendance: "—",
      status: "Completed",
    },

    {
      id: 4,
      semester: "Semester 4",
      sgpa: "—",
      backlogs: 0,
      attendance: "—",
      status: "Completed",
    },

    {
      id: 5,
      semester: "Semester 5",
      sgpa: "—",
      backlogs: 0,
      attendance: "—",
      status: "Current",
    },

    {
      id: 6,
      semester: "Semester 6",
      sgpa: "—",
      backlogs: 0,
      attendance: "—",
      status: "Upcoming",
    },
  ],

  placement: {
    technicalTrack: "TCS",
    readiness: "Not Updated",
    placementStatus: "Not Updated",
  },
};
