import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchProgressSummary } from "../services/progressService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_NAME_KEY = "@user_name";
const { width } = Dimensions.get("window");

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
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{userName}</Text>
        </View>

        <View style={styles.headerIcons}>
          {/* Bell Icon - Navigates to Notification Screen */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons name="notifications-outline" size={24} color="#2D3436" />
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

      {/* DAILY PROGRESS CARD (Handmade Style) */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("ProgressDetails")}
      >
        <View style={styles.progressCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.progressTitle}>✨ Daily Progress</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
          </View>

          <Text style={styles.quote}>
            "Wisdom comes from reflecting on experience."
          </Text>

          <View style={styles.progressRow}>
            <View>
              <Text style={styles.achievement}>Today's Focus</Text>

              <View style={styles.timeBox}>
                <Ionicons name="time-outline" size={20} color="#1D7CF2" />
                <Text style={styles.timeText}>
                  {loading ? "Loading..." : displayTime}
                </Text>
              </View>
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
            <Text style={styles.tap}>Tap for details ➔</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

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
              <Ionicons name={item.icon} size={28} color={item.color} />
            </View>
            <Text style={styles.actionText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom spacer for scrolling */}
      <View style={{ height: 40 }} />
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
    backgroundColor: "#FDFBF7", // Soft paper background
    paddingHorizontal: 20, // Slightly more padding
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  greeting: {
    fontSize: 14,
    color: "#636E72",
    marginBottom: 2,
    fontWeight: "600",
  },

  name: {
    fontSize: 28,
    fontWeight: "800", // Thicker font
    color: "#2D3436",
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  iconButton: {
    padding: 8,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 16, // Softer square
    backgroundColor: "#6C5CE7", // Matching theme accent
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  avatarText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  // HANDMADE PROGRESS CARD
  progressCard: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 24,
    marginBottom: 30,
    shadowColor: "#0984E3",
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  progressTitle: {
    color: "#2D3436",
    fontSize: 20,
    fontWeight: "800",
  },

  dateText: {
    color: "#B2BEC3",
    fontSize: 13,
    fontWeight: "600",
    backgroundColor: "#F4F6F8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  quote: {
    color: "#636E72",
    marginBottom: 20,
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  achievement: {
    color: "#B2BEC3",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF6FF", // Light blue tint
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 5,
    alignSelf: 'flex-start'
  },

  timeText: {
    color: "#0984E3", // Stronger blue
    marginLeft: 8,
    fontWeight: "700",
    fontSize: 18,
  },

  circleProgressContainer: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  circleProgress: {
    width: 75,
    height: 75,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: "#EAF6FF", // Background ring
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: "#0984E3", // Active ring simulation (simple)
    borderRightColor: "#0984E3",
    transform: [{ rotate: "-45deg" }] // Just for visual style
  },

  circleText: {
    color: "#0984E3",
    fontSize: 18,
    fontWeight: "800",
    transform: [{ rotate: "45deg" }] // Counteract rotation
  },

  tapContainer: {
    marginTop: 15,
    alignItems: "flex-end",
  },
  tap: {
    color: "#B2BEC3",
    fontSize: 13,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    color: "#2D3436",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    width: "31%",
    backgroundColor: "white",
    paddingVertical: 18,
    borderRadius: 20, // More rounded
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.01)",
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 18, // Squircle
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#636E72",
  },
});
