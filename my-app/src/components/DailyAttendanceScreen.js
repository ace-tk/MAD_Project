import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    // Only allow adding time if goal is not reached
    if (studied < goal) {
      const newStudied = Math.min(goal, studied + 60); // adds 1 hour but caps at goal
      setStudied(newStudied);
      // Save to AsyncStorage
      AsyncStorage.setItem('@attendance_studied', newStudied.toString());
    }
  };

  // Load saved attendance on mount
  useEffect(() => {
    AsyncStorage.getItem('@attendance_studied').then((value) => {
      if (value) {
        const saved = parseInt(value, 10);
        setStudied(Math.min(goal, saved)); // Ensure it doesn't exceed goal
      }
    });
  }, []);

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Daily Attendance</Text>
        
        <TouchableOpacity>
          <Text style={styles.refreshIcon}>⟳</Text>
        </TouchableOpacity>
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
              {Math.floor(studied / 60)} h {studied % 60} m
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.studyBox}>
            <Text style={styles.label}>Goal</Text>
            <Text style={styles.value}>8 h 0 m</Text>
          </View>
        </View>

        {/* CHECK IN BUTTON */}
        <TouchableOpacity
          style={[styles.checkInBtn, progress >= 100 && styles.checkInBtnDisabled]}
          onPress={handleCheckIn}
          disabled={progress >= 100}
        >
          <Text style={styles.checkInText}>
            {progress >= 100 ? "✓ Goal Achieved!" : "⏩  Check In"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* WEEKLY PROGRESS CARD */}
      <View style={styles.weeklyCard}>
        <View style={styles.weekHead}>
          <Text style={styles.weekTitle}>Weekly Progress</Text>
          <Text style={styles.weekBadge}>Last 7 Days</Text>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.calendarIcon}>📅</Text>
          <Text style={styles.emptyText}>No attendance data available</Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFD",
    paddingTop: 50,
    paddingHorizontal: 16,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  backArrow: {
    fontSize: 26,
    color: "#333",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  refreshIcon: {
    fontSize: 22,
    color: "#333",
  },

  /******** MAIN CARD ********/
  mainCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },

  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0057D9",
  },

  date: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 3,
  },

  circleProgress: {
    height: 70,
    width: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: "#8BB7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0057D9",
  },

  /******** STUDY - GOAL ROW *********/
  studyRow: {
    backgroundColor: "#EAF3FF",
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },

  studyBox: {
    alignItems: "center",
  },

  label: {
    fontSize: 14,
    color: "#6B7280",
  },

  value: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  divider: {
    height: "100%",
    width: 1,
    backgroundColor: "#C7D2FE",
  },

  checkInBtn: {
    backgroundColor: "#0066EF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  checkInText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  /******** WEEKLY CARD *********/
  weeklyCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  weekHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  weekTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
  },

  weekBadge: {
    backgroundColor: "#E4EDFF",
    color: "#0057D9",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: "600",
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },

  calendarIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  emptyText: {
    color: "#6B7280",
    fontSize: 16,
  },
});
