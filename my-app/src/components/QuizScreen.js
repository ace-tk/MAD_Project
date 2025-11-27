// src/components/QuizScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { generateQuiz } from "../api/openai";




export default function QuizScreen({ route, navigation }) {
  const subject = route.params?.subject || "dsa";
  const resources = route.params?.resources || [];

  const [questions, setQuestions] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, []);

  async function loadQuiz() {
    const q = await generateQuiz(subject, 5);
    setQuestions(q);
  }

  if (!questions)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#60A5FA" />
        <Text style={{ color: "white", marginTop: 10 }}>
          Generating {subject.toUpperCase()} Quiz...
        </Text>
      </View>
    );

  const currentQ = questions[current];

  const selectOption = (option) => {
    setSelected(option);
    if (option === currentQ.answer) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      navigation.navigate("QuizSummary", {
        score,
        total: questions.length,
        subject,
        resources,
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.subjectTitle}>
        {subject.toUpperCase()} Quiz ({current + 1}/5)
      </Text>

      <Text style={styles.question}>{currentQ.question}</Text>

      {currentQ.options.map((option, index) => {
        let bg = "#1F2937";
        if (selected) {
          if (option === currentQ.answer) bg = "#10b981";
          else if (option === selected) bg = "#ef4444";
        }

        return (
          <TouchableOpacity
            key={index}
            style={[styles.option, { backgroundColor: bg }]}
            disabled={selected !== null}
            onPress={() => selectOption(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: selected ? "#3B82F6" : "#9CA3AF" },
        ]}
        disabled={!selected}
        onPress={nextQuestion}
      >
        <Text style={styles.nextButtonText}>
          {current + 1 === questions.length ? "Finish" : "Next"}
        </Text>
      </TouchableOpacity>

      {/* STUDY RESOURCES */}
      <Text style={styles.resourceTitle}>📚 Study Resources</Text>
      {resources.map((item, index) => (
        <Text key={index} style={styles.resourceItem}>
          • {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0B0F19",
    justifyContent: "center",
    alignItems: "center",
  },
  back: { color: "#60A5FA", fontSize: 18, marginBottom: 20 },
  subjectTitle: { color: "white", fontSize: 20, fontWeight: "700", marginBottom: 20 },
  question: { color: "white", fontSize: 20, marginBottom: 20, fontWeight: "600" },
  option: { padding: 15, borderRadius: 12, marginBottom: 12 },
  optionText: { color: "white", fontSize: 18 },
  nextButton: { paddingVertical: 15, borderRadius: 12, marginTop: 20 },
  nextButtonText: { color: "white", textAlign: "center", fontSize: 18, fontWeight: "700" },
  resourceTitle: { color: "#60A5FA", marginTop: 30, fontSize: 18, fontWeight: "700" },
  resourceItem: { color: "#CBD5E1", marginTop: 5, fontSize: 16 },
});
