import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import KConnectHomeScreen from "../home/home";
import ESlmScreen from "../e-learn/learn";

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
      <Stack.Screen name="E-LEARN" component={ESlmScreen} />
    </Stack.Navigator>
  );
}
