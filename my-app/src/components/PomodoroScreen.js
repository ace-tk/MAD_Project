import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 0.75;
const STROKE_WIDTH = 15;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function PomodoroScreen({ navigation }) {
  const WORK_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;

  const [secondsLeft, setSecondsLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work"); 
  const [sessions, setSessions] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const getTotalTime = () => {
    switch (mode) {
      case "work": return WORK_TIME;
      case "short": return SHORT_BREAK;
      case "long": return LONG_BREAK;
      default: return WORK_TIME;
    }
  };

  const startTimer = () => {
    if (intervalRef.current) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          handleTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  };

  const resetTimer = () => {
    pauseTimer();
    const total = getTotalTime();
    setSecondsLeft(total);
  };

  const handleTimerEnd = () => {
    if (mode === "work") {
      Alert.alert("Focus Session Complete", "Great job! Take a break.");
      const newSessions = sessions + 1;
      setSessions(newSessions);
      if (newSessions % 4 === 0) {
        setMode("long");
        setSecondsLeft(LONG_BREAK);
      } else {
        setMode("short");
        setSecondsLeft(SHORT_BREAK);
      }
    } else {
      Alert.alert("Break Over", "Time to focus again!");
      setMode("work");
      setSecondsLeft(WORK_TIME);
    }
    setIsRunning(false);
  };

  const formatTime = (total) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Calculate Progress
  const totalTime = getTotalTime();
  const progress = 1 - secondsLeft / totalTime;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const getColors = () => {
    if (mode === "work") return ["#6a11cb", "#2575fc"]; 
    if (mode === "short") return ["#43e97b", "#38f9d7"]; 
    return ["#ff9a9e", "#fecfef"]; 
  };
  const [gradStart, gradEnd] = getColors();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0f172a", "#1e293b"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pomodoro</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>

        {/* Status Chip */}
        <View style={[styles.statusChip, { borderColor: gradEnd }]}>
          <Text style={[styles.statusText, { color: gradEnd }]}>
            {mode === 'work' ? 'FOCUS' : mode === 'short' ? 'SHORT BREAK' : 'LONG BREAK'}
          </Text>
        </View>

        {/* Circular Timer */}
        <View style={styles.timerContainer}>
          <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
            {/* Track Circle */}
            <Circle
              stroke="rgba(255,255,255,0.1)"
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
            />
            {/* Progress Circle */}
            <Circle
              stroke={gradEnd}
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - (secondsLeft / totalTime))}
              strokeLinecap="round"
              rotation="-90"
              origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
            />
          </Svg>
          <View style={styles.timertextContainer}>
            <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Toggle Start/Pause */}
          <TouchableOpacity
            style={[styles.mainButton, { backgroundColor: gradEnd }]}
            onPress={isRunning ? pauseTimer : startTimer}
          >
            <Ionicons name={isRunning ? "pause" : "play"} size={32} color={mode === 'short' || mode === 'long' ? '#000' : '#FFF'} />
          </TouchableOpacity>

          {/* Reset - smaller */}
          <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
            <Ionicons name="refresh" size={24} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sessionText}>
          Sessions Completed: <Text style={{ color: gradEnd, fontWeight: 'bold' }}>{sessions}</Text>
        </Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19", // Fallback
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  statusChip: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginBottom: 40,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  timerContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  timertextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 64,
    color: 'white',
    fontWeight: '200', // Thin font for premium look
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  resetButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionText: {
    color: 'rgba(255,255,255,0.5)',
    marginTop: 40,
    fontSize: 16,
  }
});
