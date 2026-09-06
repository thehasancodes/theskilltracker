import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";

const SCALE = 1.08;

export default function MCQScreen({ navigation, route }) {
  const { width } = useWindowDimensions();
  const isPhone = width < 700;
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  // Later this entire object can come from your API
  const assignment = {
    title: "MOBILE TESTING 2",
    department: "BCA",
    semester: "5",
    questions: 2,
    totalMarks: 10,
    dueDate: "07/09/2026",
    status: "Open & Ready",
  };

  const questions = [
    {
      id: 1,
      question: "Hi",
      marks: 5,
      options: ["Hello", "Bonjour!!"],
    },
    {
      id: 2,
      question: "Yo",
      marks: 5,
      options: ["Heyy there", "What's Good"],
    },
  ];

  const activeQuestion = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  const selectAnswer = (optionIndex) => {
    setAnswers((previous) => ({
      ...previous,
      [activeQuestion.id]: optionIndex,
    }));
  };

  const submitAssessment = () => {
    Alert.alert(
      "Assessment Submitted",
      `You answered ${answeredCount} of ${questions.length} questions.`,
    );
  };

  /* -------------------------------------------------------
     PRE-LAUNCH SCREEN
  ------------------------------------------------------- */

  if (!started) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Assignment Workspace</Text>

              <Text style={styles.headerSubtitle}>Welcome queen</Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.preLaunchContent}
          >
            {/* BACK */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={18 * SCALE}
                color={colors.text}
              />

              <Text style={styles.backText}>Back to Assignments</Text>
            </TouchableOpacity>
            {/* ASSIGNMENT CARD */}
            <View style={styles.assignmentCard}>
              <View
                style={[
                  styles.assignmentTopRow,
                  isPhone && styles.assignmentTopRowPhone,
                ]}
              >
                <View style={styles.assignmentHeading}>
                  <Text style={styles.assignmentTitle}>{assignment.title}</Text>

                  <Text style={styles.assignmentDescription}>
                    Review the assessment details before launching.
                  </Text>
                </View>

                <View style={styles.readyBadge}>
                  <View style={styles.readyDot} />

                  <Text style={styles.readyText}>Ready to Launch</Text>
                </View>
              </View>

              {/* DETAILS GRID */}
              <View
                style={[styles.detailsGrid, isPhone && styles.detailsGridPhone]}
              >
                <Detail
                  label="Department"
                  value={assignment.department}
                  compact={isPhone}
                />

                <Detail
                  label="Semester"
                  value={assignment.semester}
                  compact={isPhone}
                />

                <Detail
                  label="Questions"
                  value={assignment.questions}
                  highlight
                  compact={isPhone}
                />

                <Detail
                  label="Total Marks"
                  value={assignment.totalMarks}
                  highlight
                  compact={isPhone}
                />

                <Detail
                  label="Due Date"
                  value={assignment.dueDate}
                  compact={isPhone}
                />

                <Detail
                  label="Status"
                  value={assignment.status}
                  highlight
                  compact={isPhone}
                />
              </View>
            </View>
            {/* LAUNCH BUTTON */}
            <TouchableOpacity
              style={styles.launchButton}
              activeOpacity={0.8}
              onPress={() => setStarted(true)}
            >
              <Ionicons
                name="rocket-outline"
                size={19 * SCALE}
                color={colors.text}
              />

              <Text style={styles.launchText}>
                Launch Assessment ({assignment.questions} Questions)
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  /* -------------------------------------------------------
     ACTUAL MCQ SCREEN
  ------------------------------------------------------- */

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Lab Assessment Exam</Text>

            <Text style={styles.headerSubtitle}>Welcome queen</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.examContent}
        >
          {/* EXAM HEADER */}
          <View style={[styles.examHeader, isPhone && styles.examHeaderPhone]}>
            <View>
              <View style={styles.courseRow}>
                <View style={styles.courseIcon}>
                  <Ionicons
                    name="document-text-outline"
                    size={20 * SCALE}
                    color={colors.text}
                  />
                </View>

                <View>
                  <Text style={styles.courseTitle}>MOBILE TESTING</Text>

                  <Text style={styles.courseSubtitle}>
                    Course: BCA{" "}
                    <Text style={styles.autoSaved}>• Auto-saved</Text>
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[styles.examStats, isPhone && styles.examHeaderPhoneStats]}
            >
              <View>
                <Text style={styles.statLabel}>QUESTIONS</Text>

                <Text style={styles.statValue}>{assignment.questions}</Text>
              </View>

              <View style={styles.statDivider} />

              <View>
                <Text style={styles.statLabel}>TOTAL MARKS</Text>

                <Text style={styles.statValue}>{assignment.totalMarks}</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.timerContainer}>
                <Text style={styles.timerLabel}>TIME REMAINING</Text>

                <View style={styles.timer}>
                  <Ionicons
                    name="time-outline"
                    size={17 * SCALE}
                    color={colors.primary}
                  />

                  <Text style={styles.timerText}>29:41</Text>
                </View>
              </View>
            </View>
          </View>

          {/* MAIN EXAM AREA */}
          <View style={[styles.examLayout, isPhone && styles.examLayoutPhone]}>
            {/* QUESTIONS */}
            <View style={styles.questionsArea}>
              {/* PROGRESS */}
              <View style={styles.progressCard}>
                <View style={styles.progressTop}>
                  <View style={styles.questionBadge}>
                    <Text style={styles.questionBadgeText}>
                      Question {currentQuestion + 1} / {assignment.questions}
                    </Text>
                  </View>

                  <Text style={styles.progressText}>
                    Progress: {Math.round(progress)}%
                  </Text>
                </View>

                <View style={styles.progressInfo}>
                  <Text style={styles.answered}>Answered: {answeredCount}</Text>

                  <Text style={styles.separator}>•</Text>

                  <Text style={styles.remaining}>
                    Remaining: {assignment.questions - answeredCount}
                  </Text>
                </View>

                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${progress}%` }]}
                  />
                </View>
              </View>

              {/* QUESTION */}
              <View style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>
                    Q{currentQuestion + 1}.{" "}
                  </Text>

                  <Text style={styles.questionText}>
                    {activeQuestion.question}
                  </Text>

                  <View style={styles.marksBadge}>
                    <Text style={styles.marksText}>
                      {activeQuestion.marks} marks
                    </Text>
                  </View>
                </View>

                {activeQuestion.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.option}
                    activeOpacity={0.7}
                    onPress={() => selectAnswer(index)}
                  >
                    <View
                      style={[
                        styles.radio,
                        answers[activeQuestion.id] === index &&
                          styles.radioSelected,
                      ]}
                    >
                      {answers[activeQuestion.id] === index && (
                        <View style={styles.radioDot} />
                      )}
                    </View>

                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* NAVIGATION */}
              <View style={styles.navigationRow}>
                <TouchableOpacity
                  style={styles.navButton}
                  disabled={currentQuestion === 0}
                  onPress={() => setCurrentQuestion((previous) => previous - 1)}
                >
                  <Ionicons
                    name="arrow-back"
                    size={17 * SCALE}
                    color={
                      currentQuestion === 0 ? colors.mutedDark : colors.text
                    }
                  />

                  <Text style={styles.disabledText}>Previous</Text>
                </TouchableOpacity>

                {currentQuestion === questions.length - 1 ? (
                  <TouchableOpacity
                    style={styles.examSubmitButton}
                    onPress={submitAssessment}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={17 * SCALE}
                      color={colors.background}
                    />

                    <Text style={styles.examSubmitText}>Submit Assessment</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={() =>
                      setCurrentQuestion((previous) => previous + 1)
                    }
                  >
                    <Text style={styles.navButtonText}>Next</Text>

                    <Ionicons
                      name="arrow-forward"
                      size={17 * SCALE}
                      color={colors.text}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* RIGHT SIDEBAR */}
            <View
              style={[styles.examSidebar, isPhone && styles.examSidebarPhone]}
            >
              {/* PALETTE */}
              <View style={styles.sideCard}>
                <Text style={styles.sideTitle}>QUESTION PALETTE</Text>

                <View style={styles.palette}>
                  {questions.map((_, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setCurrentQuestion(index)}
                      style={[
                        styles.paletteButton,
                        index === currentQuestion && styles.paletteActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.paletteText,
                          index === currentQuestion && styles.paletteActiveText,
                        ]}
                      >
                        {index + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.legendDivider} />

                <View style={styles.legendItem}>
                  <View style={styles.greenSquare} />
                  <Text style={styles.legendText}>Answered</Text>
                </View>

                <View style={styles.legendItem}>
                  <View style={styles.purpleSquare} />
                  <Text style={styles.legendText}>Prog. Submitted</Text>
                </View>

                <View style={styles.legendItem}>
                  <View style={styles.emptySquare} />
                  <Text style={styles.legendText}>Unanswered</Text>
                </View>
              </View>

              {/* ACTIONS */}
              <View style={styles.sideCard}>
                <Text style={styles.sideTitle}>ASSESSMENT ACTIONS</Text>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {}}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={18 * SCALE}
                    color={colors.green}
                  />

                  <Text style={styles.submitText}>Submit Assessment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------
   DETAIL COMPONENT
------------------------------------------------------- */

function Detail({ label, value, highlight, compact }) {
  return (
    <View style={[styles.detailItem, compact && styles.detailItemCompact]}>
      <Text style={styles.detailLabel}>{label}</Text>

      <Text style={[styles.detailValue, highlight && styles.detailHighlight]}>
        {value}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------
   STYLES
------------------------------------------------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* HEADER */

  header: {
    minHeight: 70 * 1.2,
    paddingHorizontal: 16 * 1.2,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: colors.white,
    fontSize: 16 * 1.2,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: colors.muted,
    fontSize: 7.5 * 1.2,
    fontWeight: "700",
    marginTop: 3 * 1.2,
    letterSpacing: 1,
  },

  /* PRE-LAUNCH */

  preLaunchContent: {
    paddingHorizontal: 16 * 1.2,
    paddingTop: 18 * 1.2,
    paddingBottom: 40 * 1.2,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5 * SCALE,

    alignSelf: "flex-start",

    marginBottom: 14 * SCALE,
  },

  backText: {
    color: colors.text,
    fontSize: 9 * SCALE,
    fontWeight: "600",
  },

  assignmentCard: {
    backgroundColor: colors.card,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 16 * SCALE,

    padding: 16 * SCALE,
  },

  assignmentTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  assignmentTopRowPhone: {
    flexDirection: "column",
  },

  assignmentHeading: {
    flex: 1,
  },

  assignmentTitle: {
    color: colors.text,
    fontSize: 20 * SCALE,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  assignmentDescription: {
    color: colors.blue,
    fontSize: 9 * SCALE,
    marginTop: 4 * SCALE,
  },

  readyBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 8 * SCALE,
    paddingVertical: 5 * SCALE,

    borderRadius: 25 * SCALE,

    borderWidth: 1,
    borderColor: colors.green,

    backgroundColor: colors.greenDark,

    marginTop: 10 * SCALE,
  },

  readyDot: {
    width: 7 * SCALE,
    height: 7 * SCALE,
    borderRadius: 7 * SCALE,

    backgroundColor: colors.green,

    marginRight: 8 * SCALE,
  },

  readyText: {
    color: colors.green,
    fontSize: 7 * SCALE,
    fontWeight: "600",
  },

  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    marginTop: 20 * SCALE,
  },

  detailItem: {
    width: "33.333%",

    marginBottom: 16 * SCALE,
  },

  detailItemCompact: {
    width: "50%",
  },

  detailsGridPhone: {
    marginTop: 16 * SCALE,
  },

  detailLabel: {
    color: colors.muted,
    fontSize: 8 * SCALE,
    marginBottom: 4 * SCALE,
  },

  detailValue: {
    color: colors.text,
    fontSize: 11 * SCALE,
    fontWeight: "700",
  },

  detailHighlight: {
    color: colors.primary,
  },

  launchButton: {
    marginTop: 8 * SCALE,

    alignSelf: "flex-start",

    minHeight: 40 * SCALE,

    paddingHorizontal: 14 * SCALE,

    borderRadius: 15 * SCALE,

    borderWidth: 1,
    borderColor: colors.primary,

    flexDirection: "row",
    alignItems: "center",
    gap: 9 * SCALE,
  },

  launchText: {
    color: colors.text,
    fontSize: 9 * SCALE,
    fontWeight: "700",
  },

  /* EXAM */

  examContent: {
    paddingBottom: 50 * SCALE,
  },

  examHeader: {
    paddingHorizontal: 24 * SCALE,
    paddingVertical: 22 * SCALE,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  examHeaderPhone: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 14 * SCALE,
  },

  examHeaderPhoneStats: {
    alignSelf: "stretch",
  },

  courseRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  courseIcon: {
    width: 36 * SCALE,
    height: 36 * SCALE,

    borderRadius: 12 * SCALE,

    borderWidth: 1,
    borderColor: colors.border,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 11 * SCALE,
  },

  courseTitle: {
    color: colors.text,
    fontSize: 19 * SCALE,
    fontWeight: "500",
  },

  courseSubtitle: {
    color: colors.blue,
    fontSize: 11 * SCALE,
    marginTop: 3 * SCALE,
  },

  autoSaved: {
    color: colors.green,
  },

  examStats: {
    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 13 * SCALE,

    paddingHorizontal: 17 * SCALE,
    paddingVertical: 10 * SCALE,
  },

  statLabel: {
    color: colors.muted,
    fontSize: 8 * SCALE,
    fontWeight: "700",
  },

  statValue: {
    color: colors.primary,
    fontSize: 15 * SCALE,
    fontWeight: "700",
    marginTop: 3 * SCALE,
  },

  statDivider: {
    width: 1,
    height: 28 * SCALE,

    backgroundColor: colors.border,

    marginHorizontal: 18 * SCALE,
  },

  timerContainer: {
    alignItems: "center",
  },

  timerLabel: {
    color: colors.muted,
    fontSize: 8 * SCALE,
    fontWeight: "700",
    marginBottom: 5 * SCALE,
  },

  timer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6 * SCALE,

    backgroundColor: colors.text,

    paddingHorizontal: 13 * SCALE,
    paddingVertical: 8 * SCALE,

    borderRadius: 13 * SCALE,
  },

  timerText: {
    color: colors.primary,
    fontSize: 13 * SCALE,
    fontWeight: "700",
  },

  examLayout: {
    flexDirection: "row",

    paddingHorizontal: 30 * SCALE,
    paddingTop: 23 * SCALE,

    gap: 22 * SCALE,
  },

  examLayoutPhone: {
    flexDirection: "column",
    paddingHorizontal: 16 * SCALE,
    paddingTop: 16 * SCALE,
    gap: 16 * SCALE,
  },

  questionsArea: {
    flex: 1,
  },

  progressCard: {
    backgroundColor: colors.card,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 17 * SCALE,

    padding: 15 * SCALE,
    marginBottom: 15 * SCALE,
  },

  progressTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  questionBadge: {
    paddingHorizontal: 10 * SCALE,
    paddingVertical: 6 * SCALE,

    borderRadius: 8 * SCALE,

    borderWidth: 1,
    borderColor: colors.purpleBorder,

    backgroundColor: colors.primaryDark,
  },

  questionBadgeText: {
    color: colors.primary,
    fontSize: 11 * SCALE,
    fontWeight: "700",
  },

  progressText: {
    color: colors.primary,
    fontSize: 11 * SCALE,
    fontWeight: "700",
  },

  progressInfo: {
    flexDirection: "row",
    marginTop: 9 * SCALE,
    gap: 8 * SCALE,
  },

  answered: {
    color: colors.green,
    fontSize: 10 * SCALE,
  },

  separator: {
    color: colors.mutedDark,
  },

  remaining: {
    color: colors.red,
    fontSize: 10 * SCALE,
  },

  progressBar: {
    height: 7 * SCALE,

    marginTop: 12 * SCALE,

    borderRadius: 10 * SCALE,

    borderWidth: 1,
    borderColor: colors.border,

    overflow: "hidden",
  },

  progressFill: {
    width: "0%",
    height: "100%",
    backgroundColor: colors.primary,
  },

  questionCard: {
    backgroundColor: colors.blueDark,

    borderWidth: 1,
    borderColor: colors.borderLight,

    borderRadius: 17 * SCALE,

    padding: 20 * SCALE,
  },

  questionHeader: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 17 * SCALE,
  },

  questionNumber: {
    color: colors.text,
    fontSize: 16 * SCALE,
    fontWeight: "700",
  },

  questionText: {
    color: colors.text,
    fontSize: 16 * SCALE,
    fontWeight: "600",
    flex: 1,
  },

  marksBadge: {
    backgroundColor: colors.primaryDark,

    borderWidth: 1,
    borderColor: colors.purpleBorder,

    borderRadius: 18 * SCALE,

    paddingHorizontal: 10 * SCALE,
    paddingVertical: 6 * SCALE,
  },

  marksText: {
    color: colors.primary,
    fontSize: 10 * SCALE,
    fontWeight: "700",
  },

  option: {
    minHeight: 45 * SCALE,

    borderWidth: 1,
    borderColor: colors.borderLight,

    borderRadius: 11 * SCALE,

    marginBottom: 10 * SCALE,

    paddingHorizontal: 13 * SCALE,

    flexDirection: "row",
    alignItems: "center",
  },

  radio: {
    width: 15 * SCALE,
    height: 15 * SCALE,

    borderRadius: 15 * SCALE,

    borderWidth: 1,
    borderColor: colors.text,

    marginRight: 10 * SCALE,

    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: colors.purple,
  },

  radioDot: {
    width: 8 * SCALE,
    height: 8 * SCALE,
    borderRadius: 4 * SCALE,
    backgroundColor: colors.purple,
  },

  optionText: {
    color: colors.text,
    fontSize: 14 * SCALE,
  },

  navigationRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginTop: 17 * SCALE,
  },

  navButton: {
    minHeight: 40 * SCALE,

    paddingHorizontal: 14 * SCALE,

    borderRadius: 11 * SCALE,

    borderWidth: 1,
    borderColor: colors.border,

    flexDirection: "row",
    alignItems: "center",
    gap: 7 * SCALE,
  },

  navButtonText: {
    color: colors.text,
    fontSize: 12 * SCALE,
    fontWeight: "700",
  },

  disabledText: {
    color: colors.mutedDark,
    fontSize: 12 * SCALE,
    fontWeight: "700",
  },

  /* SIDEBAR */

  examSidebar: {
    width: 245 * SCALE,
  },

  examSidebarPhone: {
    width: "100%",
  },

  sideCard: {
    backgroundColor: colors.card,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 17 * SCALE,

    padding: 15 * SCALE,

    marginBottom: 15 * SCALE,
  },

  sideTitle: {
    color: colors.blue,
    fontSize: 11 * SCALE,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  palette: {
    flexDirection: "row",
    gap: 10 * SCALE,

    marginTop: 17 * SCALE,
  },

  paletteButton: {
    width: 36 * SCALE,
    height: 36 * SCALE,

    borderRadius: 10 * SCALE,

    borderWidth: 1,
    borderColor: colors.border,

    alignItems: "center",
    justifyContent: "center",
  },

  paletteActive: {
    borderColor: colors.primary,
    borderWidth: 2,

    backgroundColor: colors.primaryDark,
  },

  paletteText: {
    color: colors.text,
    fontSize: 12 * SCALE,
  },

  paletteActiveText: {
    color: colors.primary,
    fontWeight: "700",
  },

  legendDivider: {
    height: 1,
    backgroundColor: colors.border,

    marginVertical: 15 * SCALE,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 9 * SCALE,
  },

  greenSquare: {
    width: 10 * SCALE,
    height: 10 * SCALE,

    borderRadius: 3 * SCALE,

    backgroundColor: colors.greenDark,
    borderWidth: 1,
    borderColor: colors.green,

    marginRight: 8 * SCALE,
  },

  purpleSquare: {
    width: 10 * SCALE,
    height: 10 * SCALE,

    borderRadius: 3 * SCALE,

    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: colors.primary,

    marginRight: 8 * SCALE,
  },

  emptySquare: {
    width: 10 * SCALE,
    height: 10 * SCALE,

    borderRadius: 3 * SCALE,

    borderWidth: 1,
    borderColor: colors.borderLight,

    marginRight: 8 * SCALE,
  },

  legendText: {
    color: colors.muted,
    fontSize: 10 * SCALE,
  },

  submitButton: {
    height: 42 * SCALE,

    borderWidth: 1,
    borderColor: colors.green,

    borderRadius: 11 * SCALE,

    marginTop: 15 * SCALE,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7 * SCALE,
  },

  examSubmitButton: {
    minHeight: 40 * SCALE,
    paddingHorizontal: 14 * SCALE,

    borderRadius: 11 * SCALE,

    backgroundColor: colors.purple,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7 * SCALE,
  },

  examSubmitText: {
    color: colors.background,
    fontSize: 10 * SCALE,
    fontWeight: "800",
  },

  submitText: {
    color: colors.text,
    fontSize: 11 * SCALE,
    fontWeight: "700",
  },
});
