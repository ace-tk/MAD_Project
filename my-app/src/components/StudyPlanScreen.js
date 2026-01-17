import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
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
    const newPlans = [...plans, newPlan];
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

  const renderPlan = ({ item }) => (
    <View style={[styles.planCard, item.completed && styles.completedCard]}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleComplete(item.id)}
      >
        <Ionicons
          name={item.completed ? "checkmark-circle" : "ellipse-outline"}
          size={28}
          color={item.completed ? "#22C55E" : "#94A3B8"}
        />
      </TouchableOpacity>
      <Text style={[styles.planText, item.completed && styles.completedText]}>
        {item.title}
      </Text>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => deletePlan(item.id)}
      >
        <Ionicons name="trash-outline" size={22} color="#E11D48" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Study Plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter subject or task"
          value={subject}
          onChangeText={setSubject}
          style={styles.input}
          onSubmitEditing={addPlan}
        />
        <TouchableOpacity style={styles.addButton} onPress={addPlan}>
          <Ionicons name="add-circle" size={32} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={renderPlan}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptySubtext}>Add a task to get started</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 15,
    gap: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  addButton: {
    padding: 5,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.7,
  },
  checkbox: {
    marginRight: 12,
  },
  planText: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    fontWeight: "500",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
  },
  deleteBtn: {
    padding: 5,
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 5,
  },
});
