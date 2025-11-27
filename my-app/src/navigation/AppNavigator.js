// src/navigation/AppNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../components/HomeScreen";
import PomodoroScreen from "../components/PomodoroScreen"; // add later
import QuizScreen from "../components/QuizScreen";
import QuizSummary from "../components/QuizSummary";
import SelectSubject from "../components/SelectSubject";
import DailyAttendanceScreen from "../components/DailyAttendanceScreen";
import ExpensesScreen from "../components/ExpensesScreen";
import StudyPlanScreen from "../components/StudyPlanScreen";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* Add more screens here */}
      {/* <Stack.Screen name="Pomodoro" component={PomodoroScreen} /> */}
      <Stack.Screen name="Pomodoro" component={PomodoroScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="QuizSummary" component={QuizSummary} />
      <Stack.Screen name="SelectSubject" component={SelectSubject} />
      <Stack.Screen name="Attendance" component={DailyAttendanceScreen} />
      <Stack.Screen name="Expenses" component={ExpensesScreen} />
      <Stack.Screen name="StudyPlan" component={StudyPlanScreen} />


    </Stack.Navigator>
  );
}
