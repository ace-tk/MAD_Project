// src/components/PomodoroScreen.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

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
    if (mode === "work") setSecondsLeft(WORK_TIME);
    if (mode === "short") setSecondsLeft(SHORT_BREAK);
    if (mode === "long") setSecondsLeft(LONG_BREAK);
  };

  const handleTimerEnd = () => {
    if (mode === "work") {
      Alert.alert("Focus Session Complete", "Great job! You've completed a session.");
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

  return (
    <View style={styles.container}>

      {/* Back */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Mode */}
      <Text style={styles.modeText}>
        {mode === "work"
          ? "Focus Session"
          : mode === "short"
            ? "Short Break"
            : "Long Break"}
      </Text>

      {/* Time */}
      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>

      {/* Start / Pause / Reset */}
      <View style={styles.buttonsRow}>
        {!isRunning ? (
          <TouchableOpacity style={styles.button} onPress={startTimer}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={pauseTimer}>
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sessions}>
        Completed Focus Sessions: {sessions}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  backText: {
    color: "#5DE0FF",
    fontSize: 18,
  },
  modeText: {
    fontSize: 26,
    color: "#C7D6FF",
    marginBottom: 20,
  },
  timer: {
    fontSize: 72,
    color: "white",
    fontWeight: "bold",
    marginVertical: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 20,
  },
  button: {
    backgroundColor: "#5DE0FF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  buttonText: {
    color: "#001B22",
    fontWeight: "800",
    fontSize: 17,
  },
  sessions: {
    marginTop: 25,
    color: "#7BE495",
    fontSize: 18,
  },
});

