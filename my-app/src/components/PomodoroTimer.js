import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function PomodoroTimer({ navigation }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const animatedValue = useRef(new Animated.Value(1)).current;

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const animatePulse = () => {
    Animated.sequence([
      Animated.timing(animatedValue, { toValue: 1.1, duration: 300, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    if (isRunning) animatePulse();
  }, [timeLeft]);

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <LinearGradient colors={["#6C63FF", "#7A5CFF"]} style={styles.header}>
        <Text style={styles.title}>AI Study Buddy</Text>
        <Text style={styles.subtitle}>Focus Mode</Text>
      </LinearGradient>

      {/* TIMER */}
      <View style={styles.centerContainer}>
        <Animated.View
          style={[
            styles.timerCircle,
            { transform: [{ scale: animatedValue }] },
          ]}
        >
          <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
        </Animated.View>
      </View>

      {/* BUTTONS */}
      <View style={styles.btnRow}>
        <ControlButton
          label="Start"
          color="#4CAF50"
          icon="play"
          onPress={() => setIsRunning(true)}
        />
        <ControlButton
          label="Pause"
          color="#FF9800"
          icon="pause"
          onPress={() => setIsRunning(false)}
        />
        <ControlButton
          label="Reset"
          color="#9E9E9E"
          icon="refresh"
          onPress={() => {
            setIsRunning(false);
            setTimeLeft(25 * 60);
          }}
        />
      </View>

      {/* PROGRESS CARD */}
      <View style={styles.progressCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Progress Snapshot</Text>
          <Text style={styles.refresh}>Refresh</Text>
        </View>

        <Text style={styles.cardLine}>⭐ Average Score: <Text style={styles.bold}>0%</Text></Text>
        <Text style={styles.cardLine}>📊 Total Quizzes: <Text style={styles.bold}>0</Text></Text>
        <Text style={styles.cardLine}>🔥 Current Streak: <Text style={styles.bold}>0 days</Text></Text>

        <Text style={styles.cardFoot}>Complete a quiz to unlock insights.</Text>
      </View>

      {/* QUIZ BUTTON */}
      <TouchableOpacity
        style={styles.quizBtn}
        onPress={() => navigation.navigate("QuizScreen")}
      >
        <Ionicons name="sparkles-outline" size={20} color="#fff" />
        <Text style={styles.quizText}>Start AI Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

function ControlButton({ label, color, icon, onPress }) {
  return (
    <TouchableOpacity style={[styles.controlBtn, { backgroundColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={18} color="#fff" />
      <Text style={styles.controlText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f4fb" },

  header: {
    paddingTop: 50,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 26, fontWeight: "700" },
  subtitle: { color: "#e6e4ff", fontSize: 14 },

  centerContainer: { alignItems: "center", marginTop: 40 },

  timerCircle: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
  },
  timeText: { fontSize: 42, fontWeight: "800", color: "#333" },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 30,
    paddingHorizontal: 20,
  },

  controlBtn: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    gap: 8,
  },
  controlText: { color: "#fff", fontWeight: "600" },

  progressCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 30,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  refresh: { color: "#6C63FF", fontWeight: "600" },
  cardLine: { marginTop: 8, fontSize: 15 },
  bold: { fontWeight: "700" },
  cardFoot: { marginTop: 10, color: "#666", fontStyle: "italic" },

  quizBtn: {
    backgroundColor: "#6C63FF",
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 25,
    paddingVertical: 14,
    borderRadius: 18,
    justifyContent: "center",
    gap: 8,
  },
  quizText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});

