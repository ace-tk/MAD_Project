import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import QuizScreen from "./QuizScreen";
import { fetchProgressSummary } from "../services/progressService";

export default function HomeScreen() {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [summary, setSummary] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const intervalRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const loadSummary = useCallback(async () => {
    try {
      setIsSummaryLoading(true);
      const data = await fetchProgressSummary();
      setSummary(data);
    } catch (error) {
      console.error("Failed to load summary", error);
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

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

  if (showQuiz) {
    return <QuizScreen onBack={() => setShowQuiz(false)} />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={isSummaryLoading} onRefresh={loadSummary} />}
    >
      <Text style={styles.title}>📘 AI Study Buddy</Text>

      <Text style={styles.timer}>{formatTime(time)}</Text>

      <View style={styles.buttonRow}>
        <Button title="Start" onPress={handleStart} />
        <Button title="Pause" onPress={handlePause} />
        <Button title="Reset" onPress={handleReset} />
      </View>

      <Text style={styles.modeText}>{isRunning ? "⏳ Focus Mode" : "🛑 Paused"}</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Progress Snapshot</Text>
          <TouchableOpacity onPress={loadSummary} disabled={isSummaryLoading}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
        {isSummaryLoading ? (
          <ActivityIndicator color="#007AFF" />
        ) : summary ? (
          <>
            <Text style={styles.summaryStat}>
              ⭐ Average Score: <Text style={styles.summaryValue}>{summary.averageScore}%</Text>
            </Text>
            <Text style={styles.summaryStat}>
              📈 Total Quizzes: <Text style={styles.summaryValue}>{summary.totalQuizzes}</Text>
            </Text>
            <Text style={styles.summaryStat}>
              🔥 Current Streak: <Text style={styles.summaryValue}>{summary.streakDays} days</Text>
            </Text>
            <View style={styles.topicsWrapper}>
              {summary.topTopics?.map((topic) => (
                <View key={topic.topic} style={styles.topicPill}>
                  <Text style={styles.topicText}>
                    {topic.topic} · {topic.average}%
                  </Text>
                </View>
              ))}
              {!summary.topTopics?.length && (
                <Text style={styles.emptyText}>Complete a quiz to unlock insights.</Text>
              )}
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>Unable to load progress right now.</Text>
        )}
      </View>

      <TouchableOpacity style={styles.quizButton} onPress={() => setShowQuiz(true)}>
        <Text style={styles.quizButtonText}>🤖 Start AI Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
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
  quizButton: {
    marginTop: 40,
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  quizButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  summaryCard: {
    width: "100%",
    backgroundColor: "#fff",
    marginTop: 40,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  refreshText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  summaryStat: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  summaryValue: {
    fontWeight: "700",
  },
  topicsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  topicPill: {
    backgroundColor: "#e3f2fd",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  topicText: {
    color: "#1976d2",
    fontWeight: "600",
  },
  emptyText: {
    color: "#777",
    fontStyle: "italic",
    marginTop: 4,
  },
});
