import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";

export default function StudyPlanScreen() {
  const [subject, setSubject] = useState("");
  const [plans, setPlans] = useState([]);

  const addPlan = () => {
    if (!subject.trim()) return;
    setPlans([...plans, { id: Date.now().toString(), title: subject }]);
    setSubject("");
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>Study Plan</Text>

      <TextInput
        placeholder="Enter subject or task"
        value={subject}
        onChangeText={setSubject}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginTop: 20,
          borderRadius: 8,
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#4c82ff",
          paddingVertical: 12,
          alignItems: "center",
          borderRadius: 8,
          marginTop: 10,
        }}
        onPress={addPlan}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>Add to Plan</Text>
      </TouchableOpacity>

      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              backgroundColor: "#eef4ff",
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}
