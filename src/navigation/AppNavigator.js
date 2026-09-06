import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "../screens/DashboardScreen";
import SectionLeaderBoard from "../screens/SectionLeaderBoard";
import ProfileScreen from "../screens/ProfileScreen";
import TechnicalTracksScreen from "../screens/TechnicalTrackScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import NotificationScreen from "../screens/NotificationScreen";
import MCQScreen from "../screens/MCQScreen";
import LoginScreen from "../screens/LoginScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator(); // newly added stack navigator for login screen

function PlaceholderScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Coming Soon</Text>
    </View>
  );
}

function CustomDrawerContent(props) {
  const currentRoute = props.state.routeNames[props.state.index];

  const navigate = (screen) => {
    props.navigation.navigate(screen);
  };

  return (
    <View style={styles.drawerContainer}>
      <DrawerContentScrollView
        {...props}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>SkillTracker</Text>
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <DrawerButton
            title="Dashboard"
            active={currentRoute === "Dashboard"}
            onPress={() => navigate("Dashboard")}
          />

          <DrawerButton
            title="Section Leaderboard"
            active={currentRoute === "SectionLeaderboard"}
            onPress={() => navigate("SectionLeaderboard")}
          />

          <DrawerButton
            title="Technical Tracks"
            active={currentRoute === "TechnicalTracks"}
            onPress={() => navigate("TechnicalTracks")}
          />

          <DrawerButton
            title="Notifications"
            active={currentRoute === "Notifications"}
            onPress={() => navigate("Notifications")}
          />

          <DrawerButton
            title="Suggestions & Bugs"
            active={currentRoute === "SuggestionsBugs"}
            onPress={() => navigate("SuggestionsBugs")}
          />

          <DrawerButton
            title="My Profile"
            active={currentRoute === "MyProfile"}
            onPress={() => navigate("MyProfile")}
          />
        </View>
      </DrawerContentScrollView>

      {/* Bottom User Section */}
      <View style={styles.bottomSection}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>MEHEDI HASAN</Text>

            <Text style={styles.userRole}>Student</Text>
          </View>
        </View>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            // Add logout API/token clearing later
            console.log("Logout pressed");
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* -------------------------------- */
/* Drawer Button                     */
/* -------------------------------- */

function DrawerButton({ title, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.drawerButton,
        active && styles.drawerButtonActive,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.drawerButtonText,
          active && styles.drawerButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

/* -------------------------------- */
/* Navigator                         */
/* -------------------------------- */

function MainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,

        drawerStyle: {
          backgroundColor: "#0a0a0a",
          width: 285,
        },

        overlayColor: "rgba(0,0,0,0.65)",
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />

      <Drawer.Screen name="SectionLeaderboard" component={SectionLeaderBoard} />

      <Drawer.Screen name="TechnicalTracks" component={TechnicalTracksScreen} />

      <Drawer.Screen name="MCQ" component={MCQScreen} />

      <Drawer.Screen name="Notifications" component={NotificationScreen} />

      <Drawer.Screen name="SuggestionsBugs" component={FeedbackScreen} />

      <Drawer.Screen name="MyProfile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="MainApp" component={MainDrawer} />
    </Stack.Navigator>
  );
}
/* -------------------------------- */
/* Styles                            */
/* -------------------------------- */

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },

  scrollContent: {
    paddingBottom: 20,
  },

  logoContainer: {
    height: 62,
    justifyContent: "center",
    paddingHorizontal: 20,

    borderBottomWidth: 1,
    borderBottomColor: "#242424",
  },

  logo: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "700",
  },

  navigation: {
    paddingTop: 14,
    paddingHorizontal: 10,
  },

  drawerButton: {
    height: 42,
    borderRadius: 12,

    justifyContent: "center",

    paddingHorizontal: 14,
    marginBottom: 4,
  },

  drawerButtonActive: {
    backgroundColor: "#27272a",

    borderLeftWidth: 2,
    borderLeftColor: "#6366f1",
  },

  drawerButtonText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "500",
  },

  drawerButtonTextActive: {
    color: "#e2e8f0",
    fontWeight: "700",
  },

  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: "#242424",

    padding: 14,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,
  },

  avatar: {
    width: 32,
    height: 32,

    borderRadius: 16,

    backgroundColor: "#16133a",

    borderWidth: 1,
    borderColor: "#4338ca",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },

  avatarText: {
    color: "#818cf8",
    fontSize: 12,
    fontWeight: "700",
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    color: "#e2e8f0",
    fontSize: 11,
    fontWeight: "700",
  },

  userRole: {
    color: "#64748b",
    fontSize: 9,
    marginTop: 2,
  },

  logoutButton: {
    height: 38,

    borderRadius: 9,

    borderWidth: 1,
    borderColor: "#252525",

    alignItems: "center",
    justifyContent: "center",
  },

  logoutText: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.65,
  },

  placeholder: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderText: {
    color: "#e2e8f0",
    fontSize: 18,
  },
});
