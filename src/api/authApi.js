const LOGIN_URL =
  process.env.EXPO_PUBLIC_LOGIN_URI ||
  "https://api.theskilltracker.in/api/mobile/auth/login";

export class AuthApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "AuthApiError";
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
    throw new AuthApiError("The server returned an invalid response.", {
      status: response.status,
    });
  }
}

export async function loginUser({ email, password }) {
  const response = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await readResponse(response);

  if (__DEV__) {
    console.log("[auth] Login response", {
      status: response.status,
      ok: response.ok,
      success: data.success,
      tokenReceived: Boolean(data.token),
      code: data.code,
      message: data.message,
      user: data.user,
    });
  }

  if (!response.ok || data.success !== true || !data.token) {
    throw new AuthApiError(data.message || "Unable to log in.", {
      status: response.status,
      code: data.code,
    });
  }

  return {
    token: data.token,
    user: data.user,
  };
}
