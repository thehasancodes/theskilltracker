import { getAuthToken } from "./authStorage";

const MCQ_BASE_URL = process.env.EXPO_PUBLIC_MCQ_BASE_URI;

export class McqApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "McqApiError";
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
    throw new McqApiError("The server returned an invalid response.", {
      status: response.status,
    });
  }
}

async function request(path, options = {}) {
  const token = await getAuthToken();

  if (!token) {
    throw new McqApiError("Your session has expired.", { status: 401 });
  }

  let response;

  try {
    response = await fetch(`${MCQ_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new McqApiError(
      "Unable to reach the MCQ server. Check the network .",
    );
  }

  const result = await readResponse(response);

  if (__DEV__) {
    console.log("[mcq] API response", {
      path,
      status: response.status,
      ok: response.ok,
      success: result.success,
      error: result.error,
      topLevelKeys: Object.keys(result),
      dataType: Array.isArray(result.data) ? "array" : typeof result.data,
      dataKeys:
        result.data &&
        typeof result.data === "object" &&
        !Array.isArray(result.data)
          ? Object.keys(result.data)
          : [],
    });
  }

  if (!response.ok || result.success === false) {
    const serverError = result.error;
    const message =
      result.message ||
      (typeof serverError === "string" ? serverError : serverError?.message) ||
      "MCQ request failed.";

    throw new McqApiError(message, {
      status: response.status,
      code: result.code,
    });
  }

  return result.data ?? result;
}

export function getMcqAssignments() {
  return request("/mcq/assignments");
}

export function getMcqQuestions(assignmentId) {
  return request(`/mcq/${encodeURIComponent(assignmentId)}`);
}

export function submitMcqAnswers(assignmentId, answers) {
  return request(`/mcq/${encodeURIComponent(assignmentId)}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  });
}
