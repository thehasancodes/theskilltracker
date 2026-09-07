import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  getMcqAssignments,
  getMcqQuestions,
  McqApiError,
  submitMcqAnswers,
} from "../api/mcqApi";
import { colors } from "../constants/colors";

function findArray(value, preferredKeys) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  for (const key of preferredKeys) {
    if (Array.isArray(value[key])) return value[key];
  }

  for (const child of Object.values(value)) {
    const result = findArray(child, preferredKeys);
    if (result.length) return result;
  }

  return [];
}

function getAssignments(value) {
  const preferred = findArray(value, ["assignments", "items", "data"]);
  if (preferred.length) return preferred;
  return findItemArray(value, (item) => item.title || item.name);
}

function getQuestions(value) {
  const preferred = findArray(value, ["questions", "mcqs", "items", "data"]);
  if (preferred.length) return preferred;
  return findItemArray(
    value,
    (item) => item.question || item.questionText || item.questionId,
  );
}

function findItemArray(value, predicate) {
  if (Array.isArray(value)) {
    return value.length &&
      value.every((item) => item && typeof item === "object")
      ? value.filter(predicate)
      : [];
  }

  if (!value || typeof value !== "object") return [];

  for (const child of Object.values(value)) {
    const result = findItemArray(child, predicate);
    if (result.length) return result;
  }

  return [];
}

function getAssignmentId(assignment) {
  return assignment?.id || assignment?._id || assignment?.assignmentId;
}

