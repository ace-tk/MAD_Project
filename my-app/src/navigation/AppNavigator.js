// src/navigation/AppNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../components/HomeScreen";
import PomodoroScreen from "../components/PomodoroScreen"; // add later

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* Add more screens here */}
      {/* <Stack.Screen name="Pomodoro" component={PomodoroScreen} /> */}
      <Stack.Screen name="Pomodoro" component={PomodoroScreen} />
    </Stack.Navigator>
  );
}
