// src/components/HomeScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>

      {/* TITLE */}
      <Text style={styles.title}>📘 AI Study</Text>

      {/* START FOCUS BUTTON */}
      <TouchableOpacity
        style={styles.focusButton}
        onPress={() => navigation.navigate("Pomodoro")}
      >
        <Text style={styles.focusButtonText}>🎯 Start Focus</Text>
      </TouchableOpacity>

      {/* PROGRESS CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progress Snapshot</Text>

        <View style={styles.row}>
          <Text style={styles.cardLine}>⭐ Average Score: 0%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLine}>📊 Total Quizzes: 0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLine}>🔥 Streak: 0 days</Text>
        </View>

        <Text style={styles.smallNote}>
          Complete a quiz to unlock insights.
        </Text>
      </View>

      {/* AI QUIZ BUTTON */}
      <TouchableOpacity
        style={styles.quizButton}
        onPress={() => navigation.navigate("Quiz")}
      >
        <Text style={styles.quizButtonText}>🤖 Start AI Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
    paddingTop: 80,
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    color: "#F9FAFB",
    fontWeight: "700",
    marginBottom: 20,
  },

  /* 🎯 START FOCUS BUTTON */
  focusButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 25,
    shadowColor: "#10b981",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
  focusButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  /* PROGRESS CARD */
  card: {
    width: "88%",
    backgroundColor: "#111827",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.25)",
    marginBottom: 25,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F1F5F9",
    marginBottom: 10,
  },

  row: {
    marginBottom: 6,
  },

  cardLine: {
    color: "#CBD5E1",
    fontSize: 15,
  },

  smallNote: {
    marginTop: 10,
    fontSize: 13,
    color: "#64748B",
  },

  /* AI QUIZ BUTTON */
  quizButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 10,
    shadowColor: "#3B82F6",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },

  quizButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 17,
  },
});
