
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchProgressSummary } from "../services/progressService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_NAME_KEY = "@user_name";

export default function HomeScreen({ navigation }) {
  const [currentDate, setCurrentDate] = useState("");
  const [userName, setUserName] = useState("Tisha Kharade");
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user name and progress data
  useEffect(() => {
    loadUserData();
    loadProgress();
    
    // Update date every minute
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  // Refresh progress when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProgress();
    });
    return unsubscribe;
  }, [navigation]);

  const updateDate = () => {
    const now = new Date();
    const options = { weekday: "long", month: "short", day: "numeric" };
    const formatted = now.toLocaleDateString("en-US", options);
    setCurrentDate(formatted);
  };

  const loadUserData = async () => {
    try {
      const stored = await AsyncStorage.getItem(USER_NAME_KEY);
      if (stored) {
        setUserName(stored);
      }
    } catch (error) {
      console.error("Error loading user name:", error);
    }
  };

  const loadProgress = async () => {
    try {
      const data = await fetchProgressSummary();
      setProgressData(data);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = 34; // Static seconds to match original design
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  // Calculate today's study time and progress
  const todayMinutes = progressData?.todaysMinutes || 0;
  const displayTime = formatTime(todayMinutes);
  const progressPercentage = Math.min(100, Math.round((todayMinutes / (8 * 60)) * 100));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.name}>{userName}</Text>

        <View style={styles.headerIcons}>
          {/* Bell Icon - Navigates to Notification Screen */}
          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <Ionicons name="notifications-outline" size={26} color="#333" />
          </TouchableOpacity>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </Text>
          </View>
        </View>
      </View>

      {/* DAILY PROGRESS CARD */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("ProgressDetails")}
      >
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>✨ Daily Progress</Text>

          <Text style={styles.quote}>
            🧠 Wisdom comes from reflecting on experience.
          </Text>

          <View style={styles.progressRow}>
            <View>
              <Text style={styles.achievement}>Today's Achievement</Text>

              <View style={styles.timeBox}>
                <Ionicons name="time-outline" size={18} color="white" />
                <Text style={styles.timeText}>
                  {loading ? "Loading..." : displayTime}
                </Text>
              </View>

              {/* ✔ Dynamic date */}
              <Text style={styles.dateText}>{currentDate}</Text>
            </View>

            <View style={styles.circleProgressContainer}>
              <View style={styles.circleProgress}>
                <Text style={styles.circleText}>
                  {loading ? "..." : `${progressPercentage}%`}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("ProgressDetails")}
            style={styles.tapContainer}
          >
            <Text style={styles.tap}>🔎 Tap for details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* QUICK ACTIONS */}
      <Text style={styles.quickTitle}>Quick Actions</Text>

      <View style={styles.grid}>
        {quickActions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionCard}
            onPress={() =>
              navigation.navigate(item.screen ? item.screen : "Home")
            }
          >
            <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
              <Ionicons name={item.icon} size={26} color={item.color} />
            </View>
            <Text style={styles.actionText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const quickActions = [
  {
    label: "Study Plan",
    icon: "document-text-outline",
    bg: "#E0EAFF",
    color: "#2563EB",
    screen: "StudyPlan",
  },
  {
    label: "Attendance",
    icon: "checkmark-done-circle-outline",
    bg: "#E3FFE0",
    color: "#22C55E",
    screen: "Attendance",
  },
  {
    label: "Reminder",
    icon: "alarm-outline",
    bg: "#FFF4E0",
    color: "#F59E0B",
    screen: "Reminder",
  },
  {
    label: "Expense",
    icon: "wallet-outline",
    bg: "#FFE4E6",
    color: "#E11D48",
    screen: "Expenses",
  },
  {
    label: "Focus",
    icon: "timer-outline",
    bg: "#F3E8FF",
    color: "#7C3AED",
    screen: "Pomodoro",
  },
  {
    label: "Doubt Solver",
    icon: "help-circle-outline",
    bg: "#E0F7FF",
    color: "#06B6D4",
    screen: "DoubtSolver",
  },
  {
    label: "Gallery",
    icon: "image-outline",
    bg: "#ECFDF5",
    color: "#10B981",
    screen: "Gallery",
  },
  {
    label: "Reports",
    icon: "bar-chart-outline",
    bg: "#F1F5F9",
    color: "#475569",
    screen: "Reports",
  },
  {
    label: "Quiz",
    icon: "school-outline",
    bg: "#FCE7F3",
    color: "#DB2777",
    screen: "SelectSubject",
  },
  

];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 15,
    paddingTop: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222",
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  progressCard: {
    backgroundColor: "#1D7CF2",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#1D7CF2",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  progressTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
  },

  quote: {
    color: "#E8F0FF",
    marginBottom: 10,
    fontSize: 14,
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  achievement: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },

  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 5,
  },

  timeText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
  },

  dateText: {
    color: "#D9E8FF",
    fontSize: 14,
    marginTop: 4,
  },

  circleProgressContainer: {
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  circleProgress: {
    width: 65,
    height: 65,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  circleText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  tapContainer: {
    marginTop: 10,
  },
  tap: {
    color: "#EAF3FF",
    fontSize: 14,
  },

  quickTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1E293B",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    width: "31%",
    backgroundColor: "white",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
});

