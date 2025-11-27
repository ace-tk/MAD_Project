// src/components/ReportsScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReportsScreen({ navigation }) {
  const [tab, setTab] = useState("Insights");
  const [month, setMonth] = useState("November 2025");
  const [shiftTab, setShiftTab] = useState("Shift");

  const items = [
    { id: "calendar", component: <CalendarSection /> },
    { id: "distribution", component: <StudyDistribution shiftTab={shiftTab} setShiftTab={setShiftTab} /> },
    { id: "trend", component: <MonthlyTrend /> },
    { id: "comparison", component: <MonthComparison /> },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>Reports of</Text>

        <View style={styles.monthBox}>
          <Text style={styles.monthText}>{month}</Text>
          <Ionicons name="chevron-down" size={18} color="#444" />
        </View>

        <Ionicons name="calendar-outline" size={24} color="#333" />
      </View>

      {/* TOP TABS */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, tab === "Insights" && styles.activeTab]}
          onPress={() => setTab("Insights")}
        >
          <Text style={[styles.tabText, tab === "Insights" && styles.activeTabText]}>Insights</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, tab === "Overview" && styles.activeTab]}
          onPress={() => setTab("Overview")}
        >
          <Text style={[styles.tabText, tab === "Overview" && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
      </View>

      {/* SCROLL CONTENT */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <View>{item.component}</View>}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

/* --------------------- COMPONENTS --------------------- */

function CalendarSection() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>November 2025</Text>
      <Text style={styles.simpleBox}>📅 Calendar UI Placeholder</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
        <Text>🟢 Present</Text>
        <Text>🔴 Absent</Text>
      </View>
    </View>
  );
}

function StudyDistribution({ shiftTab, setShiftTab }) {
  return (
    <View style={styles.card}>
      <View style={styles.tabSwitch}>
        <TouchableOpacity
          style={[styles.switchBtn, shiftTab === "Shift" && styles.switchActive]}
          onPress={() => setShiftTab("Shift")}
        >
          <Text style={shiftTab === "Shift" ? styles.switchActiveText : styles.switchText}>Shift</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchBtn, shiftTab === "Subject" && styles.switchActive]}
          onPress={() => setShiftTab("Subject")}
        >
          <Text style={shiftTab === "Subject" ? styles.switchActiveText : styles.switchText}>Subject</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.cardTitle}>Study Distribution</Text>
      <Text style={styles.simpleBox}>📊 Distribution details shown here</Text>
    </View>
  );
}

function MonthlyTrend() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Monthly Study Trend</Text>
      <Text style={styles.simpleBox}>📈 Weekly trend placeholder</Text>
    </View>
  );
}

function MonthComparison() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Month Comparison</Text>
      <Text style={styles.simpleBox}>📊 Comparison placeholder</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
        <Text>Last Month</Text>
        <Text>This Month</Text>
      </View>
    </View>
  );
}

/* --------------------- STYLES --------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", paddingTop: 35 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 10,
    marginBottom: 10,
  },

  title: { fontSize: 20, fontWeight: "700", color: "#333" },

  monthBox: {
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: 10,
  },

  monthText: { fontWeight: "600", color: "#2563EB" },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    margin: 15,
    borderRadius: 12,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },

  activeTab: { backgroundColor: "white" },

  tabText: { fontWeight: "600", color: "#475569" },

  activeTabText: { color: "#2563EB" },

  card: {
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#1E293B" },

  simpleBox: {
    backgroundColor: "#EEF2FF",
    padding: 20,
    borderRadius: 12,
    textAlign: "center",
    color: "#475569",
  },

  tabSwitch: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 10,
  },

  switchBtn: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  switchActive: { backgroundColor: "white" },

  switchText: { color: "#64748B", fontWeight: "600" },

  switchActiveText: { color: "#2563EB", fontWeight: "700" },
});
