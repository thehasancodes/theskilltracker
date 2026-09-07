import { getStoredUser } from "./authStorage";

function displayValue(value, fallback = "N/A") {
  return value === "" || value === null || value === undefined
    ? fallback
    : String(value);
}

function getAcademicRecords(user) {
  return user.academicRecords || {};
}

function getCgpa(records) {
  const sgpas = Object.values(records)
    .map((record) => Number.parseFloat(record.sgpa))
    .filter((sgpa) => Number.isFinite(sgpa));

  if (!sgpas.length) {
    return "N/A";
  }

  const average = sgpas.reduce((total, sgpa) => total + sgpa, 0) / sgpas.length;
  return average.toFixed(2);
}

function getBacklogTotal(records) {
  return Object.values(records).reduce((total, record) => {
    const backlogs = Number.parseInt(record.backlogs, 10);
    return total + (Number.isFinite(backlogs) ? backlogs : 0);
  }, 0);
}

function mapSemesters(user, records) {
  return Object.keys(records)
    .sort((first, second) => Number(first) - Number(second))
    .map((semesterNumber) => {
      const record = records[semesterNumber];
      const number = Number(semesterNumber);

      return {
        id: semesterNumber,
        semester: `Semester ${semesterNumber}`,
        sgpa: displayValue(record.sgpa, "—"),
        backlogs: displayValue(record.backlogs, 0),
        attendance: displayValue(record.attendance, "—"),
        status:
          number === Number(user.semester)
            ? "Current"
            : number < Number(user.semester)
              ? "Completed"
              : "Upcoming",
      };
    });
}

export async function getProfileData() {
  const user = await getStoredUser();

  if (!user) {
    throw new Error("No authenticated user was found.");
  }

  const records = getAcademicRecords(user);

  return {
    student: {
      name: displayValue(user.name),
      enrollmentNo: displayValue(user.enrollmentNumber),
      email: displayValue(user.email),
      department: displayValue(user.department),
      semester: `Semester ${user.semester}`,
      section: `Section ${displayValue(user.section)}`,
      track: displayValue(user.track),
    },
    academic: {
      cgpa: getCgpa(records),
      attendance: displayValue(records[user.semester]?.attendance),
      backlogs: getBacklogTotal(records),
    },
    semesters: mapSemesters(user, records),
    placement: {
      technicalTrack: displayValue(user.track),
      readiness: "Not Updated",
      placementStatus: "Not Updated",
    },
  };
}
