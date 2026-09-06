import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../constants/colors";

const HEADER_SCALE = 1.2;

// =========================================
// API CONFIGURATION
// =========================================
//
// Add your real API URL here later.
//
// Example:
//
// const API_BASE_URL = "https://yourwebsite.com/api";
//
// For now it is empty because the API
// has not been implemented yet.
//

const API_BASE_URL = "";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================================
  // LOGIN
  // =========================================

  const handleLogin = async () => {
    const cleanEmail = email.trim();

    // -----------------------------------------
    // Email validation
    // -----------------------------------------

    if (!cleanEmail) {
      Alert.alert("Email Required", "Please enter your email ID.");
      return;
    }

    // -----------------------------------------
    // Password validation
    // -----------------------------------------

    if (!password) {
      Alert.alert("Password Required", "Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // =======================================
      // TEMPORARY LOGIN
      // =======================================
      //
      // The API is not available yet.
      //
      // This allows you to test the complete
      // login → dashboard navigation.
      //
      // Remove this section when the real API
      // is connected.
      //

      if (!API_BASE_URL) {
        Alert.alert("Login Successful", "You have successfully logged in.", [
          {
            text: "OK",
            onPress: () => {
              navigation.replace("Dashboard");
            },
          },
        ]);

        return;
      }

      // =======================================
      // REAL API LOGIN
      // =======================================
      //
      // This will be used when your backend
      // API is available.
      //
      // Login credentials:
      //     email
      //     password
      //
      // The backend should check the user's
      // registered enrollment ID.
      //

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: cleanEmail,
          password: password,
        }),
      });

      const data = await response.json();

      // =======================================
      // SUCCESS
      // =======================================

      if (response.ok && data.success) {
        Alert.alert("Login Successful", "You have successfully logged in.", [
          {
            text: "OK",
            onPress: () => {
              navigation.replace("Dashboard");
            },
          },
        ]);

        return;
      }

      // =======================================
      // USER / ENROLLMENT NOT FOUND
      // =======================================

      if (
        response.status === 404 ||
        data.code === "USER_NOT_FOUND" ||
        data.code === "NOT_REGISTERED"
      ) {
        Alert.alert(
          "Account Not Found",
          "This account is not registered. Please register on the website first.",
        );

        return;
      }

      // =======================================
      // INVALID LOGIN
      // =======================================

      if (
        response.status === 401 ||
        data.code === "INVALID_PASSWORD" ||
        data.code === "INVALID_CREDENTIALS"
      ) {
        Alert.alert("Login Failed", "The email ID or password is incorrect.");

        return;
      }

      // =======================================
      // OTHER SERVER ERROR
      // =======================================

      Alert.alert(
        "Login Failed",
        data.message || "Unable to login. Please try again.",
      );
    } catch (error) {
      console.log("Login error:", error);

      Alert.alert(
        "Connection Error",
        "Unable to connect to the server. Please check your internet connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          {/* ================================= */}
          {/* HEADER                            */}
          {/* ================================= */}

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons
                name="school-outline"
                size={28 * HEADER_SCALE}
                color={colors.purple}
              />
            </View>

            <Text style={styles.headerTitle}>SkillTracker</Text>

            <Text style={styles.headerSubtitle}>
              Placement Readiness Platform
            </Text>
          </View>

          {/* ================================= */}
          {/* LOGIN CARD                        */}
          {/* ================================= */}

          <View style={styles.loginCard}>
            <View style={styles.loginIconContainer}>
              <Ionicons name="person-outline" size={25} color={colors.purple} />
            </View>

            <Text style={styles.title}>Welcome Back</Text>

            <Text style={styles.subtitle}>
              Login with your registered student account
            </Text>

            {/* ================================= */}
            {/* EMAIL ID                          */}
            {/* ================================= */}

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>EMAIL ID</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.muted}
                  style={styles.inputIcon}
                />

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email ID"
                  placeholderTextColor={colors.mutedDark}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* ================================= */}
            {/* PASSWORD                          */}
            {/* ================================= */}

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>PASSWORD</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.muted}
                  style={styles.inputIcon}
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.mutedDark}
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />

                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  disabled={loading}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={21}
                    color={colors.muted}
                  />
                </Pressable>
              </View>
            </View>

            {/* ================================= */}
            {/* LOGIN BUTTON                      */}
            {/* ================================= */}

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && !loading && styles.pressed,
                loading && styles.disabledButton,
              ]}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>LOGIN</Text>

                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={colors.white}
                  />
                </>
              )}
            </Pressable>

            {/* ================================= */}
            {/* WEBSITE REGISTRATION              */}
            {/* ================================= */}

            <View style={styles.registerInfo}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={colors.blue}
              />

              <Text style={styles.registerText}>
                Don't have an account? Register on the website first.
              </Text>
            </View>
          </View>

          {/* ================================= */}
          {/* FOOTER                            */}
          {/* ================================= */}

          <Text style={styles.footer}>
            DEVELOPED BY: MEHEDI, SOURAV, JUNEVENSON
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================================= */
/* STYLES                            */
/* ================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,

    padding: 16,

    justifyContent: "center",

    paddingBottom: 30,
  },

  /* Header */

  header: {
    alignItems: "center",

    marginBottom: 25,
  },

  logoContainer: {
    width: 62,
    height: 62,

    borderRadius: 18,

    backgroundColor: colors.purpleDark,

    borderWidth: 1,
    borderColor: colors.purpleBorder,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 14,
  },

  headerTitle: {
    color: colors.text,

    fontSize: 16 * HEADER_SCALE,

    fontWeight: "700",

    textAlign: "center",
  },

  headerSubtitle: {
    color: colors.muted,

    fontSize: 9 * HEADER_SCALE,

    fontWeight: "600",

    letterSpacing: 1,

    marginTop: 4,
  },

  /* Login Card */

  loginCard: {
    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 16,

    padding: 20,
  },

  loginIconContainer: {
    width: 48,
    height: 48,

    borderRadius: 14,

    backgroundColor: colors.purpleDark,

    borderWidth: 1,
    borderColor: colors.purpleBorder,

    alignItems: "center",
    justifyContent: "center",

    alignSelf: "center",

    marginBottom: 14,
  },

  title: {
    color: colors.text,

    fontSize: 25,

    fontWeight: "600",

    textAlign: "center",
  },

  subtitle: {
    color: colors.muted,

    fontSize: 11,

    textAlign: "center",

    lineHeight: 18,

    marginTop: 7,

    marginBottom: 24,
  },

  /* Inputs */

  inputSection: {
    marginBottom: 16,
  },

  inputLabel: {
    color: colors.muted,

    fontSize: 9,

    fontWeight: "700",

    letterSpacing: 1,

    marginBottom: 7,
  },

  inputContainer: {
    height: 52,

    backgroundColor: colors.surface2,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 11,

    flexDirection: "row",

    alignItems: "center",
  },

  inputIcon: {
    marginLeft: 14,
  },

  input: {
    flex: 1,

    height: "100%",

    color: colors.text,

    fontSize: 13,

    paddingHorizontal: 11,
  },

  eyeButton: {
    width: 48,
    height: "100%",

    alignItems: "center",
    justifyContent: "center",
  },

  /* Login Button */

  loginButton: {
    height: 52,

    backgroundColor: colors.purple,

    borderRadius: 11,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    marginTop: 5,

    gap: 9,
  },

  loginButtonText: {
    color: colors.white,

    fontSize: 12,

    fontWeight: "800",

    letterSpacing: 1,
  },

  disabledButton: {
    opacity: 0.65,
  },

  pressed: {
    opacity: 0.7,
  },

  /* Registration Information */

  registerInfo: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: colors.blueDark,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 10,

    padding: 11,

    marginTop: 18,
  },

  registerText: {
    flex: 1,

    color: colors.muted,

    fontSize: 10,

    lineHeight: 15,

    marginLeft: 8,
  },

  /* Footer */

  footer: {
    color: colors.mutedDark,

    fontSize: 9,

    textAlign: "center",

    marginTop: 20,
  },
});
