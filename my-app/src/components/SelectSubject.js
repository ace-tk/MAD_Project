// src/components/SelectSubject.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function SelectSubject({ navigation }) {
  const subjects = [
    {
      name: "DSA",
      value: "dsa",
      resources: [
        "🏹 Love Babbar DSA Sheet",
        "📘 GeeksForGeeks DSA",
        "📗 NeetCode (Best for LeetCode)",
        "📕 Abdul Bari DSA Course"
      ]
    },
    {
      name: "Advanced Programming (JWT, APIs, Backend)",
      value: "adv_prog",
      resources: [
        "🔐 JWT Official Docs",
        "🟦 Node.js Docs",
        "☕ Spring Boot - in28minutes",
        "🔗 RESTful APIs by FreeCodeCamp"
      ]
    },
    {
      name: "DBMS",
      value: "dbms",
      resources: [
        "📘 Korth DBMS Book",
        "📗 Gate Smashers DBMS",
        "📕 MySQL Crash Course",
        "🟩 MongoDB University Courses"
      ]
    },
    {
      name: "Mobile App Development",
      value: "mad",
      resources: [
        "📱 React Native - Official Docs",
        "📘 Expo Docs",
        "🟦 Android Studio Basics",
        "📗 YouTube – Hitesh Choudhary RN Course"
      ]
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📚 Select a Subject</Text>

      {subjects.map((sub, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.subjectName}>{sub.name}</Text>

          <Text style={styles.resourceTitle}>Recommended Resources:</Text>

          {sub.resources.map((r, i) => (
            <Text key={i} style={styles.resourceText}>• {r}</Text>
          ))}

          <TouchableOpacity
            style={styles.startButton}
            onPress={() =>
              navigation.navigate("Quiz", { subject: sub.value })
            }
          >
            <Text style={styles.startButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0B0F19",
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: "white",
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1F2937",
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.4)",
  },
  subjectName: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  resourceTitle: {
    color: "#93c5fd",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  resourceText: {
    color: "#CBD5E1",
    marginLeft: 10,
    marginBottom: 3,
  },
  startButton: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
  },
  startButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
