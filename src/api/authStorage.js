import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "skilltracker.authToken";
const USER_KEY = "skilltracker.authUser";

export async function saveAuthSession({ token, user }) {
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, token),
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
  ]);
}

export async function getAuthToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getStoredUser() {
  const value = await SecureStore.getItemAsync(USER_KEY);

  return value ? JSON.parse(value) : null;
}

export async function clearAuthSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}
