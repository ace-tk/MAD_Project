import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STUDY_PLAN_STORAGE_KEY = "@study_plans";

export default function StudyPlanScreen({ navigation }) {
  const [subject, setSubject] = useState("");
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const stored = await AsyncStorage.getItem(STUDY_PLAN_STORAGE_KEY);
      if (stored) {
        setPlans(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading study plans:", error);
    }
  };

  const savePlans = async (newPlans) => {
    try {
      await AsyncStorage.setItem(STUDY_PLAN_STORAGE_KEY, JSON.stringify(newPlans));
    } catch (error) {
      console.error("Error saving study plans:", error);
    }
  };

  const addPlan = () => {
    if (!subject.trim()) return;
    const newPlan = {
      id: Date.now().toString(),
      title: subject.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const newPlans = [newPlan, ...plans]; // Add new items to top
    setPlans(newPlans);
    savePlans(newPlans);
    setSubject("");
  };

  const toggleComplete = (id) => {
    const newPlans = plans.map((plan) =>
      plan.id === id ? { ...plan, completed: !plan.completed } : plan
    );
    setPlans(newPlans);
    savePlans(newPlans);
  };

  const deletePlan = (id) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const newPlans = plans.filter((plan) => plan.id !== id);
            setPlans(newPlans);
            savePlans(newPlans);
          },
        },
      ]
    );
  };

  const activePlans = plans.filter((p) => !p.completed);
  const completedPlans = plans.filter((p) => p.completed);
  const progress = plans.length > 0 ? (completedPlans.length / plans.length) * 100 : 0;

  const renderPlan = (item) => (
    <View key={item.id} style={[styles.card, item.completed && styles.completedCard]}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => toggleComplete(item.id)}
      >
        <Ionicons
          name={item.completed ? "checkbox" : "square-outline"}
          size={24}
          color={item.completed ? "#10B981" : "#64748B"}
        />
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, item.completed && styles.completedText]}>
          {item.title}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deletePlan(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Study Plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>Your Progress</Text>
            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.taskCount}>
            {completedPlans.length} of {plans.length} tasks completed
          </Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Add a new task..."
            value={subject}
            onChangeText={setSubject}
            style={styles.input}
            onSubmitEditing={addPlan}
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity
            style={[styles.addButton, !subject.trim() && styles.disabledButton]}
            onPress={addPlan}
            disabled={!subject.trim()}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>To Do ({activePlans.length})</Text>
          {activePlans.length > 0 ? (
            activePlans.map(renderPlan)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No pending tasks</Text>
            </View>
          )}
        </View>

        {completedPlans.length > 0 && (
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Completed ({completedPlans.length})</Text>
            {completedPlans.map(renderPlan)}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
  },
  content: {
    paddingHorizontal: 20,
  },
  progressSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4F46E5",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 4,
  },
  taskCount: {
    fontSize: 13,
    color: "#64748B",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    height: 50,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1E293B",
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
  },
  listSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 12,
    marginTop: 4,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#4F46E5",
  },
  completedCard: {
    opacity: 0.7,
    borderLeftColor: "#10B981",
  },
  checkboxContainer: {
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: "#1E293B",
    fontWeight: "500",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 16,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  emptyStateText: {
    color: "#94A3B8",
    fontSize: 15,
  },
});
