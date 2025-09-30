import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen() {
  const [time, setTime] = useState(25 * 60); 
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };


  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);


  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(25 * 60);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📘 AI Study Buddy</Text>

      <Text style={styles.timer}>{formatTime(time)}</Text>

      <View style={styles.buttonRow}>
        <Button title="Start" onPress={handleStart} />
        <Button title="Pause" onPress={handlePause} />
        <Button title="Reset" onPress={handleReset} />
      </View>

      <Text style={styles.modeText}>
        {isRunning ? "⏳ Focus Mode" : "🛑 Paused"}
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timer: {
    fontSize: 64,
    fontWeight: "bold",
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  modeText: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
  },
});
