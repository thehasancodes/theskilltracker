import { getAuthToken } from "./authStorage";

const LEADERBOARD_URL = process.env.EXPO_PUBLIC_LEADERBOARD_URI;
console.log("LOGIN ENV EXISTS:", Boolean(process.env.EXPO_PUBLIC_LOGIN_URI));

console.log(
  "LEADERBOARD ENV EXISTS:",
  Boolean(process.env.EXPO_PUBLIC_LEADERBOARD_URI),
);
// ============================================================
// GET SECTION LEADERBOARD
// ============================================================

export async function getSectionLeaderboard() {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(LEADERBOARD_URL, {
    method: "GET",

    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  // ==========================================================
  // RESPONSE VALIDATION
  // ==========================================================

  if (!response.ok || data.success !== true) {
    throw new Error(data.message || "Unable to load section leaderboard.");
  }

  return data.data;
}
