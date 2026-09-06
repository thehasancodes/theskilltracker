import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { colors } from "../constants/colors";

export default function DashboardCard({
  type,
  title,
  description,
  solved,
  total,
  accent = "primary",
  onPress,
}) {
  const accentColor = accent === "cyan" ? colors.cyan : colors.purple;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.badge,
            {
              borderColor: accentColor,
              backgroundColor:
                accent === "cyan" ? colors.cyanDark : colors.purpleDark,
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: accentColor }]}>{type}</Text>
        </View>

        <Text style={[styles.arrow, { color: accentColor }]}>→</Text>
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.divider} />

      <Text style={styles.progress}>
        Solved: <Text style={{ color: accentColor }}>{solved}</Text> / {total}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },

  pressed: {
    opacity: 0.75,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  badge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },

  arrow: {
    fontSize: 16,
  },

  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
  },

  description: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 19,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },

  progress: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "500",
  },
});
