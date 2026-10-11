import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { getStoredUser } from "../../api/authStorage";
import { colors } from "../../constants/colors";
const SCALE = 1.2;

const HEADER_SCALE = 1.2;

const sections = [
  {
    title: "Personal",
    items: [
      {
        icon: "school-outline",
        title: "e-SLM",
        caption: "Self-learning study materials",
        color: colors.yellow,
      },
      {
        icon: "checkbox-outline",
        title: "Assignments",
        caption: "View and submit homework",
        color: colors.purple,
      },
      {
        icon: "library-outline",
        title: "My Study Centre",
        caption: "Your centre and coordinator",
        color: colors.red,
      },
      {
        icon: "school-outline",
        title: "Programmes",
        caption: "Explore university programmes",
        color: colors.blue,
      },
      {
        icon: "people-outline",
        title: "Mentoring Group",
        caption: "Messages from your mentors",
        color: colors.green,
      },
    ],
  },
  {
    title: "University Services",
    items: [
      {
        icon: "business-outline",
        title: "About KKHSOU",
        caption: "University info and recognition",
        color: colors.red,
      },
      {
        icon: "help-circle-outline",
        title: "Help & Support",
        caption: "Get help with your studies",
        color: colors.blue,
      },
      {
        icon: "search-outline",
        title: "Find Study Centre",
        caption: "Search centres by district",
        color: colors.yellow,
      },
      {
        icon: "megaphone-outline",
        title: "Notices",
        caption: "Latest university announcements",
        color: colors.purple,
      },
      {
        icon: "card-outline",
        title: "Important Contact",
        caption: "University contact directory",
        color: colors.green,
      },
      {
        icon: "link-outline",
        title: "Quick Links",
        caption: "Useful university websites",
        color: colors.blue,
      },
    ],
  },
];

function ServiceTile({ item, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <View style={[styles.iconBox, { backgroundColor: `${item.color}22` }]}>
        <Ionicons name={item.icon} size={20} color={item.color} />
      </View>
      <Text numberOfLines={1} style={styles.tileTitle}>
        {item.title}
      </Text>
      <Text numberOfLines={1} style={styles.tileCaption}>
        {item.caption}
      </Text>
    </Pressable>
  );
}

export default function KConnectHome({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getStoredUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const name = user?.name || "Student";
  const degree = user?.department || "Student";
  const semester = user?.semester
    ? `Semester ${user.semester}`
    : "KKHSOU learner";

  const navigate = (item) => {
    const destinations = {
      "e-SLM": "ESLM",
      "Help & Support": "Help",
      Assignments: "MCQ",
      Notices: "Notifications",
      "Important Contact": "ImportantContacts",
      Programmes: "Programmes",
    };
    const destination = destinations[item.title];
    if (destination) navigation.navigate(destination);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="Open menu"
            onPress={() => navigation.openDrawer()}
            style={styles.headerButton}
          >
            <Ionicons name="menu" size={26} color={colors.text} />
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Home</Text>
            <Text style={styles.headerSubtitle}>KCONNECT</Text>
          </View>
        </View>

        <View style={styles.profilePanel}>
          <Text style={styles.panelEyebrow}>KCONNECT</Text>
          <Text style={styles.studentName}>{name.toUpperCase()}</Text>
          <Text style={styles.studentDegree}>{degree}</Text>
          <Text style={styles.studentMeta}>{semester}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.muted} />
            <Text style={styles.locationText}>Open and Distance Learning</Text>
          </View>
        </View>

        <View style={styles.notice}>
          <Ionicons
            name="shield-checkmark-outline"
            size={19}
            color={colors.yellow}
          />
          <Text style={styles.noticeText}>
            Keep your registered mobile number and email active.
          </Text>
        </View>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.grid}>
              {section.items.map((item) => (
                <ServiceTile
                  key={item.title}
                  item={item}
                  onPress={() => navigate(item)}
                />
              ))}
            </View>
          </View>
        ))}

        <Pressable
          onPress={() => navigation.navigate("SuggestionsBugs")}
          style={({ pressed }) => [
            styles.feedbackButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="chatbox-ellipses-outline"
            size={17}
            color={colors.background}
          />
          <Text style={styles.feedbackText}>Submit Feedback</Text>
        </Pressable>
        <Text style={styles.version}>
          v1.0.0 | Developed by Archon - Mehedi , Sourav and Junevenson
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 28 },
  topBar: {
    minHeight: 70,
    paddingHorizontal: 19,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  headerTitleContainer: {
    flex: 1,
    marginLeft: 11,
  },
  headerTitle: { color: colors.text, fontSize: 19, fontWeight: "700" },
  headerSubtitle: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 3,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profilePanel: {
    margin: 14,
    padding: 19,
    borderRadius: 16,
    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },
  panelEyebrow: {
    color: colors.purple,
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1.2,
    marginBottom: 15,
  },
  studentName: { color: colors.text, fontSize: 15, fontWeight: "800" },
  studentDegree: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
  },
  studentMeta: { color: colors.muted, fontSize: 11, marginTop: 14 },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 9,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  locationText: { color: colors.muted, fontSize: 10, marginLeft: 5 },
  notice: {
    marginHorizontal: 14,
    marginBottom: 20,
    padding: 13,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.yellowDark,
    borderWidth: 1,
    borderColor: colors.yellow,
  },
  noticeText: {
    flex: 1,
    color: colors.yellow,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
    marginLeft: 9,
  },
  section: { paddingHorizontal: 14, marginBottom: 18 },
  sectionTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 9,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tile: {
    width: "48.2%",
    minHeight: 112,
    padding: 12,
    marginBottom: 10,
    borderRadius: 13,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  tileTitle: { color: colors.text, fontSize: 12, fontWeight: "800" },
  tileCaption: { color: colors.muted, fontSize: 9, marginTop: 4 },
  feedbackButton: {
    alignSelf: "flex-end",
    marginRight: 14,
    marginTop: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.yellow,
  },
  feedbackText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: "800",
    marginLeft: 7,
  },
  version: {
    color: colors.mutedDark,
    textAlign: "center",
    fontSize: 9,
    marginTop: 22,
  },
  pressed: { opacity: 0.72 },
});
