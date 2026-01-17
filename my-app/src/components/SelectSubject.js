// src/components/SelectSubject.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function SelectSubject({ navigation }) {
  const subjects = [
    {
      name: "DSA",
      fullName: "Data Structures & Algorithms",
      value: "dsa",
      colors: ["#6366f1", "#4338ca", "#312e81"], // Indigo/Deep Blue
      icon: "code-slash-outline",
      resources: [
        "🏹 Love Babbar DSA Sheet",
        "📘 GeeksForGeeks DSA",
        "📗 NeetCode (Best for LeetCode)",
        "📕 Abdul Bari DSA Course"
      ]
    },
    {
      name: "Advanced Programming",
      fullName: "Adv. Programming (JWT, APIs, Backend)",
      value: "adv_prog",
      colors: ["#f43f5e", "#e11d48", "#be123c"], // Rose/Red
      icon: "server-outline",
      resources: [
        "🔐 JWT Official Docs",
        "🟦 Node.js Docs",
        "☕ Spring Boot - in28minutes",
        "🔗 RESTful APIs by FreeCodeCamp"
      ]
    },
    {
      name: "DBMS",
      fullName: "Database Management Systems",
      value: "dbms",
      colors: ["#10b981", "#059669", "#047857"], // Emerald Green
      icon: "cube-outline",
      resources: [
        "📘 Korth DBMS Book",
        "📗 Gate Smashers DBMS",
        "📕 MySQL Crash Course",
        "🟩 MongoDB University Courses"
      ]
    },
    {
      name: "Mobile App Dev",
      fullName: "Mobile App Development",
      value: "mad",
      colors: ["#0ea5e9", "#0284c7", "#0369a1"], // Sky Blue
      icon: "phone-portrait-outline",
      resources: [
        "📱 React Native - Official Docs",
        "📘 Expo Docs",
        "🟦 Android Studio Basics",
        "📗 YouTube – Hitesh Choudhary RN Course"
      ]
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Quiz Zone</Text>
          <Text style={styles.subtitle}>Master your subjects</Text>
        </View>

        <View style={styles.grid}>
          {subjects.map((sub, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("Quiz", {
                  subject: sub.value,
                  theme: sub.colors,
                  title: sub.name
                })
              }
              style={styles.cardContainer}
            >
              <LinearGradient
                colors={sub.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={sub.icon} size={28} color="white" />
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Start</Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.subjectName}>{sub.name}</Text>
                  <Text style={styles.subjectFull}>{sub.fullName}</Text>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.resourceCount}>{sub.resources.length} Resources</Text>
                  <Ionicons name="arrow-forward-circle" size={32} color="rgba(255,255,255,0.8)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#0B0F19",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  headerContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 34,
    color: "white",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 5,
    fontWeight: "500",
  },
  grid: {
    gap: 20,
  },
  cardContainer: {
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardGradient: {
    borderRadius: 24,
    padding: 24,
    minHeight: 180,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconContainer: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 14,
    backdropFilter: "blur(10px)",
  },
  badge: {
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  cardContent: {
    marginTop: 15,
  },
  subjectName: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  subjectFull: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  resourceCount: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '600',
  }
});
