import React, { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../constants/colors";

const contacts = [
  {
    title: "Learner Support Helpline",
    subtitle: "Learner Support (Line 1)",
    department: "Student Support",
    phone: "",
    email: "",
    whatsapp: "",
  },
  {
    title: "Learner Support Helpline",
    subtitle: "Learner Support (Line 2)",
    department: "Student Support",
    phone: "",
    email: "",
    whatsapp: "",
  },
  {
    title: "Learner Support Helpline",
    subtitle: "Learner Support (Line 3)",
    department: "Student Support",
    phone: "",
    email: "",
    whatsapp: "",
  },
  {
    title: "Secretary to Registrar",
    subtitle: "Secretary to Registrar",
    department: "Administration",
    phone: "",
    email: "",
    whatsapp: "",
  },
  {
    title: "Office of the Controller of Examination",
    subtitle: "Controller of Examination / DRE",
    department: "Examination",
    phone: "",
    email: "",
    whatsapp: "",
  },
  {
    title: "Office of the Controller of Examination",
    subtitle: "Assistant Registrar (Examination)",
    department: "Examination",
    phone: "",
    email: "",
    whatsapp: "",
  },
  {
    title: "Finance Officer",
    subtitle: "Finance and Accounts",
    department: "Administration",
    phone: "",
    email: "",
    whatsapp: "",
  },
];

const actions = [
  { type: "call", icon: "call-outline", color: colors.green },
  { type: "whatsapp", icon: "logo-whatsapp", color: colors.blue },
  { type: "sms", icon: "chatbox-ellipses-outline", color: colors.blue },
  { type: "email", icon: "mail-outline", color: colors.red },
];

function getTarget(contact, type) {
  if (type === "call") return contact.phone && `tel:${contact.phone}`;
  if (type === "sms") return contact.phone && `sms:${contact.phone}`;
  if (type === "whatsapp") {
    const number = contact.whatsapp || contact.phone;
    return number && `whatsapp://send?phone=${number.replace(/\D/g, "")}`;
  }
  if (type === "email") {
    return contact.email && `mailto:${contact.email}`;
  }
  return null;
}

async function openContactAction(contact, type) {
  const target = getTarget(contact, type);

  if (!target) {
    Alert.alert(
      "Contact detail unavailable",
      `No ${type} detail is configured for this contact yet.`,
    );
    return;
  }

  try {
    await Linking.openURL(target);
  } catch {
    if (type === "whatsapp") {
      const number = (contact.whatsapp || contact.phone).replace(/\D/g, "");
      try {
        await Linking.openURL(`https://wa.me/${number}`);
        return;
      } catch {
        Alert.alert(
          "Unable to open WhatsApp",
          "No supported messaging app was found for this action.",
        );
        return;
      }
    }

    Alert.alert(
      "Unable to open app",
      "No supported app was found for this action.",
    );
  }
}

function ContactAction({ contact, action }) {
  return (
    <Pressable
      accessibilityLabel={`${action.type} ${contact.title}`}
      onPress={() => openContactAction(contact, action.type)}
      style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
    >
      <Ionicons name={action.icon} size={21} color={action.color} />
    </Pressable>
  );
}

function ContactRow({ contact }) {
  const [showMessageOptions, setShowMessageOptions] = useState(false);

  const callAction = {
    type: "call",
    icon: "call-outline",
    color: colors.green,
  };

  const emailAction = {
    type: "email",
    icon: "mail-outline",
    color: colors.red,
  };

  const messageActions = [
    {
      type: "whatsapp",
      icon: "logo-whatsapp",
      color: "#25D366",
    },
    {
      type: "sms",
      icon: "chatbubble-ellipses-outline",
      color: colors.blue,
    },
  ];

  return (
    <View style={styles.contactItem}>
      <View style={styles.contactRow}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={22} color={colors.purple} />
        </View>

        <View style={styles.contactDetails}>
          <Text style={styles.contactTitle}>{contact.title}</Text>
          <Text style={styles.contactSubtitle}>{contact.subtitle}</Text>
          <Text style={styles.contactDepartment}>• {contact.department}</Text>
        </View>

        <View style={styles.actions}>
          {/* Call */}
          <ContactAction contact={contact} action={callAction} />

          {/* Expand messaging options */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Show messaging options"
            accessibilityState={{ expanded: showMessageOptions }}
            onPress={() => setShowMessageOptions((visible) => !visible)}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="chatbox-ellipses-outline"
              size={21}
              color={colors.blue}
            />
          </Pressable>

          {/* Email */}
          <ContactAction contact={contact} action={emailAction} />
        </View>
      </View>

      {/* WhatsApp and SMS appear when the message icon is tapped */}
      {showMessageOptions && (
        <View style={styles.messageOptions}>
          <Text style={styles.messageOptionsText}>Send using</Text>

          {messageActions.map((action) => (
            <ContactAction
              key={action.type}
              contact={contact}
              action={action}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default function ImportantContactsScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const filteredContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return contacts;

    return contacts.filter((contact) =>
      [contact.title, contact.subtitle, contact.department].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [query]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Important Contact</Text>
        <View style={styles.headerButton} />
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={21} color={colors.muted} />
        <TextInput
          accessibilityLabel="Search contacts"
          onChangeText={setQuery}
          placeholder="Search contacts"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={query}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredContacts.map((contact, index) => (
          <ContactRow
            key={`${contact.title}-${contact.subtitle}-${index}`}
            contact={contact}
          />
        ))}

        {!filteredContacts.length && (
          <Text style={styles.emptyText}>No contacts found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    height: 72,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: 8,
    color: colors.text,
    fontSize: 22,
    fontWeight: "500",
  },
  searchBox: {
    height: 56,
    margin: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  searchInput: { flex: 1, marginLeft: 12, color: colors.text, fontSize: 16 },

  contactItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  contactRow: {
    minHeight: 126,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  actions: {
    width: 100,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  messageOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 18,
    paddingBottom: 12,
  },

  messageOptionsText: {
    color: colors.muted,
    fontSize: 11,
    marginRight: 8,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryDark,
  },
  contactDetails: { flex: 1, marginHorizontal: 16 },
  contactTitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "800",
  },
  contactSubtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 2,
  },
  contactDepartment: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  actions: {
    width: 100,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  actionButton: {
    width: 30,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 3,
  },
  pressed: { opacity: 0.55 },
  emptyText: {
    margin: 28,
    color: colors.muted,
    textAlign: "center",
    fontSize: 15,
  },
});
