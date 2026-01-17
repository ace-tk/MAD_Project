// src/components/QuizScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  StatusBar
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { generateQuiz } from "../api/openai";

export default function QuizScreen({ route, navigation }) {
  const subject = route.params?.subject || "dsa";
  const title = route.params?.title || subject.toUpperCase();
  const theme = route.params?.theme || ["#60A5FA", "#3B82F6", "#2563EB"]; // Default Blue
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
        <ActivityIndicator size="large" color={theme[1]} />
        <Text style={[styles.loadingText, { color: theme[0] }]}>
          Generating {title} Quiz...
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
        theme, // Pass the theme
      });
    }
  };

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Dynamic Header with Gradient */}
      <LinearGradient
        colors={theme}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress Bar Container within Header */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress}%`, backgroundColor: 'white' }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Question {current + 1}/{questions.length}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.question}>{currentQ.question}</Text>

          <View style={styles.optionsContainer}>
            {currentQ.options.map((option, index) => {
              let bgColor = "rgba(255,255,255,0.05)";
              let borderColor = "rgba(255,255,255,0.1)";
              let textColor = "white";

              if (selected) {
                if (option === currentQ.answer) {
                  bgColor = "rgba(16, 185, 129, 0.2)"; // Green tint
                  borderColor = "#10b981";
                } else if (option === selected) {
                  bgColor = "rgba(239, 68, 68, 0.2)"; // Red tint
                  borderColor = "#ef4444";
                }
              } else {
                // Default state logic if needed
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    {
                      backgroundColor: bgColor,
                      borderColor: borderColor,
                      borderWidth: 1 //selected === option ? 2 : 1
                    }
                  ]}
                  disabled={selected !== null}
                  onPress={() => selectOption(option)}
                >
                  <View style={styles.optionContent}>
                    <View style={[
                      styles.radioCircle,
                      { borderColor: selected === option ? (option === currentQ.answer ? "#10b981" : "#ef4444") : theme[0] },
                      selected === option && { backgroundColor: option === currentQ.answer ? "#10b981" : "#ef4444" }
                    ]}>
                      {selected === option && <Ionicons name={option === currentQ.answer ? "checkmark" : "close"} size={16} color="white" />}
                    </View>
                    <Text style={styles.optionText}>{option}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            { opacity: selected ? 1 : 0.5 }
          ]}
          disabled={!selected}
          onPress={nextQuestion}
        >
          <LinearGradient
            colors={selected ? theme : ['#374151', '#4b5563']}
            style={styles.nextButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextButtonText}>
              {current + 1 === questions.length ? "Finish Quiz" : "Next Question"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0B0F19",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "600",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  progressContainer: {
    marginTop: 5,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  card: {
    marginTop: 10,
    marginBottom: 30,
  },
  question: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 32,
    marginBottom: 25,
  },
  optionsContainer: {
    gap: 15,
  },
  option: {
    borderRadius: 16,
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  nextButtonGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
