// src/components/QuizSummary.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function QuizSummary({ route, navigation }) {
  const { score, total } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Quiz Completed!</Text>

      <Text style={styles.score}>
        You scored {score} / {total}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>🏠 Go Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate("Quiz")}
      >
        <Text style={styles.buttonSecondaryText}>🔁 Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    color: "white",
    fontWeight: "700",
    marginBottom: 20,
  },
  score: {
    fontSize: 24,
    color: "#60A5FA",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#10b981",
    padding: 15,
    borderRadius: 25,
    width: "70%",
    marginBottom: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  buttonSecondary: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 25,
    width: "70%",
  },
  buttonSecondaryText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
