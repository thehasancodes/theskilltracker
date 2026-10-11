import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

export default function ProgrammeDetailsScreen({ navigation, route }) {
  const programme = route?.params?.programme;

  if (!programme) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Programme not found</Text>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Programme Details</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.hero}>
          <Text style={styles.faculty}>{programme.faculty}</Text>
          <Text style={styles.title}>{programme.title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{programme.group}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>DURATION</Text>
            <Text style={styles.infoValue}>{programme.duration}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>QUALIFICATION</Text>
            <Text style={styles.infoValue}>{programme.qualification}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this programme</Text>
          <Text style={styles.description}>{programme.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 28 },
  header: {
    height: 66,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: "800" },
  hero: {
    margin: 14,
    padding: 24,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  faculty: { color: colors.muted, fontSize: 11, textAlign: "center" },
  title: {
    marginTop: 14,
    color: colors.text,
    fontSize: 22,
    lineHeight: 29,
    textAlign: "center",
    fontWeight: "800",
  },
  badge: {
    marginTop: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 3,
    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },
  badgeText: { color: colors.text, fontSize: 10, fontWeight: "700" },
  infoRow: { marginHorizontal: 14, flexDirection: "row", gap: 10 },
  infoBox: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  infoLabel: { color: colors.muted, fontSize: 9, fontWeight: "700" },
  infoValue: {
    marginTop: 7,
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  section: {
    margin: 14,
    padding: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: "800" },
  description: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
  backLink: { marginTop: 15, padding: 10 },
  backLinkText: { color: colors.blue, fontWeight: "700" },
});
