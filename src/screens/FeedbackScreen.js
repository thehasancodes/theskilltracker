import React, { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../constants/colors";

const SCALE = 1.2;

// ============================================================
// FEEDBACK SCREEN
// ============================================================

export default function FeedbackScreen({ navigation }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("General");

  const categories = [
    {
      label: "App Experience",
      icon: "phone-portrait-outline",
    },
    {
      label: "Bug Report",
      icon: "bug-outline",
    },
  ];

  // ==========================================================
  // HANDLERS
  // ==========================================================

  const openDrawer = () => {
    navigation?.openDrawer?.();
  };

  const submitFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert(
        "Feedback Required",
        "Please enter some feedback before submitting.",
      );

      return;
    }

    console.log({
      category,
      rating,
      feedback,
    });

    Alert.alert(
      "Thank You!",
      "Your feedback has been submitted successfully.",
      [
        {
          text: "OK",
          onPress: () => {
            setFeedback("");
            setRating(0);
            setCategory("General");
          },
        },
      ],
    );
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          {/* ====================================================
            HEADER
        ==================================================== */}

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Pressable
                onPress={openDrawer}
                style={({ pressed }) => [
                  styles.menuButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="menu" size={22 * SCALE} color={colors.text} />
              </Pressable>

              <View>
                <Text style={styles.headerTitle}>Student Command Centre</Text>

                <Text style={styles.headerSubtitle}>FEEDBACK</Text>
              </View>
            </View>
          </View>

          {/* ====================================================
            CONTENT
        ==================================================== */}

          <View style={styles.content}>
            {/* ==================================================
              CATEGORY
          ================================================== */}

            <View style={[styles.sectionHeading, styles.firstSectionHeading]}>
              <Text style={styles.sectionEyebrow}>FEEDBACK TYPE</Text>

              <Text style={styles.sectionTitle}>What is this about?</Text>
            </View>

            <View style={styles.categoryCard}>
              {categories.map((item, index) => {
                const selected = category === item.label;

                return (
                  <React.Fragment key={item.label}>
                    <Pressable
                      onPress={() => setCategory(item.label)}
                      style={({ pressed }) => [
                        styles.categoryRow,
                        selected && styles.categoryRowSelected,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View
                        style={[
                          styles.categoryIcon,
                          selected && styles.categoryIconSelected,
                        ]}
                      >
                        <Ionicons
                          name={item.icon}
                          size={17 * SCALE}
                          color={selected ? colors.purple : colors.muted}
                        />
                      </View>

                      <View style={styles.categoryContent}>
                        <Text
                          style={[
                            styles.categoryTitle,
                            selected && styles.categoryTitleSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </View>

                      <View
                        style={[styles.radio, selected && styles.radioSelected]}
                      >
                        {selected && <View style={styles.radioDot} />}
                      </View>
                    </Pressable>

                    {index !== categories.length - 1 && (
                      <View style={styles.categoryDivider} />
                    )}
                  </React.Fragment>
                );
              })}
            </View>

            {/* ==================================================
              FEEDBACK INPUT
          ================================================== */}

            <View style={styles.sectionHeading}>
              <Text style={styles.sectionEyebrow}>YOUR FEEDBACK</Text>

              <Text style={styles.sectionTitle}>Tell us more</Text>

              <Text style={styles.sectionDescription}>
                Share your thoughts, suggestions, or issues.
              </Text>
            </View>

            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Ionicons
                  name="create-outline"
                  size={17 * SCALE}
                  color={colors.blue}
                />

                <Text style={styles.inputHeaderText}>Your message</Text>
              </View>

              <TextInput
                value={feedback}
                onChangeText={setFeedback}
                placeholder="Write your feedback here..."
                placeholderTextColor={colors.mutedDark}
                multiline
                scrollEnabled
                textAlignVertical="top"
                maxLength={1000}
                style={styles.textInput}
              />

              <View style={styles.characterRow}>
                <Text style={styles.characterHint}>
                  Please be as specific as possible.
                </Text>

                <Text style={styles.characterCount}>
                  {feedback.length}/1000
                </Text>
              </View>
            </View>

            {/* ==================================================
              SUBMIT
          ================================================== */}

            <Pressable
              onPress={submitFeedback}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.submitIcon}>
                <Ionicons
                  name="send-outline"
                  size={16 * SCALE}
                  color={colors.background}
                />
              </View>

              <Text style={styles.submitButtonText}>Submit Feedback</Text>

              <Ionicons
                name="arrow-forward"
                size={15 * SCALE}
                color={colors.background}
              />
            </Pressable>

            {/* ==================================================
              PRIVACY NOTE
          ================================================== */}

            <View style={styles.footer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={14 * SCALE}
                color={colors.mutedDark}
              />

              <Text style={styles.footerText}>
                Your feedback helps us improve the platform and provide a better
                experience for students.
              </Text>
            </View>

            <View style={styles.bottomSpace} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  // ==========================================================
  // ROOT
  // ==========================================================

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16 * SCALE,
    paddingTop: 18 * SCALE,
    paddingBottom: 40 * SCALE,
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    minHeight: 70 * SCALE,

    paddingHorizontal: 16 * SCALE,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuButton: {
    width: 42 * SCALE,
    height: 42 * SCALE,

    borderRadius: 11 * SCALE,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 11 * SCALE,
  },

  headerTitle: {
    color: colors.white,

    fontSize: 16 * SCALE,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: colors.muted,

    fontSize: 7.5 * SCALE,
    fontWeight: "700",

    letterSpacing: 1,

    marginTop: 3 * SCALE,
  },

  headerBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 9 * SCALE,
    paddingVertical: 6 * SCALE,

    borderRadius: 20 * SCALE,

    backgroundColor: colors.surface2,

    borderWidth: 1,
    borderColor: colors.border,
  },

  headerBadgeDot: {
    width: 5 * SCALE,
    height: 5 * SCALE,

    borderRadius: 3,

    backgroundColor: colors.green,

    marginRight: 5 * SCALE,
  },

  headerBadgeText: {
    color: colors.muted,

    fontSize: 7 * SCALE,
    fontWeight: "800",

    letterSpacing: 0.7,
  },

  // ==========================================================
  // INTRO
  // ==========================================================

  introSection: {
    marginBottom: 17 * SCALE,
  },

  eyebrow: {
    color: colors.purple,

    fontSize: 7 * SCALE,
    fontWeight: "800",

    letterSpacing: 1,
  },

  pageTitle: {
    color: colors.white,

    fontSize: 22 * SCALE,
    fontWeight: "800",

    marginTop: 5 * SCALE,
  },

  pageDescription: {
    color: colors.muted,

    fontSize: 9 * SCALE,
    lineHeight: 15 * SCALE,

    marginTop: 5 * SCALE,
  },

  // ==========================================================
  // RATING
  // ==========================================================

  ratingCard: {
    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 17 * SCALE,

    padding: 16 * SCALE,

    alignItems: "center",
  },

  cardHeader: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
  },

  cardIcon: {
    width: 40 * SCALE,
    height: 40 * SCALE,

    borderRadius: 11 * SCALE,

    backgroundColor: colors.yellowDark,

    borderWidth: 1,
    borderColor: "#57400c",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10 * SCALE,
  },

  cardHeaderText: {
    flex: 1,
  },

  cardTitle: {
    color: colors.white,

    fontSize: 11 * SCALE,
    fontWeight: "700",
  },

  cardSubtitle: {
    color: colors.muted,

    fontSize: 8 * SCALE,

    marginTop: 3 * SCALE,
  },

  starsRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 18 * SCALE,
  },

  starButton: {
    paddingHorizontal: 4 * SCALE,
  },

  ratingHint: {
    color: colors.mutedDark,

    fontSize: 7.5 * SCALE,

    marginTop: 8 * SCALE,
  },

  // ==========================================================
  // SECTION
  // ==========================================================

  sectionHeading: {
    marginTop: 23 * SCALE,
    marginBottom: 11 * SCALE,
  },

  firstSectionHeading: {
    marginTop: 8 * SCALE,
  },

  sectionEyebrow: {
    color: colors.purple,

    fontSize: 10 * SCALE,
    fontWeight: "800",

    letterSpacing: 1,
  },

  sectionTitle: {
    color: colors.white,

    fontSize: 17 * SCALE,
    fontWeight: "700",

    marginTop: 2 * SCALE,
  },

  sectionDescription: {
    color: colors.muted,

    fontSize: 8.5 * SCALE,

    lineHeight: 14 * SCALE,

    marginTop: 3 * SCALE,
  },

  // ==========================================================
  // CATEGORY
  // ==========================================================

  categoryCard: {
    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 16 * SCALE,

    paddingHorizontal: 12 * SCALE,
  },

  categoryRow: {
    minHeight: 62 * SCALE,

    flexDirection: "row",
    alignItems: "center",

    borderRadius: 10 * SCALE,
  },

  categoryRowSelected: {
    backgroundColor: colors.surface2,
  },

  categoryIcon: {
    width: 37 * SCALE,
    height: 37 * SCALE,

    borderRadius: 10 * SCALE,

    backgroundColor: colors.surface2,

    borderWidth: 1,
    borderColor: colors.border,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10 * SCALE,
  },

  categoryIconSelected: {
    backgroundColor: colors.purpleDark,

    borderColor: colors.purpleBorder,
  },

  categoryContent: {
    flex: 1,
  },

  categoryTitle: {
    color: colors.muted,

    fontSize: 9 * SCALE,
    fontWeight: "600",
  },

  categoryTitleSelected: {
    color: colors.white,
  },

  radio: {
    width: 20 * SCALE,
    height: 20 * SCALE,

    borderRadius: 10 * SCALE,

    borderWidth: 1,
    borderColor: colors.borderLight,

    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: colors.purple,
  },

  radioDot: {
    width: 9 * SCALE,
    height: 9 * SCALE,

    borderRadius: 5 * SCALE,

    backgroundColor: colors.purple,
  },

  categoryDivider: {
    height: 1,

    backgroundColor: colors.border,

    marginLeft: 47 * SCALE,
  },

  // ==========================================================
  // INPUT
  // ==========================================================

  inputCard: {
    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 16 * SCALE,

    padding: 13 * SCALE,
  },

  inputHeader: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 9 * SCALE,
  },

  inputHeaderText: {
    color: colors.white,

    fontSize: 9 * SCALE,
    fontWeight: "700",

    marginLeft: 7 * SCALE,
  },

  textInput: {
    minHeight: 145 * SCALE,

    backgroundColor: colors.surface2,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 11 * SCALE,

    padding: 12 * SCALE,

    color: colors.white,

    fontSize: 9 * SCALE,
    lineHeight: 15 * SCALE,
  },

  characterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 8 * SCALE,
  },

  characterHint: {
    color: colors.mutedDark,

    fontSize: 6.5 * SCALE,
  },

  characterCount: {
    color: colors.mutedDark,

    fontSize: 6.5 * SCALE,
  },

  // ==========================================================
  // SUBMIT
  // ==========================================================

  submitButton: {
    height: 49 * SCALE,

    borderRadius: 12 * SCALE,

    backgroundColor: colors.purple,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginTop: 17 * SCALE,
  },

  submitIcon: {
    width: 26 * SCALE,
    height: 26 * SCALE,

    borderRadius: 8 * SCALE,

    backgroundColor: colors.white,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 8 * SCALE,
  },

  submitButtonText: {
    color: colors.background,

    fontSize: 9.5 * SCALE,
    fontWeight: "800",

    marginRight: 7 * SCALE,
  },

  // ==========================================================
  // FOOTER
  // ==========================================================

  footer: {
    marginTop: 13 * SCALE,

    padding: 12 * SCALE,

    borderRadius: 11 * SCALE,

    backgroundColor: colors.footer,

    borderWidth: 1,
    borderColor: colors.border,

    flexDirection: "row",
    alignItems: "center",
  },

  footerText: {
    flex: 1,

    color: colors.mutedDark,

    fontSize: 7.5 * SCALE,
    lineHeight: 13 * SCALE,

    marginLeft: 7 * SCALE,
  },

  bottomSpace: {
    height: 25 * SCALE,
  },

  // ==========================================================
  // INTERACTION
  // ==========================================================

  pressed: {
    opacity: 0.65,
  },
});
