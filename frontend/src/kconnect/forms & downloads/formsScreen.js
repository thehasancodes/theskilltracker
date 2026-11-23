import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

const categories = [
  "All",
  "Admission",
  "Annual Report",
  "Examination",
  "Project/Dissertation Guidelines",
];

const documents = [
  {
    id: "admission-2026",
    title: "New Admission Form 2026",
    category: "Admission",
    date: "10 Jul 2026",
    url: "https://kkhsou.ac.in/",
  },
  {
    id: "refund-2026",
    title: "New Refund Form 2026",
    category: "Admission",
    date: "10 Jul 2026",
    url: "https://kkhsou.ac.in/",
  },
  {
    id: "mcom-second-semester",
    title: "M.Com. 2nd semester Project Guideline",
    category: "Project/Dissertation Guidelines",
    date: "15 Jun 2026",
    url: "https://kkhsou.ac.in/",
  },
  {
    id: "mcom-fourth-semester",
    title: "M.Com. 4th Semester Project Guideline",
    category: "Project/Dissertation Guidelines",
    date: "15 Jun 2026",
    url: "https://kkhsou.ac.in/",
  },
  {
    id: "annual-report-2025",
    title: "KKHSOU Annual Report 2025",
    category: "Annual Report",
    date: "20 May 2026",
    url: "https://kkhsou.ac.in/",
  },
];

function DocumentCard({ document }) {
  const shareDocument = async () => {
    try {
      await Share.share({
        message: `${document.title}\n${document.url}`,
        url: document.url,
      });
    } catch {
      // The native share sheet can reject when the user dismisses it.
    }
  };

  const openDocument = async () => {
    if (!document.url || document.url === "https://kkhsou.ac.in/") {
      Alert.alert(
        "Document unavailable",
        "This form does not have a PDF link yet. Add the document URL to the forms data.",
      );
      return;
    }

    try {
      const supported = await Linking.canOpenURL(document.url);

      if (!supported) {
        throw new Error("Unsupported document URL");
      }

      await Linking.openURL(document.url);
    } catch {
      Alert.alert(
        "Unable to open document",
        "Check the document link and try again.",
      );
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.pdfIcon}>
          <Ionicons name="document-text" size={24} color={colors.red} />
          <Text style={styles.pdfLabel}>PDF</Text>
        </View>

        <View style={styles.documentInfo}>
          <Text style={styles.documentTitle}>{document.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.categoryTag}>{document.category}</Text>
            <View style={styles.dateRow}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={colors.muted}
              />
              <Text style={styles.dateText}>{document.date}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardActions}>
        <Pressable
          accessibilityLabel={`Share ${document.title}`}
          onPress={shareDocument}
          style={({ pressed }) => [
            styles.shareButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="share-social-outline" size={24} color="#62616b" />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Download ${document.title}`}
          onPress={openDocument}
          style={({ pressed }) => [
            styles.downloadButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="download" size={22} color="#ffffff" />
          <Text style={styles.downloadText}>Download</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function FormsScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const visibleDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesCategory =
        selectedCategory === "All" || document.category === selectedCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${document.title} ${document.category}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={25} color={colors.text} />
          </Pressable>
          <Text style={styles.heading}>Forms &amp; Downloads</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.intro}>
          <View style={styles.folderIcon}>
            <Ionicons name="folder-open-outline" size={36} color="#59679e" />
          </View>
          <View style={styles.introCopy}>
            <Text style={styles.introTitle}>Forms &amp; Downloads</Text>
            <Text style={styles.introSubtitle}>
              Official FoCT Forms, Guidelines &amp; Documents
            </Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={27} color="#55535e" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search forms and documents"
            placeholderTextColor="#686671"
            style={styles.searchInput}
            accessibilityLabel="Search forms and documents"
          />
          {query ? (
            <Pressable
              onPress={() => setQuery("")}
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={22} color="#777582" />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {categories.map((category) => {
            const selected = selectedCategory === category;

            return (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[styles.filter, selected && styles.selectedFilter]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                {selected ? (
                  <Ionicons name="checkmark" size={19} color="#3d456b" />
                ) : null}
                <Text
                  style={[
                    styles.filterText,
                    selected && styles.selectedFilterText,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Available documents</Text>
          <Text style={styles.resultsCount}>
            {visibleDocuments.length} files
          </Text>
        </View>

        <View style={styles.list}>
          {visibleDocuments.length ? (
            visibleDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={32} color="#696777" />
              <Text style={styles.emptyTitle}>No documents found</Text>
              <Text style={styles.emptyText}>
                Try another search or category.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 30 },
  header: {
    height: 66,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: { color: colors.text, fontSize: 22, fontWeight: "500" },
  intro: {
    minHeight: 112,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
  },
  folderIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryDark,
  },
  introCopy: { flex: 1, marginLeft: 16 },
  introTitle: { color: colors.text, fontSize: 17, fontWeight: "800" },
  introSubtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },
  searchBox: {
    height: 56,
    margin: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  searchInput: { flex: 1, marginLeft: 12, color: colors.text, fontSize: 16 },
  filters: { paddingHorizontal: 14, paddingBottom: 14, gap: 8 },
  filter: {
    minHeight: 36,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  selectedFilter: {
    borderColor: colors.purpleBorder,
    backgroundColor: colors.primaryDark,
  },
  filterText: { color: colors.muted, fontSize: 11, fontWeight: "700" },
  selectedFilterText: { color: colors.text },
  resultsHeader: {
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultsTitle: { color: colors.text, fontSize: 15, fontWeight: "800" },
  resultsCount: { color: colors.muted, fontSize: 11 },
  list: { paddingHorizontal: 14, gap: 12 },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: { flexDirection: "row" },
  pdfIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${colors.red}22`,
  },
  pdfLabel: {
    position: "static",
    color: colors.red,
    fontSize: 8,
    fontWeight: "900",
    top: 32,
  },
  documentInfo: { flex: 1, marginLeft: 14 },
  documentTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  metaRow: { marginTop: 7, gap: 6 },
  categoryTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    color: colors.blue,
    backgroundColor: colors.blueDark,
    fontSize: 10,
    fontWeight: "700",
  },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateText: { color: colors.muted, fontSize: 11 },
  cardActions: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  shareButton: {
    width: 34,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadButton: {
    minWidth: 142,
    height: 42,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  downloadText: { color: colors.background, fontSize: 13, fontWeight: "800" },
  emptyState: { paddingVertical: 36, alignItems: "center" },
  emptyTitle: {
    marginTop: 12,
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  emptyText: { marginTop: 5, color: colors.muted, fontSize: 12 },
  pressed: { opacity: 0.7 },
});
