import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Reminder() {
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);

  const addTask = () => {
    if (task.trim() === "") return;
    setList([...list, { id: Date.now().toString(), title: task }]);
    setTask("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reminder</Text>

      <View style={styles.inputBox}>
        <TextInput
          value={task}
          onChangeText={setTask}
          placeholder="Enter reminder..."
          style={styles.input}
        />
        <TouchableOpacity onPress={addTask} style={styles.addBtn}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Ionicons name="notifications" size={20} color="#3B82F6" />
            <Text style={styles.itemText}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 20 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e3e3e3",
  },
  addBtn: {
    backgroundColor: "#3B82F6",
    padding: 12,
    marginLeft: 10,
    borderRadius: 10,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  itemText: { marginLeft: 10, fontSize: 16, fontWeight: "500" },
});
