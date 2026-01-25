import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function DailyAttendanceScreen({ navigation }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const [studied, setStudied] = useState(0); // in minutes
  const goal = 8 * 60; // 8 hours in minutes
  const progress = Math.min(100, Math.round((studied / goal) * 100));

  const handleCheckIn = () => {
    // Mark as full goal immediately
    if (studied < goal) {
      const newStudied = goal;
      setStudied(newStudied);

      const todayStr = new Date().toDateString(); // e.g., "Fri Jan 24 2026"
      AsyncStorage.setItem('@attendance_date', todayStr);
      AsyncStorage.setItem('@attendance_studied', newStudied.toString());
    }
  };

  // Load saved attendance on mount, check date
  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const savedDate = await AsyncStorage.getItem('@attendance_date');
        const todayStr = new Date().toDateString();

        if (savedDate === todayStr) {
          const value = await AsyncStorage.getItem('@attendance_studied');
          if (value) {
            const saved = parseInt(value, 10);
            setStudied(Math.min(goal, saved));
          }
        } else {
          // It's a new day, reset (or keep 0)
          setStudied(0);
        }
      } catch (e) {
        console.error("Failed to load attendance", e);
      }
    };

    loadAttendance();
  }, []);

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color="#2D3436" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Daily Attendance</Text>

        {/* Placeholder for refresh or extra action, keeping balanced layout */}
        <View style={{ width: 40 }} />
      </View>

      {/* MAIN CARD */}
      <View style={styles.mainCard}>
        <View style={styles.mainRow}>
          <View>
            <Text style={styles.sectionTitle}>Today's Session</Text>
            <Text style={styles.date}>{today}</Text>
          </View>

          {/* PROGRESS CIRCLE */}
          <View style={styles.circleProgress}>
            <Text style={styles.circleText}>{progress}%</Text>
          </View>
        </View>

        {/* Study vs Goal Row */}
        <View style={styles.studyRow}>
          <View style={styles.studyBox}>
            <Text style={styles.label}>Studied</Text>
            <Text style={styles.value}>
              {Math.floor(studied / 60)} <Text style={styles.unit}>h</Text> {studied % 60} <Text style={styles.unit}>m</Text>
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.studyBox}>
            <Text style={styles.label}>Goal</Text>
            <Text style={styles.value}>8 <Text style={styles.unit}>h</Text> 0 <Text style={styles.unit}>m</Text></Text>
          </View>
        </View>

        {/* MARK ATTENDANCE BUTTON */}
        <TouchableOpacity
          style={[styles.checkInBtn, progress >= 100 && styles.checkInBtnDisabled]}
          onPress={handleCheckIn}
          disabled={progress >= 100}
        >
          <Ionicons name={progress >= 100 ? "checkmark-circle" : "calendar-outline"} size={24} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.checkInText}>
            {progress >= 100 ? "Marked" : "Mark Attendance"}
          </Text>
        </TouchableOpacity>

        {progress < 100 && (
          <Text style={styles.hintText}>Tap to mark your daily attendance</Text>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFBF7", // Soft paper background
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2D3436",
  },

  /******** MAIN CARD ********/
  mainCard: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 24,
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },

  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D3436",
    marginBottom: 4,
  },

  date: {
    fontSize: 14,
    color: "#636E72",
    fontWeight: "600",
  },

  circleProgress: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: "#EAF6FF",
    alignItems: "center",
    justifyContent: "center",
    borderTopColor: "#0984E3", // Active visually
    borderRightColor: "#0984E3",
    transform: [{ rotate: "-45deg" }]
  },
  circleText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0984E3",
    transform: [{ rotate: "45deg" }]
  },

  /******** STUDY - GOAL ROW *********/
  studyRow: {
    backgroundColor: "#F4F6F8",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },

  studyBox: {
    alignItems: "center",
  },

  label: {
    fontSize: 12,
    color: "#B2BEC3",
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  value: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D3436",
  },

  unit: {
    fontSize: 14,
    fontWeight: "500",
    color: "#B2BEC3",
  },

  divider: {
    height: "100%",
    width: 1,
    backgroundColor: "#DFE6E9",
  },

  checkInBtn: {
    backgroundColor: "#0984E3",
    paddingVertical: 18,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0984E3",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  checkInBtnDisabled: {
    backgroundColor: "#22C55E", // Green when done
    shadowColor: "#22C55E",
  },
  checkInText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  hintText: {
    textAlign: "center",
    color: "#B2BEC3",
    marginTop: 15,
    fontSize: 12,
  },
});
