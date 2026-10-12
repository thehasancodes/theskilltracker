import { getAuthToken } from "./authStorage";

const DASHBOARD_URL = process.env.EXPO_PUBLIC_DASHBOARD_URI;

export class DashboardApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "DashboardApiError";
    this.status = status;
    this.code = code;
  }
}

async function readResponse(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new DashboardApiError("The server returned an invalid response.", {
      status: response.status,
    });
  }
}

export async function getDashboardData() {
  const token = await getAuthToken();

  if (!token) {
    throw new DashboardApiError("Your session has expired.", { status: 401 });
  }

  let response;

  try {
    response = await fetch(DASHBOARD_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new DashboardApiError(
      "Unable to reach the dashboard server. Check the network or dev tunnel.",
    );
  }

  const result = await readResponse(response);

  if (!response.ok || result.success !== true || !result.data) {
    throw new DashboardApiError(
      result.message || "Unable to load dashboard data.",
      {
        status: response.status,
        code: result.code,
      },
    );
  }

  return result.data;
}