function formatDate(value) {
  if (!value) return "No due date";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function normalizeQuestion(question, index) {
  const options = question.options || question.choices || [];
  return {
    id: question.id || question._id || question.questionId || String(index),
    text:
      question.question ||
      question.questionText ||
      question.text ||
      question.title ||
      "Question",
    options: options.map((option) =>
      typeof option === "string"
        ? option
        : option.text ||
          option.optionText ||
          option.label ||
          option.value ||
          "Option",
    ),
    marks: question.marks || question.points || 1,
  };
}

function getErrorMessage(error) {
  return error instanceof McqApiError
    ? error.message
    : "Unable to load the MCQ data.";
}

export default function McqApiScreen({ navigation, route }) {
  const initialAssignmentId = route?.params?.assignmentId || null;
  const [assignments, setAssignments] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    setLoading(true);
    setError(null);

    try {
      const data = await getMcqAssignments();
      const items = getAssignments(data);
      setAssignments(items);

      if (initialAssignmentId) {
        const selected = items.find(
          (item) => getAssignmentId(item) === initialAssignmentId,
        );
        if (selected) {
          await openAssignment(selected);
        }
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  async function openAssignment(item) {
    const id = getAssignmentId(item);
    if (!id) return;

    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const data = await getMcqQuestions(id);
      const questionItems = getQuestions(data).map(normalizeQuestion);

      if (!questionItems.length) {
        throw new McqApiError(
          "This assignment returned no questions. Please try another assignment.",
        );
      }

      setAssignment(item);
      setQuestions(questionItems);
      setAnswers({});
      setCurrentIndex(0);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  function selectAnswer(optionIndex) {
    const question = questions[currentIndex];
    setAnswers((previous) => ({
      ...previous,
      [question.id]: optionIndex,
    }));
  }

  async function finishAssignment() {
    const assignmentId = getAssignmentId(assignment);
    if (!assignmentId) return;

    const payload = questions.map((question) => ({
      questionId: question.id,
      selectedOption: answers[question.id] ?? null,
    }));

    setBusy(true);
    setError(null);

    try {
      const submission = await submitMcqAnswers(assignmentId, payload);
      setResult(submission);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <LoadingState label="Loading assignments..." />;

  if (result) {
    const score = result.score ?? result.totalScore ?? result.data?.score;
    const total = result.maxScore ?? result.totalMarks ?? result.data?.maxScore;

    return (
      <ScreenShell navigation={navigation}>
        <View style={styles.resultCard}>
          <Ionicons name="checkmark-circle" size={58} color={colors.green} />
          <Text style={styles.resultTitle}>Assessment submitted</Text>
          <Text style={styles.resultSubtitle}>{assignment?.title}</Text>
          {score !== undefined ? (
            <Text style={styles.resultScore}>
              Score: {score}
              {total !== undefined ? ` / ${total}` : ""}
            </Text>
          ) : null}
          <Button
            label="Back to assignments"
            onPress={() => setAssignment(null)}
          />
        </View>
      </ScreenShell>
    );
  }

  if (!assignment) {
    return (
      <ScreenShell navigation={navigation}>
        <Text style={styles.pageTitle}>MCQ Assignments</Text>
        <Text style={styles.pageSubtitle}>Choose a test to begin.</Text>
        {error ? <ErrorBox message={error} onRetry={loadAssignments} /> : null}
        {assignments.length === 0 && !error ? (
          <Text style={styles.emptyText}>No assignments available.</Text>
        ) : null}
        {assignments.map((item, index) => {
          const id = getAssignmentId(item) || String(index);
          return (
            <Pressable
              key={id}
              onPress={() => openAssignment(item)}
              style={({ pressed }) => [
                styles.assignmentCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.cardIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color={colors.purple}
                />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.assignmentTitle}>
                  {item.title || item.name || "MCQ Test"}
                </Text>
                <Text style={styles.assignmentMeta}>
                  {item.type || "Assessment"} · Due{" "}
                  {formatDate(item.dueDate || item.dueAt)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </Pressable>
          );
        })}
      </ScreenShell>
    );
  }

  const question = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length
    ? (answeredCount / questions.length) * 100
    : 0;

  return (
    <ScreenShell navigation={navigation}>
      <View style={styles.examHeader}>
        <View style={styles.headerText}>
          <Text style={styles.pageTitle}>
            {assignment.title || "MCQ Assessment"}
          </Text>
          <Text style={styles.pageSubtitle}>
            Question {currentIndex + 1} of {questions.length}
          </Text>
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>

      {error ? <ErrorBox message={error} /> : null}
      {busy && !question ? <LoadingState label="Loading questions..." /> : null}
      {!busy && !question ? (
        <Text style={styles.emptyText}>No questions found.</Text>
      ) : null}

      {question ? (
        <>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.questionCard}>
            <View style={styles.questionTop}>
              <Text style={styles.questionNumber}>Q{currentIndex + 1}</Text>
              <Text style={styles.marks}>{question.marks} marks</Text>
            </View>
            <Text style={styles.questionText}>{question.text}</Text>
            {question.options.map((option, index) => (
              <Pressable
                key={`${question.id}-${index}`}
                onPress={() => selectAnswer(index)}
                style={({ pressed }) => [
                  styles.option,
                  answers[question.id] === index && styles.optionSelected,
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.radio,
                    answers[question.id] === index && styles.radioSelected,
                  ]}
                >
                  {answers[question.id] === index ? (
                    <View style={styles.radioDot} />
                  ) : null}
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.navigationRow}>
            <Button
              label="Previous"
              disabled={currentIndex === 0 || busy}
              onPress={() => setCurrentIndex((value) => value - 1)}
            />
            {currentIndex === questions.length - 1 ? (
              <Button
                label={busy ? "Submitting..." : "Finish"}
                onPress={finishAssignment}
                disabled={busy}
                primary
              />
            ) : (
              <Button
                label="Next"
                onPress={() => setCurrentIndex((value) => value + 1)}
                primary
              />
            )}
          </View>
        </>
      ) : null}
    </ScreenShell>
  );
}

function ScreenShell({ navigation, children }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Assignment Workspace</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function LoadingState({ label }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.loading}>
        <ActivityIndicator size="small" color={colors.purple} />
        <Text style={styles.loadingText}>{label}</Text>
      </View>
    </SafeAreaView>
  );
}

function ErrorBox({ message, onRetry }) {
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>{message}</Text>
      {onRetry ? <Button label="Retry" onPress={onRetry} /> : null}
    </View>
  );
}

function Button({ label, onPress, disabled, primary }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        primary && styles.primaryButton,
        disabled && styles.disabledButton,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.buttonText, primary && styles.primaryButtonText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    minHeight: 70,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { marginRight: 14, padding: 5 },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
  content: { padding: 18, paddingBottom: 40 },
  pageTitle: { color: colors.text, fontSize: 24, fontWeight: "700" },
  pageSubtitle: { color: colors.muted, fontSize: 13, marginTop: 6 },
  assignmentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },
  cardIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.purpleDark,
  },
  cardBody: { flex: 1, marginHorizontal: 12 },
  assignmentTitle: { color: colors.text, fontSize: 15, fontWeight: "700" },
  assignmentMeta: { color: colors.muted, fontSize: 11, marginTop: 6 },
  emptyText: { color: colors.muted, marginTop: 24, textAlign: "center" },
  examHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: { flex: 1 },
  progressText: { color: colors.purple, fontWeight: "700", fontSize: 16 },
  progressBar: {
    height: 7,
    backgroundColor: colors.surface3,
    borderRadius: 8,
    marginTop: 18,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: colors.purple },
  questionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    padding: 18,
    marginTop: 18,
  },
  questionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionNumber: { color: colors.purple, fontSize: 15, fontWeight: "800" },
  marks: { color: colors.muted, fontSize: 11 },
  questionText: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 27,
    marginTop: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  optionSelected: {
    borderColor: colors.purple,
    backgroundColor: colors.purpleDark,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioSelected: { borderColor: colors.purple },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.purple,
  },
  optionText: { color: colors.text, flex: 1, fontSize: 14 },
  navigationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  button: {
    minWidth: 100,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryButton: { backgroundColor: colors.purple, borderColor: colors.purple },
  disabledButton: { opacity: 0.45 },
  buttonText: { color: colors.text, fontWeight: "700", fontSize: 12 },
  primaryButtonText: { color: colors.background },
  errorBox: {
    padding: 14,
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: colors.red + "20",
    borderWidth: 1,
    borderColor: colors.red,
  },
  errorText: { color: colors.red, fontSize: 12, marginBottom: 10 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { color: colors.muted, marginTop: 10 },
  resultCard: {
    alignItems: "center",
    padding: 26,
    marginTop: 50,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
  },
  resultSubtitle: { color: colors.muted, marginTop: 8, textAlign: "center" },
  resultScore: {
    color: colors.green,
    fontSize: 22,
    fontWeight: "800",
    marginVertical: 20,
  },
  pressed: { opacity: 0.7 },
});
