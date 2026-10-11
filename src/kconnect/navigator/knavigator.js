import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import KConnectHomeScreen from "../home/home";
import ESlmScreen from "../e-learn/learn";
import ImportantContactsScreen from "../contacts/impContacts";
import ProgrammesScreen from "../programmes/programme";
import ProgrammeDetailsScreen from "../programmes/programmeDetails";

const Stack = createNativeStackNavigator();

export default function KConnectHome() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Home" component={KConnectHomeScreen} />
      <Stack.Screen name="ESLM" component={ESlmScreen} />
      <Stack.Screen
        name="ImportantContacts"
        component={ImportantContactsScreen}
      />
      <Stack.Screen name="Programmes" component={ProgrammesScreen} />
      <Stack.Screen
        name="ProgrammeDetails"
        component={ProgrammeDetailsScreen}
      />
    </Stack.Navigator>
  );
}
