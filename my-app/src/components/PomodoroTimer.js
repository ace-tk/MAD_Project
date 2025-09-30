import React, { useReducer, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";


const initialState = { time: 25 * 60, isRunning: false };

const reducer = (state, action) => {
  switch (action.type) {
    case "START":
      return { ...state, isRunning: true };
    case "PAUSE":
      return { ...state, isRunning: false };
    case "RESET":
      return { time: 25 * 60, isRunning: false };
    case "TICK":
      return { ...state, time: state.time > 0 ? state.time - 1 : 0 };
    default:
      return state;
  }
};

const PomodoroTimer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let interval = null;
    if (state.isRunning) {
      interval = setInterval(() => dispatch({ type: "TICK" }), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [state.isRunning]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{formatTime(state.time)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4caf50" }]}
          onPress={() =>
            state.isRunning ? dispatch({ type: "PAUSE" }) : dispatch({ type: "START" })
          }
        >
          <Text style={styles.buttonText}>{state.isRunning ? "Pause" : "Start"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#f44336" }]}
          onPress={() => dispatch({ type: "RESET" })}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  timerText: { fontSize: 60, fontWeight: "bold", color: "#333" },
  buttonContainer: { flexDirection: "row", marginTop: 20, gap: 20 },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default PomodoroTimer;
