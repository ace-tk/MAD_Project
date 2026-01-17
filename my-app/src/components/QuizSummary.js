// src/components/QuizSummary.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function QuizSummary({ route, navigation }) {
  // Add default theme in case it's missing (e.g. direct navigation)
  const { score, total, theme = ["#4F46E5", "#3B82F6"] } = route.params;

  const percentage = Math.round((score / total) * 100);
  let feedback = "Good Effort!";
  let icon = "ribbon-outline";

  if (percentage >= 80) {
    feedback = "Outstanding!";
    icon = "trophy";
  } else if (percentage >= 50) {
    feedback = "Well Done!";
    icon = "thumbs-up";
  } else {
    feedback = "Keep Practicing!";
    icon = "book";
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme}
        style={styles.gradientCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={icon} size={80} color="white" style={{ marginBottom: 20 }} />

        <Text style={styles.feedbackText}>{feedback}</Text>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{percentage}%</Text>
          <Text style={styles.scoreSubtext}>{score} out of {total} correct</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("SelectSubject")}
        >
          <Text style={[styles.primaryButtonText, { color: theme[1] }]}>Try Another Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
    justifyContent: "center",
    padding: 20,
  },
  gradientCard: {
    padding: 40,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  feedbackText: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 30,
    textAlign: "center",
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  scoreText: {
    color: "white",
    fontSize: 48,
    fontWeight: "900",
  },
  scoreSubtext: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    marginTop: 5,
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    fontWeight: "600",
  },
});
